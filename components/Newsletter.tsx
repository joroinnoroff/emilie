export default function Newsletter() {
  return (
    <section className="newsletter" id="newsletter">
      <div className="wrap">
        <div className="newsletter-copy">
          <h2>Newsletter</h2>
          <p>Subscribe for the latest exhibitions and creations.</p>
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
