import { ImageResponse } from "next/og"

/** Compact OG card — restrained type, less empty stretch than a huge banner */
export const alt = "Emilie W. Lien"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f6f3",
          color: "#111111",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#111111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: 30,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 500,
                lineHeight: 1,
                marginTop: -2,
              }}
            >
              E
            </div>
          </div>
          <div
            style={{
              fontSize: 48,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Emilie W. Lien
          </div>
         
        </div>
      </div>
    ),
    { ...size }
  )
}
