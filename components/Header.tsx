"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/projects", label: "Works" },
  { href: "/#about", label: "About" },
  { href: "/#shop", label: "Shop" },
  { href: "/#contact", label: "Contact" },
];

const LOGO = "Emilie";

export default function Header() {
  const [pastVideo, setPastVideo] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const media = document.getElementById("hero-media");
    if (!media) {
      setPastVideo(true);
    }

    const update = () => {
      if (!media) return;
      // Transform a little before the video fully leaves the viewport
      const past = media.getBoundingClientRect().bottom <= 140;
      setPastVideo(past);
    };

    const onScroll = () => {
      setOpen(false);
      update();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <header className={`${pastVideo ? "scrolled" : ""}${open ? " menu-open" : ""}`}>
      <div className="wrap">
        {pastVideo ? (
          <Link href="/" className="logo" onClick={() => setOpen(false)}>
            {LOGO.split("").map((char, i) => (
              <span
                key={`${char}-${i}`}
                className="logo-char"
                style={{ animationDelay: `${i * 55}ms` }}
              >
                {char}
              </span>
            ))}
          </Link>
        ) : (
          <span className="logo-spacer" aria-hidden="true" />
        )}

        {!pastVideo ? (
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

      {pastVideo && (
        <div className={`menu-panel${open ? " open" : ""}`}>
          <nav className="wrap">
            <ul>
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setOpen(false)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
