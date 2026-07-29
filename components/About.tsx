import type { AboutContent } from "@/lib/sanity-content";

type AboutProps = {
  content: AboutContent;
};

function CvGroup({
  heading,
  items,
}: {
  heading: string;
  items?: { year?: string; title?: string; detail?: string }[];
}) {
  if (!items?.length) return null;

  return (
    <div className="cv-group">
      <h3>{heading}</h3>
      {items.map((item, i) => (
        <div className="cv-row" key={`${item.year}-${item.title}-${i}`}>
          <span className="yr">{item.year}</span>
          <span className="what">
            {item.title ? <b>{item.title}</b> : null}
            {item.title && item.detail ? " — " : null}
            {item.detail}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function About({ content }: AboutProps) {
  return (
    <section className="about" id="about">
      <div className="wrap">
        <div className="about-bio">
          <h2>About</h2>
          {content.bio?.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        <div className="about-cv">
          <CvGroup heading="Education" items={content.education} />
          <CvGroup heading="Selected Exhibitions" items={content.exhibitions} />
          <CvGroup heading="Awards" items={content.awards} />
        </div>
      </div>
    </section>
  );
}
