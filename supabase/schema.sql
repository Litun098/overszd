-- =============================================================================
-- OVRSZD — Database schema (Supabase / Postgres)
-- Run in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
-- =============================================================================

-- Extensions ------------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()

-- Helper: auto-update updated_at -----------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- =============================================================================
-- PRODUCTS
-- `id` is the human slug used in URLs (e.g. 'shadow-hoodie') to match the
-- existing /product/[id] route. Prices are stored in the smallest currency
-- unit (paise/cents) as integers to avoid floating-point money bugs.
-- =============================================================================
create table if not exists products (
  id            text primary key,                  -- slug, e.g. 'shadow-hoodie'
  name          text not null,
  description   text,
  details       text,
  tag           text,                              -- 'Hoodies' | 'Tees' | 'New' ...
  label         text,                              -- short marketing label (may contain \n)
  price_cents   integer not null check (price_cents >= 0),
  currency      text not null default 'INR',
  specs         text[] not null default '{}',
  sizes         text[] not null default '{}',      -- e.g. {'S','M','L','XL'}
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
drop trigger if exists trg_products_updated on products;
create trigger trg_products_updated before update on products
  for each row execute function set_updated_at();

-- Product images live in Cloudflare R2; we store the public URL + ordering.
create table if not exists product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null references products(id) on delete cascade,
  url         text not null,                       -- public R2 / CDN URL
  alt         text,
  position    integer not null default 0,          -- 0 = primary/hero image
  created_at  timestamptz not null default now()
);
create index if not exists idx_product_images_product on product_images(product_id, position);

-- Optional: per-size stock tracking (inventory).
create table if not exists product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null references products(id) on delete cascade,
  size        text not null,
  stock       integer not null default 0 check (stock >= 0),
  unique (product_id, size)
);

-- =============================================================================
-- ORDERS
-- Created server-side at checkout. Never trust client-sent prices — the server
-- recomputes totals from the products table (see /api/checkout).
-- =============================================================================
create type order_status as enum ('pending','paid','failed','fulfilled','cancelled','refunded');

create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  status            order_status not null default 'pending',
  email             text not null,
  -- shipping address (kept denormalized; this is what was shipped to)
  first_name        text,
  last_name         text,
  address           text,
  city              text,
  postal_code       text,
  country           text,
  -- money (smallest unit)
  currency          text not null default 'INR',
  subtotal_cents    integer not null default 0,
  discount_cents    integer not null default 0,
  shipping_cents    integer not null default 0,
  tax_cents         integer not null default 0,
  total_cents       integer not null default 0,
  promo_code        text,
  -- payment linkage
  payment_provider  text,                          -- 'razorpay' | 'dodo'
  payment_ref       text,                          -- provider order/payment id
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
drop trigger if exists trg_orders_updated on orders;
create trigger trg_orders_updated before update on orders
  for each row execute function set_updated_at();
create index if not exists idx_orders_email on orders(email);
create index if not exists idx_orders_payment_ref on orders(payment_ref);

create table if not exists order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  product_id    text references products(id) on delete set null,
  name          text not null,                     -- snapshot at purchase time
  size          text,
  unit_price_cents integer not null,               -- snapshot price
  quantity      integer not null check (quantity > 0),
  created_at    timestamptz not null default now()
);
create index if not exists idx_order_items_order on order_items(order_id);

-- =============================================================================
-- ROW LEVEL SECURITY
-- Public can READ active products/images. Everything writeable only via the
-- service-role key (server). Orders are NOT publicly readable.
-- =============================================================================
alter table products         enable row level security;
alter table product_images   enable row level security;
alter table product_variants enable row level security;
alter table orders           enable row level security;
alter table order_items      enable row level security;

drop policy if exists "public read active products" on products;
create policy "public read active products" on products
  for select using (is_active = true);

drop policy if exists "public read product images" on product_images;
create policy "public read product images" on product_images
  for select using (true);

drop policy if exists "public read variants" on product_variants;
create policy "public read variants" on product_variants
  for select using (true);

-- No public policies on orders / order_items:
-- the service-role key bypasses RLS, so the server can still read/write them.
