import type { Project } from "@/lib/projects"

const filterOptions = [
  { value: "all", label: "All" },
  { label: "Size", value: "size" },
  { label: "Type", value: "type" },
  { label: "Price", value: "price" },
  { label: "Year", value: "year" },
  { label: "Series", value: "series" },
]

export default function ProductFilter(_props: { products: Project[] }) {
  return (
    <div className="sticky top-[var(--header-height)] z-[150] -mx-12 px-12 bg-white py-3">
      <div className="filterComp flex gap-2 items-center">
        {filterOptions.map((option) => (
          <button key={option.value} type="button">
            {option.label}
          </button>
        ))}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="#888888"
            d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"
          />
        </svg>
      </div>
    </div>
  )
}
