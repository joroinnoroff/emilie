"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { loadStripe } from "@stripe/stripe-js"
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js"
import { useCart } from "@/components/CartProvider"
import { useLocale } from "@/lib/LocaleProvider"
import { checkoutCurrency } from "@/lib/i18n"
import type { DeliveryOption } from "@/lib/sanity-content"
import { localized } from "@/lib/sanity-content"
import { btnClass, cn, fieldClass } from "./ui"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
)

const DEFAULT_LABELS: Record<string, { en: string; nb: string }> = {
  pickup: { en: "Pick-up in Oslo", nb: "Henting i Oslo" },
  norway: { en: "Shipping in Norway", nb: "Frakt i Norge" },
  abroad: { en: "Shipping abroad", nb: "Frakt til utlandet" },
}

type CheckoutClientProps = {
  deliveryOptions: DeliveryOption[]
}

export default function CheckoutClient({ deliveryOptions }: CheckoutClientProps) {
  const { lines, removeItem } = useCart()
  const { locale, t, money } = useLocale()
  const currency = checkoutCurrency(locale)

  const [step, setStep] = useState<"info" | "payment">("info")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [deliveryKey, setDeliveryKey] = useState<string>("")
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loadingCheckout, setLoadingCheckout] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const linesSnapshot = useRef(lines)

  const [retryToken, setRetryToken] = useState(0)

  // Keep a snapshot for Stripe after navigating steps (cart stays until success)
  useEffect(() => {
    if (lines.length) linesSnapshot.current = lines
  }, [lines])

  const options = useMemo(
    () => (deliveryOptions || []).filter((o) => o.enabled !== false && o.key),
    [deliveryOptions]
  )

  const selectedDelivery = options.find((o) => o.key === deliveryKey)
  const activeLines = lines.length ? lines : linesSnapshot.current

  const itemsTotal = useMemo(
    () =>
      activeLines.reduce((sum, line) => {
        const unit = currency === "nok" ? line.priceNok : line.priceEur
        return sum + (unit ?? 0) * line.qty
      }, 0),
    [activeLines, currency]
  )

  const deliveryTotal =
    selectedDelivery == null
      ? 0
      : currency === "nok"
        ? selectedDelivery.priceNok
        : selectedDelivery.priceEur

  const grandTotal = itemsTotal + deliveryTotal

  const deliveryLabel = (opt: DeliveryOption) => {
    const fallback = DEFAULT_LABELS[opt.key]
    return (
      localized(locale, opt.label || fallback?.en, opt.labelNb || fallback?.nb) ||
      opt.key
    )
  }

  useEffect(() => {
    if (step !== "payment") return
    if (!deliveryKey) {
      if (options[0]) setDeliveryKey(options[0].key)
      return
    }
    if (!selectedDelivery || !email.trim() || !activeLines.length) return

    let cancelled = false
    setLoadingCheckout(true)
    setError(null)
    setClientSecret(null)

    const payload = {
      locale,
      currency,
      email: email.trim(),
      name: name.trim(),
      delivery: {
        key: selectedDelivery.key,
        label: deliveryLabel(selectedDelivery),
        priceNok: selectedDelivery.priceNok,
        priceEur: selectedDelivery.priceEur,
      },
      lines: activeLines.map((l) => ({
        id: l.id,
        productId: l.productId,
        variant: l.variant,
        printSize: l.printSize,
        qty: l.qty,
        title: l.title,
        priceNok: l.priceNok,
        priceEur: l.priceEur,
      })),
    }

    async function fetchCheckout(attempt = 1): Promise<void> {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = (await res.json()) as { clientSecret?: string; error?: string }
        if (cancelled) return
        if (!res.ok || !data.clientSecret) {
          setError(data.error || "Could not start payment.")
          return
        }
        setClientSecret(data.clientSecret)
      } catch {
        // ERR_NETWORK_CHANGED / flaky Wi‑Fi — retry a couple times
        if (!cancelled && attempt < 3) {
          await new Promise((r) => setTimeout(r, 600 * attempt))
          if (!cancelled) return fetchCheckout(attempt + 1)
          return
        }
        if (!cancelled) {
          setError(
            locale === "nb"
              ? "Nettverksfeil ved oppstart av betaling. Prøv igjen."
              : "Network error starting payment. Please try again."
          )
        }
      }
    }

    ;(async () => {
      await fetchCheckout(1)
      if (!cancelled) setLoadingCheckout(false)
    })()

    return () => {
      cancelled = true
    }
    // intentionally recreate when delivery / step / currency / retry changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, deliveryKey, currency, locale, retryToken])

  const continueToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !email.trim()) {
      setError(locale === "nb" ? "Fyll inn navn og e-post." : "Enter name and email.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(locale === "nb" ? "Ugyldig e-post." : "Invalid email.")
      return
    }
    if (!deliveryKey && options[0]) setDeliveryKey(options[0].key)
    setStep("payment")
  }

  if (!activeLines.length) {
    return (
      <div className="py-10 pb-20">
        <p className="mb-6 text-ink-soft">{t("checkout.empty")}</p>
        <Link href="/shop" className={btnClass}>
          {t("nav.shop")}
        </Link>
      </div>
    )
  }

  return (
    <div>
      <nav className="mb-10 flex items-center gap-3" aria-label="Checkout steps">
        <button
          type="button"
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-inherit text-sm",
            step === "info" ? "text-ink" : "text-ink-soft"
          )}
          onClick={() => {
            setStep("info")
            setClientSecret(null)
          }}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center border border-current text-xs">
            1
          </span>
          Info
        </button>
        <span className="h-px w-8 bg-line" aria-hidden="true" />
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 border-0 bg-transparent p-0 font-inherit text-sm disabled:cursor-default",
            step === "payment" ? "text-ink" : "text-ink-soft"
          )}
          disabled={step === "info"}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center border border-current text-xs">
            2
          </span>
          {locale === "nb" ? "Betaling & levering" : "Payment & Delivery"}
        </button>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_0.8fr] max-[860px]:gap-8">
        <div>
          {step === "info" ? (
            <form className="flex max-w-md flex-col gap-4" onSubmit={continueToPayment}>
              <h2 className="mb-2 text-2xl tracking-tight">
                {locale === "nb" ? "Dine opplysninger" : "Your details"}
              </h2>
              <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
                <span>{locale === "nb" ? "Navn" : "Name"}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className={fieldClass}
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
                <span>{locale === "nb" ? "E-post" : "Email"}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className={fieldClass}
                />
              </label>
              {error ? <p className="text-sm text-red-700">{error}</p> : null}
              <button type="submit" className={`${btnClass} self-start`}>
                {locale === "nb" ? "Fortsett" : "Continue"}
              </button>
            </form>
          ) : (
            <div>
              <h2 className="mb-4 text-2xl tracking-tight">
                {locale === "nb" ? "Levering" : "Delivery"}
              </h2>
              <div className="mb-8 flex flex-col gap-2" role="radiogroup">
                {options.map((opt) => {
                  const price = money({
                    priceNok: opt.priceNok,
                    priceEur: opt.priceEur,
                  })
                  const free =
                    (currency === "nok" ? opt.priceNok : opt.priceEur) === 0
                  return (
                    <label
                      key={opt.key}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 border px-4 py-3",
                        deliveryKey === opt.key ? "border-ink" : "border-line"
                      )}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={opt.key}
                        checked={deliveryKey === opt.key}
                        onChange={() => setDeliveryKey(opt.key)}
                        className="accent-ink"
                      />
                      <span className="flex flex-1 items-baseline justify-between gap-4">
                        <strong className="font-medium">{deliveryLabel(opt)}</strong>
                        <em className="not-italic text-ink-soft">
                          {free ? (locale === "nb" ? "Gratis" : "Free") : price}
                        </em>
                      </span>
                    </label>
                  )
                })}
              </div>

              <h2 className="mb-4 text-2xl tracking-tight">
                {locale === "nb" ? "Betaling" : "Payment"}
              </h2>

              {error ? (
                <div className="mb-4 flex flex-col items-start gap-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    type="button"
                    className={cn(btnClass, "border-line text-ink-soft hover:border-ink hover:bg-transparent hover:text-ink")}
                    onClick={() => {
                      setError(null)
                      setRetryToken((n) => n + 1)
                    }}
                  >
                    {locale === "nb" ? "Prøv igjen" : "Try again"}
                  </button>
                </div>
              ) : null}
              {loadingCheckout ? (
                <p className="mb-4 text-sm text-ink-soft">
                  {locale === "nb" ? "Laster betaling…" : "Loading payment…"}
                </p>
              ) : null}

              {clientSecret ? (
                <div className="min-h-[320px]">
                  <EmbeddedCheckoutProvider
                    key={clientSecret}
                    stripe={stripePromise}
                    options={{ clientSecret }}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <aside className="border border-line p-6">
          <h2 className="mb-5 text-xl tracking-tight">{t("checkout.summary")}</h2>

          {step === "payment" && (name.trim() || email.trim()) ? (
            <div className="mb-5 border-b border-line pb-4">
              <div className="mb-2 flex items-center justify-between gap-3 text-sm text-ink-soft">
                <span>{locale === "nb" ? "Dine opplysninger" : "Your details"}</span>
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-inherit text-sm text-ink"
                  onClick={() => {
                    setStep("info")
                    setClientSecret(null)
                    setError(null)
                  }}
                  aria-label={locale === "nb" ? "Rediger opplysninger" : "Edit details"}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M10 3L5 8l5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {locale === "nb" ? "Rediger" : "Edit"}
                </button>
              </div>
              {name.trim() ? <p className="text-sm">{name.trim()}</p> : null}
              {email.trim() ? <p className="text-sm text-ink-soft">{email.trim()}</p> : null}
            </div>
          ) : null}

          <ul className="mb-4 flex list-none flex-col gap-4">
            {activeLines.map((line) => (
              <li key={line.id}>
                <div className="flex justify-between gap-3 text-sm">
                  <span>
                    {line.title}
                    {line.variant === "print" ? ` · ${line.printSize}` : ""}
                    {line.qty > 1 ? ` × ${line.qty}` : ""}
                  </span>
                  <span>
                    {money({
                      priceNok: (line.priceNok ?? 0) * line.qty,
                      priceEur: (line.priceEur ?? 0) * line.qty,
                    })}
                  </span>
                </div>
                {step === "info" ? (
                  <button
                    type="button"
                    className="mt-1 cursor-pointer border-0 border-b border-ink bg-transparent p-0 pb-px text-sm text-ink hover:opacity-50"
                    onClick={() => removeItem(line.id)}
                  >
                    {t("checkout.remove")}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
          {selectedDelivery ? (
            <div className="mb-3 flex justify-between gap-3 border-t border-line pt-3 text-sm text-ink-soft">
              <span>{deliveryLabel(selectedDelivery)}</span>
              <span>
                {deliveryTotal === 0
                  ? locale === "nb"
                    ? "Gratis"
                    : "Free"
                  : money({
                      priceNok: selectedDelivery.priceNok,
                      priceEur: selectedDelivery.priceEur,
                    })}
              </span>
            </div>
          ) : null}
          <p className="mt-4 border-t border-line pt-4 text-right">
            <strong className="text-lg font-medium">
              {money(
                currency === "nok"
                  ? { priceNok: grandTotal, priceEur: null }
                  : { priceNok: null, priceEur: grandTotal }
              )}
            </strong>
          </p>
        </aside>
      </div>
    </div>
  )
}
