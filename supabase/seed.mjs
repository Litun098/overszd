// Seed Supabase `products` from the existing static catalog.
//
// Usage (after running schema.sql and setting env in .env.local):
//   node supabase/seed.mjs
//
// This upserts product METADATA. Product IMAGES are currently inline base64 in
// src/data/products.js — migrate those to Cloudflare R2 separately (see
// ARCHITECTURE.md "Image migration"), then insert product_images rows with the
// public R2 URLs. Prices convert whole-unit -> *_cents.
import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import { PRODUCTS } from '../src/data/products.js';

loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const rows = PRODUCTS.map((p) => ({
  id: p.id,
  name: p.name,
  description: p.description ?? null,
  details: p.details ?? null,
  tag: p.tag ?? null,
  label: p.label ?? null,
  price_cents: Math.round(p.price * 100),
  currency: 'INR',
  specs: p.specs ?? [],
  sizes: p.sizes ?? [],
  is_active: true,
}));

const { error } = await supabase.from('products').upsert(rows, { onConflict: 'id' });
if (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}
console.log(`Seeded ${rows.length} products.`);
