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
import {
  formatMoney,
  t as translate,
  type Locale,
  type MessageKey,
} from "@/lib/i18n"

const STORAGE_KEY = "emilie-locale"

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey) => string
  money: (prices: { priceNok?: number | null; priceEur?: number | null }) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("nb")

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "en" || saved === "nb") setLocaleState(saved)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => translate(locale, key),
      money: (prices) => formatMoney(locale, prices),
    }),
    [locale, setLocale]
  )

  return (
    <LocaleContext.Provider value={value}>
      <div lang={locale === "nb" ? "nb" : "en"}>{children}</div>
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}
