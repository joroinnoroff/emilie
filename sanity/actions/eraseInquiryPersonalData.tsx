import { useToast } from "@sanity/ui"
import { useCallback, useState } from "react"
import { type DocumentActionComponent, useClient } from "sanity"
import { apiVersion } from "../env"

/** Personvern: strip customer PII while keeping sale/revenue stats. */
export const eraseInquiryPersonalDataAction: DocumentActionComponent = (
  props
) => {
  const { id, type, published, draft, onComplete } = props
  const doc = draft || published
  const client = useClient({ apiVersion })
  const toast = useToast()
  const [busy, setBusy] = useState(false)

  const onHandle = useCallback(async () => {
    if (!doc || type !== "inquiry") return
    // eslint-disable-next-line no-alert -- Studio confirmation
    const ok = window.confirm(
      "Erase personal data on this inquiry? Name, email, phone, shipping and message will be removed. Sale amounts are kept. This cannot be undone."
    )
    if (!ok) {
      onComplete()
      return
    }

    setBusy(true)
    try {
      const inquiryId = id.replace(/^drafts\./, "")
      await client
        .patch(inquiryId)
        .set({
          name: "[deleted]",
          email: "deleted@privacy.local",
          phone: "",
          shippingLocation: "",
          message: "",
          status: doc.status === "sold" ? "sold" : "closed",
        })
        .commit()

      try {
        await client.delete(`drafts.${inquiryId}`)
      } catch {
        // no draft
      }

      toast.push({
        status: "success",
        title: "Personal data erased",
      })
      onComplete()
    } catch (err) {
      toast.push({
        status: "error",
        title: "Could not erase data",
        description: err instanceof Error ? err.message : "Unknown error",
      })
    } finally {
      setBusy(false)
    }
  }, [client, doc, id, onComplete, toast, type])

  if (type !== "inquiry") return null
  if (!doc || doc.name === "[deleted]") return null

  return {
    label: busy ? "Erasing…" : "Erase personal data (GDPR)",
    tone: "critical",
    disabled: busy,
    onHandle,
  }
}
