export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="contact-intro">
          <h2>Get in touch</h2>
          <p>
            Available for private inquiries, commissions, and exhibition collaborations. Based in
            Norway, shipping internationally.
          </p>
          <div className="contact-links">
            <a href="mailto:post@emilie.no">post@emilie.no</a>
            <a href="#">Instagram →</a>
          </div>
        </div>

        <div className="contact-forms">
          <form className="contact-form">
            <h3>Send a message</h3>
            <input type="text" name="name" placeholder="Name" />
            <input type="email" name="email" placeholder="Email" />
            <textarea name="message" rows={4} placeholder="Message" />
            <button type="submit" className="btn">
              Send message
            </button>
          </form>

          <form className="newsletter-form">
            <h3>Newsletter</h3>
            <p>
              Subscribe for the latest exhibitions and creations.
            </p>
            <div className="newsletter-row">
              <input type="email" name="newsletter" placeholder="Your email" required />
              <button type="submit" className="btn">
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
