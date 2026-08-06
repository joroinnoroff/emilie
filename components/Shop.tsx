"use client"

import Link from "next/link"
import type { Project } from "@/lib/projects"
import Money from "@/components/Money"
import { useLocale } from "@/lib/LocaleProvider"

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
    <section className="shop" id="shop">
      <div className="wrap">
        <div className="section-head">
          <h2>Originals for Sale</h2>

          <Link href="/shop" className="btn">
            All Art →
          </Link>
        </div>
        <div className="shop-grid">
          {items.map((p) => {
            const label = offerLabel(p, t)
            return (
              <div className="shop-card" key={p.id}>
                <div className="shop-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.title} />
                </div>
                <div className="shop-info">
                  <div className="name">{p.title}</div>
                  <div className="price">
                    <Money priceNok={p.priceNok} priceEur={p.priceEur} />
                  </div>
                  {label ? <div className="status">{label}</div> : null}
                  <Link href={`/shop/${p.id}`} className="btn">
                    View
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
