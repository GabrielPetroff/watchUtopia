import { createClient } from '@supabase/supabase-js';

// Supabase Credentials

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate existence of environment variables

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase enviroment variables!');
  console.error('Please check your .env has:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- VITE.SUPABASE_ANON_KEY');
  throw new Error('Missing Supabase environment variables!');
}

// Initialize Supabase Client

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'watchUtopia',
    },
  },
});

// Intiliaze global error handling

export const handleSupabaseError = (error) => {
  if (error) {
    console.error('Supabase Error:', error);
    return {
      success: false,
      message: error.message || 'An error occured!',
      error: error,
    };
  }

  return null;
};
