"use client"

import Link from "next/link"
import { Suspense, useEffect, useRef, useState } from "react"
import type { Project } from "@/lib/projects"
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

const DESKTOP_MQ = "(min-width: 861px)"

export default function ProductDetailView({
  product,
  prev,
  next,
}: ProductDetailViewProps) {
  const { locale, t } = useLocale()
  const cartAnchorRef = useRef<HTMLDivElement>(null)
  const stickyScopeRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const [imageScale, setImageScale] = useState(1)
  const [isDesktop, setIsDesktop] = useState(false)
  const printSizes = product.prints.filter((p) => p.stock > 0).length
  const statusLabel =
    product.status === "Sold" ? t("shop.sold") : t("shop.available")

  useEffect(() => {
    let raf = 0
    const mq = window.matchMedia(DESKTOP_MQ)

    const update = () => {
      raf = 0
      const desktop = mq.matches
      setIsDesktop(desktop)

      if (desktop) {
        const progress = Math.min(window.scrollY / 480, 1)
        setImageScale(1 - progress * 0.74)
        return
      }

      // Mobile / tablet: only shrink a little while sticky scope is active,
      // and stop once medium — year reaches under the header.
      const meta = metaRef.current
      const scope = stickyScopeRef.current
      if (!meta || !scope) {
        setImageScale(1)
        return
      }

      const headerOffset = 96
      const metaTop = meta.getBoundingClientRect().top
      const scopeTop = scope.getBoundingClientRect().top
      const travel = Math.max(1, metaTop - scopeTop - headerOffset)
      const scrolled = Math.min(
        1,
        Math.max(0, (headerOffset - scopeTop) / travel)
      )
      // Mild shrink only (1 → ~0.72), freeze when meta hits the header
      const capped = metaTop <= headerOffset ? 0.72 : 1 - scrolled * 0.28
      setImageScale(Math.max(0.72, capped))
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    update()
    mq.addEventListener("change", update)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      mq.removeEventListener("change", update)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

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

  const metaLine = (
    <div ref={metaRef} className="mb-2 text-sm text-ink-soft">
      {product.medium} — {product.year}
    </div>
  )

  return (
    <>
      <section className="pt-[130px]">
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
          {/* Mobile: sticky only until medium — year; desktop: full sticky column */}
          <div
            ref={stickyScopeRef}
            className={
              isDesktop
                ? "sticky top-[110px] z-30 flex min-h-[calc(100vh-140px)] items-start justify-start overflow-visible"
                : "relative z-30"
            }
          >
            <div
              className={
                isDesktop
                  ? "contents"
                  : "sticky top-24 mb-3 overflow-visible"
              }
            >
              <FullscreenImage
                src={product.image}
                alt={product.title}
                scale={imageScale}
                origin={isDesktop ? "top right" : "bottom right"}
              />
            </div>
            {/* Stop marker for mobile sticky — releases before title/description */}
            <div className="min-[861px]:hidden">
              {metaLine}
              <div className="h-[12vh]" aria-hidden="true" />
            </div>
          </div>

          <div>
            <div className="mb-2 hidden text-sm text-ink-soft min-[861px]:block">
              {product.medium} — {product.year}
            </div>
            <h1 className="mb-4 text-[clamp(2rem,4vw,3rem)] tracking-tight">
              {product.title}
            </h1>
            <p className="mb-8 max-w-[440px] text-[1.0625rem] text-ink-soft">
              {product.description}
            </p>
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
                <span className="text-ink-soft">{t("shop.status")}</span>
                <span>{statusLabel}</span>
              </div>
              {product.printAvailable ? (
                <div className="flex max-w-[340px] justify-between gap-4">
                  <span className="text-ink-soft">{t("shop.prints")}</span>
                  <span>
                    {printSizes
                      ? tCount(
                          locale,
                          "shop.printsInSizes",
                          "shop.printsInSizesPlural",
                          printSizes
                        )
                      : t("shop.printsUnavailable")}
                  </span>
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
          <Link href={`/shop/${prev.id}`} className="max-w-[45%]">
            <span className="mb-1.5 block text-sm text-ink-soft">
              {t("projects.prev")}
            </span>
            <span className="text-ink-soft transition-colors hover:text-ink">
              {prev.title}
            </span>
          </Link>
          <Link href={`/shop/${next.id}`} className="max-w-[45%] text-right">
            <span className="mb-1.5 block text-sm text-ink-soft">
              {t("projects.next")}
            </span>
            <span className="text-ink-soft transition-colors hover:text-ink">
              {next.title}
            </span>
          </Link>
        </div>
      </Wrap>
    </>
  )
}
