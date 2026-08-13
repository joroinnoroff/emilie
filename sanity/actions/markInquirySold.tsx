import { useToast } from "@sanity/ui"
import { useCallback, useState } from "react"
import { type DocumentActionComponent, useClient } from "sanity"
import { apiVersion } from "../env"

type InquiryLine = {
  title?: string
  work?: { _ref?: string }
  variant?: "original" | "print"
  printSize?: string
  qty?: number
  priceNok?: number
  priceEur?: number
}

type WorkDoc = {
  _id: string
  printAvailable?: boolean
  prints?: Array<{
    _key: string
    size?: string
    stock?: number
  }>
}

export const markInquirySoldAction: DocumentActionComponent = (props) => {
  const { id, type, published, draft, onComplete } = props
  const doc = draft || published
  const client = useClient({ apiVersion })
  const toast = useToast()
  const [busy, setBusy] = useState(false)

  const onHandle = useCallback(async () => {
    if (!doc || type !== "inquiry") return
    setBusy(true)
    try {
      const lines = (Array.isArray(doc.lines) ? doc.lines : []) as InquiryLine[]
      let saleNok = 0
      let saleEur = 0
      const soldAt = new Date().toISOString()
      const inquiryId = id.replace(/^drafts\./, "")

      for (const line of lines) {
        const qty = Math.max(1, Number(line.qty) || 1)
        const lineNok =
          typeof line.priceNok === "number" ? line.priceNok * qty : 0
        const lineEur =
          typeof line.priceEur === "number" ? line.priceEur * qty : 0
        saleNok += lineNok
        saleEur += lineEur

        const workId = line.work?._ref
        if (workId) {
          if (line.variant === "original") {
            const work = await client.fetch<WorkDoc | null>(
              `*[_type == "work" && _id == $id][0]{ _id, printAvailable }`,
              { id: workId }
            )
            await client
              .patch(workId)
              .set({
                status: "Sold",
                stock: 0,
                soldAt,
                forSale: Boolean(work?.printAvailable),
              })
              .commit()
          } else if (line.variant === "print") {
            const work = await client.fetch<WorkDoc | null>(
              `*[_type == "work" && _id == $id][0]{
                _id,
                prints[]{ _key, size, stock }
              }`,
              { id: workId }
            )
            if (work?.prints?.length && line.printSize) {
              const nextPrints = work.prints.map((p) => {
                if (p.size !== line.printSize) return p
                return {
                  ...p,
                  stock: Math.max(0, (p.stock ?? 0) - qty),
                }
              })
              await client.patch(workId).set({ prints: nextPrints }).commit()
            }
          }
        }

        if (lineNok || lineEur) {
          await client.create({
            _type: "sale",
            soldAt,
            title: line.title || "Work",
            amountNok: lineNok || undefined,
            amountEur: lineEur || undefined,
            variant: line.variant,
            printSize: line.printSize,
            qty,
            source: "inquiry",
            ...(workId
              ? { work: { _type: "reference", _ref: workId } }
              : {}),
            inquiry: { _type: "reference", _ref: inquiryId },
          })
        }
      }

      await client
        .patch(inquiryId)
        .set({
          status: "sold",
          soldAt,
          ...(saleNok ? { saleAmountNok: saleNok } : {}),
          ...(saleEur ? { saleAmountEur: saleEur } : {}),
        })
        .commit()

      try {
        await client.delete(`drafts.${inquiryId}`)
      } catch {
        // no draft
      }

      toast.push({
        status: "success",
        title: "Marked as sold",
        description: "Income graph updated with this sale.",
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

  if (type !== "inquiry") return null
  if (!doc || doc.status === "sold") return null

  return {
    label: busy ? "Marking sold…" : "Mark as sold",
    tone: "positive",
    disabled: busy,
    onHandle,
  }
}
