import { useToast } from "@sanity/ui"
import { useCallback, useState } from "react"
import { type DocumentActionComponent, useClient } from "sanity"
import { apiVersion } from "../env"

export const markWorkSoldAction: DocumentActionComponent = (props) => {
  const { id, type, published, draft, onComplete } = props
  const doc = draft || published
  const client = useClient({ apiVersion })
  const toast = useToast()
  const [busy, setBusy] = useState(false)

  const onHandle = useCallback(async () => {
    if (!doc || type !== "work") return
    setBusy(true)
    try {
      const workId = id.replace(/^drafts\./, "")
      const soldAt = new Date().toISOString()
      const amountNok =
        typeof doc.priceNok === "number" ? doc.priceNok : undefined
      const amountEur =
        typeof doc.priceEur === "number" ? doc.priceEur : undefined

      await client
        .patch(workId)
        .set({
          status: "Sold",
          stock: 0,
          soldAt,
          forSale: Boolean(doc.printAvailable),
        })
        .commit()

      if (amountNok || amountEur) {
        await client.create({
          _type: "sale",
          soldAt,
          title: doc.title || "Work",
          amountNok,
          amountEur,
          variant: "original",
          qty: 1,
          source: "work",
          work: { _type: "reference", _ref: workId },
        })
      }

      try {
        await client.delete(`drafts.${workId}`)
      } catch {
        // no draft
      }

      toast.push({
        status: "success",
        title: "Marked as sold",
        description: "Added to total income graph.",
      })
      onComplete()
    } catch (err) {
      console.error(err)
      toast.push({
        status: "error",
        title: "Could not mark as sold",
        description: err instanceof Error ? err.message : "Unknown error",
      })
    } finally {
      setBusy(false)
    }
  }, [client, doc, id, onComplete, toast, type])

  if (type !== "work") return null
  if (!doc || doc.status === "Sold") return null

  return {
    label: busy ? "Marking sold…" : "Mark as sold",
    tone: "positive",
    disabled: busy,
    onHandle,
  }
}
