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
import type { BringPickupPoint, BringShippingOption } from "@/lib/bring"
import { btnClass, cn, fieldClass } from "./ui"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
)

type CheckoutClientProps = {
  deliveryOptions: DeliveryOption[]
}

type SelectedDelivery = {
  key: string
  label: string
  priceNok: number
  priceEur: number
  productId?: string
  pickupPointId?: string
  pickupPointName?: string
}

export default function CheckoutClient({ deliveryOptions }: CheckoutClientProps) {
  const { lines, removeItem } = useCart()
  const { locale, t, money } = useLocale()
  const currency = checkoutCurrency(locale)

  const [step, setStep] = useState<"info" | "payment">("info")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [street, setStreet] = useState("")
  const [deliveryKey, setDeliveryKey] = useState<string>("")
  const [bringOptions, setBringOptions] = useState<BringShippingOption[]>([])
  const [pickupPoints, setPickupPoints] = useState<BringPickupPoint[]>([])
  const [pickupPointId, setPickupPointId] = useState("")
  const [bringLoading, setBringLoading] = useState(false)
  const [bringError, setBringError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loadingCheckout, setLoadingCheckout] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const linesSnapshot = useRef(lines)
  const [retryToken, setRetryToken] = useState(0)

  useEffect(() => {
    if (lines.length) linesSnapshot.current = lines
  }, [lines])

  const studioPickup = useMemo(() => {
    const opt = (deliveryOptions || []).find(
      (o) => o.enabled !== false && o.key === "pickup"
    )
    if (!opt) return null
    return {
      key: "pickup",
      label:
        localized(locale, opt.label || "Pick-up in Oslo", opt.labelNb || "Henting i Oslo") ||
        "Henting i Oslo",
      priceNok: opt.priceNok,
      priceEur: opt.priceEur,
    } satisfies SelectedDelivery
  }, [deliveryOptions, locale])

  const activeLines = lines.length ? lines : linesSnapshot.current

  const weightGrams = useMemo(
    () =>
      Math.max(
        1000,
        activeLines.reduce((sum, l) => sum + l.qty * (l.variant === "original" ? 3500 : 800), 0)
      ),
    [activeLines]
  )

  const selectedBring = bringOptions.find((o) => o.key === deliveryKey)
  const selectedPickup = pickupPoints.find((p) => p.id === pickupPointId)

  const selectedDelivery: SelectedDelivery | null = useMemo(() => {
    if (deliveryKey === "pickup" && studioPickup) return studioPickup
    if (!selectedBring) return null
    return {
      key: selectedBring.key,
      label:
        locale === "nb"
          ? selectedBring.labelNb || selectedBring.label
          : selectedBring.label || selectedBring.labelNb,
      priceNok: selectedBring.priceNok,
      priceEur: selectedBring.priceEur,
      productId: selectedBring.productId,
      pickupPointId: selectedBring.key === "bring_pickup" ? pickupPointId : undefined,
      pickupPointName:
        selectedBring.key === "bring_pickup" && selectedPickup
          ? `${selectedPickup.name}, ${selectedPickup.address}, ${selectedPickup.postalCode} ${selectedPickup.city}`
          : undefined,
    }
  }, [deliveryKey, studioPickup, selectedBring, pickupPointId, selectedPickup, locale])

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

  // Fetch Bring rates + pickup points when entering payment with a postal code
  useEffect(() => {
    if (step !== "payment") return
    if (!/^\d{4}$/.test(postalCode.trim())) return

    let cancelled = false
    setBringLoading(true)
    setBringError(null)

    ;(async () => {
      try {
        const [shipRes, pointsRes] = await Promise.all([
          fetch("/api/bring/shipping", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              postalCode: postalCode.trim(),
              weightGrams,
              language: locale === "nb" ? "NO" : "EN",
            }),
          }),
          fetch(
            `/api/bring/pickup-points?postalCode=${encodeURIComponent(postalCode.trim())}${
              street.trim() ? `&street=${encodeURIComponent(street.trim())}` : ""
            }`
          ),
        ])

        const shipData = (await shipRes.json()) as {
          options?: BringShippingOption[]
          error?: string
        }
        const pointsData = (await pointsRes.json()) as {
          points?: BringPickupPoint[]
          error?: string
        }

        if (cancelled) return

        if (!shipRes.ok) {
          setBringError(
            shipData.error ||
              (locale === "nb"
                ? "Kunne ikke hente fraktpriser fra Bring."
                : "Could not load Bring shipping prices.")
          )
          setBringOptions([])
        } else {
          setBringOptions(shipData.options || [])
          if (!deliveryKey && (shipData.options?.length || studioPickup)) {
            setDeliveryKey(shipData.options?.[0]?.key || "pickup")
          }
        }

        setPickupPoints(pointsData.points || [])
        if (pointsData.points?.[0] && !pickupPointId) {
          setPickupPointId(pointsData.points[0].id)
        }
      } catch {
        if (!cancelled) {
          setBringError(
            locale === "nb"
              ? "Nettverksfeil mot Bring."
              : "Network error talking to Bring."
          )
        }
      } finally {
        if (!cancelled) setBringLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, postalCode, street, weightGrams, locale])

  useEffect(() => {
    if (step !== "payment") return
    if (!deliveryKey || !selectedDelivery || !email.trim() || !activeLines.length) return
    if (deliveryKey === "bring_pickup" && !pickupPointId) return

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
        label: selectedDelivery.pickupPointName
          ? `${selectedDelivery.label} — ${selectedDelivery.pickupPointName}`
          : selectedDelivery.label,
        priceNok: selectedDelivery.priceNok,
        priceEur: selectedDelivery.priceEur,
        productId: selectedDelivery.productId || "",
        pickupPointId: selectedDelivery.pickupPointId || "",
        pickupPointName: selectedDelivery.pickupPointName || "",
        postalCode: postalCode.trim(),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, deliveryKey, pickupPointId, currency, locale, retryToken, postalCode])

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
    if (!/^\d{4}$/.test(postalCode.trim())) {
      setError(
        locale === "nb"
          ? "Skriv inn et gyldig postnummer (4 siffer) for frakt."
          : "Enter a valid 4-digit postal code for shipping."
      )
      return
    }
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
              <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
                <span>{locale === "nb" ? "Postnummer" : "Postal code"}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  autoComplete="postal-code"
                  required
                  className={fieldClass}
                  placeholder="0150"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
                <span>
                  {locale === "nb"
                    ? "Gateadresse (valgfritt, bedre hentesteder)"
                    : "Street (optional, better pickup results)"}
                </span>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  autoComplete="street-address"
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
              <p className="mb-4 text-sm text-ink-soft">
                {locale === "nb"
                  ? `Priser via Bring for ${postalCode}`
                  : `Bring rates for ${postalCode}`}
              </p>

              {bringLoading ? (
                <p className="mb-4 text-sm text-ink-soft">
                  {locale === "nb" ? "Henter fraktpriser…" : "Loading shipping prices…"}
                </p>
              ) : null}
              {bringError ? (
                <p className="mb-4 text-sm text-red-700">{bringError}</p>
              ) : null}

              <div className="mb-6 flex flex-col gap-2" role="radiogroup">
                {studioPickup ? (
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 border px-4 py-3",
                      deliveryKey === "pickup" ? "border-ink" : "border-line"
                    )}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value="pickup"
                      checked={deliveryKey === "pickup"}
                      onChange={() => {
                        setDeliveryKey("pickup")
                        setClientSecret(null)
                      }}
                      className="accent-ink"
                    />
                    <span className="flex flex-1 items-baseline justify-between gap-4">
                      <strong className="font-medium">{studioPickup.label}</strong>
                      <em className="not-italic text-ink-soft">
                        {locale === "nb" ? "Gratis" : "Free"}
                      </em>
                    </span>
                  </label>
                ) : null}

                {bringOptions.map((opt) => {
                  const price = money({
                    priceNok: opt.priceNok,
                    priceEur: opt.priceEur,
                  })
                  const title = locale === "nb" ? opt.labelNb || opt.label : opt.label
                  return (
                    <label
                      key={opt.key}
                      className={cn(
                        "flex cursor-pointer flex-col gap-1 border px-4 py-3",
                        deliveryKey === opt.key ? "border-ink" : "border-line"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery"
                          value={opt.key}
                          checked={deliveryKey === opt.key}
                          onChange={() => {
                            setDeliveryKey(opt.key)
                            setClientSecret(null)
                          }}
                          className="accent-ink"
                        />
                        <span className="flex flex-1 items-baseline justify-between gap-4">
                          <strong className="font-medium">{title}</strong>
                          <em className="not-italic text-ink-soft">{price}</em>
                        </span>
                      </span>
                      {opt.expectedDelivery ? (
                        <span className="pl-7 text-xs text-ink-soft">
                          {locale === "nb" ? "Forventet" : "Expected"}:{" "}
                          {opt.expectedDelivery}
                        </span>
                      ) : null}
                    </label>
                  )
                })}
              </div>

              {deliveryKey === "bring_pickup" ? (
                <div className="mb-8">
                  <h3 className="mb-3 text-lg tracking-tight">
                    {locale === "nb" ? "Velg hentested" : "Choose pickup point"}
                  </h3>
                  {pickupPoints.length === 0 ? (
                    <p className="text-sm text-ink-soft">
                      {locale === "nb"
                        ? "Ingen hentesteder funnet for dette postnummeret."
                        : "No pickup points found for this postal code."}
                    </p>
                  ) : (
                    <div className="flex max-h-[280px] flex-col gap-2 overflow-auto">
                      {pickupPoints.map((p) => (
                        <label
                          key={p.id}
                          className={cn(
                            "flex cursor-pointer gap-3 border px-3 py-2.5 text-sm",
                            pickupPointId === p.id ? "border-ink" : "border-line"
                          )}
                        >
                          <input
                            type="radio"
                            name="pickupPoint"
                            value={p.id}
                            checked={pickupPointId === p.id}
                            onChange={() => {
                              setPickupPointId(p.id)
                              setClientSecret(null)
                            }}
                            className="mt-1 accent-ink"
                          />
                          <span className="min-w-0 flex-1">
                            <strong className="font-medium">{p.name}</strong>
                            <span className="mt-0.5 flex items-baseline justify-between gap-4 text-ink-soft">
                              <span className="min-w-0">
                                {p.address}, {p.postalCode} {p.city}
                              </span>
                              {p.distanceInKm ? (
                                <span className="shrink-0 whitespace-nowrap">
                                  {p.distanceInKm} km
                                </span>
                              ) : null}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}

              <h2 className="mb-4 text-2xl tracking-tight">
                {locale === "nb" ? "Betaling" : "Payment"}
              </h2>

              {error ? (
                <div className="mb-4 flex flex-col items-start gap-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    type="button"
                    className={cn(
                      btnClass,
                      "border-line text-ink-soft hover:border-ink hover:bg-transparent hover:text-ink"
                    )}
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
                >
                  {locale === "nb" ? "Rediger" : "Edit"}
                </button>
              </div>
              {name.trim() ? <p className="text-sm">{name.trim()}</p> : null}
              {email.trim() ? <p className="text-sm text-ink-soft">{email.trim()}</p> : null}
              {postalCode.trim() ? (
                <p className="text-sm text-ink-soft">
                  {locale === "nb" ? "Postnr." : "Postal"} {postalCode.trim()}
                </p>
              ) : null}
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
              <span className="max-w-[70%]">
                {selectedDelivery.label}
                {selectedDelivery.pickupPointName
                  ? ` · ${selectedPickup?.name || ""}`
                  : ""}
              </span>
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
