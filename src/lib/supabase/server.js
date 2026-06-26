// Server-only Supabase client (uses the SERVICE ROLE key — bypasses RLS).
// NEVER import this from a Client Component. Use only in Route Handlers /
// server code. Returns null if env is not configured.
import 'server-only';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseServerConfigured = Boolean(url && serviceKey);

let serverClient = null;

export function getSupabaseAdmin() {
  if (!isSupabaseServerConfigured) return null;
  if (!serverClient) {
    serverClient = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return serverClient;
}
