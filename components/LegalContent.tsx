"use client"

import { useEffect, useState } from "react"
import { useLocale } from "@/lib/LocaleProvider"
import { cn, Wrap } from "./ui"

const SECTIONS = [
  { id: "privacy", labelKey: "legal.tocPrivacy" as const },
  { id: "cookies", labelKey: "legal.tocCookies" as const },
  { id: "data", labelKey: "legal.tocData" as const },
  { id: "rights", labelKey: "legal.tocRights" as const },
  { id: "terms", labelKey: "legal.tocTerms" as const },
  { id: "orders", labelKey: "legal.tocOrders" as const },
  { id: "art", labelKey: "legal.tocArt" as const },
  { id: "payment", labelKey: "legal.tocPayment" as const },
] as const

export default function LegalContent({ email }: { email: string }) {
  const { t } = useLocale()
  const [active, setActive] = useState<string>(SECTIONS[0].id)

  useEffect(() => {
    const nodes = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    )
    if (!nodes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) setActive(visible[0].target.id)
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.1, 0.35, 0.6],
      }
    )

    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (!hash) return
    const el = document.getElementById(hash)
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      setActive(hash)
    })
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "start" })
    setActive(id)
  }

  return (
    <section className="min-h-screen bg-white pt-[130px] pb-[100px]">
      <Wrap>
        <h1 className="mb-10 text-[clamp(1.85rem,3.2vw,2.85rem)] tracking-tight text-ink">
          {t("legal.title")}
        </h1>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
          <nav
            aria-label={t("legal.toc")}
            className="lg:sticky lg:top-[calc(var(--header-height)+1.25rem)]"
          >
            <p className="mb-3 text-xs tracking-wide text-ink-soft uppercase">
              {t("legal.toc")}
            </p>
            <ul className="flex list-none flex-col gap-1.5">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(s.id)}
                    className={cn(
                      "w-full cursor-pointer border-0 bg-transparent px-0 py-1 text-left font-inherit text-sm transition-colors duration-300",
                      active === s.id
                        ? "text-ink"
                        : "text-ink-soft hover:text-ink"
                    )}
                  >
                    {t(s.labelKey)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <div className="mx-auto flex max-w-[560px] flex-col gap-12 text-[1.0625rem] leading-relaxed text-ink-soft">
              <section id="privacy" className="scroll-mt-28">
                <h2 className="mb-3 text-lg tracking-tight text-ink">
                  {t("privacy.title")}
                </h2>
                <p>{t("privacy.intro")}</p>
              </section>

              <section id="cookies" className="scroll-mt-28">
                <h2 className="mb-3 text-lg tracking-tight text-ink">
                  {t("privacy.necessaryTitle")}
                </h2>
                <p>{t("privacy.necessaryBody")}</p>
              </section>

              <section id="data" className="scroll-mt-28">
                <h2 className="mb-3 text-lg tracking-tight text-ink">
                  {t("privacy.dataTitle")}
                </h2>
                <p>{t("privacy.dataBody")}</p>
              </section>

              <section id="rights" className="scroll-mt-28">
                <h2 className="mb-3 text-lg tracking-tight text-ink">
                  {t("privacy.rightsTitle")}
                </h2>
                <p>{t("privacy.rightsBody")}</p>
              </section>

              <section id="terms" className="scroll-mt-28">
                <h2 className="mb-3 text-lg tracking-tight text-ink">
                  {t("terms.title")}
                </h2>
                <p>{t("terms.intro")}</p>
              </section>

              <section id="orders" className="scroll-mt-28">
                <h2 className="mb-3 text-lg tracking-tight text-ink">
                  {t("terms.ordersTitle")}
                </h2>
                <p>{t("terms.ordersBody")}</p>
              </section>

              <section id="art" className="scroll-mt-28">
                <h2 className="mb-3 text-lg tracking-tight text-ink">
                  {t("terms.artTitle")}
                </h2>
                <p>{t("terms.artBody")}</p>
              </section>

              <section id="payment" className="scroll-mt-28">
                <h2 className="mb-3 text-lg tracking-tight text-ink">
                  {t("terms.paymentTitle")}
                </h2>
                <p className="mb-6">{t("terms.paymentBody")}</p>
                <p>
                  {t("privacy.contact")}{" "}
                  <a
                    href={`mailto:${email}`}
                    className="text-ink underline decoration-line underline-offset-4 transition-opacity hover:opacity-55"
                  >
                    {email}
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  )
}
