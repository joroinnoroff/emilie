export default function About() {
  return (
    <section className="about" id="about">
      <div className="wrap">
        <div className="about-bio">
          <h2>About</h2>
          <p>
            My work moves between still life and dreamscape — orchids, shells, birds, and everyday
            objects placed in soft, cloud-lit environments that feel just slightly out of time. Each
            painting begins as a study of a single object and grows into a quiet scene about memory,
            care, and the tension between abundance and absence.
          </p>
          <p>
            Working primarily in oil on canvas, I&apos;m drawn to coastal light, classical staging, and
            symbols borrowed from surrealism — thresholds, orbs, and the space between interior and
            horizon.
          </p>
        </div>
        <div className="about-cv">
          <div className="cv-group">
            <h3>Education</h3>
            <div className="cv-row">
              <span className="yr">2023–2025</span>
              <span className="what">
                <b>[MFA Fine Art]</b>, [Academy Name]
              </span>
            </div>
            <div className="cv-row">
              <span className="yr">2019–2022</span>
              <span className="what">
                <b>[BA Visual Art]</b>, [University Name]
              </span>
            </div>
          </div>
          <div className="cv-group">
            <h3>Selected Exhibitions</h3>
            <div className="cv-row">
              <span className="yr">2025</span>
              <span className="what">
                <b>[Exhibition Title]</b> — Solo, [Gallery], Oslo
              </span>
            </div>
            <div className="cv-row">
              <span className="yr">2024</span>
              <span className="what">
                <b>[Exhibition Title]</b> — Group, [Gallery], Bergen
              </span>
            </div>
            <div className="cv-row">
              <span className="yr">2023</span>
              <span className="what">
                <b>[Exhibition Title]</b> — Group, [Gallery], Copenhagen
              </span>
            </div>
          </div>
          <div className="cv-group">
            <h3>Awards</h3>
            <div className="cv-row">
              <span className="yr">2024</span>
              <span className="what">[Award Name], [Institution]</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
