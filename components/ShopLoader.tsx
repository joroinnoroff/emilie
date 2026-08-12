const DOTS = 12
const SIZE = 80
const CENTER = SIZE / 2
const ORBIT = 28
const DOT_R = 4.2

/** Soft pastels — site palette + close neighbors */
const PASTELS = [
  "#9dbdd0",
  "#a8c9b8",
  "#e3d5b8",
  "#e3aebb",
  "#67a2c5",
  "#c5d4a8",
  "#d4b8a8",
  "#b8c9d4",
  "#d8c4b0",
  "#9ab08a",
  "#c9b8b0",
  "#b5c9c4",
] as const

type ShopLoaderProps = {
  className?: string
  /** Accessible label */
  label?: string
}

/** 12-bit circular volume loader — pastel dots pulse in sequence. */
export default function ShopLoader({
  className,
  label = "Loading",
}: ShopLoaderProps) {
  return (
    <div
      className={
        className ??
        "flex min-h-[42vh] w-full items-center justify-center pt-8"
      }
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="56"
        height="56"
        aria-hidden="true"
        className="shop-loader-svg overflow-visible"
      >
        {Array.from({ length: DOTS }, (_, i) => {
          const angle = (i / DOTS) * Math.PI * 2 - Math.PI / 2
          const cx = CENTER + Math.cos(angle) * ORBIT
          const cy = CENTER + Math.sin(angle) * ORBIT
          return (
            <circle
              key={i}
              className="shop-loader-dot"
              cx={cx}
              cy={cy}
              r={DOT_R}
              fill={PASTELS[i]}
              style={{ animationDelay: `${(i / DOTS) * 1.05}s` }}
            />
          )
        })}
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  )
}
