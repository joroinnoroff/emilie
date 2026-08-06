import Link from "next/link"
import type { Project } from "@/lib/projects"
import Money from "@/components/Money"

type ShopProps = {
  items: Project[]
}

export default function Shop({ items }: ShopProps) {
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
          {items.map((p) => (
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
                <div className="status">
                  {p.status}
                  {p.printAvailable ? " · Prints available" : ""}
                </div>
                <Link href={`/shop/${p.id}`} className="btn">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
