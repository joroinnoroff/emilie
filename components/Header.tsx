"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useCart } from "./CartProvider"
import { usePathname } from "next/navigation"

const LINKS = [
  { href: "/projects", label: "Works" },
  { href: "/#about", label: "About" },
  { href: "/#shop", label: "Shop" },
  { href: "/#contact", label: "Contact" },
]

const LOGO = "Emilie"

export default function Header() {
  const [pastVideo, setPastVideo] = useState(false)
  const [hasHero, setHasHero] = useState(true)
  const [open, setOpen] = useState(false)
  const [logoKey, setLogoKey] = useState(0)
  const { count, toggleCart, closeCart } = useCart()
  const pathName = usePathname();

  

  useEffect(() => {
    const media = document.getElementById("hero-media")
    setHasHero(Boolean(media))

    if (!media) {
      setPastVideo(true)
      return
    }

    let wasPast = media.getBoundingClientRect().bottom <= 0
    setPastVideo(wasPast)

    const update = () => {
      const past = media.getBoundingClientRect().bottom <= 0
      if (past && !wasPast) setLogoKey((k) => k + 1)
      wasPast = past
      setPastVideo(past)
    }

    const onScroll = () => {
      setOpen(false)
      update()
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", update)
    }
  }, [])

  const showLogo = !hasHero || pastVideo
  const showCart = pathName.startsWith("/shop")

  return (
    <header className={`${pastVideo || !hasHero ? "scrolled" : ""}${open ? " menu-open" : ""}`}>
      <div className="wrap">
        {showLogo ? (
          <Link
            href="/"
            key={logoKey}
            className="logo logo-enter"
            onClick={() => {
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
              Cart{count > 0 ? ` (${count})` : ""}
            </button>
          ) : null}

          {!pastVideo && hasHero ? (
            <nav className="nav-inline">
              <ul>
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
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
        </div>
      </div>

      {(pastVideo || !hasHero) && (
        <div className={`menu-panel${open ? " open" : ""}`}>
          <nav className="wrap">
            <ul>
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => {
                      setOpen(false)
                      closeCart()
                    }}
                  >
                    {link.label}
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
