export type Status = "Available" | "Sold"

export type PrintEdition = {
  size: string
  stock: number
  priceNok?: number
  priceEur?: number
}

export interface Project {
  id: string
  sanityId?: string
  title: string
  series: string
  year: string
  image: string
  medium: string
  size: string
  stock: number
  priceNok?: number
  priceEur?: number
  priceUsd?: number
  /** Locale-agnostic fallback label — prefer formatMoney / useLocale().money */
  price: string
  status: Status
  forSale: boolean
  printAvailable: boolean
  prints: PrintEdition[]
  description: string
}

export const PROJECTS: Project[] = [
  {
    id: "orchid-dominoes",
    title: "Orchid & Dominoes",
    series: "Orchid Studies",
    year: "2025",
    image: "/image0.jpeg",
    medium: "Oil on canvas",
    size: "60 × 50 cm",
    price: "€1,450",
    priceEur: 1450,
    priceNok: 16000,
    status: "Available",
    stock: 1,
    forSale: true,
    printAvailable: true,
    prints: [
      { size: "30 × 40 cm", stock: 20, priceEur: 120, priceNok: 1400 },
      { size: "50 × 70 cm", stock: 10, priceEur: 220, priceNok: 2500 },
    ],
    description:
      "A cattleya orchid rises from a stacked field of dominoes, chance and bloom balanced on the same tide-smoothed platform. Beneath it, a cracked-open chestnut waits for the game to be decided.",
  },
  {
    id: "orchid-ear",
    title: "Orchid & Ear",
    series: "Orchid Studies",
    year: "2024",
    image: "/image4.jpeg",
    medium: "Oil on canvas",
    size: "48 × 64 cm",
    price: "€980",
    priceEur: 980,
    priceNok: 11000,
    status: "Available",
    stock: 1,
    forSale: true,
    printAvailable: false,
    prints: [],
    description:
      "A cyclamen leans into an oversized ear across an impossibly flat lawn — a study in listening, and in what a flower might be trying to say.",
  },
  {
    id: "orchid-swan",
    title: "Orchid Swan",
    series: "Orchid Studies",
    year: "2023",
    image: "/image11.jpeg",
    medium: "Oil on canvas",
    size: "51 × 64 cm",
    price: "€1,050",
    priceEur: 1050,
    priceNok: 12000,
    status: "Available",
    stock: 1,
    forSale: true,
    printAvailable: true,
    prints: [{ size: "40 × 50 cm", stock: 15, priceEur: 150, priceNok: 1700 }],
    description:
      "A swan's neck dissolves into a white phalaenopsis bloom, drifting across a mountain lake caught between stillness and metamorphosis.",
  },
  {
    id: "red-threshold",
    title: "Red Threshold",
    series: "Orchid Studies",
    year: "2024",
    image: "/image7.jpeg",
    medium: "Oil on canvas",
    size: "51 × 64 cm",
    price: "—",
    status: "Sold",
    stock: 0,
    forSale: false,
    printAvailable: false,
    prints: [],
    description:
      "A deep red interior opens onto coastal light — the threshold between private heat and public weather.",
  },
]

export function getSeries(): string[] {
  return Array.from(new Set(PROJECTS.map((p) => p.series)))
}

export function getShopProjects(): Project[] {
  return PROJECTS.filter((p) => p.forSale)
}
