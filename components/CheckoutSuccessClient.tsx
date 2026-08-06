"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/components/CartProvider"
import { useLocale } from "@/lib/LocaleProvider"

export default function CheckoutSuccessClient() {
  const { clearCart } = useCart()
  const { locale } = useLocale()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <section className="page-hero">
      <div className="wrap checkout-success">
        <h1>{locale === "nb" ? "Takk" : "Thank you"}</h1>
        <p>
          {locale === "nb"
            ? "Betalingen er mottatt."
            : "Your payment was received."}
        </p>
        <p className="cart-note">
          {locale === "nb"
            ? "Sandkasse / testmodus — ingen ekte trekk ved testkort."
            : "Sandbox / test mode — no real charge with test cards."}
        </p>
        <Link href="/shop" className="btn">
          {locale === "nb" ? "Tilbake til butikk" : "Back to shop"}
        </Link>
      </div>
    </section>
  )
}
