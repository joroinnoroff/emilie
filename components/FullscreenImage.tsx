"use client"

import { useEffect, useState } from "react"

export default function FullscreenImage({
  src,
  alt,
}: {
  src: string
  alt: string
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <>
      <div className="detail-img relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
        <button
          type="button"
          className="fullscreen-btn bg-transparent text-black"
          onClick={() => setOpen(true)}
          aria-label="View fullscreen"
        >
       <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">{/**<--Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --> */}<path fill="#00000" d="M3 21v-5h2v3h3v2zm13 0v-2h3v-3h2v5zM3 8V3h5v2H5v3zm16 0V5h-3V3h5v5z"/></svg>
        </button> 
      </div>

      {open ? (
        <div
          className="fullscreen-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="fullscreen-close"
            onClick={() => setOpen(false)}
            aria-label="Close fullscreen"
          >
            Close
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="fullscreen-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  )
}
