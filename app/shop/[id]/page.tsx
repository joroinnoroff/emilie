import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getForSale, getProject } from "@/lib/projects";

export function generateStaticParams() {
  return getForSale().map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProject(id);
  return { title: product ? `${product.title} — Shop — Emilie` : "Shop — Emilie" };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProject(id);
  if (!product || !product.forSale) return notFound();

  return (
    <section className="detail-hero">
      <div className="wrap">
        <div className="detail-img">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="detail-meta">
          <div className="detail-eyebrow">Original Painting — {product.year}</div>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <div className="detail-specs">
            <div>
              <span>Medium</span>
              <span>{product.medium}</span>
            </div>
            <div>
              <span>Size</span>
              <span>{product.size}</span>
            </div>
            <div>
              <span>Status</span>
              <span>{product.status}</span>
            </div>
          </div>

          <div className="cart-block">
            <div className="cart-price">{product.price}</div>
            <button className="btn disabled" disabled>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
