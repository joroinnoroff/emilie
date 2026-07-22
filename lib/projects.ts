export type Status = "Available" | "Sold";

export interface Project {
  id: string;
  title: string;
  series: string;
  year: string;
  image: string;
  medium: string;
  size: string;
  price: string;
  status: Status;
  forSale: boolean;
  description: string;
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
    status: "Available",
    forSale: true,
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
    status: "Available",
    forSale: true,
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
    status: "Available",
    forSale: true,
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
    forSale: false,
    description:
      "An open red door frames a pair of spotted orchids against rolling farmland — the domestic and the wild sharing the same threshold.",
  },
  {
    id: "shell-sanctuary",
    title: "Shell Sanctuary",
    series: "Coastal Thresholds",
    year: "2024",
    image: "/image2.jpeg",
    medium: "Oil on canvas",
    size: "51 × 64 cm",
    price: "€1,200",
    status: "Available",
    forSale: true,
    description:
      "A murex shell stands like a monument beneath a vaulted stone archway, an orchid and a braided cord left as offerings at its base.",
  },
  {
    id: "knight-at-sunset",
    title: "Knight at Sunset",
    series: "Coastal Thresholds",
    year: "2024",
    image: "/image3.jpeg",
    medium: "Oil on canvas",
    size: "50 × 64 cm",
    price: "€1,600",
    status: "Available",
    forSale: true,
    description:
      "A chess knight, cast in stone, watches the tide from a darkening shoreline — a single piece left mid-game against the horizon.",
  },
  {
    id: "stork-and-shell",
    title: "Stork & Shell",
    series: "Coastal Thresholds",
    year: "2023",
    image: "/image8.jpeg",
    medium: "Oil on canvas",
    size: "60 × 48 cm",
    price: "—",
    status: "Sold",
    forSale: false,
    description:
      "A stork considers a conch shell balanced with an apple on a plinth, the sky behind them collapsing into dusk.",
  },
  {
    id: "diner-steps",
    title: "Diner Steps",
    series: "Coastal Thresholds",
    year: "2023",
    image: "/image13.jpeg",
    medium: "Oil on canvas",
    size: "60 × 48 cm",
    price: "€1,100",
    status: "Available",
    forSale: true,
    description:
      "A crumpled note reading “Diner” rests at the foot of stone steps, a swallow and a nautilus shell keeping watch beneath a full moon.",
  },
  {
    id: "weeping-fountain",
    title: "The Weeping Fountain",
    series: "Quiet Interiors",
    year: "2025",
    image: "/image14.jpeg",
    medium: "Oil on canvas",
    size: "60 × 48 cm",
    price: "—",
    status: "Sold",
    forSale: false,
    description:
      "A fountain with eyes instead of a face weeps quietly onto sand, while a chickadee perched on stone regards it without concern.",
  },
  {
    id: "rose-and-portrait",
    title: "Rose & Portrait",
    series: "Quiet Interiors",
    year: "2023",
    image: "/image9.jpeg",
    medium: "Oil on canvas",
    size: "51 × 64 cm",
    price: "€1,150",
    status: "Available",
    forSale: true,
    description:
      "A woman's face, cut cleanly in profile against an open sky, faces a single rose losing its petals to the wind.",
  },
  {
    id: "driftwood-and-feather",
    title: "Driftwood & Feather",
    series: "Quiet Interiors",
    year: "2023",
    image: "/image12.jpeg",
    medium: "Oil on canvas",
    size: "48 × 64 cm",
    price: "€890",
    status: "Available",
    forSale: true,
    description:
      "A pale orchid rests between driftwood and a single feather, staged against a sky the color of an ending day.",
  },
];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function getSeries(): string[] {
  return Array.from(new Set(PROJECTS.map((p) => p.series)));
}

export function getForSale(): Project[] {
  return PROJECTS.filter((p) => p.forSale);
}

export function getSiblings(id: string): { prev: Project; next: Project } {
  const idx = PROJECTS.findIndex((p) => p.id === id);
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  return { prev, next };
}
