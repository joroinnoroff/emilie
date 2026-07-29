"use client"

import Link from "next/link"
import { useCart } from "./CartProvider"
import type { Project } from "@/lib/projects"

type CartDrawerProps = {
  products: Project[]
}

export default function CartDrawer({ products }: CartDrawerProps) {
  const { open, lines, closeCart, setQty, removeItem, getQty } = useCart()

  const detailed = lines
    .map((line) => {
      const product = products.find((p) => p.id === line.id)
      if (!product) return null
      return { line, product }
    })
    .filter(Boolean) as { line: { id: string; qty: number }; product: Project }[]

  return (
    <>
      <div
        className={`cart-overlay${open ? " open" : ""}`}
        onClick={closeCart}
        aria-hidden={!open}
      />

      <aside className={`cart-drawer${open ? " open" : ""}`} aria-hidden={!open}>
        <div className="cart-drawer-head">
          <h2>Cart</h2>
          <button type="button" className="cart-close" onClick={closeCart} aria-label="Close cart">
            ×
          </button>
        </div>

        {detailed.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <ul className="cart-lines">
            {detailed.map(({ line, product }) => {
              const unique = product.stock <= 1
              return (
                <li key={product.id} className="cart-line">
                  <div className="cart-line-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt={product.title} />
                  </div>
                  <div className="cart-line-meta">
                    <div className="cart-line-title">{product.title}</div>
                    <div className="cart-line-price">{product.price}</div>
                    {unique ? (
                      <div className="cart-line-actions">
                        <span className="cart-unique">Unique original</span>
                        <button type="button" onClick={() => removeItem(product.id)}>
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="cart-line-actions">
                        <button
                          type="button"
                          disabled={getQty(product.id) <= 1}
                          onClick={() => setQty(product.id, line.qty - 1, product.stock)}
                        >
                          −
                        </button>
                        <span>{line.qty}</span>
                        <button
                          type="button"
                          disabled={line.qty >= product.stock}
                          onClick={() => setQty(product.id, line.qty + 1, product.stock)}
                        >
                          +
                        </button>
                        <button type="button" onClick={() => removeItem(product.id)}>
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <div className="cart-drawer-foot">
          <Link
            href="/checkout"
            className={`btn${detailed.length === 0 ? " disabled" : ""}`}
            onClick={(e) => {
              if (detailed.length === 0) e.preventDefault()
              else closeCart()
            }}
          >
            Checkout
          </Link>
        </div>
      </aside>
    </>
  )
}
