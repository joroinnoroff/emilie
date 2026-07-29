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

export type CartLine = {
  id: string
  qty: number
}

type CartContextValue = {
  lines: CartLine[]
  open: boolean
  hydrated: boolean
  count: number
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (product: Project) => { ok: boolean; reason?: string }
  setQty: (id: string, qty: number, maxStock: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getQty: (id: string) => number
}

const STORAGE_KEY = "emilie-cart-v1"
const CartContext = createContext<CartContextValue | null>(null)

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

  const addItem = useCallback((product: Project) => {
    if (product.status === "Sold" || product.stock < 1 || !product.forSale) {
      return { ok: false, reason: "sold" as const }
    }

    let result: { ok: boolean; reason?: string } = { ok: true }

    setLines((prev) => {
      const existing = prev.find((l) => l.id === product.id)
      if (existing) {
        if (product.stock <= 1) {
          result = { ok: false, reason: "unique" }
          return prev
        }
        if (existing.qty >= product.stock) {
          result = { ok: false, reason: "max" }
          return prev
        }
        return prev.map((l) =>
          l.id === product.id ? { ...l, qty: l.qty + 1 } : l
        )
      }
      return [...prev, { id: product.id, qty: 1 }]
    })

    return result
  }, [])

  const setQty = useCallback((id: string, qty: number, maxStock: number) => {
    setLines((prev) => {
      if (qty < 1) return prev.filter((l) => l.id !== id)
      const nextQty = Math.min(qty, Math.max(1, maxStock))
      return prev.map((l) => (l.id === id ? { ...l, qty: nextQty } : l))
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
