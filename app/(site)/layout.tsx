import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { CartProvider } from "@/components/CartProvider"
import CartDrawer from "@/components/Cart"
import { LocaleProvider } from "@/lib/LocaleProvider"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <CartProvider>
        <Header />
        {children}
        <Footer />
        <CartDrawer />
      </CartProvider>
    </LocaleProvider>
  )
}
