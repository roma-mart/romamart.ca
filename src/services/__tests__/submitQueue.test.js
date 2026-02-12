import 'fake-indexeddb/auto';
import {
  addEntry,
  getQueueStatus,
  getEntriesByStatus,
  drainQueue,
  cleanupSynced,
  checkEviction,
  closeDb,
} from '../submitQueue';
import { openDB } from 'idb';

/**
 * submitQueue tests -- validates connectivity-gap queue lifecycle.
 * Uses fake-indexeddb to provide IndexedDB in jsdom.
 *
 * Covers: addEntry, getQueueStatus, drainQueue (success, 409, 401, 422, 5xx),
 * cleanupSynced, checkEviction.
 */

// Mock crypto.randomUUID (not available in jsdom)
let uuidCounter = 0;
vi.stubGlobal('crypto', {
  ...globalThis.crypto,
  randomUUID: () => `test-uuid-${++uuidCounter}`,
});

const DB_NAME = 'RomaMartComplianceDB';

/**
 * Helper: directly manipulate entries in the DB without going through
 * submitQueue's cached connection. Opens its own short-lived connection.
 */
async function directDbUpdate(storeName, callback) {
  const db = await openDB(DB_NAME, 1);
  try {
    await callback(db, storeName);
  } finally {
    db.close();
  }
}

describe('submitQueue', () => {
  beforeEach(async () => {
    uuidCounter = 0;
    await closeDb();
    // Delete the database between tests for clean state
    await new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase(DB_NAME);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      req.onblocked = () => resolve(); // proceed even if blocked
    });
  });

  afterEach(async () => {
    await closeDb();
  });

  describe('addEntry', () => {
    it('creates an entry with idempotency key and pending status', async () => {
      const result = await addEntry({
        logType: 'temperature',
        employeeId: 'emp-001',
        locationId: 'loc-wellington-001',
        data: { assetId: 'fridge-1', reading: 3.5, unit: 'C' },
      });

      expect(result.idempotencyKey).toBeTruthy();
      expect(result.idempotencyKey).toMatch(/^test-uuid-/);

      const entries = await getEntriesByStatus('pending');
      expect(entries).toHaveLength(1);
      expect(entries[0].logType).toBe('temperature');
      expect(entries[0].status).toBe('pending');
      expect(entries[0].clientCreatedAt).toBeTruthy();
      expect(entries[0].attempts).toBe(0);
    });

    it('generates unique idempotency keys per entry', async () => {
      const r1 = await addEntry({ logType: 'temperature', employeeId: 'emp-001', locationId: 'loc-1' });
      const r2 = await addEntry({ logType: 'cleaning', employeeId: 'emp-001', locationId: 'loc-1' });

      expect(r1.idempotencyKey).not.toBe(r2.idempotencyKey);
    });
  });

  describe('getQueueStatus', () => {
    it('returns zero counts on empty queue', async () => {
      const status = await getQueueStatus();
      expect(status).toEqual({ pending: 0, failed: 0, synced: 0, total: 0 });
    });

    it('counts pending entries correctly', async () => {
      await addEntry({ logType: 'temperature', employeeId: 'emp-001', locationId: 'loc-1' });
      await addEntry({ logType: 'cleaning', employeeId: 'emp-001', locationId: 'loc-1' });

      const status = await getQueueStatus();
      expect(status.pending).toBe(2);
      expect(status.total).toBe(2);
    });
  });

  describe('drainQueue', () => {
    const mockGetToken = () => 'mock-access-token';
    const mockGetTokenNull = () => null;

    it('syncs pending entries on success', async () => {
      await addEntry({ logType: 'temperature', employeeId: 'emp-001', locationId: 'loc-1' });
      await addEntry({ logType: 'cleaning', employeeId: 'emp-001', locationId: 'loc-1' });

      const mockApiPost = vi
        .fn()
        .mockResolvedValue({ success: true, data: { id: 'log-1', serverReceivedAt: new Date().toISOString() } });

      const result = await drainQueue(mockGetToken, mockApiPost);
      expect(result.synced).toBe(2);
      expect(result.failed).toBe(0);
      expect(result.authRequired).toBe(false);

      const status = await getQueueStatus();
      expect(status.pending).toBe(0);
      expect(status.synced).toBe(2);
    });

    it('treats 409 CONFLICT as success (idempotency)', async () => {
      await addEntry({ logType: 'temperature', employeeId: 'emp-001', locationId: 'loc-1' });

      const mockApiPost = vi.fn().mockResolvedValue({
        success: false,
        error: { code: 'CONFLICT', message: 'Entry already processed' },
      });

      const result = await drainQueue(mockGetToken, mockApiPost);
      expect(result.synced).toBe(1);
      expect(result.failed).toBe(0);

      const status = await getQueueStatus();
      expect(status.synced).toBe(1);
      expect(status.pending).toBe(0);
    });

    it('stops drain on 401 SESSION_EXPIRED and sets authRequired', async () => {
      await addEntry({ logType: 'temperature', employeeId: 'emp-001', locationId: 'loc-1' });
      await addEntry({ logType: 'cleaning', employeeId: 'emp-001', locationId: 'loc-1' });

      const mockApiPost = vi.fn().mockResolvedValue({
        success: false,
        error: { code: 'SESSION_EXPIRED', message: 'Session expired' },
      });

      const result = await drainQueue(mockGetToken, mockApiPost);
      expect(result.authRequired).toBe(true);
      expect(result.stopped).toBe(true);
      expect(result.synced).toBe(0);

      // Entries preserved as pending
      const status = await getQueueStatus();
      expect(status.pending).toBe(2);
    });

    it('marks entry as failed on 422 VALIDATION_ERROR', async () => {
      await addEntry({ logType: 'temperature', employeeId: 'emp-001', locationId: 'loc-1' });

      const mockApiPost = vi.fn().mockResolvedValue({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid reading', field: 'data.reading' },
      });

      const result = await drainQueue(mockGetToken, mockApiPost);
      expect(result.failed).toBe(1);
      expect(result.synced).toBe(0);

      const status = await getQueueStatus();
      expect(status.failed).toBe(1);
      expect(status.pending).toBe(0);
    });

    it('stops on 5xx error and increments attempts', async () => {
      await addEntry({ logType: 'temperature', employeeId: 'emp-001', locationId: 'loc-1' });

      const mockApiPost = vi.fn().mockResolvedValue({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Server error' },
      });

      const result = await drainQueue(mockGetToken, mockApiPost);
      expect(result.stopped).toBe(true);
      expect(result.synced).toBe(0);
      expect(result.failed).toBe(0);

      // Entry still pending but attempts incremented
      const entries = await getEntriesByStatus('pending');
      expect(entries[0].attempts).toBe(1);
    });

    it('stops when no auth token available', async () => {
      await addEntry({ logType: 'temperature', employeeId: 'emp-001', locationId: 'loc-1' });

      const mockApiPost = vi.fn();

      const result = await drainQueue(mockGetTokenNull, mockApiPost);
      expect(result.authRequired).toBe(true);
      expect(result.stopped).toBe(true);
      expect(mockApiPost).not.toHaveBeenCalled();

      // Entries preserved
      const status = await getQueueStatus();
      expect(status.pending).toBe(1);
    });

    it('returns early when offline', async () => {
      const orig = navigator.onLine;
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true });

      await addEntry({ logType: 'temperature', employeeId: 'emp-001', locationId: 'loc-1' });

      const mockApiPost = vi.fn();
      const result = await drainQueue(mockGetToken, mockApiPost);
      expect(result.stopped).toBe(true);
      expect(mockApiPost).not.toHaveBeenCalled();

      Object.defineProperty(navigator, 'onLine', { value: orig, writable: true, configurable: true });
    });

    it('returns early when another tab holds the drain lock', async () => {
      // First create an entry to ensure DB is initialized with proper schema
      await addEntry({ logType: 'temperature', employeeId: 'emp-001', locationId: 'loc-1' });

      // Now close the module's DB so we can manipulate the lock directly
      await closeDb();

      // Set the lock via a direct connection (DB already has the meta store)
      await directDbUpdate('meta', async (db) => {
        await db.put('meta', { key: 'drainLock', timestamp: Date.now(), tabId: 'other-tab' });
      });

      const mockApiPost = vi.fn();
      const result = await drainQueue(mockGetToken, mockApiPost);
      expect(result.stopped).toBe(true);
      expect(mockApiPost).not.toHaveBeenCalled();
    });
  });

  describe('cleanupSynced', () => {
    it('removes synced entries older than retention period', async () => {
      await addEntry({ logType: 'temperature', employeeId: 'emp-001', locationId: 'loc-1' });

      // Drain to mark as synced
      const mockApiPost = vi
        .fn()
        .mockResolvedValue({ success: true, data: { id: 'log-1', serverReceivedAt: new Date().toISOString() } });
      await drainQueue(() => 'token', mockApiPost);

      // Close module connection before direct manipulation
      await closeDb();

      // Backdate the syncedAt to 8 days ago
      await directDbUpdate('pendingEntries', async (db) => {
        const synced = await db.getAllFromIndex('pendingEntries', 'status', 'synced');
        for (const entry of synced) {
          entry.syncedAt = Date.now() - 8 * 24 * 60 * 60 * 1000;
          await db.put('pendingEntries', entry);
        }
      });

      const cleaned = await cleanupSynced();
      expect(cleaned).toBe(1);

      const status = await getQueueStatus();
      expect(status.total).toBe(0);
    });

    it('preserves recently synced entries', async () => {
      await addEntry({ logType: 'temperature', employeeId: 'emp-001', locationId: 'loc-1' });

      const mockApiPost = vi
        .fn()
        .mockResolvedValue({ success: true, data: { id: 'log-1', serverReceivedAt: new Date().toISOString() } });
      await drainQueue(() => 'token', mockApiPost);

      const cleaned = await cleanupSynced();
      expect(cleaned).toBe(0);

      const status = await getQueueStatus();
      expect(status.synced).toBe(1);
    });
  });

  describe('checkEviction', () => {
    it('detects eviction when pending count drops unexpectedly', async () => {
      await addEntry({ logType: 'temperature', employeeId: 'emp-001', locationId: 'loc-1' });
      await addEntry({ logType: 'cleaning', employeeId: 'emp-001', locationId: 'loc-1' });

      // Close module connection before direct manipulation
      await closeDb();

      // Simulate eviction by clearing entries directly
      await directDbUpdate('pendingEntries', async (db) => {
        const tx = db.transaction('pendingEntries', 'readwrite');
        await tx.store.clear();
        await tx.done;
      });

      const result = await checkEviction(2);
      expect(result.evictionDetected).toBe(true);
      expect(result.currentCount).toBe(0);
    });

    it('does not flag eviction when entries were synced', async () => {
      await addEntry({ logType: 'temperature', employeeId: 'emp-001', locationId: 'loc-1' });

      const mockApiPost = vi
        .fn()
        .mockResolvedValue({ success: true, data: { id: 'log-1', serverReceivedAt: new Date().toISOString() } });
      await drainQueue(() => 'token', mockApiPost);

      // Synced count > 0 means drain happened, not eviction
      const result = await checkEviction(1);
      expect(result.evictionDetected).toBe(false);
    });

    it('does not flag eviction when lastKnownCount is 0', async () => {
      const result = await checkEviction(0);
      expect(result.evictionDetected).toBe(false);
    });
  });
});
