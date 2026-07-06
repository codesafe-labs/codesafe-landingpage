# codesafe.sh Marketing Site — Design Spec

**Date:** 2026-07-06  
**Status:** Approved for implementation  
**Source mockups:** `public/landingpage-design/Codesafe Landing.dc.html`, `Blog.dc.html`, `Imprint.dc.html`

## Summary

Replace the Astro blog starter with a marketing site for codesafe.sh: landing page, changelog (at `/blog`), imprint, and privacy pages. Tailwind CSS for styling, React islands for interactivity, self-hosted fonts, PostgreSQL for form submissions only, deployed on Coolify via the Node standalone adapter. All site content lives in Git; the database stores runtime user submissions only.

## Goals

- Pixel-faithful implementation of the three design mockups
- GDPR-aligned: no third-party data services, no external font CDN, no runtime calls to SaaS APIs from server routes
- Coolify-ready deployment with documented local dev workflow
- Changelog entries editable as Markdown without touching production database

## Non-goals (v1)

- Resend or any external email/marketing integration
- Outbound transactional email (self-hosted SMTP deferred)
- Individual changelog post pages (timeline list is the full view)
- Third-party analytics
- CLI "Coming soon" hero mode (shipping Waitlist mode)

---

## Architecture

### Stack

| Layer | Choice |
|-------|--------|
| Framework | Astro 7 |
| Styling | Tailwind CSS (`@astrojs/tailwind`) |
| Interactivity | React islands (`@astrojs/react`) |
| Fonts | `@fontsource/*` packages (build-time bundle, zero runtime third-party requests) |
| Database | PostgreSQL 16 |
| DB access | Raw `pg` or lightweight Drizzle ORM (minimal schema) |
| Deployment | Coolify + `@astrojs/node` standalone |
| Content | Astro content collection (Markdown) |

### Routes

| Route | Page | Design source |
|-------|------|---------------|
| `/` | Landing | `Codesafe Landing.dc.html` |
| `/blog` | Changelog timeline | `Blog.dc.html` |
| `/imprint` | Imprint / Impressum | `Imprint.dc.html` |
| `/privacy` | Minimal privacy policy | Derived from Imprint privacy section |
| `POST /api/waitlist` | Waitlist signup | Server route |
| `POST /api/subscribe` | Changelog email signup | Server route |

### Removed from starter

- `src/pages/blog/[...slug].astro` and starter blog posts in `src/content/blog/`
- Starter `Header.astro`, `Footer.astro`, Atkinson font config
- Placeholder content on `index.astro`
- `about.astro` (unless repurposed later)
- RSS feed (`rss.xml.js`) — remove or repoint to changelog in a follow-up

### Output mode

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://codesafe.sh',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [tailwind(), react(), sitemap()],
});
```

Pre-render static pages where possible; API routes and any SSR needs handled by the Node server.

---

## Content vs database

Two independent data paths — this is the key to local/production workflow.

| Data | Storage | Sync mechanism |
|------|---------|----------------|
| Changelog entries | `src/content/changelog/*.md` | Git → push → Coolify rebuild |
| Landing static copy | `src/data/landing.ts` | Git |
| Legal / site config | `src/config/site.ts` | Git |
| DB schema | `db/migrations/*.sql` | Git → migrate on deploy |
| Waitlist emails | PostgreSQL `subscribers` table | **Not synced** — separate per environment |
| Changelog subscribe emails | Same table, `type` column | **Not synced** — separate per environment |

Adding a changelog entry: create/edit a `.md` file, preview with `astro dev`, commit, push. No database access required.

---

## Styling (Tailwind)

### Design tokens

```ts
// tailwind.config — extend theme
colors: {
  cream: '#FAFAF7',
  ink: '#18201B',
  muted: '#4C5751',
  subtle: '#78827B',
  faint: '#9AA39C',
  border: '#E7EAE4',
  green: {
    DEFAULT: '#10805A',
    dark: '#10664A',
    hover: '#0C6B4B',
    light: '#6FBF9A',
    pale: '#EEF6F0',
    border: '#CFE4D8',
  },
  terminal: {
    bg: '#101714',
    border: '#223028',
    bar: '#1C2620',
  },
  dark: {
    bg: '#14201A',
    card: '#182620',
    border: '#29382F',
    text: '#E8EFE9',
    muted: '#A9B8AE',
  },
  tag: {
    rules: { bg: '#FDF3EC', border: '#F0D9C8', text: '#B4552D' },
    cloud: { bg: '#EEF2FA', border: '#D3DEF0', text: '#2A5FB8' },
    fix: { bg: '#F6F8F4', border: '#E7EAE4', text: '#4C5751' },
  },
},
fontFamily: {
  display: ['Bricolage Grotesque', 'Helvetica', 'sans-serif'],
  sans: ['Instrument Sans', 'Helvetica', 'sans-serif'],
  mono: ['IBM Plex Mono', 'monospace'],
},
maxWidth: {
  landing: '1120px',
  changelog: '880px',
  imprint: '800px',
  faq: '760px',
},
```

### Fonts (self-hosted)

Install and import at build time:

- `@fontsource/bricolage-grotesque` — weights 400, 500, 600, 700, 800
- `@fontsource/instrument-sans` — weights 400, 500, 600
- `@fontsource/ibm-plex-mono` — weights 400, 500, 600

Import in `MarketingLayout.astro`. No Google Fonts `<link>` tags. Remove existing Atkinson `fontProviders.local()` config from `astro.config.mjs`.

### Animations

Define in `src/styles/global.css`:

- `cs-rise` — fade + translateY(14px), used on hero and tooltips
- `cs-blink` — cursor blink in terminal

### Responsive

Mockups are desktop-first. Breakpoints:

- Landing hero, PR showcase, free scan: single column below `lg`
- How-it-works, checks, pricing grids: 1 col mobile → 2 col `md` → 3–4 col `lg`
- Nav: hamburger or collapsed links below `md` (implement pragmatic mobile nav; mockup is desktop-only)
- Changelog timeline: stack date column above content below `md`

---

## File structure

```
src/
├── config/
│   └── site.ts                    # URLs, legal fields, feature flags
├── data/
│   ├── landing.ts                 # checks, plans, compareRows, faqData, terminal lines
│   └── tagStyles.ts               # changelog tag color maps
├── layouts/
│   └── MarketingLayout.astro      # fonts, bg, nav slot, footer
├── components/
│   ├── marketing/
│   │   ├── Nav.astro              # variants: landing | subpage
│   │   ├── Footer.astro
│   │   ├── sections/
│   │   │   ├── Hero.astro
│   │   │   ├── HowItWorks.astro
│   │   │   ├── FixPrShowcase.astro
│   │   │   ├── WhatItChecks.astro
│   │   │   ├── FreeScan.astro
│   │   │   ├── OpenSource.astro
│   │   │   ├── Pricing.astro
│   │   │   └── Waitlist.astro
│   │   └── changelog/
│   │       ├── ChangelogEntry.astro
│   │       └── SubscribeCTA.astro
│   └── islands/
│       ├── TerminalAnimation.tsx
│       ├── FaqAccordion.tsx
│       ├── WaitlistForm.tsx
│       └── SubscribeForm.tsx
├── content/
│   └── changelog/                 # *.md entries
├── content.config.ts              # changelog collection schema
├── pages/
│   ├── index.astro
│   ├── blog/
│   │   └── index.astro            # changelog list
│   ├── imprint.astro
│   ├── privacy.astro
│   └── api/
│       ├── waitlist.ts
│       └── subscribe.ts
├── lib/
│   └── db.ts                      # pool, query helpers
└── styles/
    └── global.css

db/
└── migrations/
    └── 001_subscribers.sql

docker-compose.yml                 # local Postgres only
.env.example
```

Keep `public/landingpage-design/` as design reference; do not delete.

---

## Site config

`src/config/site.ts` — single source for values used across pages:

```ts
export const site = {
  name: 'codesafe.sh',
  title: 'codesafe.sh · Ship without fear',
  url: 'https://codesafe.sh',
  github: 'https://github.com/codesafe-sh/codesafe',  // update when known
  docs: 'https://docs.codesafe.sh',                     // update when known
  legal: {
    operator: '[Your full name / company name]',
    address: '[Street and number], [ZIP] [City], Austria',
    email: 'contact@codesafe.sh',
    vatId: '[ATU… if applicable]',
    authority: '[Magistrat / Bezirkshauptmannschaft]',
    businessPurpose: 'IT services / software development',
  },
};
```

Imprint and Privacy pages import from here. Placeholders remain until real values are provided.

---

## Changelog content collection

Replace the `blog` collection with `changelog`:

```ts
// content.config.ts
const changelog = defineCollection({
  loader: glob({ base: './src/content/changelog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    version: z.string(),
    tag: z.enum(['Release', 'Rules', 'Cloud', 'Fix']),
    description: z.string(),
    items: z.array(z.string()),
  }),
});
```

Seed five entries from the mockup (`postsData` in `Blog.dc.html`). `/blog/index.astro` loads collection, sorts by date descending, renders timeline. Tag colors from `tagStyles.ts`. No `[...slug]` route.

---

## Landing page sections

Port content verbatim from `Codesafe Landing.dc.html`:

1. **Nav** — logo, anchor links (How it works, What it checks, Pricing, FAQ), GitHub star button, Free scan CTA
2. **Hero** — badges, h1, copy, **Waitlist mode CTA** (direct "Join the waitlist" → `#waitlist`), trust bullets, terminal animation island
3. **How it works** — 3-step cards
4. **Fix PR showcase** — copy + static PR card mockup
5. **What it checks** — 6 OWASP cards from `checksData`
6. **Free scan** — copy + static score card (A−)
7. **Open source** — dark section, 3 trust cards
8. **Pricing** — 4 plan cards, comparison table, "No artificial limitations" block
9. **FAQ** — React accordion island
10. **Waitlist** — React form island
11. **Footer** — links to GitHub, Docs, Pricing, Imprint, Privacy

Static marketing data lives in `src/data/landing.ts` (checks, plans, compareRows, faqData, terminal line definitions).

### Hero CTA mode

Ship **Waitlist mode** only for v1: hero shows "Join the waitlist" linking to `#waitlist`. No "Coming soon" tooltip on a fake CLI button. The terminal animation and Free scan section retain the `$ npx codesafe scan` visual but scroll-to-waitlist on click if not yet available.

---

## React islands

| Component | Mount | Behavior |
|-----------|-------|----------|
| `TerminalAnimation` | `client:visible` | Typewriter reveal 420ms/line; click replays; blinking cursor |
| `FaqAccordion` | `client:visible` | Single-open accordion; +/− toggle |
| `WaitlistForm` | `client:load` | Validate email → POST `/api/waitlist` → success/error UI |
| `SubscribeForm` | `client:load` | Same → POST `/api/subscribe` |

Use `client:visible` for below-fold islands to reduce initial JS.

---

## Database

### Schema

```sql
-- db/migrations/001_subscribers.sql
CREATE TABLE IF NOT EXISTS subscribers (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL,
  type       TEXT NOT NULL CHECK (type IN ('waitlist', 'changelog')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (email, type)
);

CREATE INDEX idx_subscribers_type ON subscribers (type);
```

No IP address stored in v1. Optional `ip_hash` column can be added later if rate limiting needs it.

### API routes

Both routes:

1. Parse JSON body `{ email: string }`
2. Validate format (basic `@` check + max length)
3. `INSERT … ON CONFLICT (email, type) DO NOTHING`
4. Return `{ ok: true }` on success **and** on duplicate (idempotent UX — user sees subscribed either way)
5. Return `{ error: string }` with 400 on invalid email, 500 on DB failure

No outbound HTTP calls. No Resend. No webhooks.

### GDPR notes for Privacy page

- Emails collected for stated purpose only (waitlist invite / release notes)
- Stored on EU-hosted infrastructure operated by codesafe
- No sharing with third parties
- Retention: until unsubscribe or request for deletion (mechanism deferred; document intent)
- Repos scanned in cloud product deleted after scan (product copy, not site DB)

---

## Imprint & Privacy pages

### Imprint (`/imprint`)

Match `Imprint.dc.html` layout: heading, legal intro, detail card (grid label/value pairs from `site.legal`), Privacy summary section, Liability section. Subpage nav with logo + back link.

### Privacy (`/privacy`)

Minimal Imprint-style page (no separate mockup):

- Heading + GDPR intro
- What data the **website** collects (email from forms)
- Where stored (self-hosted PostgreSQL, EU)
- Purpose and retention
- Rights (access, deletion — contact email from `site.legal.email`)
- No third-party processors for form data
- Link back to Imprint

---

## Coolify deployment

### package.json scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "start": "HOST=0.0.0.0 node ./dist/server/entry.mjs",
    "db:migrate": "node scripts/migrate.mjs",
    "db:export-subscribers": "node scripts/export-subscribers.mjs"
  }
}
```

### Coolify settings

| Setting | Value |
|---------|-------|
| Is it a static site? | **No** |
| Build command | `npm run build` (Nixpacks default) |
| Start command | `npm start` or `node ./dist/server/entry.mjs` |
| Exposed port | `4321` |
| Environment | `DATABASE_URL`, `HOST=0.0.0.0`, `PORT=4321` |

Run migrations before or on server start (e.g. Coolify pre-deploy command: `npm run db:migrate`).

### PostgreSQL on Coolify

Provision PostgreSQL as a Coolify database service. Link `DATABASE_URL` to the Astro application. Use separate databases (or separate instances) for production vs staging if staging exists.

---

## Local development

### docker-compose.yml

```yaml
services:
  db:
    image: postgres:16-alpine
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: codesafe
      POSTGRES_PASSWORD: codesafe
      POSTGRES_DB: codesafe_dev
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Workflow

```bash
docker compose up -d db
npm run db:migrate
cp .env.example .env.local   # DATABASE_URL=postgresql://codesafe:codesafe@localhost:5432/codesafe_dev
astro dev
```

- Edit `src/content/changelog/*.md` → instant preview, no DB
- Submit test forms → local Postgres only
- Never point `.env.local` at production `DATABASE_URL`

### Export production subscribers (optional)

```bash
DATABASE_URL=<prod-readonly-url> npm run db:export-subscribers > subscribers.csv
```

One-way export for operator use; not part of normal content workflow.

---

## Security (v1)

- `RESEND_API_KEY` and similar **not used**
- API keys only in server env vars (`DATABASE_URL`)
- Basic email validation; consider rate limiting middleware in follow-up
- Optional: reject startup if dev mode detects production DB hostname

---

## Testing checklist

- [ ] All four routes render matching mockup layout
- [ ] Changelog entries sort correctly; tags styled per type
- [ ] Terminal animates and replays on click
- [ ] FAQ accordion opens one at a time
- [ ] Waitlist/subscribe forms persist to Postgres locally
- [ ] Duplicate email handled gracefully
- [ ] No network requests to Google Fonts or third-party APIs on page load
- [ ] `astro build` succeeds; `npm start` serves production build
- [ ] Migrations run cleanly on empty database
- [ ] Mobile layouts usable at 375px width

---

## Open items (operator-provided later)

- Real legal fields in `site.config.ts`
- Final GitHub and docs URLs
- Production `DATABASE_URL` in Coolify
- Custom domain SSL on Coolify
