import type { ReactNode } from "react"

type WrapProps = {
  children: ReactNode
  className?: string
  as?: "div" | "nav" | "section" | "footer"
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

export function Wrap({ children, className, as: Tag = "div" }: WrapProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[1280px] px-6 md:px-12", className)}>
      {children}
    </Tag>
  )
}

/** Primary bordered button */
export const btnClass =
  "inline-flex cursor-pointer items-center gap-2 border border-ink bg-transparent px-6 py-3.5 font-inherit text-base text-ink transition-colors hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-ink"

/** Underline text link button (section CTAs) */
export const textLinkClass =
  "inline-flex items-center border-0 border-b border-ink bg-transparent p-0 pb-0.5 font-inherit text-base text-ink transition-opacity hover:bg-transparent hover:text-ink hover:opacity-50"

/** Form field underline style */
export const fieldClass =
  "w-full rounded-none border-0 border-b border-line bg-transparent px-0 py-2.5 font-inherit text-base text-ink outline-none placeholder:text-ink-soft"
