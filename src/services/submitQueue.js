/**
 * Compliance Connectivity-Gap Queue
 *
 * IndexedDB-backed queue for storing log entries during brief connectivity gaps.
 * NOT a full offline-first system -- handles WiFi drops, not extended offline.
 *
 * Architecture decisions:
 * - D20: Separate database (RomaMartComplianceDB) -- no conflict with existing RomaMartDB
 * - D21: Dual timestamps (clientCreatedAt + serverReceivedAt)
 * - HSC-07: Append-only with idempotency keys (crypto.randomUUID())
 *
 * Stores: pendingEntries (log entries awaiting sync), meta (drain lock, counters)
 *
 * @module services/submitQueue
 */

import { openDB } from 'idb';

const DB_NAME = 'RomaMartComplianceDB';
const DB_VERSION = 1;
const ENTRIES_STORE = 'pendingEntries';
const META_STORE = 'meta';
const LOCK_KEY = 'drainLock';
const LOCK_STALE_MS = 30000; // 30s -- stale lock threshold
const SYNCED_RETENTION_DAYS = 7;

/** @type {import('idb').IDBPDatabase | null} */
let dbInstance = null;

/**
 * Open or return cached database connection.
 */
async function getDb() {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Pending entries store
      if (!db.objectStoreNames.contains(ENTRIES_STORE)) {
        const store = db.createObjectStore(ENTRIES_STORE, { keyPath: 'idempotencyKey' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('queuedAt', 'queuedAt', { unique: false });
      }
      // Meta store (drain lock, counters)
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'key' });
      }
    },
  });

  return dbInstance;
}

/**
 * Add a new entry to the queue.
 *
 * @param {Object} payload - Form data to queue
 * @param {string} payload.logType - Type of log entry
 * @param {string} payload.employeeId - Submitting employee
 * @param {string} payload.locationId - Store location
 * @param {Object} [payload.data] - Log-type-specific data
 * @returns {Promise<{idempotencyKey: string}>} The generated idempotency key
 */
export async function addEntry(payload) {
  const db = await getDb();
  const idempotencyKey = crypto.randomUUID(); // HSC-07
  const clientCreatedAt = new Date().toISOString(); // D21

  const entry = {
    ...payload,
    idempotencyKey,
    clientCreatedAt,
    status: 'pending',
    queuedAt: Date.now(),
    attempts: 0,
    error: null,
    syncedAt: null,
  };

  await db.put(ENTRIES_STORE, entry);
  return { idempotencyKey };
}

/**
 * Get queue status counts.
 *
 * @returns {Promise<{pending: number, failed: number, synced: number, total: number}>}
 */
export async function getQueueStatus() {
  const db = await getDb();
  const tx = db.transaction(ENTRIES_STORE, 'readonly');
  const index = tx.store.index('status');

  const [pending, failed, synced] = await Promise.all([
    index.count('pending'),
    index.count('failed'),
    index.count('synced'),
  ]);

  return {
    pending,
    failed,
    synced,
    total: pending + failed + synced,
  };
}

/**
 * Get all entries with a given status.
 *
 * @param {string} status - 'pending' | 'failed' | 'synced'
 * @returns {Promise<Array>}
 */
export async function getEntriesByStatus(status) {
  const db = await getDb();
  return db.getAllFromIndex(ENTRIES_STORE, 'status', status);
}

/**
 * Acquire the drain lock. Returns true if lock acquired, false if another tab holds it.
 * Uses a single readwrite transaction to prevent TOCTOU race conditions.
 */
async function acquireLock() {
  const db = await getDb();
  const tx = db.transaction(META_STORE, 'readwrite');
  const store = tx.objectStore(META_STORE);
  const existing = await store.get(LOCK_KEY);

  if (existing && existing.timestamp > Date.now() - LOCK_STALE_MS) {
    return false; // Another tab is draining
  }

  const tabId = crypto.randomUUID().substring(0, 8);
  await store.put({ key: LOCK_KEY, timestamp: Date.now(), tabId });
  await tx.done;
  return true;
}

/**
 * Release the drain lock.
 */
async function releaseLock() {
  const db = await getDb();
  await db.delete(META_STORE, LOCK_KEY);
}

/**
 * Drain the queue -- attempt to sync all pending entries.
 *
 * @param {Function} getToken - Returns current access token (from AuthContext)
 * @param {Function} apiPost - Function to POST an entry: (path, body, options) => result
 * @returns {Promise<{synced: number, failed: number, authRequired: boolean, stopped: boolean}>}
 */
export async function drainQueue(getToken, apiPost) {
  if (!navigator.onLine) {
    return { synced: 0, failed: 0, authRequired: false, stopped: true };
  }

  const locked = await acquireLock();
  if (!locked) {
    return { synced: 0, failed: 0, authRequired: false, stopped: true };
  }

  const result = { synced: 0, failed: 0, authRequired: false, stopped: false };
  const db = await getDb();

  try {
    // Get pending entries ordered by queuedAt
    const entries = await db.getAllFromIndex(ENTRIES_STORE, 'status', 'pending');
    entries.sort((a, b) => a.queuedAt - b.queuedAt);

    for (const entry of entries) {
      const token = getToken();

      if (!token) {
        // No auth -- try to surface this for the UI
        result.authRequired = true;
        result.stopped = true;
        break;
      }

      const response = await apiPost(
        '/log-entry',
        {
          logType: entry.logType,
          locationId: entry.locationId,
          employeeId: entry.employeeId,
          data: entry.data,
          gpsCoords: entry.gpsCoords,
          clientCreatedAt: entry.clientCreatedAt,
          idempotencyKey: entry.idempotencyKey,
          signatureData: entry.signatureData,
        },
        { accessToken: token }
      );

      if (response.success || response.error?.code === 'CONFLICT') {
        // 2xx or 409 (duplicate) -- mark synced
        await db.put(ENTRIES_STORE, {
          ...entry,
          status: 'synced',
          syncedAt: Date.now(),
        });
        result.synced++;
      } else if (response.error?.code === 'SESSION_EXPIRED') {
        // 401 -- stop drain, prompt re-login
        result.authRequired = true;
        result.stopped = true;
        break;
      } else if (response.error?.code === 'VALIDATION_ERROR') {
        // 422 -- mark failed with details
        await db.put(ENTRIES_STORE, {
          ...entry,
          status: 'failed',
          error: response.error,
          attempts: entry.attempts + 1,
        });
        result.failed++;
      } else {
        // 5xx / network error -- increment attempts, stop
        await db.put(ENTRIES_STORE, {
          ...entry,
          attempts: entry.attempts + 1,
        });
        result.stopped = true;
        break;
      }
    }
  } finally {
    await releaseLock();
  }

  return result;
}

/**
 * Clean up synced entries older than retention period.
 *
 * @returns {Promise<number>} Number of entries cleaned up
 */
export async function cleanupSynced() {
  const db = await getDb();
  const cutoff = Date.now() - SYNCED_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  const synced = await db.getAllFromIndex(ENTRIES_STORE, 'status', 'synced');

  let cleaned = 0;
  for (const entry of synced) {
    if (entry.syncedAt && entry.syncedAt < cutoff) {
      await db.delete(ENTRIES_STORE, entry.idempotencyKey);
      cleaned++;
    }
  }

  return cleaned;
}

/**
 * Monitor for unexpected eviction.
 * Compares current queue count against last known count.
 *
 * @param {number} lastKnownCount - Previous pending count
 * @returns {Promise<{evictionDetected: boolean, currentCount: number}>}
 */
export async function checkEviction(lastKnownCount) {
  const status = await getQueueStatus();
  const evictionDetected = lastKnownCount > 0 && status.pending < lastKnownCount && status.synced === 0; // No drain happened -- entries just disappeared

  if (evictionDetected && import.meta.env.DEV) {
    console.warn(
      '[Queue] Possible eviction detected: expected',
      lastKnownCount,
      'pending entries, found',
      status.pending
    );
  }

  return { evictionDetected, currentCount: status.pending };
}

/**
 * Close the database connection (for testing/cleanup).
 */
export async function closeDb() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
