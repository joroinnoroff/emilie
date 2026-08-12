import Link from "next/link"
import NaturalAspectImage from "./NaturalAspectImage"

interface WorkCardProps {
  href: string
  image: string
  title: string
}

export default function WorkCard({ href, image, title }: WorkCardProps) {
  return (
    <article className="min-w-0">
      <Link href={href} className="block">
        <NaturalAspectImage src={image} alt={title} className="mb-3.5 bg-[#f0f0f0]" />
        <h2 className="text-center text-[1.0625rem] tracking-tight text-ink">
          {title}
        </h2>
      </Link>
    </article>
  )
}
