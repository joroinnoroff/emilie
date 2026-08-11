"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/components/CartProvider"
import { useLocale } from "@/lib/LocaleProvider"
import { Wrap, btnClass } from "./ui"

export default function CheckoutSuccessClient() {
  const { clearCart } = useCart()
  const { locale } = useLocale()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <section className="pt-[150px] pb-20">
      <Wrap className="max-w-[520px]">
        <h1 className="mb-4 text-[clamp(2.25rem,5vw,4rem)] tracking-tight">
          {locale === "nb" ? "Takk" : "Thank you"}
        </h1>
        <p className="mb-3 text-[1.0625rem] text-ink-soft">
          {locale === "nb"
            ? "Betalingen er mottatt."
            : "Your payment was received."}
        </p>
        <p className="mb-6 text-sm text-ink-soft">
          {locale === "nb"
            ? "Sandkasse / testmodus — ingen ekte trekk ved testkort."
            : "Sandbox / test mode — no real charge with test cards."}
        </p>
        <Link href="/shop" className={`${btnClass} mt-6`}>
          {locale === "nb" ? "Tilbake til butikk" : "Back to shop"}
        </Link>
      </Wrap>
    </section>
  )
}
