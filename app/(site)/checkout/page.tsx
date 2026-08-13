import type { Metadata } from "next"
import CheckoutClient from "@/components/CheckoutClient"
import { Wrap } from "@/components/ui"

export const metadata: Metadata = {
  title: "Forespørsel — Emilie",
}

export default function CheckoutPage() {
  return (
    <section className="pt-[150px] pb-20">
      <Wrap>
        <CheckoutClient />
      </Wrap>
    </section>
  )
}
