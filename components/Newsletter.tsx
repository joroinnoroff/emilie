import type { SiteSettings } from "@/lib/sanity-content";

type NewsletterProps = {
  settings: SiteSettings;
};

export default function Newsletter({ settings }: NewsletterProps) {
  return (
    <section className="newsletter" id="newsletter">
      <div className="wrap">
        <div className="newsletter-copy">
          <h2>Newsletter</h2>
          <p>{settings.newsletterIntro}</p>
        </div>
        <form className="newsletter-form">
          <div className="newsletter-row">
            <input type="email" name="newsletter" placeholder="Your email" required />
            <button type="submit" className="btn">
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
