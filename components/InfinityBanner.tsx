const TEXT = "Exhibition at Galleri Tjøme 25. July — 08. August";

export default function InfinityBanner() {
  const items = Array.from({ length: 6 }, (_, i) => (
    <span key={i} className="infinity-banner-item">
      {TEXT}
      <span className="infinity-banner-sep" aria-hidden="true">
        ·
      </span>
    </span>
  ));

  return (
    <div className="infinity-banner" aria-label={TEXT}>
      <div className="infinity-banner-track">
        {items}
        {items}
      </div>
    </div>
  );
}
