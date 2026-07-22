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
