"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useCart } from "./CartProvider"
import { useLocale } from "@/lib/LocaleProvider"
import { checkoutCurrency } from "@/lib/i18n"

export default function CartDrawer() {
  const { open, lines, closeCart, setQty, removeItem, getQty } = useCart()
  const { locale, t, money } = useLocale()
  const currency = checkoutCurrency(locale)

  const total = useMemo(
    () =>
      lines.reduce((sum, line) => {
        const unit = currency === "nok" ? line.priceNok : line.priceEur
        return sum + (unit ?? 0) * line.qty
      }, 0),
    [lines, currency]
  )

  return (
    <>
      <div
        className={`cart-overlay${open ? " open" : ""}`}
        onClick={closeCart}
        aria-hidden={!open}
      />

      <aside className={`cart-drawer${open ? " open" : ""}`} aria-hidden={!open}>
        <div className="cart-drawer-head">
          <h2>{t("nav.cart")}</h2>
          <button type="button" className="cart-close" onClick={closeCart} aria-label="Close cart">
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="cart-empty">{t("checkout.empty")}</p>
        ) : (
          <ul className="cart-lines">
            {lines.map((line) => {
              const unique = line.maxStock <= 1
              return (
                <li key={line.id} className="cart-line">
                  <div className="cart-line-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={line.image} alt={line.title} />
                  </div>
                  <div className="cart-line-meta">
                    <div className="cart-line-title">{line.title}</div>
                    <div className="cart-line-variant">
                      {line.variant === "original"
                        ? t("shop.original")
                        : `${t("shop.print")} · ${line.printSize}`}
                    </div>
                    <div className="cart-line-price">
                      {money({ priceNok: line.priceNok, priceEur: line.priceEur })}
                      {line.qty > 1 ? ` × ${line.qty}` : ""}
                    </div>
                    {unique ? (
                      <div className="cart-line-actions">
                        <span className="cart-unique">{t("shop.unique")}</span>
                        <button type="button" onClick={() => removeItem(line.id)}>
                          {t("checkout.remove")}
                        </button>
                      </div>
                    ) : (
                      <div className="cart-line-actions">
                        <button
                          type="button"
                          disabled={getQty(line.id) <= 1}
                          onClick={() => setQty(line.id, line.qty - 1)}
                        >
                          −
                        </button>
                        <span>{line.qty}</span>
                        <button
                          type="button"
                          disabled={line.qty >= line.maxStock}
                          onClick={() => setQty(line.id, line.qty + 1)}
                        >
                          +
                        </button>
                        <button type="button" onClick={() => removeItem(line.id)}>
                          {t("checkout.remove")}
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <div className="cart-drawer-foot">
          {lines.length > 0 ? (
            <div className="cart-total">
              <span>{t("checkout.summary")}</span>
              <strong>
                {money(
                  currency === "nok"
                    ? { priceNok: total, priceEur: null }
                    : { priceNok: null, priceEur: total }
                )}
              </strong>
            </div>
          ) : null}
          <Link
            href="/checkout"
            className={`btn${lines.length === 0 ? " disabled" : ""}`}
            onClick={(e) => {
              if (lines.length === 0) e.preventDefault()
              else closeCart()
            }}
          >
            {t("checkout.title")}
          </Link>
        </div>
      </aside>
    </>
  )
}
