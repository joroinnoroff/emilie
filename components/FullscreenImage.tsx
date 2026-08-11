"use client"

import { useEffect, useState } from "react"
import { cn } from "./ui"

export default function FullscreenImage({
  src,
  alt,
  scale = 1,
  className,
}: {
  src: string
  alt: string
  /** 1 = full size; lower values shrink on scroll (Henrik-style) */
  scale?: number
  className?: string
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
      <div
        className={cn(
          "relative w-full max-w-[520px] overflow-visible will-change-transform max-[860px]:max-w-none",
          className
        )}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top right",
          transition: "transform 0.12s linear",
          zIndex: scale < 0.95 ? 30 : 10,
        }}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f0f0f0]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="h-full w-full object-cover" />
          <button
            type="button"
            className="absolute right-3 bottom-3 z-[2] cursor-pointer border-0 bg-transparent p-0 text-black"
            onClick={() => setOpen(true)}
            aria-label="View fullscreen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="#000"
                d="M3 21v-5h2v3h3v2zm13 0v-2h3v-3h2v5zM3 8V3h5v2H5v3zm16 0V5h-3V3h5v5z"
              />
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/90 p-6"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="absolute top-6 right-6 cursor-pointer border-0 bg-transparent font-inherit text-base text-white"
            onClick={() => setOpen(false)}
            aria-label="Close fullscreen"
          >
            Close
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  )
}
