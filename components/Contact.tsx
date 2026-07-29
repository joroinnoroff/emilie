import type { SiteSettings } from "@/lib/sanity-content";

type ContactProps = {
  settings: SiteSettings;
};

export default function Contact({ settings }: ContactProps) {
  const email = settings.email || "post@emilie.no";
  const instagram = settings.instagram || "#";

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="contact-intro">
          <h2>Get in touch</h2>
          <p>{settings.contactIntro}</p>
          <div className="contact-links">
            <a href={`mailto:${email}`}>{email}</a>
            <a href={instagram} target="_blank" rel="noreferrer">
              Instagram →
            </a>
          </div>
        </div>
        <form className="contact-form">
          <input type="text" name="name" placeholder="Name" />
          <input type="email" name="email" placeholder="Email" />
          <textarea name="message" rows={4} placeholder="Message" />
          <button type="submit" className="btn">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
