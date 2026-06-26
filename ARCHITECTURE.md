# OVRSZD — Production Architecture

Custom Next.js storefront backed by your own services. No Shopify.

```
Browser (Next.js frontend, Vercel)
   │
   ├── reads catalog ──► /api/products            ─► data layer ─► Supabase (or static fallback)
   │                     /api/products/[id]
   │
   ├── checkout ───────► /api/checkout            ─► recompute totals (server-trusted)
   │                                                ─► create order (Supabase, status=pending)
   │                                                ─► create payment (Razorpay | Dodo)
   │                                                ◄─ returns clientParams
   │
   └── pays via provider widget/redirect
                         provider ──webhook──────► /api/webhooks/payment  ─► order.status = paid
                                                   (signature-verified; source of truth)

Cloudflare R2  ◄── product images / assets (public URLs stored in product_images)
```

## Stack

| Concern        | Choice                          | Notes                                            |
| -------------- | ------------------------------- | ------------------------------------------------ |
| Frontend host  | **Vercel**                      | First-party Next 16 support                       |
| Database/auth  | **Supabase** (Postgres + RLS)   | `supabase/schema.sql`                             |
| Asset storage  | **Cloudflare R2** (S3-compat)   | `src/lib/storage/r2.js`                           |
| Payments       | **Razorpay** (default) / Dodo   | provider-agnostic, `src/lib/payments/`           |

## File map

```
.env.example                       # all env vars (copy to .env.local)
vercel.json                        # forces framework=nextjs (fixes the 404)
supabase/
  schema.sql                       # tables, enums, RLS — run in SQL editor
  seed.mjs                         # migrate static catalog -> Supabase
src/lib/
  supabase/client.js               # browser client (anon key, RLS)
  supabase/server.js               # server client (service role, bypasses RLS)
  data/products.js                 # read layer; Supabase w/ static fallback
  storage/r2.js                    # R2 upload + presigned URLs
  payments/index.js                # provider facade (getProvider())
  payments/razorpay.js             # Razorpay REST adapter
  payments/dodo.js                 # Dodo adapter (stub — see warning below)
src/app/api/
  products/route.js                # GET list
  products/[id]/route.js           # GET one
  checkout/route.js                # POST create order + payment
  webhooks/payment/route.js        # POST provider webhook -> mark paid
```

## Design rules baked in

1. **Never trust client prices.** `/api/checkout` ignores any amounts from the
   browser and recomputes subtotal/discount/shipping/tax/total from the
   products table. The browser only says *what* to buy (id, size, qty).
2. **Webhook is the source of truth for payment**, not the browser redirect.
   Signatures are verified on the raw request body.
3. **Never store card data.** The current `checkout/page.js` has fake card
   fields — replace them with the provider's hosted widget/redirect (Razorpay
   Checkout / Dodo hosted checkout). Card data never touches your server.
4. **Graceful degradation.** Until Supabase env vars are set, the data layer
   serves the existing static catalog, so the live demo keeps working.
5. **Money as integers.** All amounts stored in the smallest unit (`*_cents`).

## ⚠️ Payment provider decision (do this first)

`PAYMENT_PROVIDER=razorpay` is the default. **Dodo is a merchant-of-record
aimed at digital/SaaS — confirm it allows physical apparel before using it.**
If unsure, stay on Razorpay (best fit for physical goods + India/UPI).

## Setup checklist (going live)

1. Create a Supabase project → run `supabase/schema.sql` in the SQL editor.
2. Copy `.env.example` → `.env.local`, fill Supabase keys.
3. `node supabase/seed.mjs` to load the catalog.
4. Create a Cloudflare R2 bucket + API token → fill `R2_*` env vars.
5. **Image migration:** upload the base64 images from `src/data/products.js`
   to R2, then insert `product_images` rows with the public URLs.
6. Pick + configure the payment provider; register the webhook URL
   `https://<domain>/api/webhooks/payment` in its dashboard.
7. Add the same env vars in Vercel → Project → Settings → Environment Variables.
8. Swap the checkout form's fake card fields for the provider's hosted widget.

## Cost (recap)

- **Demo:** ~$0 (all free tiers).
- **Production at launch:** ~$50–75/mo fixed (Vercel Pro $20 + Supabase Pro $25
  + R2 a few $) **+ ~2–3% payment processing** of revenue.
