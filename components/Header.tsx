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

export default function Header() {
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
        { href: "/projects", labelKey: "nav.works" as MessageKey },
        { href: "/#about", labelKey: "nav.about" as MessageKey },
        { href: "/#shop", labelKey: "nav.shop" as MessageKey },
        { href: "/#contact", labelKey: "nav.contact" as MessageKey },
      ] as const,
    []
  )

  // Mark that the next home visit should land at the hero top
  useEffect(() => {
    if (pathName !== "/") {
      setCookie(HERO_COOKIE, "1")
      setHasHero(false)
      setPastVideo(true)
      setOpen(false)
    }
  }, [pathName])

  // On home: if cookie says we left another page, scroll to top so the banner isn't cropped
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

    // Wait a frame so Hero has mounted after client navigation
    const raf = requestAnimationFrame(() => {
      syncHero()
      // After forced scroll, measure again
      if (needsTop) {
        requestAnimationFrame(syncHero)
      }
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
  const showCart = pathName.startsWith("/shop") || pathName.startsWith("/checkout")

  return (
    <header className={`${pastVideo || !hasHero ? "scrolled" : ""}${open ? " menu-open" : ""}`}>
      <div className="wrap">
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
        ) : (
          <span className="logo-spacer" aria-hidden="true" />
        )}

        <div className="header-actions">
          {showCart ? (
            <button type="button" className="cart-trigger" onClick={toggleCart}>
              {t("nav.cart")}
              {count > 0 ? ` (${count})` : ""}
            </button>
          ) : null}

          {!pastVideo && hasHero ? (
            <nav className="nav-inline">
              <ul>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{t(link.labelKey)}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : (
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
          )}

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
        </div>
      </div>

      {(pastVideo || !hasHero) && (
        <div className={`menu-panel${open ? " open" : ""}`}>
          <nav className="wrap">
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
      )}
    </header>
  )
}
