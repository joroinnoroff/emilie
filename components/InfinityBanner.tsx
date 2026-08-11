type InfinityBannerProps = {
  text: string
}

export default function InfinityBanner({ text }: InfinityBannerProps) {
  const items = Array.from({ length: 6 }, (_, i) => (
    <span
      key={i}
      className="flex items-center gap-5 [writing-mode:vertical-rl] rotate-180 text-xs font-medium tracking-[0.04em] uppercase"
    >
      {text}
      <span className="opacity-70" aria-hidden="true">
        ·
      </span>
    </span>
  ))

  return (
    <div
      className="absolute top-0 bottom-0 left-0 z-[5] w-9 overflow-hidden bg-banner text-white max-[860px]:w-[1.85rem]"
      aria-label={text}
    >
      <div className="infinity-banner-track flex w-full flex-col items-center gap-5">
        {items}
        {items}
      </div>
    </div>
  )
}
