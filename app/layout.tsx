import type { Metadata } from "next"
import "./globals.css"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://emilie.no"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Emilie W. Lien — Paintings",
    template: "%s · Emilie W. Lien",
  },
  description: "Original oil paintings and exhibitions by Emilie W. Lien.",
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: "Emilie W. Lien",
    title: "Emilie W. Lien — Paintings",
    description: "Original oil paintings and exhibitions by Emilie W. Lien.",
  },
  twitter: {
    // Smaller square preview — sharper than summary_large_image banners
    card: "summary",
    title: "Emilie W. Lien — Paintings",
    description: "Original oil paintings and exhibitions by Emilie W. Lien.",
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
