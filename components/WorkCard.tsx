"use client";

import Link from "next/link";

interface WorkCardProps {
  href: string;
  image: string;
  title: string;
  onHoverImage?: (src: string | null) => void;
}

// Deliberately minimal: no tilt, no glare, no scale. Just the image,
// the title, and the shared colour-wash effect on the section behind it.
export default function WorkCard({ href, image, title, onHoverImage }: WorkCardProps) {
  return (
    <div className="work-card">
      <Link
        href={href}
        onMouseEnter={() => onHoverImage?.(image)}
        onMouseLeave={() => onHoverImage?.(null)}
      >
        <div className="work-thumb">
          <img src={image} alt={title} />
        </div>
        <div className="work-title">{title}</div>
      </Link>
    </div>
  );
}
