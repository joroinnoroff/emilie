"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useCart } from "./CartProvider"
import { useLocale } from "@/lib/LocaleProvider"
import { checkoutCurrency } from "@/lib/i18n"
import { btnClass, cn } from "./ui"

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
        className={cn(
          "fixed inset-0 z-[300] bg-black/25 transition-opacity duration-300",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        onClick={closeCart}
        aria-hidden={!open}
      />

      <aside
        className={cn(
          "fixed top-0 right-0 z-[310] flex h-full w-full max-w-[420px] flex-col bg-white px-6 py-7 shadow-[-20px_0_60px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-[cubic-bezier(0.22,0.9,0.32,1)]",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!open}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl tracking-tight">{t("nav.cart")}</h2>
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent text-[1.75rem] leading-none text-ink"
            onClick={closeCart}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col gap-4">
            <p className="text-ink-soft">{t("checkout.empty")}</p>
            <button
              type="button"
              className="cursor-pointer self-start border-0 bg-transparent p-0 font-inherit text-sm text-ink underline-offset-4 hover:underline"
              onClick={closeCart}
            >
              {t("inquiry.continueBrowse")}
            </button>
          </div>
        ) : (
          <ul className="flex flex-1 list-none flex-col gap-5 overflow-auto">
            {lines.map((line) => {
              const unique = line.maxStock <= 1
              return (
                <li key={line.id} className="grid grid-cols-[72px_1fr] gap-3.5">
                  <div className="aspect-[4/5] overflow-hidden bg-[#eee]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={line.image}
                      alt={line.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-base font-medium">{line.title}</div>
                    <div className="mt-0.5 text-[0.8125rem] text-ink-soft">
                      {line.variant === "original"
                        ? t("shop.original")
                        : `${t("shop.print")} · ${line.printSize}`}
                    </div>
                    <div className="mt-1 text-sm text-ink-soft">
                      {money({ priceNok: line.priceNok, priceEur: line.priceEur })}
                      {line.qty > 1 ? ` × ${line.qty}` : ""}
                    </div>
                    {unique ? (
                      <div className="mt-2.5 flex items-center gap-2.5 text-sm">
                        <button
                          type="button"
                          className="cursor-pointer border-0 bg-transparent p-0 font-inherit text-ink"
                          onClick={() => removeItem(line.id)}
                        >
                          {t("checkout.remove")}
                        </button>
                      </div>
                    ) : (
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
                        <button
                          type="button"
                          className="cursor-pointer border-0 bg-transparent p-0 font-inherit text-ink"
                          onClick={() => removeItem(line.id)}
                        >
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

        <div className="border-t border-line pt-5">
          {lines.length > 0 ? (
            <div className="mb-4 flex items-center justify-between text-sm text-ink-soft">
              <span>{t("checkout.summary")}</span>
              <strong className="text-[1.15rem] font-medium text-ink">
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
            className={cn(
              btnClass,
              "mb-3 w-full justify-center",
              lines.length === 0 && "pointer-events-none opacity-45"
            )}
            onClick={(e) => {
              if (lines.length === 0) e.preventDefault()
              else closeCart()
            }}
          >
            {t("inquiry.submit")}
          </Link>
          <button
            type="button"
            className="w-full cursor-pointer border-0 bg-transparent p-0 text-center font-inherit text-sm text-ink-soft underline-offset-4 transition-opacity hover:opacity-60 hover:underline"
            onClick={closeCart}
          >
            {t("inquiry.continueBrowse")}
          </button>
        </div>
      </aside>
    </>
  )
}
