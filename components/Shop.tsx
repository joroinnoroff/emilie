"use client"

import Link from "next/link"
import type { Project } from "@/lib/projects"
import { useLocale } from "@/lib/LocaleProvider"
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
    <section className="border-t border-line pt-[140px] pb-[90px] md:pt-[160px]" id="shop">
      <Wrap>
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="text-[clamp(2.25rem,4.2vw,3.5rem)] tracking-tight">
            {t("shop.heading")}
          </h2>

          <Link href="/shop" className={textLinkClass}>
            {t("shop.all")}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 max-[860px]:grid-cols-2">
          {items.map((p) => {
            const label = offerLabel(p, t)
            return (
              <div key={p.id}>
                <div className="aspect-[4/5] overflow-hidden bg-[#eee]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="pt-4">
                  <div className="text-xl tracking-tight">{p.title}</div>
                  {label ? (
                    <div className="mt-1.5 text-sm text-ink-soft">{label}</div>
                  ) : null}
                  <Link
                    href={`/shop/${p.id}`}
                    className="mt-3.5 inline-flex border-0 border-b border-ink bg-transparent p-0 pb-0.5 text-ink transition-opacity hover:opacity-50"
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
