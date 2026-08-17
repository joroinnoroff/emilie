"use client"

import type { Project } from "@/lib/projects"
import type { Locale, MessageKey } from "@/lib/i18n"
import { useLocale } from "@/lib/LocaleProvider"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"
import NaturalAspectImage from "./NaturalAspectImage"

/** Scroll-down distance before auto-collapsing extra filters */
const COLLAPSE_SCROLL_THRESHOLD = 56

const filterEase = [0.22, 0.9, 0.32, 1] as const

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

const PRICE_BUCKETS_EUR = [
  { value: "eur-low", labelKey: "shop.filter.price.low" as MessageKey, min: 0, max: 500 },
  { value: "eur-mid", labelKey: "shop.filter.price.mid" as MessageKey, min: 500, max: 1500 },
  { value: "eur-high", labelKey: "shop.filter.price.high" as MessageKey, min: 1500, max: Infinity },
] as const

const PRICE_BUCKETS_NOK = [
  { value: "nok-low", labelKey: "shop.filter.price.lowNb" as MessageKey, min: 0, max: 5000 },
  { value: "nok-mid", labelKey: "shop.filter.price.midNb" as MessageKey, min: 5000, max: 15000 },
  { value: "nok-high", labelKey: "shop.filter.price.highNb" as MessageKey, min: 15000, max: Infinity },
] as const

function priceBucketsFor(locale: Locale) {
  return locale === "nb" ? PRICE_BUCKETS_NOK : PRICE_BUCKETS_EUR
}

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  )
}

/** Locale currency for a single amount field pair */
function pickAmount(
  locale: Locale,
  priceNok?: number | null,
  priceEur?: number | null,
  priceUsd?: number | null
) {
  if (locale === "nb") return priceNok ?? priceEur ?? priceUsd ?? null
  return priceEur ?? priceNok ?? priceUsd ?? null
}

/**
 * All buyable prices for a work (original + in-stock prints).
 * Needed so “Under 5 000 kr” matches Trykk, not only originals.
 */
function availablePrices(p: Project, locale: Locale): number[] {
  const prices: number[] = []
  const originalOk = p.status !== "Sold" && p.stock > 0 && p.forSale
  if (originalOk) {
    const amt = pickAmount(locale, p.priceNok, p.priceEur, p.priceUsd)
    if (amt != null) prices.push(amt)
  }
  if (p.printAvailable) {
    for (const pr of p.prints) {
      if (pr.stock < 1) continue
      const amt = pickAmount(locale, pr.priceNok, pr.priceEur)
      if (amt != null) prices.push(amt)
    }
  }
  return prices
}

function matchesFacet(
  p: Project,
  facet: Facet,
  value: string | null,
  locale: Locale
) {
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
    const prices = availablePrices(p, locale)
    if (!prices.length) return false
    const bucket = priceBucketsFor(locale).find((b) => b.value === value)
    if (!bucket) return false
    return prices.some(
      (amount) => amount >= bucket.min && amount < bucket.max
    )
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
  const { t, locale } = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const scrollAccRef = useRef(0)
  const lastScrollYRef = useRef(0)
  const pendingScrollAccRef = useRef(0)
  const pendingLastYRef = useRef(0)
  const filterBarRef = useRef<HTMLDivElement>(null)

  //url to read 
  const facet = (searchParams.get("facet") as Facet) ?? "all"
  const value = searchParams.get("value")

  function clearToAll() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("facet")
    params.delete("value")
    params.delete("prints")
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  // Drop stale price bucket when switching language (eur-* vs nok-*)
  useEffect(() => {
    if (facet !== "price" || !value) return
    const valid = priceBucketsFor(locale).some((b) => b.value === value)
    if (valid) return
    const params = new URLSearchParams(searchParams.toString())
    params.delete("value")
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [facet, value, locale, router, searchParams])

  useEffect(() => {
    if (!expanded) {
      scrollAccRef.current = 0
      return
    }

    lastScrollYRef.current = window.scrollY
    scrollAccRef.current = 0

    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastScrollYRef.current
      lastScrollYRef.current = y

      if (delta > 0) {
        scrollAccRef.current += delta
        if (scrollAccRef.current >= COLLAPSE_SCROLL_THRESHOLD) {
          setExpanded(false)
          scrollAccRef.current = 0
        }
      } else if (delta < 0) {
        scrollAccRef.current = Math.max(0, scrollAccRef.current + delta)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [expanded])

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
      return priceBucketsFor(locale).map((b) => ({
        value: b.value,
        label: t(b.labelKey),
      }))
    }
    return [] as string[] | { value: string; label: string }[]
  }, [facet, products, locale, t])

  /** Facet open but no second-level choice yet → dismiss back to All */
  const pendingSecondary =
    facet !== "all" && !value && valueOptions.length > 0

  useEffect(() => {
    if (!pendingSecondary) {
      pendingScrollAccRef.current = 0
      return
    }

    pendingLastYRef.current = window.scrollY
    pendingScrollAccRef.current = 0

    const onScroll = () => {
      const y = window.scrollY
      const delta = y - pendingLastYRef.current
      pendingLastYRef.current = y

      if (delta > 0) {
        pendingScrollAccRef.current += delta
        if (pendingScrollAccRef.current >= COLLAPSE_SCROLL_THRESHOLD) {
          clearToAll()
          pendingScrollAccRef.current = 0
        }
      } else if (delta < 0) {
        pendingScrollAccRef.current = Math.max(
          0,
          pendingScrollAccRef.current + delta
        )
      }
    }

    const onPointerDown = (e: MouseEvent) => {
      const root = filterBarRef.current
      if (!root) return
      if (root.contains(e.target as Node)) return
      clearToAll()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("mousedown", onPointerDown)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("mousedown", onPointerDown)
    }
    // clearToAll closes over latest searchParams via router
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSecondary, facet, searchParams, router])

  const visible = useMemo(
    () => products.filter((p) => matchesFacet(p, facet, value, locale)),
    [products, facet, value, locale]
  )

  function selectFacet(next: Facet) {
    const params = new URLSearchParams(searchParams.toString())
    if (next == "all") {
      params.delete("facet")
      params.delete("value")
      params.delete("prints")
    } else {
      params.set("facet", next)
      params.delete("value")
      params.delete("prints")
    }

    router.replace(`?${params.toString()}`, { scroll: false })
  }

  function selectValue(next: string | null) {
    // Deselecting the only second option → back to All
    if (!next) {
      clearToAll()
      return
    }
    const params = new URLSearchParams(searchParams.toString())
    params.set("value", next)
    // Price buckets include print prices — keep Prints visually active too
    if (facet === "price") {
      params.set("prints", "1")
    } else {
      params.delete("prints")
    }
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const priceIncludesPrints =
    facet === "price" && Boolean(value) && searchParams.get("prints") === "1"

  function isFacetActive(option: Facet) {
    if (option === "prints") return facet === "prints" || priceIncludesPrints
    return facet === option
  }

  return (
    <>
      <div className="mb-2 flex min-w-0 items-baseline justify-between gap-4">
        <h1 className="min-w-0 break-words text-[clamp(1.85rem,3.2vw,2.85rem)] tracking-tight">
          {t("shop.allTitle")}
        </h1>
        <span className="shrink-0 text-ink-soft">({visible.length})</span>
      </div>

      <div ref={filterBarRef} className="sticky top-[var(--header-height)] z-[150] mb-6">
        <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-white py-3">
          <div className="w-full px-6 md:px-12">
            <div className="flex w-fit max-w-full flex-nowrap items-center gap-x-3 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {PRIMARY.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`shrink-0 cursor-pointer whitespace-nowrap border-0 border-b bg-transparent p-0 py-1 font-inherit text-base ${
                    isFacetActive(option.value)
                      ? "border-ink text-ink"
                      : "border-transparent text-ink-soft hover:border-ink hover:text-ink"
                  }`}
                  onClick={() => selectFacet(option.value)}
                >
                  {t(option.labelKey)}
                </button>
              ))}

              <motion.div
                initial={false}
                animate={{
                  width: expanded ? "auto" : 0,
                  opacity: expanded ? 1 : 0,
                }}
                transition={{ duration: 0.42, ease: filterEase }}
                className={`flex shrink-0 flex-nowrap items-center gap-x-3 overflow-hidden whitespace-nowrap ${
                  expanded ? "" : "pointer-events-none"
                }`}
              >
                {EXTRA.map((option, i) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    tabIndex={expanded ? 0 : -1}
                    initial={false}
                    animate={
                      expanded
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: "0.55em" }
                    }
                    transition={{
                      duration: 0.45,
                      delay: expanded
                        ? 0.06 + i * 0.055
                        : (EXTRA.length - 1 - i) * 0.04,
                      ease: filterEase,
                    }}
                    className={`shrink-0 cursor-pointer whitespace-nowrap border-0 border-b bg-transparent p-0 py-1 font-inherit text-base ${
                      facet === option.value
                        ? "border-ink text-ink"
                        : "border-transparent text-ink-soft hover:border-ink hover:text-ink"
                    }`}
                    onClick={() => selectFacet(option.value)}
                  >
                    {t(option.labelKey)}
                  </motion.button>
                ))}
              </motion.div>

              <button
                type="button"
                className="inline-flex shrink-0 cursor-pointer items-center border-0 bg-transparent p-0 text-ink-soft transition-colors hover:text-ink"
                onClick={() => setExpanded((v) => !v)}
                aria-label={expanded ? "Hide filters" : "More filters"}
                aria-expanded={expanded}
              >
                {expanded ? <ChevronLeft /> : <ChevronRight />}
              </button>
            </div>

            {facet !== "all" && valueOptions.length > 0 ? (
              <div className="mt-3 flex w-full flex-nowrap items-center gap-x-3 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {facet === "price"
                  ? (valueOptions as { value: string; label: string }[]).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`shrink-0 cursor-pointer whitespace-nowrap border-0 border-b bg-transparent p-0 py-1 font-inherit text-[0.9375rem] ${
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
                        className={`shrink-0 cursor-pointer whitespace-nowrap border-0 border-b bg-transparent p-0 py-1 font-inherit text-[0.9375rem] ${
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
        </div>
      </div>

      <div className="mx-auto mb-10 flex min-h-full w-full max-w-[328px] flex-col gap-40 min-[600px]:max-w-[400px] min-[600px]:gap-80 lg:gap-64">
        {visible.map((product) => {
          const href =
            facet === "prints" || priceIncludesPrints
              ? `/shop/${product.id}?version=print${
                  facet === "prints" && value
                    ? `&size=${encodeURIComponent(value)}`
                    : ""
                }`
              : `/shop/${product.id}`
          return (
            <Link href={href} key={product.id} className="flex w-full min-w-0 flex-col gap-3.5">
              <NaturalAspectImage src={product.image} alt={`${product.title} — Emilie W. Lien`} />
              <div className="flex min-w-0 items-baseline justify-between gap-5 pt-1">
                <h2 className="min-w-0 truncate text-[1.125rem] font-medium">{product.title}</h2>
                <span className="shrink-0 text-sm text-ink-soft">
                  {facet === "prints" || priceIncludesPrints
                    ? (facet === "prints" && value) || t("shop.filter.prints")
                    : product.size}
                </span>
              </div>
              {(() => {
                const label = offerLabel(product, t)
                if (!label) return null
                const parts = label.split("·").map((p) => p.trim()).filter(Boolean)
                if (parts.length === 2) {
                  return (
                    <p className="flex items-center gap-2 text-sm text-ink-soft">
                      <span>{parts[0]}</span>
                      <span aria-hidden>·</span>
                      <span>{parts[1]}</span>
                    </p>
                  )
                }
                return <p className="text-sm text-ink-soft">{label}</p>
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
