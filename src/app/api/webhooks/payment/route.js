// POST /api/webhooks/payment
//
// The payment provider calls this server-to-server after a payment completes.
// This — NOT the browser redirect — is the source of truth for "order paid".
// We verify the signature, then flip the order status.
//
// Register this URL in your provider dashboard:
//   https://<your-domain>/api/webhooks/payment
import { NextResponse } from 'next/server';
import { getProvider } from '@/lib/payments';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function POST(req) {
  // Read the RAW body — signature verification must run on the exact bytes.
  const rawBody = await req.text();

  let result;
  try {
    const provider = getProvider();
    result = provider.verifyWebhook({ rawBody, headers: req.headers });
  } catch (e) {
    console.error('[webhook] verify error:', e.message);
    return NextResponse.json({ error: 'verify error' }, { status: 500 });
  }

  if (!result) {
    // Bad/missing signature.
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  // Only act on terminal states; ignore the rest (idempotent).
  if (result.status !== 'paid' && result.status !== 'failed') {
    return NextResponse.json({ received: true });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase || !result.paymentRef) {
    return NextResponse.json({ received: true });
  }

  const { error } = await supabase
    .from('orders')
    .update({ status: result.status })
    .eq('payment_ref', result.paymentRef)
    .neq('status', 'paid'); // don't downgrade an already-paid order

  if (error) {
    console.error('[webhook] order update failed:', error.message);
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
