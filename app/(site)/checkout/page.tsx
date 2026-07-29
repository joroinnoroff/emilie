import type { Metadata } from "next"
import CheckoutClient from "@/components/CheckoutClient"
import { getWorks } from "@/sanity/lib/fetch"

export const metadata: Metadata = {
  title: "Checkout — Emilie",
}

export default async function CheckoutPage() {
  const products = await getWorks()

  return (
    <section className="page-hero checkout-page">
      <div className="wrap">
        <h1>Checkout</h1>
        <p className="checkout-lead">Demo flow — Vipps & Stripe come next.</p>
        <CheckoutClient products={products} />
      </div>
    </section>
  )
}
