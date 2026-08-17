import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/site"
import "./globals.css"

const siteUrl = getSiteUrl()

const keywords = [
  "Emilie W. Lien",
  "Emilie W Lien",
  "Emilie Lien",
  "Emilie W Lien kunst",
  "Emilie W Lien art",
  "Emilie W Lien artist",
  "Emilie W Lien painter",
  "Emilie W Lien maler",
  "Emilie W Lien kunstner",
  "Emilie W Lien Oslo",
  "Emilie W Lien oil paintings",
  "Emilie W Lien oljemaleri",
  "Emilie Utstillinger",
  "Emilie Kunstner",
  "Emilie kunst",
  "norsk kunstner Oslo",
  "norsk maler",
  "norwegian painter",
  "norwegian contemporary artist",
  "oljemalerier Oslo",
  "oil paintings Oslo",
  "kjøp kunst Oslo",
  "kjøp kunst Norge",
  "samtidskunst Norge",
  "surrealistiske malerier",
  "surrealist oil painting",
  "orkide malerier",
  "orchid paintings",
  "stilleben maleri",
  "contemporary still life painting",
]

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Emilie W. Lien",
  alternateName: ["Emilie W Lien", "Emilie Lien"],
  url: siteUrl,
  image: `${siteUrl}/about-portrait.png`,
  jobTitle: "Visual Artist",
  description:
    "Norwegian oil painter based in Oslo, working between still life and dreamscape — orchids, shells, birds, and everyday objects in soft, surreal compositions.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Oslo",
    addressCountry: "NO",
  },
  sameAs: ["https://www.instagram.com/emilieewl"],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Emilie W. Lien",
    template: "%s · Emilie W. Lien",
  },
  description: "Original oil paintings and exhibitions by Emilie W. Lien.",
  keywords,
  alternates: {
    canonical: siteUrl,
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
