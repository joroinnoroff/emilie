import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="wrap hero-content">
        <h1 className="hero-statement">
          Hi, I&apos;m Emilie. Elev ved Einar Granum Kunstfagskole, basert i Oslo.
        </h1>
        <Link href="/#works" className="hero-link">
          Se arbeider
        </Link>
      </div>
      <div className="hero-media">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video src="/hero.mp4" autoPlay muted loop playsInline />
      </div>
    </section>
  );
}
