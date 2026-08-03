import { createClient } from '@supabase/supabase-js';

// Supabase Credentials - loaded from environment variables

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

// Supabase is now used for Storage only (DB + Auth moved to Neon/Better
// Auth) -- no `auth` config block needed since nothing calls `.auth`
// on this client anymore.

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'x-application-name': 'watchUtopia',
    },
  },
});
