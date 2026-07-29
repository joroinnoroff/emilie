import Hero from "@/components/Hero";
import WorksSection from "@/components/WorksSection";
import About from "@/components/About";
import Shop from "@/components/Shop";
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
      <Shop items={shopWorks.slice(0, 4)} />
      <Newsletter settings={settings} />
      <Contact settings={settings} />
    </>
  );
}
