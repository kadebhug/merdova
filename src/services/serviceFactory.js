import { ServiceProvider } from './serviceInterface';
import { 
  SupabaseDatabaseService, 
  SupabaseStorageService 
} from './supabaseService';
import { 
  FirebaseDatabaseService, 
  FirebaseStorageService 
} from './firebaseService';

/**
 * Service Factory
 * 
 * Creates and returns the appropriate service provider based on configuration.
 * This allows easy switching between Supabase and Firebase.
 */

// Service provider type - can be 'supabase' or 'firebase'
// Defaults to 'supabase' for backward compatibility
const SERVICE_PROVIDER = import.meta.env.VITE_SERVICE_PROVIDER || 'supabase';

/**
 * Get the active service provider
 * @returns {ServiceProvider} The configured service provider
 */
export function getServiceProvider() {
  switch (SERVICE_PROVIDER.toLowerCase()) {
    case 'firebase':
      return new ServiceProvider(
        new FirebaseDatabaseService(),
        new FirebaseStorageService()
      );
    
    case 'supabase':
    default:
      return new ServiceProvider(
        new SupabaseDatabaseService(),
        new SupabaseStorageService()
      );
  }
}

/**
 * Get the current service provider name
 * @returns {string} 'supabase' or 'firebase'
 */
export function getServiceProviderName() {
  return SERVICE_PROVIDER.toLowerCase();
}

// Export a singleton instance for convenience
export const serviceProvider = getServiceProvider();

// Export individual services for direct access if needed
export const databaseService = serviceProvider.database;
export const storageService = serviceProvider.storage;

