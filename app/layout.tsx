import type { Metadata } from "next"
import "./globals.css"

function resolveSiteUrl() {
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

const siteUrl = resolveSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Emilie W. Lien",
    template: "%s · Emilie W. Lien",
  },
  description: "Original oil paintings and exhibitions by Emilie W. Lien.",
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: siteUrl,
    siteName: "Emilie W. Lien",
    title: "Emilie W. Lien",
    description: "Original oil paintings and exhibitions by Emilie W. Lien.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Emilie W. Lien",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emilie W. Lien",
    description: "Original oil paintings and exhibitions by Emilie W. Lien.",
    images: ["/twitter-image"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nb" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
