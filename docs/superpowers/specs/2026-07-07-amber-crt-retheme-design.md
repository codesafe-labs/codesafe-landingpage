# codesafe.sh Amber CRT Retheme — Design Spec

**Date:** 2026-07-07  
**Status:** Approved for implementation  
**Supersedes:** Visual/styling sections of `2026-07-06-codesafe-landing-design.md` (cream/green v1)  
**Preserves:** Architecture, routes, database, API, deployment, and content workflow from the 2026-07-06 spec  
**Source mockup:** `public/Codesafe Landing v2 (Amber CRT).dc.html`

## Summary

Retheme the full codesafe.sh marketing site to the **Amber CRT** visual identity: a dark terminal aesthetic grounded in security audit tooling — amber phosphor accents, IBM Plex Mono throughout, CRT scanlines on the landing page, dashed borders, and uppercase display typography. Blog, Imprint, and Privacy inherit the same token palette and chrome but use **sentence case** for long-form prose.

Architecture, PostgreSQL schema, API routes, content collections, and Coolify deployment are **unchanged** from the 2026-07-06 spec.

## Goals

- Pixel-faithful Amber CRT landing page from the v2 mockup
- Full-site visual consistency (`/`, `/blog`, `/imprint`, `/privacy`)
- Self-hosted fonts via `@fontsource` (no CDN requests)
- Hybrid CTA model: terminal is decorative; all actionable buttons say "Join waitlist"
- Compliance with [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) and frontend-design principles during implementation
- GDPR-aligned: no third-party data services, no external font CDN

## Non-goals

- New mockups for Blog/Imprint/Privacy (derive styling from tokens)
- Database schema or migration changes
- Resend, analytics, individual changelog post pages
- CLI shipping (waitlist-only for cloud features)
- Resend or outbound email integration

---

## Design identity (frontend-design)

### Subject grounding

codesafe is a **security audit tool for AI-generated code**. The visual language should feel like sitting in front of a CRT running a live security scan — not a generic SaaS landing page. Materials: terminal output, OWASP rule IDs, pull-request diffs, scan scores, keyboard shortcuts (`[F1]` nav).

**Audience:** Indie hackers and small teams shipping AI-built apps who can merge a PR but don't know OWASP by heart.

**Page job:** Convince them codesafe finds real holes and ships fixes as PRs — then capture their email for cloud/waitlist access.

### Signature element

The **animated terminal audit** is the one memorable thing. Everything else stays disciplined around it: scanlines on landing only, amber glow on the terminal card, blinking cursor. Do not add scattered motion elsewhere — one orchestrated moment beats decoration.

### Typography as personality

IBM Plex Mono is the **only** typeface. On the landing page, uppercase treatment on headings, labels, nav, and short CTAs encodes the terminal vernacular. On secondary pages and in long-form content (FAQ answers, legal prose, changelog bodies), **sentence case** preserves readability. This split is intentional — not a compromise.

The `[01]` / `[02]` / `[03]` step markers are justified: How-it-works is a real ordered process where sequence carries meaning.

### Copy principles

Apply during implementation (mockup copy is the source of truth for marketing sections, with these rules):

| Context | Case & voice |
|---------|--------------|
| Landing headings, nav, section labels, short CTAs | Uppercase (mockup) |
| FAQ questions (landing) | Uppercase per mockup (short display labels) |
| FAQ answers, changelog bodies, legal text | Sentence case |
| Buttons | Active voice, specific label: **"Join waitlist"** not "Submit" or "$ npx codesafe scan" |
| Errors | State problem + fix: "Enter a valid email address" not "Invalid input" |
| Success states | Confirm outcome: "You're on the list. We'll be in touch." |
| Placeholders | End with `…`: `you@yourapp.com` → `you@yourapp.com…` |
| Ellipsis | Use `…` not `...` |
| Quotes in prose | Curly `"` `"` where appropriate |

Brand name `codesafe`, code tokens (`npx codesafe scan`), and identifiers: wrap with `translate="no"`.

---

## Visual system

### Color tokens

Replace the cream/green palette in `src/styles/global.css` `@theme`:

| Token | Hex | Usage |
|-------|-----|-------|
| `crt-bg` | `#0E0B07` | Page background |
| `crt-bg-alt` | `#100D08` | Scanline stripe |
| `crt-surface` | `#0A0805` | Cards, terminal, inputs |
| `crt-surface-accent` | `#171105` | Featured cards, open-source band |
| `crt-amber` | `#F5A623` | Primary accent, links, CTAs |
| `crt-amber-hover` | `#FFBE4A` | Button hover |
| `crt-cream` | `#F5E9CE` | Headings, emphasis |
| `crt-body` | `#B3A180` | Body text |
| `crt-muted` | `#8F7F63` | Secondary text, nav links |
| `crt-faint` | `#6B5F48` | Tertiary, footnotes |
| `crt-border` | `#2E2618` | Dashed section dividers |
| `crt-border-strong` | `#4A3E28` | Card borders, inputs |
| `crt-green` | `#9FBF6B` | Success, diff additions, checkmarks |
| `crt-red` | `#E0705A` | Errors, terminal `[HIGH]` findings |
| `crt-yellow` | `#D9B45B` | Warnings, `[MED]` findings |
| `crt-diff-bg` | `#131A0C` | PR diff highlight rows |

Remove all cream/green token definitions after migration. Update `tagStyles.ts` for changelog tags to CRT-appropriate dark-surface variants.

### Typography & fonts

**Strategy:** `@fontsource/ibm-plex-mono` only (weights 400, 500, 600, 700). Remove `@fontsource/bricolage-grotesque` and `@fontsource/instrument-sans` from `MarketingLayout.astro` and `package.json`.

```css
--font-mono: 'IBM Plex Mono', monospace;
/* body defaults to font-mono everywhere */
```

`@fontsource` bundles fonts at build time — zero runtime third-party font requests. `font-display: swap` is handled by the package.

### CRT effects

| Effect | Scope | Implementation |
|--------|-------|----------------|
| Scanlines | Landing page only | `.crt-scanlines` utility with `repeating-linear-gradient` |
| `cs-blink` / `cs-rise` | Landing hero + terminal | Existing keyframes in `global.css`; honor `prefers-reduced-motion` |
| Dashed dividers | All pages | `border-dashed border-crt-border` |
| Terminal glow | Terminal + PR cards | `box-shadow: inset` amber glow from mockup |

### Dark theme baseline

On `<html>` for all marketing pages:

```css
color-scheme: dark;
```

Set explicit `background-color` and `color` on native `<input>` elements (Windows dark mode). `<meta name="theme-color" content="#0E0B07">` in `MarketingLayout.astro`.

### Layout

| Token | Value |
|-------|-------|
| `--max-width-landing` | `1160px` (was 1120) |
| `--max-width-changelog` | `880px` (unchanged) |
| `--max-width-imprint` | `800px` (unchanged) |
| `--max-width-faq` | `780px` (was 760) |
| Section padding | `72px 32px` |
| Nav padding | `20px 32px` |

### CSS utilities

Add to `global.css`:

```css
.crt-scanlines { /* repeating-linear-gradient per mockup */ }
.crt-section-label { /* 11.5px, crt-amber, tracking 0.14em */ }
.crt-card { /* border crt-border-strong, bg crt-surface */ }
.crt-divider { /* border-top dashed crt-border */ }
```

---

## Implementation approach

**Recommended: Token swap + per-component restyle (Approach A).**

Replace design tokens in `global.css`, restyle existing Astro components in place. Add 3–4 shared utility classes for repeated CRT patterns. Do not create a parallel component tree or extract a full primitive layer — the existing section-based structure already mirrors the mockup.

---

## Landing page (`/`)

Content source: v2 mockup script block and HTML. Update `src/data/landing.ts` with mockup terminal lines, checks, plans, compare rows, and FAQ data (uppercase titles in data; FAQ answers remain sentence case in source strings).

### Nav

- Logo: `<span style="color: crt-amber">▮</span> CODESAFE.SH`
- Anchor links: `[F1] HOW`, `[F2] CHECKS`, `[F3] PRICING`, `[F4] FAQ`, `[F5] CHANGELOG` → `/blog`
- GitHub: `★ STAR ON GITHUB` (outlined)
- Primary nav CTA: **`JOIN WAITLIST ▸`** → scroll to `#waitlist` (not "Run free scan")
- Dashed bottom border

### Hero

- Eyebrow: `═══ OPEN SOURCE · APACHE 2.0 · MADE IN THE EU ═══`
- H1: `SHIP / WITHOUT / FEAR_` (amber on `FEAR_`)
- Primary CTA: **`JOIN WAITLIST ▸`**
- Secondary: **`SEE A FIX PR ▸`** → `#pr`
- Trust line: `FREE SCAN & SCORE ── ZERO RUNTIME DEPENDENCIES ── BUILT IN AUSTRIA`

### Terminal animation (decorative)

Restyle `TerminalAnimation.tsx`:

- Header: `SECURITY AUDIT — my-vibe-app` / `codesafe v0.4.0` (remove macOS window dots)
- Segment colors from mockup `fullLines` in v2 HTML
- Uppercase `[HIGH]` / `[MED]` finding format
- Click replays animation only — **does not** scroll to waitlist
- Hint: `[ CLICK TERMINAL TO REPLAY ]`
- `role="button"` + keyboard handler (Enter/Space) — already present; add `aria-label="Replay terminal animation"`

### Sections

| Section | Component | Notes |
|---------|-----------|-------|
| How it works | `HowItWorks.astro` | `[01]`–`[03]` labels; step 3 amber border highlight |
| Fix PR showcase | `FixPrShowcase.astro` | Static PR card; green diff rows |
| What it checks | `WhatItChecks.astro` | 6 OWASP cards |
| Free scan | `FreeScan.astro` | Score card `A−`; CTA = **Join waitlist** |
| Open source | `OpenSource.astro` | Amber top border band, `#171105` bg |
| Pricing | `Pricing.astro` | 4 plans; Cloud featured; comparison table |
| FAQ | `Faq.astro` + `FaqAccordion.tsx` | Sentence case answers |
| Waitlist | `Waitlist.astro` + `WaitlistForm.tsx` | `YOUR APP IS LIVE. / IS IT SAFE?` |
| Footer | `Footer.astro` | Uppercase link row |

### CTA rules (hybrid model)

| Element | Behavior |
|---------|----------|
| Hero / Free scan / Pricing Cloud / Nav buttons | **"Join waitlist"** → `#waitlist` or POST form |
| Terminal animation | Decorative replay only |
| `$ npx codesafe scan` text | Appears **inside terminal output only**, not on clickable CTAs |
| Secondary links | "See a fix PR", GitHub star — real navigation |

---

## Secondary pages

### `/blog` (Changelog)

- Shared CRT nav/footer; **no scanlines**
- Label: `═══ CHANGELOG ═══` (uppercase)
- H1: "What's new in codesafe" — sentence case, `text-wrap: balance`
- Timeline: dashed top borders; tag pills from updated `tagStyles.ts`
- Bullet markers: `crt-green` `›`
- Subscribe CTA: dark card, amber border; `SubscribeForm` restyled

### `/imprint` and `/privacy`

- Shared nav/footer; no scanlines
- Section labels uppercase; headings and legal prose sentence case
- Definition-list grid: mono values in `crt-muted`
- Links: `crt-amber` / hover `crt-cream`

---

## React islands

| Component | Mount | Changes for retheme |
|-----------|-------|---------------------|
| `TerminalAnimation` | `client:visible` | CRT chrome, mockup colors, `aria-label` |
| `FaqAccordion` | `client:visible` | Dark cards, amber `+`/`−`; add `aria-expanded` |
| `WaitlistForm` | `client:load` | CRT inputs; accessibility fixes (see below) |
| `SubscribeForm` | `client:load` | Same as waitlist form |

---

## Web Interface Guidelines compliance

Implementation **must** satisfy these rules from the [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines). Known gaps in current islands are called out for fix during retheme.

### Accessibility

- [ ] Skip link to main content in `MarketingLayout.astro`: visually hidden by default, visible on `:focus-visible` (e.g. absolute positioned, `crt-amber` outline)
- [ ] `<main id="main">` wraps page content
- [ ] Heading hierarchy: one `<h1>` per page, sections use `<h2>`, subsections `<h3>`
- [ ] `scroll-margin-top` on `#how`, `#checks`, `#pricing`, `#faq`, `#waitlist`, `#pr` anchor targets (offset for sticky nav if added later)
- [ ] Terminal replay: `aria-label="Replay terminal animation"`; decorative `▮` has `aria-hidden="true"`
- [ ] FAQ accordion: `aria-expanded` on trigger buttons; optional `aria-controls` + `id` on panels
- [ ] Form success/error: `aria-live="polite"` region for async feedback
- [ ] Nav/footer links: use `<a href>` not `<button onClick>` for navigation
- [ ] Pricing CTAs that scroll to waitlist: use `<a href="#waitlist">` not buttons with JS scroll

### Focus states

- [ ] Replace `outline-none` on inputs with `focus-visible:outline-2 focus-visible:outline-crt-amber focus-visible:outline-offset-2`
- [ ] All buttons/links: visible `:focus-visible` ring (amber on dark surfaces)
- [ ] Never remove outline without a focus-visible replacement

### Forms (`WaitlistForm`, `SubscribeForm`)

- [ ] Visible `<label>` for email (visually hidden OK with `sr-only`, not omitted)
- [ ] `name="email"`, `type="email"`, `autoComplete="email"`, `inputMode="email"`
- [ ] `spellCheck={false}` on email inputs
- [ ] Placeholder: `you@yourapp.com…`
- [ ] Submit button stays enabled until request starts; show "Joining…" / "Subscribing…" during fetch
- [ ] Inline error next to field (fix current absolute-positioned error in `WaitlistForm`)
- [ ] Focus first invalid field on submit failure
- [ ] Do not block paste

### Animation

- [ ] Wrap `cs-rise`, `cs-blink`, terminal typewriter in `@media (prefers-reduced-motion: reduce)` — disable or instant-show content
- [ ] Animate `transform` and `opacity` only
- [ ] No `transition: all` — list properties explicitly (e.g. `transition-colors`, `transition-opacity`)
- [ ] Terminal interval (420ms) skipped entirely when reduced motion preferred

### Typography

- [ ] `text-wrap: balance` on landing h1 and section h2s
- [ ] `text-pretty` on body paragraphs
- [ ] `font-variant-numeric: tabular-nums` on pricing comparison table and score card stats
- [ ] Use `…` not `...` in loading states

### Touch & interaction

- [ ] `touch-action: manipulation` on interactive elements
- [ ] Hover states on all buttons/links (amber hover per mockup)
- [ ] No `user-scalable=no` or `maximum-scale=1`

### Content handling

- [ ] Flex children with truncatable text: `min-w-0`
- [ ] Long email addresses in success state: `break-all` or `truncate`

### Performance

- [ ] Keep `client:visible` for below-fold islands
- [ ] No layout reads in render loops in terminal animation

---

## Architecture (unchanged)

Carry forward from `2026-07-06-codesafe-landing-design.md`:

| Layer | Choice |
|-------|--------|
| Framework | Astro 7 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Interactivity | React islands (`@astrojs/react`) |
| Fonts | `@fontsource/ibm-plex-mono` (400–700) |
| Database | PostgreSQL 16 |
| DB access | Raw `pg` singleton pool |
| Deployment | Coolify + `@astrojs/node` standalone |
| Content | Astro content collection (Markdown changelog) |

### Routes

| Route | Page |
|-------|------|
| `/` | Landing (Amber CRT) |
| `/blog` | Changelog |
| `/imprint` | Imprint |
| `/privacy` | Privacy |
| `POST /api/waitlist` | Waitlist signup |
| `POST /api/subscribe` | Changelog subscribe |

### `MarketingLayout.astro` changes

```astro
<html lang="en">
  <head>
    <meta name="theme-color" content="#0E0B07" />
    <!-- IBM Plex Mono @fontsource imports only -->
  </head>
  <body class="min-h-screen bg-crt-bg font-mono text-crt-body antialiased">
    <!-- Skip link: visually hidden, visible on focus-visible -->
    <slot name="nav" />
    <main id="main">
      <slot />
    </main>
    <slot name="footer" />
  </body>
</html>
```

Apply `color-scheme: dark` on `html` via `global.css`, not Tailwind's `dark` class.

Landing page wrapper adds `crt-scanlines` class. Secondary pages omit it.

---

## Database (unchanged)

No schema changes. Full specification in `2026-07-06-codesafe-landing-design.md`:

- `subscribers` table with `bigint identity` PK, lowercase email constraint, composite index `(type, created_at DESC)`
- Insert-only `codesafe_app` role; readonly export role
- `INSERT … ON CONFLICT (email, type) DO NOTHING`
- Singleton pool with `DB_POOL_MAX`
- Cursor-paginated export script

Supabase Postgres best practices applied: lowercase identifiers, atomic upserts, composite indexes aligned to query patterns, least-privilege roles, connection pooling.

---

## File change map

| File | Action |
|------|--------|
| `src/styles/global.css` | Replace tokens; add CRT utilities; reduced-motion; dark theme |
| `src/layouts/MarketingLayout.astro` | Font imports, body classes, skip link, theme-color |
| `src/data/landing.ts` | Mockup terminal lines, uppercase section titles where applicable |
| `src/data/tagStyles.ts` | CRT tag colors |
| `src/components/marketing/*.astro` | Restyle all section components |
| `src/components/islands/*.tsx` | Restyle + accessibility fixes |
| `src/pages/blog/index.astro` | CRT styling, sentence case prose |
| `src/pages/imprint.astro` | CRT styling |
| `src/pages/privacy.astro` | CRT styling |
| `package.json` | Remove bricolage-grotesque, instrument-sans deps |

No changes to: `db/migrations/*`, `src/pages/api/*`, `src/lib/db.ts`, `scripts/migrate.mjs`, `astro.config.mjs`.

---

## Testing checklist

### Visual

- [ ] Landing matches v2 mockup at 1280px and 375px
- [ ] Blog, imprint, privacy share CRT chrome; sentence case on long prose
- [ ] No cream/green tokens remain in components
- [ ] Scanlines on landing only

### CTA & copy

- [ ] All actionable buttons say "Join waitlist" (not `$ npx codesafe scan`)
- [ ] Terminal replays on click; does not navigate
- [ ] Placeholders use `…`

### Accessibility (Web Interface Guidelines)

- [ ] Skip link visible on focus
- [ ] All form inputs have labels
- [ ] Focus-visible rings on interactive elements
- [ ] FAQ accordion exposes `aria-expanded`
- [ ] Success/error messages in `aria-live="polite"` region
- [ ] Animations respect `prefers-reduced-motion`
- [ ] No `outline-none` without replacement

### Functional (unchanged)

- [ ] Waitlist/subscribe POST to Postgres
- [ ] Duplicate email handled idempotently
- [ ] Changelog sorts by date; tags styled
- [ ] No Google Fonts or third-party API requests on load
- [ ] `astro build` + `npm start` succeed

---

## Open items (operator-provided later)

- Real legal fields in `site.config.ts`
- Final GitHub and docs URLs
- Production DB URLs and role passwords in Coolify
- Custom domain SSL on Coolify
