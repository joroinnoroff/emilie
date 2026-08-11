import { Suspense } from "react";
import Hero from "@/components/Hero";
import WorksSection from "@/components/WorksSection";
import About from "@/components/About";
import Shop from "@/components/Shop";
import Commission from "@/components/Commission";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";
import {
  getAboutContent,
  getFeaturedWorks,
  getShopWorks,
  getSiteSettings,
} from "@/sanity/lib/fetch";

export default async function Home() {
  const [settings, about, featuredWorks, shopWorks] = await Promise.all([
    getSiteSettings(),
    getAboutContent(),
    getFeaturedWorks(),
    getShopWorks(),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <WorksSection works={featuredWorks} />
      <About content={about} />
      <Shop
        items={shopWorks
          .filter((w) => {
            const title = w.title.toLowerCase()
            return (
              !title.includes("det er dine tårer vi drikker") &&
              !title.includes("cannegione")
            )
          })
          .slice(0, 4)}
      />
      <Commission settings={settings} />
      <Newsletter settings={settings} />
      <Suspense fallback={null}>
        <Contact settings={settings} />
      </Suspense>
    </>
  );
}
