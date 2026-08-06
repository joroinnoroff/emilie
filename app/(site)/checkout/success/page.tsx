import type { Metadata } from "next"
import CheckoutSuccessClient from "@/components/CheckoutSuccessClient"

export const metadata: Metadata = {
  title: "Order confirmed — Emilie",
}

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessClient />
}
