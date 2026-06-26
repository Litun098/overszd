// Product data-access layer.
//
// Single source of truth for reading products. Prefers Supabase; if Supabase
// isn't configured yet (demo phase) it falls back to the existing static
// catalog in src/data/products.js so the live site keeps working.
//
// Money note: Supabase stores `price_cents` (integer, smallest unit). The
// static catalog uses whole-unit `price`. Both are normalized to the shape
// the UI already expects: { id, name, price, tag, label, image, description,
// sizes, specs, details }.
import { getSupabaseAdmin } from '@/lib/supabase/server';
import {
  PRODUCTS as STATIC_PRODUCTS,
  getProductById as getStaticProductById,
} from '@/data/products';

function rowToProduct(row) {
  const primaryImage =
    row.product_images?.sort((a, b) => a.position - b.position)?.[0]?.url ?? null;
  return {
    id: row.id,
    name: row.name,
    price: Math.round(row.price_cents) / 100,
    currency: row.currency,
    tag: row.tag,
    label: row.label,
    image: primaryImage,
    images: (row.product_images ?? [])
      .sort((a, b) => a.position - b.position)
      .map((i) => i.url),
    description: row.description,
    sizes: row.sizes ?? [],
    specs: row.specs ?? [],
    details: row.details,
  };
}

export async function getProducts() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return STATIC_PRODUCTS;

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[products] Supabase read failed, using static fallback:', error.message);
    return STATIC_PRODUCTS;
  }
  if (!data?.length) return STATIC_PRODUCTS;
  return data.map(rowToProduct);
}

export async function getProductById(id) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return getStaticProductById(id);

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error('[products] Supabase read failed:', error.message);
    return getStaticProductById(id);
  }
  return rowToProduct(data);
}
