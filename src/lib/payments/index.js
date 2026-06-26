// Provider-agnostic payments facade.
//
// The rest of the app talks to this module, not to a specific provider, so you
// can switch Razorpay <-> Dodo by changing PAYMENT_PROVIDER without touching
// checkout/order code.
//
// Contract every adapter implements:
//   createPayment({ order })           -> { ref, clientParams }
//   verifyWebhook({ rawBody, headers}) -> { event, paymentRef, status } | null
import 'server-only';
import * as razorpay from './razorpay';
import * as dodo from './dodo';

const PROVIDERS = { razorpay, dodo };

export function getProvider() {
  const name = process.env.PAYMENT_PROVIDER || 'razorpay';
  const provider = PROVIDERS[name];
  if (!provider) throw new Error(`Unknown PAYMENT_PROVIDER: ${name}`);
  return { name, ...provider };
}
