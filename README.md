# Emilie — Next.js site

Next.js 15 (App Router) + TypeScript rewrite of the portfolio/shop mockup.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Structure

- `app/page.tsx` — home (hero, selected works preview, about, shop, contact)
- `app/projects/page.tsx` — all projects, filterable by series
- `app/projects/[id]/page.tsx` — project case-study page (description, specs, prev/next)
- `app/shop/[id]/page.tsx` — product page (price, Add to Cart placeholder for future Stripe/Vipps)
- `lib/projects.ts` — **single source of truth for all painting data**. Edit titles, prices,
  descriptions, series, and status here — every page updates automatically.
- `components/` — Header, Hero, WorksSection, ProjectsGrid, WorkCard (hover tilt/glare effect),
  Shop, About, Contact, Footer
- `public/` — images and hero.mp4

## Notes for next steps

- `Add to Cart` on `/shop/[id]` is a disabled placeholder. Wire it up to Stripe/Vipps checkout
  when ready — the price and product data are already structured in `lib/projects.ts`.
- Replace the bracketed placeholders in `components/About.tsx` (education, exhibitions, awards)
  with real details.
- Swap the Instagram link placeholder in `components/Contact.tsx`.
