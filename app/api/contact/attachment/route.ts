import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

const MAX_BYTES = 8 * 1024 * 1024 // 8 MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
])

/**
 * Contact-form attachments → Vercel Blob.
 * Requires BLOB_READ_WRITE_TOKEN (Vercel project → Storage → Blob).
 */
export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Upload is not configured. Add BLOB_READ_WRITE_TOKEN from Vercel Blob.",
      },
      { status: 503 }
    )
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 })
  }

  const file = form.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File is too large (max 8 MB)." },
      { status: 400 }
    )
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Only images (JPEG, PNG, WebP, GIF) or PDF are allowed." },
      { status: 400 }
    )
  }

  try {
    const safeName = (file.name || "attachment").replace(/[^\w.\-]+/g, "_")
    const blob = await put(`contact/${Date.now()}-${safeName}`, file, {
      access: "public",
      contentType: file.type,
    })

    return NextResponse.json({
      ok: true,
      url: blob.url,
      pathname: blob.pathname,
      originalFilename: file.name || safeName,
    })
  } catch (err) {
    console.error("Contact attachment upload failed:", err)
    return NextResponse.json(
      { error: "Could not upload attachment." },
      { status: 502 }
    )
  }
}
