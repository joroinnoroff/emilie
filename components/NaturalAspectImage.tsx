"use client"

import { cn } from "./ui"

/** Image that keeps the file’s natural portrait/landscape ratio. */
export default function NaturalAspectImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="block h-auto w-full" />
    </div>
  )
}
