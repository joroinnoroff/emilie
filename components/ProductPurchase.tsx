"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { Project } from "@/lib/projects"
import { cartLineId, useCart } from "./CartProvider"
import { useLocale } from "@/lib/LocaleProvider"
import { btnClass, cn } from "./ui"

type ProductPurchaseProps = {
  product: Project
  /** Desktop: scroll purchase CTA into view when choosing version/size */
  onSelectOption?: () => void
}

const chipClass =
  "inline-flex cursor-pointer flex-col items-start gap-0.5 border border-line bg-white px-3.5 py-2.5 font-inherit text-[0.9375rem] text-ink transition-colors duration-300 ease-out"

const versionBtnClass =
  "relative z-[1] flex min-w-0 flex-1 cursor-pointer flex-col items-start gap-0.5 border-0 bg-transparent px-3.5 py-2.5 font-inherit text-[0.9375rem] text-ink"

export default function ProductPurchase({
  product,
  onSelectOption,
}: ProductPurchaseProps) {
  const { addItem, openCart, getQty } = useCart()
  const { t, money, locale } = useLocale()
  const router = useRouter()
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
    version === "original"
      ? !originalAvailable
      : !selectedPrint || selectedPrint.stock < 1

  if (!originalAvailable && !printAvailable) {
    return (
      <button type="button" className={cn(btnClass, "opacity-45")} disabled>
        {t("shop.sold")}
      </button>
    )
  }

  return (
    <div className="flex flex-col items-start gap-3.5">
      {(originalAvailable || printAvailable) && (
        <div className="flex w-full max-w-[420px] flex-col gap-1.5 text-sm text-ink-soft">
          <span>{t("shop.selectVersion")}</span>
          {originalAvailable && printAvailable ? (
            <div
              className="relative grid grid-cols-2 gap-1 rounded-sm bg-[#f3f3f1] p-1"
              role="group"
              aria-label={t("shop.selectVersion")}
            >
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(50%-0.375rem)] rounded-sm bg-[#e2e2de] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  version === "print" && "translate-x-[calc(100%+0.25rem)]"
                )}
              />
              <button
                type="button"
                className={versionBtnClass}
                aria-pressed={version === "original"}
                onClick={() => {
                  setVersion("original")
                  setMessage(null)
                  onSelectOption?.()
                }}
              >
                <span>{t("shop.original")}</span>
                <span className="text-[0.8125rem] text-ink-soft">1 / 1</span>
              </button>
              <button
                type="button"
                className={versionBtnClass}
                aria-pressed={version === "print"}
                onClick={() => {
                  setVersion("print")
                  setMessage(null)
                  onSelectOption?.()
                }}
              >
                <span>{t("shop.print")}</span>
                <span className="text-[0.8125rem] text-ink-soft">
                  {locale === "nb"
                    ? `${availablePrints.reduce((n, p) => n + p.stock, 0)} tilgjengelig`
                    : `${availablePrints.reduce((n, p) => n + p.stock, 0)} available`}
                </span>
              </button>
            </div>
          ) : (
            <div
              className="relative w-fit max-w-full rounded-sm bg-[#f3f3f1] p-1"
              role="group"
              aria-label={t("shop.selectVersion")}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-1 rounded-sm bg-[#e2e2de]"
              />
              {originalAvailable ? (
                <button
                  type="button"
                  className="relative z-[1] flex cursor-pointer flex-col items-start gap-0.5 border-0 bg-transparent px-3.5 py-2.5 font-inherit text-[0.9375rem] text-ink"
                  aria-pressed
                  onClick={() => {
                    setVersion("original")
                    setMessage(null)
                    onSelectOption?.()
                  }}
                >
                  <span>{t("shop.original")}</span>
                  <span className="text-[0.8125rem] text-ink-soft">1 / 1</span>
                </button>
              ) : null}
              {printAvailable ? (
                <button
                  type="button"
                  className="relative z-[1] flex cursor-pointer flex-col items-start gap-0.5 border-0 bg-transparent px-3.5 py-2.5 font-inherit text-[0.9375rem] text-ink"
                  aria-pressed
                  onClick={() => {
                    setVersion("print")
                    setMessage(null)
                    onSelectOption?.()
                  }}
                >
                  <span>{t("shop.print")}</span>
                  <span className="text-[0.8125rem] text-ink-soft">
                    {locale === "nb"
                      ? `${availablePrints.reduce((n, p) => n + p.stock, 0)} tilgjengelig`
                      : `${availablePrints.reduce((n, p) => n + p.stock, 0)} available`}
                  </span>
                </button>
              ) : null}
            </div>
          )}
        </div>
      )}

      {version === "print" && availablePrints.length > 0 ? (
        <div className="flex w-full max-w-[420px] flex-col gap-1.5 text-sm text-ink-soft">
          <span>{t("shop.selectSize")}</span>
          <div
            className="flex flex-wrap gap-2"
            role="listbox"
            aria-label={t("shop.selectSize")}
          >
            {availablePrints.map((p) => (
              <button
                key={p.size}
                type="button"
                role="option"
                aria-selected={printSize === p.size}
                className={cn(
                  chipClass,
                  "border-transparent",
                  printSize === p.size
                    ? "bg-[#e2e2de]"
                    : "bg-[#f3f3f1]"
                )}
                onClick={() => {
                  setPrintSize(p.size)
                  setMessage(null)
                  onSelectOption?.()
                }}
              >
                <span>{p.size}</span>
                <span className="mx-auto text-center text-[0.8125rem] text-ink-soft">
                  {money({ priceNok: p.priceNok, priceEur: p.priceEur })}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mb-1 text-[2rem] text-ink">{money(prices)}</div>

      {sold ? (
        <button type="button" className={cn(btnClass, "opacity-45")} disabled>
          {t("shop.sold")}
        </button>
      ) : uniqueOriginal && inCart ? (
        <button
          type="button"
          className={btnClass}
          onClick={() => router.push("/checkout")}
        >
          {t("shop.inCart")}
        </button>
      ) : (
        <button
          type="button"
          className={btnClass}
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
              if (result.reason !== "sold") openCart()
              return
            }
            setMessage(null)
            router.push("/checkout")
          }}
        >
          {t("shop.addToCart")}
        </button>
      )}

      {message ? (
        <p className="mt-3 text-sm text-ink-soft">{message}</p>
      ) : null}
    </div>
  )
}
