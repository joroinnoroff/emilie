import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="wrap hero-content">
        <h1 className="hero-statement">
          Hi, I&apos;m Emilie. Previous student at Einar Granum Kunstfagskole
        </h1>

        <Link href="/#works" className="hero-link">
          See Works →
        </Link>
      </div>
      <div className="hero-media" id="hero-media">
        <div className="hero-meta">
          <span>Based in Oslo</span>
          <span>Born in 1997</span>
        </div>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video src="/hero.mp4" autoPlay muted loop playsInline />
      </div>
    </section>
  );
}
