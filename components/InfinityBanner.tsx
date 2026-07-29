type InfinityBannerProps = {
  text: string;
};

export default function InfinityBanner({ text }: InfinityBannerProps) {
  const items = Array.from({ length: 6 }, (_, i) => (
    <span key={i} className="infinity-banner-item">
      {text}
      <span className="infinity-banner-sep" aria-hidden="true">
        ·
      </span>
    </span>
  ));

  return (
    <div className="infinity-banner" aria-label={text}>
      <div className="infinity-banner-track">
        {items}
        {items}
      </div>
    </div>
  );
}
