// Dodo Payments adapter (merchant-of-record).
//
// ⚠️  BEFORE USING: Dodo is a merchant-of-record focused on DIGITAL products
// and SaaS. Confirm with Dodo that PHYSICAL apparel is permitted on your
// account — MoR providers frequently disallow physical goods. If it's not
// supported, set PAYMENT_PROVIDER=razorpay and use razorpay.js instead.
//
// The functions below are scaffolded stubs. Fill in the real endpoints/fields
// from Dodo's API reference once your account is approved.
import 'server-only';
import crypto from 'node:crypto';

const apiKey = process.env.DODO_API_KEY;
const webhookSecret = process.env.DODO_WEBHOOK_SECRET;

export const isConfigured = Boolean(apiKey);

export async function createPayment({ order }) {
  if (!isConfigured) throw new Error('Dodo is not configured.');

  // TODO: Replace with the real Dodo "create payment/checkout" endpoint + fields.
  const res = await fetch('https://api.dodopayments.com/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      amount: order.total_cents,
      currency: order.currency || 'INR',
      reference: order.id,
      customer: { email: order.email },
    }),
  });

  if (!res.ok) {
    throw new Error(`Dodo createPayment failed: ${res.status} ${await res.text()}`);
  }
  const payment = await res.json();

  return {
    ref: payment.id,
    // For a hosted-checkout MoR flow you typically redirect to a URL:
    clientParams: { checkoutUrl: payment.checkout_url ?? null },
  };
}

export function verifyWebhook({ rawBody, headers }) {
  if (!webhookSecret) throw new Error('DODO_WEBHOOK_SECRET not set.');
  // TODO: confirm Dodo's signature header name + scheme in their docs.
  const signature = headers.get('dodo-signature');
  if (!signature) return null;

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');
  if (expected !== signature) return null;

  const payload = JSON.parse(rawBody);
  return {
    event: payload.type,
    paymentRef: payload?.data?.id ?? null,
    status: payload?.data?.status === 'succeeded' ? 'paid' : 'pending',
  };
}
