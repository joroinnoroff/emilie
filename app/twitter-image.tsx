import { ImageResponse } from "next/og"

/** Square card — pairs with twitter.card = "summary" for a smaller, sharper preview */
export const alt = "Emilie W. Lien"
export const size = { width: 800, height: 800 }
export const contentType = "image/png"

const TL = "#b8c9a8"
const TR = "#a8c4d8"
const BL = "#e8b4bc"
const BR = "#f0e4b8"

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
            width: 120,
            height: 120,
            display: "flex",
            flexWrap: "wrap",
            marginBottom: 40,
            overflow: "hidden",
            borderRadius: 4,
          }}
        >
          <div style={{ width: "50%", height: "50%", background: TL }} />
          <div style={{ width: "50%", height: "50%", background: TR }} />
          <div style={{ width: "50%", height: "50%", background: BL }} />
          <div style={{ width: "50%", height: "50%", background: BR }} />
        </div>
        <div
          style={{
            fontSize: 44,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Emilie W. Lien
        </div>
      </div>
    ),
    { ...size }
  )
}
