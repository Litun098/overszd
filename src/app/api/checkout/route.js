// POST /api/checkout
//
// Body: { email, shipping:{firstName,lastName,address,city,postalCode,country},
//         items:[{ id, size, quantity }], promoCode? }
//
// SECURITY: the client only sends WHAT they want to buy (product id, size, qty)
// — never prices. The server looks up every product, recomputes the totals, and
// only then creates the order + payment. This is the single most important rule
// in an ecommerce backend: never trust money values from the browser.
import { NextResponse } from 'next/server';
import { getProductById } from '@/lib/data/products';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { getProvider } from '@/lib/payments';

const CURRENCY = 'INR';
const FREE_SHIPPING_THRESHOLD_CENTS = 20000 * 100; // ₹20,000
const SHIPPING_CENTS = 99 * 100;                   // ₹99 flat
const TAX_RATE = 0.18;                             // 18% GST (adjust per category)
const PROMO_CODES = { OVRSZD26: 0.15 };            // code -> fraction off

export async function POST(req) {
  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { email, shipping = {}, items, promoCode } = payload ?? {};

  if (!email || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'email and items are required' }, { status: 400 });
  }

  // --- Recompute line items from trusted server-side product data ---
  const lineItems = [];
  let subtotalCents = 0;
  for (const item of items) {
    const product = await getProductById(item.id);
    if (!product) {
      return NextResponse.json({ error: `Unknown product: ${item.id}` }, { status: 400 });
    }
    const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
    const unitPriceCents = Math.round(product.price * 100);
    subtotalCents += unitPriceCents * quantity;
    lineItems.push({
      product_id: product.id,
      name: product.name,
      size: item.size ?? null,
      unit_price_cents: unitPriceCents,
      quantity,
    });
  }

  const discountFraction = PROMO_CODES[String(promoCode || '').toUpperCase()] ?? 0;
  const discountCents = Math.round(subtotalCents * discountFraction);
  const shippingCents =
    subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS;
  const taxableCents = subtotalCents - discountCents + shippingCents;
  const taxCents = Math.round(taxableCents * TAX_RATE);
  const totalCents = taxableCents + taxCents;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Checkout backend not configured (set Supabase env vars).' },
      { status: 503 }
    );
  }

  // --- Persist a pending order + items ---
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      status: 'pending',
      email,
      first_name: shipping.firstName ?? null,
      last_name: shipping.lastName ?? null,
      address: shipping.address ?? null,
      city: shipping.city ?? null,
      postal_code: shipping.postalCode ?? null,
      country: shipping.country ?? null,
      currency: CURRENCY,
      subtotal_cents: subtotalCents,
      discount_cents: discountCents,
      shipping_cents: shippingCents,
      tax_cents: taxCents,
      total_cents: totalCents,
      promo_code: promoCode ?? null,
    })
    .select()
    .single();

  if (orderErr) {
    console.error('[checkout] order insert failed:', orderErr.message);
    return NextResponse.json({ error: 'Could not create order' }, { status: 500 });
  }

  const { error: itemsErr } = await supabase
    .from('order_items')
    .insert(lineItems.map((li) => ({ ...li, order_id: order.id })));
  if (itemsErr) {
    console.error('[checkout] order_items insert failed:', itemsErr.message);
  }

  // --- Create the payment with the configured provider ---
  let payment;
  try {
    const provider = getProvider();
    payment = await provider.createPayment({ order });
    await supabase
      .from('orders')
      .update({ payment_provider: provider.name, payment_ref: payment.ref })
      .eq('id', order.id);
  } catch (e) {
    console.error('[checkout] payment init failed:', e.message);
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 502 });
  }

  return NextResponse.json({
    orderId: order.id,
    amountCents: totalCents,
    currency: CURRENCY,
    payment: payment.clientParams,
  });
}
