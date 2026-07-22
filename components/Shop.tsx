import Link from "next/link";
import { getForSale } from "@/lib/projects";

export default function Shop() {
  const items = getForSale().slice(0, 4);

  return (
    <section className="shop" id="shop">
      <div className="wrap">
        <div className="section-head">
          <h2>Originals for Sale</h2>
        </div>
        <div className="shop-grid">
          {items.map((p) => (
            <div className="shop-card" key={p.id}>
              <div className="shop-thumb">
                <img src={p.image} alt={p.title} />
              </div>
              <div className="shop-info">
                <div className="name">{p.title}</div>
                <div className="price">{p.price}</div>
                <div className="status">Original · {p.status}</div>
                <Link href={`/shop/${p.id}`} className="btn">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
