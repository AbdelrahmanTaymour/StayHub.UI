import { loadStripe, type Stripe } from "@stripe/stripe-js"

let stripePromise: Promise<Stripe | null> | undefined

/** Loads Stripe.js once per page load and reuses the same promise on every call. */
export function getStripe() {
  stripePromise ??= loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  return stripePromise
}
