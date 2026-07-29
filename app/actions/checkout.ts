"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { getWorkBySlug } from "@/sanity/lib/fetch"
import { canWriteSanity, writeClient } from "@/sanity/lib/write-client"

export type DemoCheckoutResult =
  | { ok: true; soldIds: string[]; skipped: string[]; writeEnabled: boolean }
  | { ok: false; error: string }

export async function demoCompleteCheckout(
  itemIds: string[]
): Promise<DemoCheckoutResult> {
  const uniqueIds = Array.from(new Set(itemIds.filter(Boolean)))
  if (!uniqueIds.length) {
    return { ok: false, error: "Cart is empty." }
  }

  const soldIds: string[] = []
  const skipped: string[] = []

  for (const id of uniqueIds) {
    const work = await getWorkBySlug(id)
    if (!work) {
      skipped.push(id)
      continue
    }
    if (work.status === "Sold" || work.stock < 1) {
      skipped.push(id)
      continue
    }

    if (canWriteSanity && work.sanityId) {
      try {
        await writeClient
          .patch(work.sanityId)
          .set({ status: "Sold", forSale: false, stock: 0 })
          .commit()
        soldIds.push(id)
      } catch {
        skipped.push(id)
      }
    } else {
      // Demo without write token — treat as success locally
      soldIds.push(id)
    }
  }

  revalidateTag("works")
  revalidatePath("/")
  revalidatePath("/projects")
  revalidatePath("/shop")
  revalidatePath("/checkout")

  if (!soldIds.length) {
    return {
      ok: false,
      error: "Those works were already sold or unavailable.",
    }
  }

  return {
    ok: true,
    soldIds,
    skipped,
    writeEnabled: canWriteSanity,
  }
}
