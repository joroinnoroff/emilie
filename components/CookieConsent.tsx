"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { acceptCookieConsent, hasCookieConsent } from "@/lib/cookie-consent"
import { useLocale } from "@/lib/LocaleProvider"
import { Wrap } from "./ui"

function CookieMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3a9 9 0 1 0 9 9c0-.4-.03-.8-.1-1.18a3.5 3.5 0 0 1-4.22-4.22A9.1 9.1 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="13.5" cy="14" r="1" fill="currentColor" />
      <circle cx="9.5" cy="15.5" r="0.85" fill="currentColor" />
      <circle cx="14.5" cy="9.5" r="0.85" fill="currentColor" />
    </svg>
  )
}

export default function CookieConsent() {
  const { t } = useLocale()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!hasCookieConsent()) setVisible(true)
  }, [])

  const accept = () => {
    acceptCookieConsent()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[900] p-4 md:p-6"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-body"
    >
      <Wrap className="max-w-[520px] border border-line bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] md:ml-0 md:p-6">
        <div className="mb-3 flex items-center gap-2.5 text-ink">
          <CookieMark />
          <h2
            id="cookie-consent-title"
            className="text-base font-medium tracking-tight"
          >
            {t("cookies.title")}
          </h2>
        </div>
        <p
          id="cookie-consent-body"
          className="mb-2 text-sm leading-relaxed text-ink-soft"
        >
          {t("cookies.body")}
        </p>
        <p className="mb-5 text-xs leading-relaxed text-ink-soft">
          {t("cookies.necessaryNote")}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            type="button"
            onClick={accept}
            className="cursor-pointer border border-ink bg-ink px-5 py-2.5 font-inherit text-sm text-white transition-opacity duration-300 hover:opacity-80"
          >
            {t("cookies.accept")}
          </button>
          <Link
            href="/privacy"
            className="border-0 border-b border-ink-soft bg-transparent pb-px text-sm text-ink-soft transition-colors duration-300 hover:border-ink hover:text-ink"
          >
            {t("cookies.readMore")}
          </Link>
        </div>
      </Wrap>
    </div>
  )
}
