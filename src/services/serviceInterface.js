/**
 * Service Layer Interface
 * 
 * This interface defines the contract that all service implementations
 * (Supabase, Firebase, etc.) must follow to ensure consistency.
 */

/**
 * Database Service Interface
 */
export class DatabaseService {
  /**
   * Fetch all entries from the database
   * @returns {Promise<Array>} Array of entries
   */
  async fetchEntries() {
    throw new Error('fetchEntries must be implemented');
  }

  /**
   * Create a new entry
   * @param {Object} entryData - The entry data to create
   * @returns {Promise<Object>} The created entry
   */
  async createEntry(entryData) {
    throw new Error('createEntry must be implemented');
  }

  /**
   * Update an existing entry
   * @param {string} entryId - The ID of the entry to update
   * @param {Object} entryData - The updated entry data
   * @returns {Promise<Object>} The updated entry
   */
  async updateEntry(entryId, entryData) {
    throw new Error('updateEntry must be implemented');
  }

  /**
   * Delete an entry
   * @param {string} entryId - The ID of the entry to delete
   * @returns {Promise<void>}
   */
  async deleteEntry(entryId) {
    throw new Error('deleteEntry must be implemented');
  }

  /**
   * Get a single entry by ID
   * @param {string} entryId - The ID of the entry
   * @returns {Promise<Object>} The entry
   */
  async getEntryById(entryId) {
    throw new Error('getEntryById must be implemented');
  }
}

/**
 * Storage Service Interface
 */
export class StorageService {
  /**
   * Upload a file to storage
   * @param {File} file - The file to upload
   * @param {string} bucket - The storage bucket/path
   * @param {string} fileName - Optional custom file name
   * @returns {Promise<string>} The public URL of the uploaded file
   */
  async uploadFile(file, bucket, fileName = null) {
    throw new Error('uploadFile must be implemented');
  }

  /**
   * Delete a file from storage
   * @param {string} bucket - The storage bucket/path
   * @param {string} fileName - The name of the file to delete
   * @returns {Promise<void>}
   */
  async deleteFile(bucket, fileName) {
    throw new Error('deleteFile must be implemented');
  }

  /**
   * Get the public URL for a file
   * @param {string} bucket - The storage bucket/path
   * @param {string} fileName - The name of the file
   * @returns {string} The public URL
   */
  getPublicUrl(bucket, fileName) {
    throw new Error('getPublicUrl must be implemented');
  }
}

/**
 * Service Provider Interface
 * Combines database and storage services
 */
export class ServiceProvider {
  constructor(databaseService, storageService) {
    this.database = databaseService;
    this.storage = storageService;
  }
}

