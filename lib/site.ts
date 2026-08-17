export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")
  if (fromEnv) return fromEnv
  const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(
    /\/$/,
    ""
  )
  if (fromVercel) {
    return fromVercel.startsWith("http")
      ? fromVercel
      : `https://${fromVercel}`
  }
  // Canonical production host (not emilie.no — that breaks OG/Twitter image URLs)
  return "https://www.emiliewlien.no"
}
