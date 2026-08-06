import type { Metadata } from "next"
import CheckoutClient from "@/components/CheckoutClient"
import { getSiteSettings } from "@/sanity/lib/fetch"
import { defaultSiteSettings } from "@/lib/sanity-content"

export const metadata: Metadata = {
  title: "Checkout — Emilie",
}

export default async function CheckoutPage() {
  const settings = await getSiteSettings()
  const deliveryOptions =
    settings.deliveryOptions?.length
      ? settings.deliveryOptions
      : defaultSiteSettings.deliveryOptions || []

  return (
    <section className="page-hero checkout-page">
      <div className="wrap">
        <h1>Checkout</h1>
        <CheckoutClient deliveryOptions={deliveryOptions} />
      </div>
    </section>
  )
}
