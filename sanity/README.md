# Sanity CMS

Admin dashboard is embedded at `/studio`.

## Categories

| Document | Purpose |
|---|---|
| **Works** | Paintings — powers Works, project pages, and Shop when `forSale` is on |
| **Series** | Groups works (Orchid Studies, Coastal Thresholds, …) |
| **Site Settings** | Hero copy, exhibition banner, contact email/Instagram, newsletter intro |
| **About** | Bio + education / exhibitions / awards CV |

## Setup

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage)
2. Copy `.env.example` → `.env.local` and set:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=yourProjectId
NEXT_PUBLIC_SANITY_DATASET=production
```

3. In [manage.sanity.io](https://www.sanity.io/manage) → Project → API → CORS origins, add:
   - `http://localhost:3000`
   - your production domain

4. Run `npm run dev` and open [http://localhost:3000/studio](http://localhost:3000/studio)

5. Sign in, then create:
   - **Site Settings** (singleton in the sidebar)
   - **About** (singleton)
   - **Series** + **Works** as needed

The public site fetches:

- **Site Settings / About** → hero, contact, newsletter, about
- **Works** → homepage carousel (`featured`), all projects, detail pages
- **Works with `forSale`** → shop grid + product pages

Local `lib/projects.ts` is only used as a fallback if Sanity is empty or unreachable.
