import Link from "next/link"

interface WorkCardProps {
  href: string
  image: string
  title: string
}

export default function WorkCard({ href, image, title }: WorkCardProps) {
  return (
    <article className="min-w-0">
      <Link href={href} className="block">
        <div className="relative mb-3.5 aspect-[4/5] w-full overflow-hidden bg-[#f0f0f0]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
        <h2 className="text-[1.0625rem] tracking-tight text-ink">{title}</h2>
      </Link>
    </article>
  )
}
