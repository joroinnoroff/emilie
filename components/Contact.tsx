export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div>
          <h2>Get in touch</h2>
          <p>
            Available for private inquiries, commissions, and exhibition collaborations. Based in
            Norway, shipping internationally.
          </p>
          <div className="contact-links">
            <a href="#">Instagram →</a>
          </div>
        </div>
        <form>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <textarea rows={4} placeholder="Message" />
          <button type="submit" className="btn" style={{ alignSelf: "flex-start" }}>
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
