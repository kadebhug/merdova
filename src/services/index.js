/**
 * Service Layer - Unified Export
 * 
 * This module provides a unified interface for accessing database and storage services.
 * It supports both Supabase and Firebase backends, switchable via environment variables.
 */

export { 
  ServiceProvider,
  DatabaseService,
  StorageService 
} from './serviceInterface';

export {
  SupabaseDatabaseService,
  SupabaseStorageService
} from './supabaseService';

export {
  FirebaseDatabaseService,
  FirebaseStorageService
} from './firebaseService';

export {
  getServiceProvider,
  getServiceProviderName,
  serviceProvider,
  databaseService,
  storageService
} from './serviceFactory';

