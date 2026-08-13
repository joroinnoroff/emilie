import { ImageResponse } from "next/og"

/** Same favicon grid, stretched to fill the share card */
export const alt = "Emilie W. Lien"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const TL = "#b8c9a8"
const TR = "#a8c4d8"
const BL = "#e8b4bc"
const BR = "#f0e4b8"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: "50%", height: "50%", background: TL }} />
        <div style={{ width: "50%", height: "50%", background: TR }} />
        <div style={{ width: "50%", height: "50%", background: BL }} />
        <div style={{ width: "50%", height: "50%", background: BR }} />
      </div>
    ),
    { ...size }
  )
}
