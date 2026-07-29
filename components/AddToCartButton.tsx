"use client"

import { useState } from "react"
import type { Project } from "@/lib/projects"
import { useCart } from "./CartProvider"

type AddToCartButtonProps = {
  product: Project
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, openCart, getQty } = useCart()
  const [message, setMessage] = useState<string | null>(null)

  const sold = product.status === "Sold" || product.stock < 1 || !product.forSale
  const inCart = getQty(product.id) > 0
  const uniqueInCart = product.stock <= 1 && inCart

  if (sold) {
    return (
      <button type="button" className="btn disabled" disabled>
        Sold
      </button>
    )
  }

  if (uniqueInCart) {
    return (
      <button
        type="button"
        className="btn"
        onClick={() => openCart()}
      >
        In cart
      </button>
    )
  }

  return (
    <div className="add-to-cart mb-32">
      <button
        type="button"
        className="btn "
        onClick={() => {
          const result = addItem(product)
          if (!result.ok) {
            setMessage(
              result.reason === "sold"
                ? "This work is no longer available."
                : "Already in your cart."
            )
            return
          }
          setMessage(null)
          openCart()
        }}
      >
        Add to Cart
      </button>
      {message ? <p className="cart-note">{message}</p> : null}
    </div>
  )
}
