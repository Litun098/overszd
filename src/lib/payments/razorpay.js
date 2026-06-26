// Razorpay adapter (REST API — no SDK dependency).
// Recommended provider for physical goods in India (UPI, cards, netbanking).
// Docs: https://razorpay.com/docs/api/orders/
import 'server-only';
import crypto from 'node:crypto';

const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

export const isConfigured = Boolean(keyId && keySecret);

function authHeader() {
  return 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
}

// Create a Razorpay order. `order` is our internal order row.
// Returns a `ref` (provider order id) to persist, and `clientParams` the
// browser checkout widget needs.
export async function createPayment({ order }) {
  if (!isConfigured) throw new Error('Razorpay is not configured.');

  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader() },
    body: JSON.stringify({
      amount: order.total_cents,            // paise
      currency: order.currency || 'INR',
      receipt: order.id,
      notes: { order_id: order.id, email: order.email },
    }),
  });

  if (!res.ok) {
    throw new Error(`Razorpay createOrder failed: ${res.status} ${await res.text()}`);
  }
  const rzpOrder = await res.json();

  return {
    ref: rzpOrder.id,
    clientParams: {
      key: keyId,
      order_id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    },
  };
}

// Verify a Razorpay webhook signature (X-Razorpay-Signature = HMAC-SHA256 of body).
export function verifyWebhook({ rawBody, headers }) {
  if (!webhookSecret) throw new Error('RAZORPAY_WEBHOOK_SECRET not set.');
  const signature = headers.get('x-razorpay-signature');
  if (!signature) return null;

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');
  if (expected !== signature) return null;

  const payload = JSON.parse(rawBody);
  const entity = payload?.payload?.payment?.entity;
  const statusMap = { captured: 'paid', failed: 'failed' };

  return {
    event: payload.event,
    paymentRef: entity?.order_id ?? null,
    status: statusMap[entity?.status] ?? 'pending',
  };
}
