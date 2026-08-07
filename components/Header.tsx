"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useCart } from "./CartProvider"
import { usePathname } from "next/navigation"
import { useLocale } from "@/lib/LocaleProvider"
import type { MessageKey } from "@/lib/i18n"

const LOGO = "Emilie"
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
  const { count, toggleCart, closeCart } = useCart()
  const pathName = usePathname()
  const { locale, setLocale, t } = useLocale()

  const links = useMemo(
    () =>
      [
        { href: "/projects", labelKey: "nav.works" as MessageKey, hero: false },
        { href: "/#about", labelKey: "nav.about" as MessageKey, hero: true },
        { href: "/shop", labelKey: "nav.shop" as MessageKey, hero: true },
        { href: "/#contact", labelKey: "nav.contact" as MessageKey, hero: true },
      ] as const,
    []
  )
  const heroLinks = useMemo(() => links.filter((link) => link.hero), [links])

  useEffect(() => {
    if (pathName !== "/") {
      setCookie(HERO_COOKIE, "1")
      setHasHero(false)
      setPastVideo(true)
      setOpen(false)
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
  const onShop =
    pathName.startsWith("/shop") || pathName.startsWith("/checkout")
  const showCart = onShop && count > 0
  const langOnRight = !onHeroLanding

  const langSwitch = (
    <div className="lang-switch" role="group" aria-label="Language">
      <button
        type="button"
        className={locale === "en" ? "is-active" : ""}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={locale === "nb" ? "is-active" : ""}
        onClick={() => setLocale("nb")}
      >
        NO
      </button>
    </div>
  )

  return (
    <header className={`${pastVideo || !hasHero ? "scrolled" : ""}${open ? " menu-open" : ""}`}>
      <div className="wrap">
        <div className="header-left">
          {!langOnRight ? langSwitch : null}

          {showLogo ? (
            <Link
              href="/"
              key={logoKey}
              className="logo logo-enter"
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
                  style={{ animationDelay: `${80 + i * 55}ms` }}
                >
                  {char}
                </span>
              ))}
            </Link>
          ) : null}
        </div>

        <div className="header-actions">
          {showCart ? (
            <button
              type="button"
              className="cart-trigger"
              onClick={toggleCart}
              aria-label={count > 0 ? `${t("nav.cart")} (${count})` : t("nav.cart")}
            >
              <CartIcon />
              {count > 0 ? <span className="cart-count">{count}</span> : null}
            </button>
          ) : null}

          {onHeroLanding ? (
            <nav className="nav-inline">
              <ul>
                {heroLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{t(link.labelKey)}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {langOnRight ? langSwitch : null}

          {!onHeroLanding ? (
            <button
              type="button"
              className={`menu-toggle${open ? " open" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          ) : null}
        </div>
      </div>

      {!onHeroLanding ? (
        <div className={`menu-panel${open ? " open" : ""}`}>
          <nav className="wrap">
            <div className="menu-social">
              <a
                href={`mailto:${email}`}
                aria-label="Email"
                onClick={() => setOpen(false)}
              >
                <MailIcon />
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                onClick={() => setOpen(false)}
              >
                <InstagramIcon />
              </a>
            </div>
            <ul>
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
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
          </nav>
        </div>
      ) : null}
    </header>
  )
}
