"use client"

import { motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useLocale } from "@/lib/LocaleProvider"
import { cn } from "./ui"

function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="currentColor"
        d="M3 21v-5h2v3h3v2zm13 0v-2h3v-3h2v5zM3 8V3h5v2H5v3zm16 0V5h-3V3h5v5z"
      />
    </svg>
  )
}

/** Minimal expand cue — soft breathe only */
function ClickCueIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="fullscreen-click-cue"
    >
      <path
        d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function FullscreenImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const { t } = useLocale()
  const frameRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [ratio, setRatio] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [hovering, setHovering] = useState(false)
  const isWide = ratio != null && ratio > 1

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 420, damping: 32, mass: 0.4 })
  const y = useSpring(rawY, { stiffness: 420, damping: 32, mass: 0.4 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setRatio(null)
    const img = new window.Image()
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        setRatio(img.naturalWidth / img.naturalHeight)
      }
    }
    img.src = src
  }, [src])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const openFullscreen = () => setOpen(true)

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = frameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    rawX.set(e.clientX - rect.left)
    rawY.set(e.clientY - rect.top)
  }

  const overlay =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/92 p-5 md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              className="absolute top-5 right-5 z-[1] cursor-pointer border-0 bg-transparent p-0 font-inherit text-sm text-white/90 transition-opacity hover:opacity-60 md:top-8 md:right-8"
              onClick={() => setOpen(false)}
              aria-label="Close fullscreen"
            >
              Close
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="mx-auto max-h-[min(92vh,920px)] max-w-[min(96vw,1100px)] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body
        )
      : null

  return (
    <>
      <div
        className={cn(
          "relative w-full overflow-visible",
          isWide ? "max-w-full" : "max-w-[520px] max-[860px]:max-w-none",
          className
        )}
      >
        <div
          ref={frameRef}
          className={cn(
            "relative w-full overflow-hidden",
            isWide
              ? "max-h-[min(56vh,560px)]"
              : "max-h-[min(78vh,720px)]"
          )}
          style={
            ratio
              ? { aspectRatio: `${ratio}` }
              : { aspectRatio: "4 / 5" }
          }
          onPointerEnter={(e) => {
            setHovering(true)
            onPointerMove(e)
          }}
          onPointerLeave={() => setHovering(false)}
          onPointerMove={onPointerMove}
        >
          <button
            type="button"
            className="absolute inset-0 z-[1] cursor-pointer border-0 bg-transparent p-0"
            onClick={openFullscreen}
            aria-label={t("shop.fullscreen")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="pointer-events-none h-full w-full object-contain"
              onLoad={(e) => {
                const el = e.currentTarget
                if (el.naturalWidth > 0 && el.naturalHeight > 0) {
                  setRatio(el.naturalWidth / el.naturalHeight)
                }
              }}
            />
          </button>

          {/* Default: expand icon (hidden while desktop hover cue is active) */}
          <button
            type="button"
            className={cn(
              "absolute right-3 bottom-3 z-[2] flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-black transition-opacity duration-300",
              hovering
                ? "pointer-events-none opacity-0 min-[861px]:opacity-0"
                : "opacity-100 hover:opacity-55"
            )}
            onClick={openFullscreen}
            aria-label={t("shop.fullscreen")}
            tabIndex={hovering ? -1 : 0}
          >
            <ExpandIcon />
          </button>

          {/* Desktop hover: follower with animated click SVG + label */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 z-[3] hidden size-[104px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-full bg-black text-white min-[861px]:flex"
            style={{ x, y }}
            initial={false}
            animate={{
              scale: hovering ? 1 : 0.4,
              opacity: hovering ? 1 : 0,
            }}
            transition={{ duration: 0.28, ease: [0.22, 0.9, 0.32, 1] }}
          >
            <ClickCueIcon />
            <span className="text-[0.625rem] font-medium tracking-[0.06em] uppercase">
              {t("shop.fullscreen")}
            </span>
          </motion.div>
        </div>
      </div>
      {overlay}
    </>
  )
}
