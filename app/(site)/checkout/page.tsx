import type { Metadata } from "next"
import CheckoutClient from "@/components/CheckoutClient"
import CheckoutHeading from "@/components/CheckoutHeading"
import { Wrap } from "@/components/ui"
import { getSiteSettings } from "@/sanity/lib/fetch"
import { defaultSiteSettings } from "@/lib/sanity-content"

export const metadata: Metadata = {
  title: "Kasse — Emilie",
}

export default async function CheckoutPage() {
  const settings = await getSiteSettings()
  const deliveryOptions =
    settings.deliveryOptions?.length
      ? settings.deliveryOptions
      : defaultSiteSettings.deliveryOptions || []

  return (
    <section className="pt-[150px] pb-20">
      <Wrap>
        <CheckoutHeading />
        <CheckoutClient deliveryOptions={deliveryOptions} />
      </Wrap>
    </section>
  )
}
