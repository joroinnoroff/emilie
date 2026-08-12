import Hero from "@/components/Hero"
import WorksSection from "@/components/WorksSection"
import About from "@/components/About"
import Newsletter from "@/components/Newsletter"
import Commission from "@/components/Commission"
import {
  getAboutContent,
  getFeaturedWorks,
  getSiteSettings,
} from "@/sanity/lib/fetch"

export default async function Home() {
  const [settings, about, featuredWorks] = await Promise.all([
    getSiteSettings(),
    getAboutContent(),
    getFeaturedWorks(),
  ])

  return (
    <>
      <Hero settings={settings} />
      <WorksSection works={featuredWorks} />
      <About content={about} />
      <Newsletter settings={settings} />
      <Commission settings={settings} />
    </>
  )
}
