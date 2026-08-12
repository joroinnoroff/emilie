"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useLocale } from "@/lib/LocaleProvider"

const ease = [0.22, 0.9, 0.32, 1] as const

export default function DescriptionCollapse({
  text,
}: {
  text?: string | null
}) {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)
  const body = text?.trim()
  if (!body) return null

  return (
    <div className="mb-8 max-w-[440px] border-t border-line pt-4">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent p-0 font-inherit text-[0.9375rem] text-ink"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{t("shop.description")}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,0.9,0.32,1)] ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <path
            d="M3 5l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="description"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-[1.0625rem] text-ink-soft">{body}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
