"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useCart } from "@/components/CartProvider"
import { useLocale } from "@/lib/LocaleProvider"
import { checkoutCurrency } from "@/lib/i18n"
import { btnClass, fieldClass } from "./ui"

export default function CheckoutClient() {
  const { lines, removeItem, setQty, getQty, clearCart } = useCart()
  const { locale, t, money } = useLocale()
  const currency = checkoutCurrency(locale)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [shippingLocation, setShippingLocation] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const total = useMemo(
    () =>
      lines.reduce((sum, line) => {
        const unit = currency === "nok" ? line.priceNok : line.priceEur
        return sum + (unit ?? 0) * line.qty
      }, 0),
    [lines, currency]
  )

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim() || !phone.trim() || !shippingLocation.trim()) {
      setError(t("inquiry.errorRequired"))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t("inquiry.errorEmail"))
      return
    }
    if (!lines.length) {
      setError(t("checkout.empty"))
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
          shippingLocation: shippingLocation.trim(),
          locale,
          lines: lines.map((line) => ({
            id: line.id,
            productId: line.productId,
            title: line.title,
            variant: line.variant,
            printSize: line.printSize,
            qty: line.qty,
            priceNok: line.priceNok,
            priceEur: line.priceEur,
          })),
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(data.error || t("inquiry.errorSend"))
        return
      }
      clearCart()
      setSent(true)
    } catch {
      setError(t("inquiry.errorSend"))
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="max-w-lg py-6">
        <h2 className="mb-3 text-2xl tracking-tight">{t("inquiry.successTitle")}</h2>
        <p className="mb-8 text-[1.0625rem] text-ink-soft">
          {t("inquiry.successBody")}
        </p>
        <Link href="/shop" className={btnClass}>
          {t("inquiry.continueBrowse")}
        </Link>
      </div>
    )
  }

  if (!lines.length) {
    return (
      <div className="py-10 pb-20">
        <p className="mb-6 text-ink-soft">{t("checkout.empty")}</p>
        <Link href="/shop" className={btnClass}>
          {t("inquiry.continueBrowse")}
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_0.85fr] max-[860px]:gap-8">
      <form className="flex max-w-md flex-col gap-4" onSubmit={onSubmit}>
        <p className="mb-1 text-[1.0625rem] text-ink-soft">{t("inquiry.intro")}</p>

        <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
          <span>{t("inquiry.name")}</span>
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
          <span>{t("inquiry.email")}</span>
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
          <span>{t("inquiry.phone")}</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            required
            className={fieldClass}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
          <span>{t("inquiry.shipping")}</span>
          <input
            type="text"
            value={shippingLocation}
            onChange={(e) => setShippingLocation(e.target.value)}
            autoComplete="address-level2"
            required
            className={fieldClass}
            placeholder={t("inquiry.shippingPlaceholder")}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-ink-soft">
          <span>{t("inquiry.message")}</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className={`${fieldClass} min-h-[120px] resize-none`}
            placeholder={t("inquiry.messagePlaceholder")}
          />
        </label>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <button type="submit" className={btnClass} disabled={submitting}>
            {submitting ? t("inquiry.sending") : t("inquiry.submit")}
          </button>
          <Link
            href="/shop"
            className="text-sm text-ink-soft underline-offset-4 transition-opacity hover:opacity-60 hover:underline"
          >
            {t("inquiry.continueBrowse")}
          </Link>
        </div>
      </form>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <h2 className="mb-5 text-2xl tracking-tight">{t("inquiry.askingAbout")}</h2>
        <ul className="mb-6 flex list-none flex-col gap-5">
          {lines.map((line) => {
            const unique = line.maxStock <= 1
            return (
              <li
                key={line.id}
                className="grid grid-cols-[72px_1fr_auto] items-start gap-3.5"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#eee]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={line.image}
                    alt={line.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-base font-medium">{line.title}</div>
                  <div className="mt-0.5 text-[0.8125rem] text-ink-soft">
                    {line.variant === "original"
                      ? t("shop.original")
                      : `${t("shop.print")} · ${line.printSize}`}
                  </div>
                  <div className="mt-1 text-sm text-ink-soft">
                    {money({
                      priceNok: line.priceNok,
                      priceEur: line.priceEur,
                    })}
                    {line.qty > 1 ? ` × ${line.qty}` : ""}
                  </div>
                  {!unique ? (
                    <div className="mt-2.5 flex items-center gap-2.5 text-sm">
                      <button
                        type="button"
                        className="cursor-pointer border-0 bg-transparent p-0 font-inherit text-ink disabled:cursor-default disabled:opacity-30"
                        disabled={getQty(line.id) <= 1}
                        onClick={() => setQty(line.id, line.qty - 1)}
                      >
                        −
                      </button>
                      <span>{line.qty}</span>
                      <button
                        type="button"
                        className="cursor-pointer border-0 bg-transparent p-0 font-inherit text-ink disabled:cursor-default disabled:opacity-30"
                        disabled={line.qty >= line.maxStock}
                        onClick={() => setQty(line.id, line.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="cursor-pointer justify-self-end border-0 bg-transparent p-0 pt-0.5 font-inherit text-sm text-ink"
                  onClick={() => removeItem(line.id)}
                >
                  {t("checkout.remove")}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="flex items-center justify-between border-t border-line pt-4 text-sm text-ink-soft">
          <span>{t("checkout.summary")}</span>
          <strong className="text-[1.15rem] font-medium text-ink">
            {money(
              currency === "nok"
                ? { priceNok: total, priceEur: null }
                : { priceNok: null, priceEur: total }
            )}
          </strong>
        </div>
      </aside>
    </div>
  )
}
