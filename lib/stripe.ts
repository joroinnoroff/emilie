import Stripe from "stripe"

let _stripe: Stripe | null = null

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2026-07-29.dahlia",
    })
  }
  return _stripe
}

export function hasStripe() {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}
