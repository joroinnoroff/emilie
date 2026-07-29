import Link from "next/link";
import InfinityBanner from "./InfinityBanner";
import type { SiteSettings } from "@/lib/sanity-content";

type HeroProps = {
  settings: SiteSettings;
};

export default function Hero({ settings }: HeroProps) {
  const videoSrc = settings.heroVideoUrl || "/hero.mp4";

  return (
    <section className="hero" id="hero">
      <div className="hero-above">
        {settings.exhibitionBanner ? (
          <InfinityBanner text={settings.exhibitionBanner} />
        ) : null}
        <div className="hero-top">
          <div className="wrap hero-content">
            <h1 className="hero-statement">{settings.heroStatement}</h1>
            <Link href="/#works" className="hero-link">
              {settings.heroCtaLabel || "See Works →"}
            </Link>
          </div>
        </div>
        <div className="hero-meta">
          <span>{settings.basedIn}</span>
          <span>{settings.bornIn}</span>
        </div>
      </div>
      <div className="hero-media" id="hero-media">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video src={videoSrc} autoPlay muted loop playsInline />
      </div>
    </section>
  );
}
