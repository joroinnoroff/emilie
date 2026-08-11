"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/components/CartProvider"
import { useLocale } from "@/lib/LocaleProvider"
import { Wrap, btnClass } from "./ui"

type OrderSummary = {
  orderId: string
  paymentStatus: string
  email?: string | null
  name?: string
  currency: string
  amountTotal: number
  delivery?: string
  pickupPoint?: string
  postalCode?: string
  items: { name: string; quantity: number; amount: number }[]
}

export default function CheckoutSuccessClient() {
  const { clearCart } = useCart()
  const { locale } = useLocale()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [order, setOrder] = useState<OrderSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(Boolean(sessionId))

  useEffect(() => {
    clearCart()
  }, [clearCart])

  useEffect(() => {
    if (!sessionId) {
      setLoading(false)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(
          `/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`
        )
        const data = (await res.json()) as OrderSummary & { error?: string }
        if (cancelled) return
        if (!res.ok) {
          setError(data.error || "Could not load order.")
          return
        }
        setOrder(data)
      } catch {
        if (!cancelled) {
          setError(
            locale === "nb" ? "Kunne ikke hente ordre." : "Could not load order."
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [sessionId, locale])

  const formatMoney = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat(locale === "nb" ? "nb-NO" : "en-GB", {
        style: "currency",
        currency: currency || "NOK",
      }).format(amount)
    } catch {
      return `${amount} ${currency}`
    }
  }

  return (
    <section className="pt-[150px] pb-20">
      <Wrap className="max-w-[560px]">
        <h1 className="mb-4 text-[clamp(2.25rem,5vw,4rem)] tracking-tight">
          {locale === "nb" ? "Takk for bestillingen" : "Thank you for your order"}
        </h1>
        <p className="mb-8 text-[1.0625rem] text-ink-soft">
          {locale === "nb"
            ? "Betalingen er mottatt. Handlekurven er tømt."
            : "Payment received. Your cart has been cleared."}
        </p>

        {loading ? (
          <p className="text-sm text-ink-soft">
            {locale === "nb" ? "Henter ordre…" : "Loading order…"}
          </p>
        ) : null}

        {error ? <p className="mb-6 text-sm text-red-700">{error}</p> : null}

        {order ? (
          <div className="mb-10 border border-line p-6">
            <div className="mb-5 border-b border-line pb-4">
              <p className="text-xs tracking-wide text-ink-soft uppercase">
                {locale === "nb" ? "Ordre-ID" : "Order ID"}
              </p>
              <p className="mt-1 font-mono text-sm break-all">{order.orderId}</p>
            </div>

            {(order.name || order.email) && (
              <div className="mb-5 text-sm">
                {order.name ? <p>{order.name}</p> : null}
                {order.email ? <p className="text-ink-soft">{order.email}</p> : null}
              </div>
            )}

            <ul className="mb-4 flex list-none flex-col gap-3">
              {order.items.map((item, i) => (
                <li key={`${item.name}-${i}`} className="flex justify-between gap-4 text-sm">
                  <span>
                    {item.name}
                    {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                  </span>
                  <span>{formatMoney(item.amount, order.currency)}</span>
                </li>
              ))}
            </ul>

            {order.delivery ? (
              <div className="mb-3 border-t border-line pt-3 text-sm text-ink-soft">
                <p>{order.delivery}</p>
                {order.pickupPoint ? <p className="mt-1">{order.pickupPoint}</p> : null}
                {order.postalCode ? (
                  <p className="mt-1">
                    {locale === "nb" ? "Postnr." : "Postal"} {order.postalCode}
                  </p>
                ) : null}
              </div>
            ) : null}

            <p className="mt-4 flex justify-between border-t border-line pt-4 text-base">
              <span>{locale === "nb" ? "Totalt" : "Total"}</span>
              <strong className="font-medium">
                {formatMoney(order.amountTotal, order.currency)}
              </strong>
            </p>
          </div>
        ) : null}

        {!sessionId && !loading ? (
          <p className="mb-8 text-sm text-ink-soft">
            {locale === "nb"
              ? "Ingen ordredetaljer funnet. Hvis du nettopp betalte, sjekk e-posten din."
              : "No order details found. If you just paid, check your email."}
          </p>
        ) : null}

        <Link href="/shop" className={btnClass}>
          {locale === "nb" ? "Tilbake til butikk" : "Back to shop"}
        </Link>
      </Wrap>
    </section>
  )
}
