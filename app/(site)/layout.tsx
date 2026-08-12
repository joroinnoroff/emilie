import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CookieConsent from "@/components/CookieConsent"
import { CartProvider } from "@/components/CartProvider"
import CartDrawer from "@/components/Cart"
import { LocaleProvider } from "@/lib/LocaleProvider"
import { getSiteSettings } from "@/sanity/lib/fetch"

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <LocaleProvider>
      <CartProvider>
        <Header email={settings.email} instagram={settings.instagram} />
        {children}
        <Footer settings={settings} />
        <CartDrawer />
        <CookieConsent />
      </CartProvider>
    </LocaleProvider>
  )
}
