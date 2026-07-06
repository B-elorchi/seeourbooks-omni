import { createClient } from '@supabase/supabase-js';

// Read from the environment (.env / .env.production) instead of hardcoding —
// a hardcoded http:// URL silently breaks in production: the site is served
// over https:// on omni.seeourbook.com, and browsers block "mixed content"
// (an https page calling an http endpoint), so every Supabase call fails.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Set them in .env (see .env.example).'
  );
}
if (import.meta.env.PROD && supabaseUrl.startsWith('http://')) {
  // Not a hard failure — some self-hosted setups may have a reason — but this
  // WILL be blocked by the browser as mixed content on an https:// site.
  console.warn(
    `Supabase URL is http:// (${supabaseUrl}) — this will be blocked as mixed ` +
    'content on an https:// deployment. Use an https:// URL for VITE_SUPABASE_URL.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
