import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Converts a pure username to a clean internal virtual email for Supabase Auth
 */
export function formatUsernameToEmail(username: string): string {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  return `${clean}@polski.app`;
}

/**
 * Extracts a readable username from a Supabase user object
 */
export function extractUsername(
  email?: string,
  userMetadata?: Record<string, unknown>
): string {
  if (userMetadata?.username && typeof userMetadata.username === 'string') {
    return userMetadata.username;
  }
  if (!email) return 'User';
  return email.split('@')[0];
}
