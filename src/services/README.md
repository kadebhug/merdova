# Service Layer Documentation

This service layer provides a unified interface for database and storage operations, supporting both Supabase and Firebase backends.

## Architecture

The service layer consists of:

1. **Service Interface** (`serviceInterface.js`) - Defines the contract that all implementations must follow
2. **Supabase Implementation** (`supabaseService.js`) - Supabase-specific implementations
3. **Firebase Implementation** (`firebaseService.js`) - Firebase-specific implementations
4. **Service Factory** (`serviceFactory.js`) - Factory pattern to create and switch between providers

## Usage

### Basic Usage

```javascript
import { databaseService, storageService } from './services';

// Fetch all entries
const entries = await databaseService.fetchEntries();

// Create a new entry
const newEntry = await databaseService.createEntry({
  title: 'My Entry',
  content_items: [],
  flower_color: '#eab308',
  height: 200
});

// Update an entry
await databaseService.updateEntry(entryId, {
  title: 'Updated Title'
});

// Delete an entry
await databaseService.deleteEntry(entryId);

// Upload a file
const imageUrl = await storageService.uploadFile(file, 'flower-images');

// Get public URL
const publicUrl = storageService.getPublicUrl('flower-images', 'filename.jpg');
```

### Getting the Service Provider

```javascript
import { getServiceProvider, getServiceProviderName } from './services';

// Get the current provider name ('supabase' or 'firebase')
const providerName = getServiceProviderName();

// Get a new service provider instance
const services = getServiceProvider();
const entries = await services.database.fetchEntries();
```

### Direct Service Access

```javascript
import { 
  SupabaseDatabaseService, 
  FirebaseDatabaseService 
} from './services';

// Use Supabase directly
const supabaseDb = new SupabaseDatabaseService();
const entries = await supabaseDb.fetchEntries();

// Use Firebase directly
const firebaseDb = new FirebaseDatabaseService();
const entries = await firebaseDb.fetchEntries();
```

## Service Methods

### DatabaseService

All database services implement these methods:

- `fetchEntries()` - Fetch all entries, ordered by creation date
- `createEntry(entryData)` - Create a new entry
- `updateEntry(entryId, entryData)` - Update an existing entry
- `deleteEntry(entryId)` - Delete an entry
- `getEntryById(entryId)` - Get a single entry by ID

### StorageService

All storage services implement these methods:

- `uploadFile(file, bucket, fileName?)` - Upload a file and return its public URL
- `deleteFile(bucket, fileName)` - Delete a file from storage
- `getPublicUrl(bucket, fileName)` - Get the public URL for a file

## Configuration

Set the `VITE_SERVICE_PROVIDER` environment variable in `.env.local`:

```env
VITE_SERVICE_PROVIDER=firebase  # or 'supabase'
```

If not set, defaults to `supabase` for backward compatibility.

## Data Format

The service layer normalizes data formats between Supabase and Firebase:

- **Timestamps**: Automatically converted to ISO strings
- **IDs**: Handled transparently (UUIDs for Supabase, auto-generated IDs for Firebase)
- **Dates**: Normalized to consistent formats

## Error Handling

All service methods throw errors that should be caught:

```javascript
try {
  const entries = await databaseService.fetchEntries();
} catch (error) {
  console.error('Failed to fetch entries:', error);
  // Handle error appropriately
}
```

## Migration Guide

### From Direct Supabase Calls

**Before:**
```javascript
import { supabase } from '../config/supabaseClient';

const { data, error } = await supabase
  .from('flower_entries')
  .select('*')
  .order('created_at', { ascending: true });
```

**After:**
```javascript
import { databaseService } from '../services';

const entries = await databaseService.fetchEntries();
```

### From Direct Supabase Storage

**Before:**
```javascript
const { data, error } = await supabase.storage
  .from('flower-images')
  .upload(fileName, file);

const { data: { publicUrl } } = supabase.storage
  .from('flower-images')
  .getPublicUrl(fileName);
```

**After:**
```javascript
import { storageService } from '../services';

const publicUrl = await storageService.uploadFile(file, 'flower-images');
```

## Benefits

1. **Abstraction**: Switch between Supabase and Firebase without changing component code
2. **Consistency**: Unified API across different backend providers
3. **Testability**: Easy to mock services for testing
4. **Flexibility**: Can use different providers for different environments
5. **Future-proof**: Easy to add new service providers (e.g., AWS, Azure)

