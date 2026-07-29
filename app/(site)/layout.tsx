import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { CartProvider } from "@/components/CartProvider"
import CartDrawer from "@/components/Cart"
import { getWorks } from "@/sanity/lib/fetch"

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const products = await getWorks()

  return (
    <CartProvider>
      <Header />
      {children}
      <Footer />
      <CartDrawer products={products} />
    </CartProvider>
  )
}
