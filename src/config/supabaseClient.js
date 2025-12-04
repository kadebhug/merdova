import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Make sure to set these environment variables in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
           supabaseUrl.startsWith('http') && 
           supabaseAnonKey.length > 0);
};

// Create a single supabase client for interacting with your database
// If not configured, create a client with placeholder values that won't break the app
// but will fail gracefully on actual API calls
let supabaseInstance = null;

if (isSupabaseConfigured()) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Use a valid URL format to prevent createClient from throwing
  // This is a dummy Supabase project URL format that won't validate but won't throw
  const placeholderUrl = 'https://xxxxxxxxxxxxx.supabase.co';
  const placeholderKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
  
  console.warn(
    '⚠️ Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.\n' +
    'The app will run but Supabase features will not work.'
  );
  
  try {
    supabaseInstance = createClient(placeholderUrl, placeholderKey);
  } catch (error) {
    // If createClient still throws, create a minimal mock client
    console.error('Failed to create Supabase client:', error);
    // Return a mock object that matches the Supabase client interface
    supabaseInstance = {
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    };
  }
}

export const supabase = supabaseInstance;
