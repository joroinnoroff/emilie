"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useCart } from "./CartProvider"
import { usePathname } from "next/navigation"
import { useLocale } from "@/lib/LocaleProvider"
import type { MessageKey } from "@/lib/i18n"
import { Wrap, cn } from "./ui"

const LOGO = "Emilie W. Lien"
const HERO_COOKIE = "emilie-needs-hero-top"

function setCookie(name: string, value: string, maxAgeSec = 60 * 60) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSec}; SameSite=Lax`
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}

function hasCookie(name: string) {
  return document.cookie.split("; ").some((c) => c.startsWith(`${name}=`))
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6h15l-1.5 9h-12L6 6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M6 6L5 3H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="20" r="1.25" fill="currentColor" />
      <circle cx="18" cy="20" r="1.25" fill="currentColor" />
    </svg>
  )
}

type HeaderProps = {
  email?: string
  instagram?: string
}

export default function Header({
  email = "post@emilie.no",
  instagram = "#",
}: HeaderProps) {
  const [pastVideo, setPastVideo] = useState(false)
  const [hasHero, setHasHero] = useState(false)
  const [open, setOpen] = useState(false)
  const [logoKey, setLogoKey] = useState(0)
  const [aboutTheme, setAboutTheme] = useState(false)
  const { count, toggleCart, closeCart } = useCart()
  const pathName = usePathname()
  const { locale, setLocale, t } = useLocale()

  const links = useMemo(
    () =>
      [
        { href: "/#about", labelKey: "nav.about" as MessageKey, hero: true },
        { href: "/shop", labelKey: "nav.shop" as MessageKey, hero: true },
        { href: "/#contact", labelKey: "nav.contact" as MessageKey, hero: true },
      ] as const,
    []
  )
  const heroLinks = useMemo(() => links.filter((link) => link.hero), [links])

  useEffect(() => {
    const syncAboutTheme = () => {
      setAboutTheme(document.documentElement.dataset.aboutTheme === "1")
    }
    syncAboutTheme()
    const observer = new MutationObserver(syncAboutTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-about-theme"],
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (pathName !== "/") {
      setCookie(HERO_COOKIE, "1")
      setHasHero(false)
      setPastVideo(true)
      setOpen(false)
      setAboutTheme(false)
    }
  }, [pathName])

  useEffect(() => {
    if (pathName !== "/") return

    const needsTop = hasCookie(HERO_COOKIE)
    if (needsTop) {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual"
      }
      window.scrollTo(0, 0)
      clearCookie(HERO_COOKIE)
    }

    const syncHero = () => {
      const media = document.getElementById("hero-media")
      setHasHero(Boolean(media))
      if (!media) {
        setPastVideo(true)
        return
      }
      const past = media.getBoundingClientRect().bottom <= 0
      setPastVideo(past)
    }

    const raf = requestAnimationFrame(() => {
      syncHero()
      if (needsTop) requestAnimationFrame(syncHero)
    })

    let wasPast = false
    const update = () => {
      const media = document.getElementById("hero-media")
      if (!media) {
        setHasHero(false)
        setPastVideo(true)
        return
      }
      setHasHero(true)
      const past = media.getBoundingClientRect().bottom <= 0
      if (past && !wasPast) setLogoKey((k) => k + 1)
      wasPast = past
      setPastVideo(past)
    }

    const onScroll = () => {
      setOpen(false)
      update()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", update)
    }
  }, [pathName])

  const showLogo = !hasHero || pastVideo
  const onHeroLanding = hasHero && !pastVideo
  const showCart = pathName.startsWith("/shop") && count > 0
  const langOnRight = !onHeroLanding
  const scrolled = pastVideo || !hasHero

  const langSwitch = (
    <div
      className={cn(
        "inline-flex shrink-0 items-center gap-2",
        !langOnRight && "max-[1100px]:ml-3.5 max-[760px]:ml-[18px]"
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        className={cn(
          "cursor-pointer border-0 bg-transparent p-0 font-inherit text-sm transition-colors duration-500",
          aboutTheme
            ? locale === "en"
              ? "border-b border-white text-white"
              : "text-white/70"
            : locale === "en"
              ? "border-b border-ink text-ink"
              : "text-ink-soft"
        )}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={cn(
          "cursor-pointer border-0 bg-transparent p-0 font-inherit text-sm transition-colors duration-500",
          aboutTheme
            ? locale === "nb"
              ? "border-b border-white text-white"
              : "text-white/70"
            : locale === "nb"
              ? "border-b border-ink text-ink"
              : "text-ink-soft"
        )}
        onClick={() => setLocale("nb")}
      >
        NO
      </button>
    </div>
  )

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[200] py-[22px] transition-colors duration-300",
        aboutTheme
          ? "bg-about text-white"
          : scrolled || open
            ? "bg-white text-ink"
            : "bg-transparent text-ink",
        open && "z-[400]"
      )}
    >
      <Wrap className="relative z-[2] flex items-center justify-between gap-4">
        <div className="flex min-w-0 shrink-0 items-center gap-4">
          {!langOnRight ? langSwitch : null}

          {showLogo ? (
            <Link
              href="/"
              key={logoKey}
              className={cn(
                "inline-flex min-w-16 whitespace-nowrap text-xl font-medium transition-colors duration-500",
                aboutTheme ? "text-white" : "text-ink"
              )}
              onClick={() => {
                setCookie(HERO_COOKIE, "1")
                setOpen(false)
                closeCart()
              }}
            >
              {LOGO.split("").map((char, i) => (
                <span
                  key={`${char}-${i}`}
                  className="logo-char"
                  style={{ animationDelay: `${80 + i * 45}ms` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </Link>
          ) : null}
        </div>

        <div className="ml-auto flex min-w-0 items-center gap-[18px]">
          {showCart ? (
            <button
              type="button"
              className={cn(
                "relative inline-flex shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 transition-colors duration-500 hover:opacity-55",
                aboutTheme ? "text-white" : "text-ink"
              )}
              onClick={toggleCart}
              aria-label={count > 0 ? `${t("nav.cart")} (${count})` : t("nav.cart")}
            >
              <CartIcon />
              {count > 0 ? (
                <span
                  className={cn(
                    "absolute -top-1.5 -right-2 min-w-4 rounded-full px-1 text-center text-[10px] leading-4 font-medium",
                    aboutTheme ? "bg-white text-about" : "bg-ink text-white"
                  )}
                >
                  {count}
                </span>
              ) : null}
            </button>
          ) : null}

          {onHeroLanding ? (
            <nav className="min-w-0">
              <ul className="flex list-none flex-nowrap gap-7 max-[1100px]:gap-4 max-[760px]:gap-3">
                {heroLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "whitespace-nowrap border-b border-transparent text-base transition-[border-color,color] duration-500 max-[1100px]:text-[0.9375rem] max-[760px]:text-sm",
                        aboutTheme
                          ? "text-white hover:border-white"
                          : "text-ink hover:border-ink"
                      )}
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {langOnRight ? langSwitch : null}

          {!onHeroLanding ? (
            <button
              type="button"
              className="relative z-[2] h-3.5 w-7 cursor-pointer border-0 bg-transparent p-0"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className={cn(
                  "menu-toggle-line menu-toggle-line-top absolute inset-x-0 top-0 h-0.5 transition-colors duration-500",
                  aboutTheme ? "bg-white" : "bg-ink",
                  open && "open"
                )}
              />
              <span
                className={cn(
                  "menu-toggle-line menu-toggle-line-bottom absolute inset-x-0 bottom-0 h-0.5 transition-colors duration-500",
                  aboutTheme ? "bg-white" : "bg-ink",
                  open && "open"
                )}
              />
            </button>
          ) : null}
        </div>
      </Wrap>

      {!onHeroLanding ? (
        <div
          className={cn(
            "absolute inset-x-0 top-full z-[1] max-h-0 overflow-hidden opacity-0 transition-[max-height,opacity,background-color] duration-400 ease-[cubic-bezier(0.22,0.9,0.32,1)]",
            aboutTheme ? "bg-about" : "bg-white",
            open && "max-h-[420px] opacity-100"
          )}
        >
          <Wrap
            as="nav"
            className="flex items-start justify-between gap-8 pt-2 pb-7"
          >
            <div className="flex shrink-0 flex-col items-start gap-3 pt-1">
              <div className="flex items-center justify-start gap-4">
                <a
                  href={`mailto:${email}`}
                  aria-label="Email"
                  className={cn(
                    "inline-flex items-center justify-center transition-colors duration-500",
                    aboutTheme
                      ? "text-white/75 hover:text-white"
                      : "text-ink-soft hover:text-ink"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <MailIcon />
                </a>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className={cn(
                    "inline-flex items-center justify-center transition-colors duration-500",
                    aboutTheme
                      ? "text-white/75 hover:text-white"
                      : "text-ink-soft hover:text-ink"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <InstagramIcon />
                </a>
              </div>
              <Link
                href="/privacy"
                className={cn(
                  "text-sm transition-colors duration-500",
                  aboutTheme
                    ? "text-white/70 hover:text-white"
                    : "text-ink-soft hover:text-ink"
                )}
                onClick={() => setOpen(false)}
              >
                {t("legal.title")}
              </Link>
            </div>
            <ul className="ml-auto flex list-none flex-col items-end justify-end gap-4">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-lg transition-opacity duration-500 hover:opacity-50",
                      aboutTheme ? "text-white" : "text-ink"
                    )}
                    onClick={() => {
                      setOpen(false)
                      closeCart()
                    }}
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </Wrap>
        </div>
      ) : null}
    </header>
  )
}
