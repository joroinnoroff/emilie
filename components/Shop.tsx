"use client"

import Link from "next/link"
import type { Project } from "@/lib/projects"
import { useLocale } from "@/lib/LocaleProvider"
import NaturalAspectImage from "./NaturalAspectImage"
import { Wrap, textLinkClass } from "./ui"

type ShopProps = {
  items: Project[]
}

function offerLabel(
  p: Project,
  t: (key: "shop.offerBoth" | "shop.offerOriginal" | "shop.printsAvailable") => string
) {
  const originalOk = p.status !== "Sold" && p.stock > 0
  const printsOk =
    p.printAvailable && p.prints.some((pr) => pr.stock > 0)

  if (originalOk && printsOk) return t("shop.offerBoth")
  if (originalOk) return t("shop.offerOriginal")
  if (printsOk) return t("shop.printsAvailable")
  return ""
}

export default function Shop({ items }: ShopProps) {
  const { t } = useLocale()

  return (
    <section className="border-t border-line pt-[220px] pb-[90px]" id="shop">
      <Wrap>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <h2 className="min-w-0 max-w-full flex-1 basis-[12rem] text-[clamp(1.85rem,3.2vw,2.85rem)] tracking-tight">
            {t("shop.heading")}
          </h2>

          <Link href="/shop" className={`${textLinkClass} shrink-0 whitespace-nowrap`}>
            {t("shop.all")}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-24 md:grid-cols-4 md:gap-x-16 md:gap-y-28">
          {items.map((p) => {
            const label = offerLabel(p, t)
            return (
              <div key={p.id} className="flex min-w-0 flex-col gap-4">
                <NaturalAspectImage src={p.image} alt={p.title} />
                <div className="flex flex-col gap-2 pt-1">
                  <div className="text-lg tracking-tight md:text-xl">{p.title}</div>
                  {label ? (
                    (() => {
                      const parts = label.split("·").map((p) => p.trim()).filter(Boolean)
                      if (parts.length === 2) {
                        return (
                          <div className="flex items-center gap-2 text-sm text-ink-soft">
                            <span>{parts[0]}</span>
                            <span aria-hidden>·</span>
                            <span>{parts[1]}</span>
                          </div>
                        )
                      }
                      return (
                        <div className="text-sm text-ink-soft">{label}</div>
                      )
                    })()
                  ) : null}
                  <Link
                    href={`/shop/${p.id}`}
                    className="mt-1 inline-flex border-0 border-b border-ink bg-transparent p-0 pb-0.5 text-ink transition-opacity hover:opacity-50"
                  >
                    {t("shop.view")}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </Wrap>
    </section>
  )
}
