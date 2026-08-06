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

    ;(async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
          }),
        })
        const data = (await res.json()) as { clientSecret?: string; error?: string }
        if (cancelled) return
        if (!res.ok || !data.clientSecret) {
          setError(data.error || "Could not start payment.")
          return
        }
        setClientSecret(data.clientSecret)
      } catch {
        if (!cancelled) setError("Could not start payment.")
      } finally {
        if (!cancelled) setLoadingCheckout(false)
      }
    })()

    return () => {
      cancelled = true
    }
    // intentionally recreate when delivery / step / currency changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, deliveryKey, currency, locale])

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
      <div className="checkout-empty">
        <p>{t("checkout.empty")}</p>
        <Link href="/shop" className="btn">
          {t("nav.shop")}
        </Link>
      </div>
    )
  }

  return (
    <div className="checkout-flow">
      <nav className="checkout-steps" aria-label="Checkout steps">
        <button
          type="button"
          className={`checkout-step${step === "info" ? " is-active" : ""}`}
          onClick={() => {
            setStep("info")
            setClientSecret(null)
          }}
        >
          <span className="checkout-step-num">1</span>
          Info
        </button>
        <span className="checkout-step-sep" aria-hidden="true" />
        <button
          type="button"
          className={`checkout-step${step === "payment" ? " is-active" : ""}`}
          disabled={step === "info"}
        >
          <span className="checkout-step-num">2</span>
          {locale === "nb" ? "Betaling & levering" : "Payment & Delivery"}
        </button>
      </nav>

      <div className="checkout-grid">
        <div className="checkout-main">
          {step === "info" ? (
            <form className="checkout-info" onSubmit={continueToPayment}>
              <h2>{locale === "nb" ? "Dine opplysninger" : "Your details"}</h2>
              <label className="checkout-field">
                <span>{locale === "nb" ? "Navn" : "Name"}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </label>
              <label className="checkout-field">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </label>
              {error ? <p className="checkout-error">{error}</p> : null}
              <button type="submit" className="btn">
                {locale === "nb" ? "Fortsett" : "Continue"}
              </button>
            </form>
          ) : (
            <div className="checkout-payment">
              <h2>{locale === "nb" ? "Levering" : "Delivery"}</h2>
              <div className="delivery-options" role="radiogroup">
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
                      className={`delivery-option${deliveryKey === opt.key ? " is-active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={opt.key}
                        checked={deliveryKey === opt.key}
                        onChange={() => setDeliveryKey(opt.key)}
                      />
                      <span className="delivery-option-text">
                        <strong>{deliveryLabel(opt)}</strong>
                        <em>{free ? (locale === "nb" ? "Gratis" : "Free") : price}</em>
                      </span>
                    </label>
                  )
                })}
              </div>

              <h2 className="checkout-pay-heading">
                {locale === "nb" ? "Betaling" : "Payment"}
              </h2>

              {error ? <p className="checkout-error">{error}</p> : null}
              {loadingCheckout ? (
                <p className="cart-note">
                  {locale === "nb" ? "Laster betaling…" : "Loading payment…"}
                </p>
              ) : null}

              {clientSecret ? (
                <div className="stripe-embed">
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

        <aside className="checkout-summary">
          <h2>{t("checkout.summary")}</h2>

          {step === "payment" && (name.trim() || email.trim()) ? (
            <div className="checkout-summary-info">
              <div className="checkout-summary-info-head">
                <span>{locale === "nb" ? "Dine opplysninger" : "Your details"}</span>
                <button
                  type="button"
                  className="checkout-edit-info"
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
              {name.trim() ? <p>{name.trim()}</p> : null}
              {email.trim() ? <p>{email.trim()}</p> : null}
            </div>
          ) : null}

          <ul className="checkout-summary-lines">
            {activeLines.map((line) => (
              <li key={line.id}>
                <div className="checkout-summary-row">
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
                    className="work-info-btn"
                    onClick={() => removeItem(line.id)}
                  >
                    {t("checkout.remove")}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
          {selectedDelivery ? (
            <div className="checkout-summary-row checkout-summary-delivery">
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
          <p className="checkout-summary-total">
            <strong>
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
