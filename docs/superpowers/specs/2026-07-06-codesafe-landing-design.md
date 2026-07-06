# codesafe.sh Marketing Site — Design Spec

**Date:** 2026-07-06  
**Status:** Approved for implementation (database section revised per Postgres best practices)  
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
| DB access | Raw `pg` with singleton connection pool (minimal schema; no ORM) |
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
│   └── db.ts                      # singleton pool, insert helpers
└── styles/
    └── global.css

db/
└── migrations/
    ├── 001_schema_migrations.sql  # migration tracking table
    ├── 002_subscribers.sql        # table, indexes, constraints
    └── 003_roles.sql              # least-privilege roles + grants

scripts/
├── migrate.mjs                    # applies pending migrations
└── export-subscribers.mjs         # cursor-paginated CSV export (readonly role)

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

Design follows [Supabase Postgres best practices](https://github.com/supabase/agent-skills): lowercase snake_case identifiers, `bigint identity` PKs, `timestamptz`, atomic upserts, composite indexes aligned to query patterns, least-privilege roles, and a singleton app connection pool.

### Design review (vs original spec)

| Area | Original | Updated | Rule |
|------|----------|---------|------|
| Primary key | `SERIAL` | `bigint GENERATED ALWAYS AS IDENTITY` | `schema-primary-keys` |
| Email uniqueness | raw `TEXT`, app-only validation | lowercase enforced at DB + app | `schema-data-types`, `schema-constraints` |
| Indexes | single-column `(type)` | composite `(type, created_at DESC)` | `query-composite-indexes` |
| Redundant index | `(type)` alone | removed — covered by composite | `query-missing-indexes` |
| Upsert | `ON CONFLICT DO NOTHING` | unchanged (correct) | `data-upsert` |
| Connections | unspecified pool | singleton `pg.Pool`, capped size | `conn-pooling`, `conn-limits` |
| DB user | single `codesafe` superuser | separate migrate / app / readonly roles | `security-privileges` |
| Migrations | one file, `IF NOT EXISTS` only | tracked in `schema_migrations`, named constraints | `schema-constraints` |
| Export | full-table SELECT | cursor pagination by `id` | `data-pagination` |
| Transactions | implicit | single-statement INSERT only | `lock-short-transactions` |

RLS, partitioning, and partial indexes are intentionally omitted — the app connects with a single service role and the table is tiny (form submissions only).

### Schema

All identifiers are unquoted lowercase snake_case (`schema-lowercase-identifiers`).

```sql
-- db/migrations/001_schema_migrations.sql
CREATE TABLE IF NOT EXISTS schema_migrations (
  version     text PRIMARY KEY,
  applied_at  timestamptz NOT NULL DEFAULT now()
);
```

```sql
-- db/migrations/002_subscribers.sql
CREATE TABLE IF NOT EXISTS subscribers (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       text NOT NULL,
  type        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT subscribers_email_lowercase_check
    CHECK (email = lower(email)),

  CONSTRAINT subscribers_type_check
    CHECK (type IN ('waitlist', 'changelog')),

  CONSTRAINT subscribers_email_type_key
    UNIQUE (email, type)
);

-- Export queries: WHERE type = $1 ORDER BY created_at DESC
-- Equality column first, range/sort column second (query-composite-indexes)
CREATE INDEX IF NOT EXISTS idx_subscribers_type_created_at
  ON subscribers (type, created_at DESC);
```

No IP address stored in v1. Optional `ip_hash text` column can be added in a follow-up migration if rate limiting needs it.

**Email normalization:** API routes trim whitespace and lowercase before INSERT. The `subscribers_email_lowercase_check` constraint is a safety net so `user@x.com` and `User@X.com` cannot coexist.

**Why not `citext`?** Avoids an extension dependency on Coolify-hosted Postgres. Lowercase normalization achieves the same uniqueness guarantee with zero extra setup.

### Roles and privileges

Migrations run as the database owner (Coolify default superuser or `codesafe` owner). The running app and export script use dedicated roles with minimal grants (`security-privileges`).

```sql
-- db/migrations/003_roles.sql
-- Revoke broad defaults from PUBLIC
REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;

-- App role: INSERT-only on subscribers (no SELECT/UPDATE/DELETE)
CREATE ROLE codesafe_app NOLOGIN;
GRANT USAGE ON SCHEMA public TO codesafe_app;
GRANT INSERT ON subscribers TO codesafe_app;
GRANT USAGE, SELECT ON SEQUENCE subscribers_id_seq TO codesafe_app;

-- Readonly role: SELECT for operator export script
CREATE ROLE codesafe_readonly NOLOGIN;
GRANT USAGE ON SCHEMA public TO codesafe_readonly;
GRANT SELECT ON subscribers TO codesafe_readonly;

-- Login roles (passwords set via Coolify / docker env, not in Git)
-- CREATE ROLE codesafe_app_login LOGIN PASSWORD '…' IN ROLE codesafe_app;
-- CREATE ROLE codesafe_readonly_login LOGIN PASSWORD '…' IN ROLE codesafe_readonly;
```

Local dev may use the `codesafe` superuser from docker-compose for simplicity; production must use `codesafe_app_login` for the app and `codesafe_readonly_login` for exports.

### Connection pool (`src/lib/db.ts`)

Postgres connections are expensive (1–3 MB RAM each). The app must reuse a **singleton pool**, never open a connection per request (`conn-pooling`).

```ts
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DB_POOL_MAX ?? 10),       // conn-limits: cap per Node instance
  idleTimeoutMillis: 30_000,                          // conn-idle-timeout
  connectionTimeoutMillis: 5_000,
  // pg uses unnamed prepared statements by default — safe with direct connections.
  // If routing through PgBouncer transaction mode later, set prepareThreshold: 0
  // (conn-prepared-statements).
});

export async function insertSubscriber(email: string, type: 'waitlist' | 'changelog') {
  const normalized = email.trim().toLowerCase();
  await pool.query(
    `INSERT INTO subscribers (email, type)
     VALUES ($1, $2)
     ON CONFLICT (email, type) DO NOTHING`,
    [normalized, type],
  );
}
```

**Scaling note:** If Coolify runs multiple app replicas, set `DB_POOL_MAX` so `(replicas × DB_POOL_MAX) < postgres max_connections − reserved`. Consider PgBouncer in transaction mode if connection count becomes a bottleneck.

### Migration runner (`scripts/migrate.mjs`)

- Connects with `DATABASE_MIGRATE_URL` (owner) or falls back to `DATABASE_URL` in local dev.
- Reads `db/migrations/*.sql` in lexical order.
- Skips files whose basename already exists in `schema_migrations`.
- Runs each pending file in a transaction; records version on success.
- Uses named constraints in SQL so re-runs fail safely at the constraint level rather than silently duplicating objects.

### API routes

Both `POST /api/waitlist` and `POST /api/subscribe`:

1. Parse JSON body `{ email: string }`
2. Validate in app: trim, lowercase, basic `@` check, max length 320 chars
3. Single-statement INSERT via `insertSubscriber()` — no explicit transaction wrapper, no external calls inside a transaction (`lock-short-transactions`)
4. `INSERT … ON CONFLICT (email, type) DO NOTHING` — atomic, no SELECT-then-INSERT race (`data-upsert`)
5. Return `{ ok: true }` on success **and** on duplicate (idempotent UX)
6. Return `{ error: string }` with 400 on invalid email, 503 if pool unavailable, 500 on unexpected DB error

No outbound HTTP calls. No Resend. No webhooks.

### Export script (`scripts/export-subscribers.mjs`)

Operator-only CSV export using `DATABASE_READONLY_URL`:

```sql
-- Cursor pagination (data-pagination) — O(1) per batch regardless of table size
SELECT id, email, type, created_at
FROM subscribers
WHERE type = $1 AND id > $2
ORDER BY id
LIMIT 1000;
```

Loop with `$2 = last_id` until no rows. Never use `OFFSET` for large exports.

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
| Environment | `DATABASE_URL` (app role), `DATABASE_MIGRATE_URL` (owner, migrations only), `DATABASE_READONLY_URL` (export only), `DB_POOL_MAX=10`, `HOST=0.0.0.0`, `PORT=4321` |

Run migrations before server start (Coolify pre-deploy command: `npm run db:migrate`). Migrations require owner credentials (`DATABASE_MIGRATE_URL`); the running app uses `DATABASE_URL` with the insert-only role.

### PostgreSQL on Coolify

Provision PostgreSQL 16 as a Coolify database service. Create login roles per migration `003_roles.sql` and wire URLs:

| Variable | Role | Used by |
|----------|------|---------|
| `DATABASE_MIGRATE_URL` | owner / migrate | pre-deploy `db:migrate` only |
| `DATABASE_URL` | `codesafe_app_login` | running Astro server |
| `DATABASE_READONLY_URL` | `codesafe_readonly_login` | manual export script |

Use separate databases (or instances) for production vs staging. Enable SSL in connection strings for production (`?sslmode=require`).

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

### `.env.example`

```bash
# Local dev — docker-compose superuser is fine for all three
DATABASE_URL=postgresql://codesafe:codesafe@localhost:5432/codesafe_dev
DATABASE_MIGRATE_URL=postgresql://codesafe:codesafe@localhost:5432/codesafe_dev
DATABASE_READONLY_URL=postgresql://codesafe:codesafe@localhost:5432/codesafe_dev

# Pool size per Node process (default 10)
DB_POOL_MAX=10
```

### Workflow

```bash
docker compose up -d db
npm run db:migrate
cp .env.example .env.local
astro dev
```

- Edit `src/content/changelog/*.md` → instant preview, no DB
- Submit test forms → local Postgres only
- Never point `.env.local` at production `DATABASE_URL`

### Export production subscribers (optional)

```bash
DATABASE_READONLY_URL=<prod-readonly-url> npm run db:export-subscribers > subscribers.csv
```

Uses cursor pagination and the readonly role. One-way export for operator use; not part of normal content workflow.

---

## Security (v1)

- `RESEND_API_KEY` and similar **not used**
- App connects with insert-only `codesafe_app` role — SQL injection cannot read or delete subscriber data
- Migration and export credentials stored separately; never baked into the app runtime env on production
- Basic email validation; rate limiting middleware deferred
- Reject startup in dev if `DATABASE_URL` hostname matches production allowlist (optional guard)
- Production Postgres connections use `sslmode=require`

---

## Testing checklist

- [ ] All four routes render matching mockup layout
- [ ] Changelog entries sort correctly; tags styled per type
- [ ] Terminal animates and replays on click
- [ ] FAQ accordion opens one at a time
- [ ] Waitlist/subscribe forms persist to Postgres locally
- [ ] Duplicate email handled gracefully (including case variants: `User@X.com` vs `user@x.com`)
- [ ] App role cannot SELECT from `subscribers` (verify with `\dp` or permission test)
- [ ] Migrations are idempotent — re-running `db:migrate` skips applied versions
- [ ] Export script paginates with cursor, not OFFSET
- [ ] No network requests to Google Fonts or third-party APIs on page load
- [ ] `astro build` succeeds; `npm start` serves production build
- [ ] Migrations run cleanly on empty database
- [ ] Mobile layouts usable at 375px width

---

## Open items (operator-provided later)

- Real legal fields in `site.config.ts`
- Final GitHub and docs URLs
- Production DB URLs and role passwords in Coolify
- Custom domain SSL on Coolify
