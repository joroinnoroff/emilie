import { ImageResponse } from "next/og"

/** Square card — pairs with twitter.card = "summary" for a smaller, sharper preview */
export const alt = "Emilie W. Lien — Paintings"
export const size = { width: 800, height: 800 }
export const contentType = "image/png"

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f6f3",
          color: "#111111",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            background: "#111111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              color: "#ffffff",
              fontSize: 40,
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
            fontSize: 42,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Emilie W. Lien
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 20,
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "#757575",
            letterSpacing: "0.04em",
          }}
        >
          Paintings
        </div>
      </div>
    ),
    { ...size }
  )
}
