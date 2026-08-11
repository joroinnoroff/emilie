"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import type { SiteSettings } from "@/lib/sanity-content"
import { localized } from "@/lib/sanity-content"
import { useLocale } from "@/lib/LocaleProvider"
import { Wrap, btnClass, fieldClass } from "./ui"

type ContactProps = {
  settings: SiteSettings
}

const REASONS = [
  { value: "general", en: "General inquiry", nb: "Generell henvendelse" },
  { value: "commission", en: "Commission", nb: "Kommisjon" },
  { value: "purchase", en: "Purchase", nb: "Kjøp" },
  { value: "exhibition", en: "Exhibition / collaboration", nb: "Utstilling / samarbeid" },
  { value: "other", en: "Other", nb: "Annet" },
] as const

type ReasonValue = (typeof REASONS)[number]["value"]

function isReason(value: string | null): value is ReasonValue {
  return REASONS.some((r) => r.value === value)
}

export default function Contact({ settings }: ContactProps) {
  const { locale } = useLocale()
  const searchParams = useSearchParams()
  const email = settings.email || "post@emilie.no"
  const instagram = settings.instagram || "#"
  const intro = localized(locale, settings.contactIntro, settings.contactIntroNb)
  const [reason, setReason] = useState<ReasonValue>("general")

  useEffect(() => {
    const fromQuery = searchParams.get("reason")
    if (isReason(fromQuery)) setReason(fromQuery)
  }, [searchParams])

  return (
    <section
      className="flex min-h-screen items-center border-t border-line py-[120px] max-[860px]:min-h-0 max-[860px]:py-[90px]"
      id="contact"
    >
      <Wrap className="grid w-full grid-cols-1 items-start gap-20 md:grid-cols-2 max-[860px]:gap-9">
        <div>
          <h2 className="mb-[22px] text-[clamp(2.25rem,4.2vw,3.5rem)] tracking-tight">
            {locale === "nb" ? "Ta kontakt" : "Get in touch"}
          </h2>
          <p className="mb-8 max-w-[400px] text-[1.0625rem] text-ink-soft">{intro}</p>
          <div>
            <a
              href={`mailto:${email}`}
              className="mb-3.5 block max-w-[340px] border-b border-line pb-3 text-lg transition-opacity hover:opacity-50"
            >
              {email}
            </a>
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              className="mb-3.5 block max-w-[340px] border-b border-line pb-3 text-lg transition-opacity hover:opacity-50"
            >
              Instagram →
            </a>
          </div>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            name="name"
            placeholder={locale === "nb" ? "Navn" : "Name"}
            className={fieldClass}
          />
          <input
            type="email"
            name="email"
            placeholder={locale === "nb" ? "E-post" : "Email"}
            className={fieldClass}
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-ink-soft">
              {locale === "nb" ? "Årsak" : "Reason"}
            </span>
            <select
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as ReasonValue)}
              className={`${fieldClass} cursor-pointer appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23757575' d='M1.2.8L6 5.6 10.8.8 12 2 6 8 0 2z'/%3E%3C/svg%3E")] bg-position-[right_0_center] bg-no-repeat pr-5`}
            >
              {REASONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {locale === "nb" ? option.nb : option.en}
                </option>
              ))}
            </select>
          </label>
          <textarea
            name="message"
            rows={4}
            placeholder={locale === "nb" ? "Melding" : "Message"}
            className={fieldClass}
          />
          <button type="submit" className={`${btnClass} mt-2 self-start`}>
            {locale === "nb" ? "Send melding" : "Send message"}
          </button>
        </form>
      </Wrap>
    </section>
  )
}
