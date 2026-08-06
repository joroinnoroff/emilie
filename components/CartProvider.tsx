"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Project } from "@/lib/projects"

export type CartVariant = "original" | "print"

export type CartLine = {
  /** Unique line key: productId:original or productId:print:size */
  id: string
  productId: string
  variant: CartVariant
  printSize?: string
  qty: number
  /** Snapshot prices at add-time */
  priceNok?: number
  priceEur?: number
  title: string
  image: string
  maxStock: number
}

type AddCartItemInput = {
  product: Project
  variant: CartVariant
  printSize?: string
}

type CartContextValue = {
  lines: CartLine[]
  open: boolean
  hydrated: boolean
  count: number
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (input: AddCartItemInput) => { ok: boolean; reason?: string }
  setQty: (id: string, qty: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getQty: (id: string) => number
}

const STORAGE_KEY = "emilie-cart-v2"
const CartContext = createContext<CartContextValue | null>(null)

export function cartLineId(productId: string, variant: CartVariant, printSize?: string) {
  if (variant === "print") return `${productId}:print:${printSize || ""}`
  return `${productId}:original`
}

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartLine[]
    return Array.isArray(parsed) ? parsed.filter((l) => l.id && l.qty > 0) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [open, setOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setLines(readStorage())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines, hydrated])

  const openCart = useCallback(() => setOpen(true), [])
  const closeCart = useCallback(() => setOpen(false), [])
  const toggleCart = useCallback(() => setOpen((v) => !v), [])

  const getQty = useCallback(
    (id: string) => lines.find((l) => l.id === id)?.qty ?? 0,
    [lines]
  )

  const addItem = useCallback((input: AddCartItemInput) => {
    const { product, variant, printSize } = input
    const print =
      variant === "print"
        ? product.prints.find((p) => p.size === printSize)
        : undefined

    if (variant === "original") {
      if (product.status === "Sold" || product.stock < 1 || !product.forSale) {
        return { ok: false, reason: "sold" as const }
      }
    } else {
      if (!product.printAvailable || !print || print.stock < 1) {
        return { ok: false, reason: "sold" as const }
      }
    }

    const id = cartLineId(product.id, variant, printSize)
    const maxStock = variant === "original" ? product.stock : print!.stock
    const priceNok = variant === "original" ? product.priceNok : print?.priceNok
    const priceEur = variant === "original" ? product.priceEur : print?.priceEur

    let result: { ok: boolean; reason?: string } = { ok: true }

    setLines((prev) => {
      const existing = prev.find((l) => l.id === id)
      if (existing) {
        if (maxStock <= 1) {
          result = { ok: false, reason: "unique" }
          return prev
        }
        if (existing.qty >= maxStock) {
          result = { ok: false, reason: "max" }
          return prev
        }
        return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
      }

      return [
        ...prev,
        {
          id,
          productId: product.id,
          variant,
          printSize,
          qty: 1,
          priceNok,
          priceEur,
          title: product.title,
          image: product.image,
          maxStock,
        },
      ]
    })

    return result
  }, [])

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) => {
      const line = prev.find((l) => l.id === id)
      if (!line) return prev
      if (qty < 1) return prev.filter((l) => l.id !== id)
      return prev.map((l) =>
        l.id === id ? { ...l, qty: Math.min(qty, Math.max(1, l.maxStock)) } : l
      )
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const clearCart = useCallback(() => setLines([]), [])

  const count = useMemo(
    () => lines.reduce((sum, l) => sum + l.qty, 0),
    [lines]
  )

  const value = useMemo(
    () => ({
      lines,
      open,
      hydrated,
      count,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      setQty,
      removeItem,
      clearCart,
      getQty,
    }),
    [
      lines,
      open,
      hydrated,
      count,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      setQty,
      removeItem,
      clearCart,
      getQty,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
