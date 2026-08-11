"use client"

import type { Project } from "@/lib/projects"
import { useLocale } from "@/lib/LocaleProvider"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"

function offerLabel(
  product: Project,
  t: ReturnType<typeof useLocale>["t"]
) {
  const originalOk = product.status !== "Sold" && product.stock > 0
  const printsOk =
    product.printAvailable && product.prints.some((pr) => pr.stock > 0)
  if (originalOk && printsOk) return t("shop.offerBoth")
  if (printsOk) return t("shop.printsAvailable")
  if (originalOk) return t("shop.offerOriginal")
  return null
}

type Facet = "all" | "size" | "type" | "price" | "year" | "series" | "prints"

const PRIMARY: { value: Facet; labelKey: "shop.filter.all" | "shop.filter.size" | "shop.filter.type" | "shop.filter.price" | "shop.filter.prints" }[] = [
  { value: "all", labelKey: "shop.filter.all" },
  { value: "size", labelKey: "shop.filter.size" },
  { value: "type", labelKey: "shop.filter.type" },
  { value: "price", labelKey: "shop.filter.price" },
  { value: "prints", labelKey: "shop.filter.prints" },
]

const EXTRA: { value: Facet; labelKey: "shop.filter.year" | "shop.filter.series" }[] = [
  { value: "year", labelKey: "shop.filter.year" },
  { value: "series", labelKey: "shop.filter.series" },
]

const PRICE_BUCKETS = [
  { value: "0-1000", label: "Under 1,000", min: 0, max: 1000 },
  { value: "1000-2000", label: "1,000 – 2,000", min: 1000, max: 2000 },
  { value: "2000+", label: "2,000+", min: 2000, max: Infinity },
] as const

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  )
}

function priceAmount(p: Project) {
  return p.priceEur ?? p.priceNok ?? p.priceUsd ?? null
}

function matchesFacet(p: Project, facet: Facet, value: string | null) {
  if (facet === "all") return true
  if (facet === "prints") {
    if (!p.printAvailable) return false
    const inStock = p.prints.filter((pr) => pr.stock > 0)
    if (!inStock.length) return false
    if (!value) return true
    return inStock.some((pr) => pr.size === value)
  }
  if (!value) return true
  if (facet === "size") return p.size === value
  if (facet === "type") return p.medium === value
  if (facet === "year") return p.year === value
  if (facet === "series") return p.series === value
  if (facet === "price") {
    const amount = priceAmount(p)
    if (amount == null) return false
    const bucket = PRICE_BUCKETS.find((b) => b.value === value)
    if (!bucket) return false
    return amount >= bucket.min && amount < bucket.max
  }
  return true
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"
      />
    </svg>
  )
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M11.4 12l3.9 3.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.213-.325T9.525 12t.062-.375t.213-.325l4.6-4.6q.275-.275.7-.275t.7.275t.275.7t-.275.7z"
      />
    </svg>
  )
}

export default function ProductFilter({ products }: { products: Project[] }) {
  const [expanded, setExpanded] = useState(false)
  const { t } = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()

  //url to read 
  const facet = (searchParams.get("facet") as Facet) ?? "all"
  const value = searchParams.get("value")

  

  const categories = expanded ? [...PRIMARY, ...EXTRA] : PRIMARY

  const valueOptions = useMemo(() => {
    if (facet === "size") return uniqueSorted(products.map((p) => p.size))
    if (facet === "type") return uniqueSorted(products.map((p) => p.medium))
    if (facet === "year") return uniqueSorted(products.map((p) => p.year))
    if (facet === "series") return uniqueSorted(products.map((p) => p.series))
    if (facet === "prints") {
      return uniqueSorted(
        products.flatMap((p) =>
          p.printAvailable
            ? p.prints.filter((pr) => pr.stock > 0).map((pr) => pr.size)
            : []
        )
      )
    }
    if (facet === "price") {
      return PRICE_BUCKETS.map((b) => ({ value: b.value, label: b.label }))
    }
    return [] as string[] | { value: string; label: string }[]
  }, [facet, products])

  const visible = useMemo(
    () => products.filter((p) => matchesFacet(p, facet, value)),
    [products, facet, value]
  )

  function selectFacet(next: Facet) {
    const params = new URLSearchParams(searchParams.toString());
    if (next == "all") {
        params.delete("facet")
        params.delete("value")
    } else {
        params.set("facet", next)
        params.delete("value")

    }

    router.replace(`?${params.toString()}`, { scroll: false })
  }

  function selectValue(next: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!next) params.delete("value")
        else params.set("value", next)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  return (
    <>
      <div className="mb-2 flex min-w-0 items-baseline justify-between gap-4">
        <h1 className="min-w-0 break-words text-[clamp(2.25rem,5vw,4rem)] tracking-tight">
          {t("shop.allTitle")}
        </h1>
        <span className="shrink-0 text-ink-soft">({visible.length})</span>
      </div>

      <div className="sticky top-[var(--header-height)] z-[150] mb-6 max-w-full bg-white py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {categories.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`cursor-pointer whitespace-nowrap border-0 border-b bg-transparent p-0 py-1 font-inherit text-base ${
                facet === option.value
                  ? "border-ink text-ink"
                  : "border-transparent text-ink-soft hover:border-ink hover:text-ink"
              }`}
              onClick={() => selectFacet(option.value)}
            >
              {t(option.labelKey)}
            </button>
          ))}

          <button
            type="button"
            className="ml-1 inline-flex shrink-0 cursor-pointer items-center border-0 bg-transparent p-0 text-ink-soft hover:text-ink"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Hide filters" : "More filters"}
            aria-expanded={expanded}
          >
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        {facet !== "all" && valueOptions.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {facet === "price"
              ? (valueOptions as { value: string; label: string }[]).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`cursor-pointer whitespace-nowrap border-0 border-b bg-transparent p-0 py-1 font-inherit text-[0.9375rem] ${
                      value === opt.value
                        ? "border-ink text-ink"
                        : "border-transparent text-ink-soft hover:border-ink hover:text-ink"
                    }`}
                    onClick={() => selectValue(value === opt.value ? null : opt.value)}
                  >
                    {opt.label}
                  </button>
                ))
              : (valueOptions as string[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`cursor-pointer whitespace-nowrap border-0 border-b bg-transparent p-0 py-1 font-inherit text-[0.9375rem] ${
                      value === opt
                        ? "border-ink text-ink"
                        : "border-transparent text-ink-soft hover:border-ink hover:text-ink"
                    }`}
                    onClick={() => selectValue(value === opt ? null : opt)}
                  >
                    {opt}
                  </button>
                ))}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-14 min-h-full mb-10 w-full">
        {visible.map((product) => {
          const href =
            facet === "prints"
              ? `/shop/${product.id}?version=print${value ? `&size=${encodeURIComponent(value)}` : ""}`
              : `/shop/${product.id}`
          return (
            <Link href={href} key={product.id} className="w-full min-w-0">
              <div className="aspect-[4/5] overflow-hidden bg-[#eee] mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="size flex justify-between items-baseline gap-3 my-2 min-w-0">
                <h2 className="min-w-0 truncate text-[1.125rem] font-medium">{product.title}</h2>
                <span className="shrink-0 text-ink-soft text-sm">
                  {facet === "prints"
                    ? value || t("shop.filter.prints")
                    : product.size}
                </span>
              </div>
              {(() => {
                const label = offerLabel(product, t)
                return label ? (
                  <p className="text-ink-soft text-sm">{label}</p>
                ) : null
              })()}
            </Link>
          )
        })}
      </div>

      {visible.length === 0 ? (
        <p className="text-ink-soft mb-16">{t("shop.noMatch")}</p>
      ) : null}
    </>
  )
}
