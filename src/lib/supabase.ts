import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Secure Admin Client (Server-Side Only)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

if (!process.env.SUPABASE_SERVICE_ROLE_KEY && typeof window === 'undefined') {
  console.warn('⚠️ WARNING: SUPABASE_SERVICE_ROLE_KEY is missing. Administrative operations will fail.');
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey
);
