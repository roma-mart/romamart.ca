/**
 * IndexedDB Utility for Offline Form Submissions
 * Stores form data when offline, syncs when online
 */

const DB_NAME = 'RomaMartDB';
const DB_VERSION = 1;
const STORE_NAME = 'contactForms';

/**
 * Initialize IndexedDB
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true
        });

        // Create indexes
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        objectStore.createIndex('synced', 'synced', { unique: false });
      }
    };
  });
};

/**
 * Add form submission to queue
 */
export const queueFormSubmission = async (formData) => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const submission = {
      ...formData,
      timestamp: Date.now(),
      synced: false
    };

    const request = store.add(submission);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get all pending (unsynced) form submissions
 */
export const getPendingSubmissions = async () => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('synced');

    const request = index.getAll(false); // Get all unsynced items

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Mark submission as synced
 */
export const markAsSynced = async (id) => {
  const db = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const data = getRequest.result;
      data.synced = true;
      data.syncedAt = Date.now();

      const updateRequest = store.put(data);
      updateRequest.onsuccess = () => resolve();
      updateRequest.onerror = () => reject(updateRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
};

/**
 * Delete synced submissions older than 7 days
 */
export const cleanupOldSubmissions = async () => {
  const db = await initDB();
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('timestamp');

    const request = index.openCursor();

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const item = cursor.value;
        
        // Delete if synced and older than 7 days
        if (item.synced && item.timestamp < sevenDaysAgo) {
          cursor.delete();
        }
        
        cursor.continue();
      } else {
        resolve();
      }
    };

    request.onerror = () => reject(request.error);
  });
};

/**
 * Get count of pending submissions
 */
export const getPendingCount = async () => {
  const pending = await getPendingSubmissions();
  return pending.length;
};

export default {
  initDB,
  queueFormSubmission,
  getPendingSubmissions,
  markAsSynced,
  cleanupOldSubmissions,
  getPendingCount
};
