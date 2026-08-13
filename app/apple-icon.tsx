import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111111",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: 96,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            marginTop: -6,
          }}
        >
          E
        </div>
      </div>
    ),
    { ...size }
  )
}
