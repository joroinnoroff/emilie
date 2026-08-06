"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import type { Project } from "@/lib/projects"
import { cartLineId, useCart } from "./CartProvider"
import { useLocale } from "@/lib/LocaleProvider"

type ProductPurchaseProps = {
  product: Project
}

export default function ProductPurchase({ product }: ProductPurchaseProps) {
  const { addItem, openCart, getQty } = useCart()
  const { t, money, locale } = useLocale()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState<string | null>(null)

  const originalAvailable =
    product.status !== "Sold" && product.stock > 0 && product.forSale
  const availablePrints = product.prints.filter((p) => p.stock > 0)
  const printAvailable = product.printAvailable && availablePrints.length > 0

  const initialVersion: "original" | "print" =
    searchParams.get("version") === "print" && printAvailable
      ? "print"
      : originalAvailable
        ? "original"
        : printAvailable
          ? "print"
          : "original"

  const requestedSize = searchParams.get("size")
  const initialSize =
    (requestedSize &&
      availablePrints.find((p) => p.size === requestedSize)?.size) ||
    availablePrints[0]?.size ||
    ""

  const [version, setVersion] = useState<"original" | "print">(initialVersion)
  const [printSize, setPrintSize] = useState(initialSize)

  const selectedPrint = useMemo(
    () => availablePrints.find((p) => p.size === printSize),
    [availablePrints, printSize]
  )

  const prices =
    version === "original"
      ? { priceNok: product.priceNok, priceEur: product.priceEur }
      : { priceNok: selectedPrint?.priceNok, priceEur: selectedPrint?.priceEur }

  const lineId = cartLineId(
    product.id,
    version,
    version === "print" ? printSize : undefined
  )
  const inCart = getQty(lineId) > 0
  const uniqueOriginal = version === "original" && product.stock <= 1
  const sold =
    version === "original" ? !originalAvailable : !selectedPrint || selectedPrint.stock < 1

  if (!originalAvailable && !printAvailable) {
    return (
      <button type="button" className="btn disabled" disabled>
        {t("shop.sold")}
      </button>
    )
  }

  return (
    <div className="product-purchase">
      {(originalAvailable || printAvailable) && (
        <div className="purchase-field">
          <span>{t("shop.selectVersion")}</span>
          <div className="print-option-row" role="group" aria-label={t("shop.selectVersion")}>
            {originalAvailable ? (
              <button
                type="button"
                className={`print-option-chip${version === "original" ? " is-active" : ""}`}
                onClick={() => {
                  setVersion("original")
                  setMessage(null)
                }}
              >
                <span>{t("shop.original")}</span>
                <span className="print-option-price">
                  {locale === "nb" ? "1 / 1 unik" : "1 / 1 unique"}
                </span>
              </button>
            ) : null}
            {printAvailable ? (
              <button
                type="button"
                className={`print-option-chip${version === "print" ? " is-active" : ""}`}
                onClick={() => {
                  setVersion("print")
                  setMessage(null)
                }}
              >
                <span>{t("shop.print")}</span>
                <span className="print-option-price">
                  {locale === "nb"
                    ? `${availablePrints.reduce((n, p) => n + p.stock, 0)} tilgjengelig`
                    : `${availablePrints.reduce((n, p) => n + p.stock, 0)} available`}
                </span>
              </button>
            ) : null}
          </div>
        </div>
      )}

      {version === "print" && availablePrints.length > 0 ? (
        <div className="purchase-field">
          <span>{t("shop.selectSize")}</span>
          <div className="print-option-row" role="listbox" aria-label={t("shop.selectSize")}>
            {availablePrints.map((p) => (
              <button
                key={p.size}
                type="button"
                role="option"
                aria-selected={printSize === p.size}
                className={`print-option-chip${printSize === p.size ? " is-active" : ""}`}
                onClick={() => {
                  setPrintSize(p.size)
                  setMessage(null)
                }}
              >
                <span>{p.size}</span>
                <span className="print-option-price">
                  {money({ priceNok: p.priceNok, priceEur: p.priceEur })}
                  {" · "}
                  {locale === "nb"
                    ? `${p.stock} tilgjengelig`
                    : `${p.stock} available`}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="cart-price">{money(prices)}</div>
      <p className="stock-note">
        {version === "original"
          ? locale === "nb"
            ? `Original — ${Math.min(product.stock, 1)} / 1 tilgjengelig`
            : `Original — ${Math.min(product.stock, 1)} / 1 available`
          : selectedPrint
            ? locale === "nb"
              ? `Trykk ${selectedPrint.size} — ${selectedPrint.stock} tilgjengelig`
              : `Print ${selectedPrint.size} — ${selectedPrint.stock} available`
            : null}
      </p>

      {sold ? (
        <button type="button" className="btn disabled" disabled>
          {t("shop.sold")}
        </button>
      ) : uniqueOriginal && inCart ? (
        <button type="button" className="btn" onClick={() => openCart()}>
          {t("shop.inCart")}
        </button>
      ) : (
        <button
          type="button"
          className="btn"
          onClick={() => {
            const result = addItem({
              product,
              variant: version,
              printSize: version === "print" ? printSize : undefined,
            })
            if (!result.ok) {
              setMessage(
                result.reason === "sold" ? t("shop.sold") : t("shop.inCart")
              )
              return
            }
            setMessage(null)
            openCart()
          }}
        >
          {t("shop.addToCart")}
        </button>
      )}

      {message ? <p className="cart-note">{message}</p> : null}
    </div>
  )
}
