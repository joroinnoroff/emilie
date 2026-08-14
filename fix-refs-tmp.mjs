import { createClient } from "@sanity/client"
import { readFileSync } from "node:fs"

for (const line of readFileSync(".env", "utf8").split("\n")) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith("#")) continue
  const eq = trimmed.indexOf("=")
  if (eq === -1) continue
  const key = trimmed.slice(0, eq).trim()
  let value = trimmed.slice(eq + 1).trim()
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
  if (!(key in process.env)) process.env[key] = value
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const DRAFT_REF = "drafts.32f2cde5-695b-40c2-9fb2-2716353e0996"
const REAL_REF = "32f2cde5-695b-40c2-9fb2-2716353e0996"
const ids = ["EZtgEk1jIgI8yOQaphe7kz","EZtgEk1jIgI8yOQaphhBGL","KxszAYJoItKTI5nOORUMSb","Xwn7BWRxH6qQXgP1j6UR7Z","Xwn7BWRxH6qQXgP1j6URXM"]

const docs = await client.fetch(`*[_id in $ids]`, { ids })

const tx = client.transaction()
for (const doc of docs) {
  if (doc._type === "sale") {
    if (doc.work?._ref === DRAFT_REF) {
      tx.patch(doc._id, (p) => p.set({ "work._ref": REAL_REF }))
      console.log(`sale ${doc._id}: work._ref -> ${REAL_REF}`)
    }
  } else if (doc._type === "inquiry") {
    let changed = false
    const lines = (doc.lines || []).map((line) => {
      if (line.work?._ref === DRAFT_REF) {
        changed = true
        return { ...line, work: { ...line.work, _ref: REAL_REF } }
      }
      return line
    })
    if (changed) {
      tx.patch(doc._id, (p) => p.set({ lines }))
      console.log(`inquiry ${doc._id}: patched lines`)
    }
  }
}

const result = await tx.commit()
console.log("Done.", result.transactionId)
