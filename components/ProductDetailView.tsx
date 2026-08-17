"use client"

import Link from "next/link"
import { Suspense, useRef } from "react"
import type { Project } from "@/lib/projects"
import DescriptionCollapse from "@/components/DescriptionCollapse"
import FullscreenImage from "@/components/FullscreenImage"
import ProductPurchase from "@/components/ProductPurchase"
import { useLocale } from "@/lib/LocaleProvider"
import { tCount } from "@/lib/i18n"
import { Wrap } from "./ui"

type ProductDetailViewProps = {
  product: Project
  prev: Project
  next: Project
}

export default function ProductDetailView({
  product,
  prev,
  next,
}: ProductDetailViewProps) {
  const { locale, t } = useLocale()
  const cartAnchorRef = useRef<HTMLDivElement>(null)
  const printSizes = product.prints.filter((p) => p.stock > 0).length
  const originalSold =
    product.status === "Sold" || product.stock < 1 || !product.forSale
  const printsInStock =
    product.printAvailable && product.prints.some((p) => p.stock > 0)

  const revealCart = () => {
    if (typeof window === "undefined") return
    const target = cartAnchorRef.current
    if (!target) return
    const top =
      target.getBoundingClientRect().top +
      window.scrollY -
      window.innerHeight * 0.42
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" })
  }

  return (
    <>
      <section className="pt-[132px]">
        <Wrap className="mb-4">
          <Link
            href="/shop"
            aria-label={t("shop.back")}
            className="inline-flex items-center text-ink transition-opacity hover:opacity-50"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 5L8 12l7 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </Wrap>

        <Wrap className="grid grid-cols-1 items-start gap-[60px] min-[861px]:grid-cols-[0.95fr_1fr] max-[860px]:gap-8">
          <div className="relative z-30 min-[861px]:sticky min-[861px]:top-[110px]">
            <FullscreenImage src={product.image} alt={`${product.title} — Emilie W. Lien`} />
            <div className="mt-3 text-sm text-ink-soft min-[861px]:hidden">
              {product.medium} — {product.year}
            </div>
            {product.gallery.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {product.gallery.map((src, i) => (
                  <FullscreenImage
                    key={src + i}
                    src={src}
                    alt={`${product.title} — Emilie W. Lien (${i + 2})`}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <div className="mb-2 hidden text-sm text-ink-soft min-[861px]:block">
              {product.medium} — {product.year}
            </div>
            <h1 className="mb-4 text-[clamp(1.85rem,3.2vw,2.85rem)] tracking-tight">
              {product.title}
            </h1>
            <DescriptionCollapse text={product.description} />
            <div className="mb-5 flex flex-col gap-3 border-t border-line pt-5 text-sm">
              <div className="flex max-w-[340px] justify-between gap-4">
                <span className="text-ink-soft">{t("shop.medium")}</span>
                <span>{product.medium}</span>
              </div>
              <div className="flex max-w-[340px] justify-between gap-4">
                <span className="text-ink-soft">{t("shop.originalSize")}</span>
                <span>{product.size || "—"}</span>
              </div>
              <div className="flex max-w-[340px] justify-between gap-4">
                <span className="text-ink-soft">{t("shop.original")}</span>
                <div className="flex items-center gap-2">
                  <span>
                    {originalSold ? t("shop.sold") : t("shop.available")}
                  </span>
                  <span
                    className={
                      originalSold
                        ? "h-4 w-4 rounded-full bg-red-500"
                        : "h-4 w-4 rounded-full bg-green-500"
                    }
                  />
                </div>
              </div>
              {product.printAvailable ? (
                <div className="flex max-w-[340px] justify-between gap-4">
                  <span className="text-ink-soft">{t("shop.print")}</span>
                  <div className="flex items-center gap-2">
                    <span>
                      {printsInStock
                        ? printSizes
                          ? tCount(
                              locale,
                              "shop.printsInSizes",
                              "shop.printsInSizesPlural",
                              printSizes
                            )
                          : t("shop.available")
                        : t("shop.printsUnavailable")}
                    </span>
                    <span
                      className={
                        printsInStock
                          ? "h-4 w-4 rounded-full bg-green-500"
                          : "h-4 w-4 rounded-full bg-red-500"
                      }
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div
              ref={cartAnchorRef}
              className="mt-5 mb-16 border-t border-line pt-5"
            >
              <Suspense fallback={<p className="text-sm text-ink-soft">…</p>}>
                <ProductPurchase product={product} onSelectOption={revealCart} />
              </Suspense>
            </div>
          </div>
        </Wrap>
      </section>

      <Wrap>
        <div className="mt-8 mb-20 flex justify-between gap-8 border-t border-line pt-8">
          <Link href={`/shop/${prev.id}`} className="group max-w-[45%]">
            <span className="mb-1.5 block text-sm text-ink-soft transition-colors duration-300 ease-out group-hover:text-[#2a2a2a]">
              {t("projects.prev")}
            </span>
            <span className="text-ink-soft transition-colors duration-300 ease-out group-hover:text-[#2a2a2a]">
              {prev.title}
            </span>
          </Link>
          <Link href={`/shop/${next.id}`} className="group max-w-[45%] text-right">
            <span className="mb-1.5 block text-sm text-ink-soft transition-colors duration-300 ease-out group-hover:text-[#2a2a2a]">
              {t("projects.next")}
            </span>
            <span className="text-ink-soft transition-colors duration-300 ease-out group-hover:text-[#2a2a2a]">
              {next.title}
            </span>
          </Link>
        </div>
      </Wrap>
    </>
  )
}
