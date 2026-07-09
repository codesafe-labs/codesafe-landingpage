# Landing page vs. positioning discussion — review

Context: reviewed the current landing page (`src/pages/index.astro` and its section
components/`src/data/landing.ts`) against the CodeSafe positioning worked out in ideation
(self-host + BYOK vs. cloud-only competitors, fix-PR-not-report, vuln classes specific to
AI-scaffolded stacks, first target = solo indie hacker / vibe coder).

**Overall: the page already fits the positioning well.** No rewrite needed — just targeted
tweaks below.

## What's already aligned (keep as-is)

- Hero + Open Source section make self-hosted Apache 2.0 + **BYOK (Claude/OpenAI)** the
  headline trust story — exactly the differentiator vs. Snyk/Socket/GitGuardian/Semgrep
  (all cloud-first-or-cloud-only) identified in ideation.
- "The product is the PR" / "not a report, a fix" framing matches the original pitch
  (scan → auto-PR with the fix) precisely.
- "What It Checks" ties vuln categories to AI-codegen-specific patterns (hardcoded
  Supabase/Stripe/AWS keys, missing RLS, permissive CORS, `dangerouslySetInnerHTML`) —
  this is the sharper wedge (platform-specific footguns, not generic OWASP) that came out
  of the tarpit discussion.
- FAQ pre-empts "why not just use Snyk / a pentest" — directly answers the tarpit
  objection instead of ignoring it.
- "If you can merge a PR, you can use codesafe" tone matches the non-expert-friendly
  angle needed for a solo/indie first audience.
- Pricing ladder (free self-hosted → $39 one-time full audit → $19/mo cloud → $99/mo
  teams) gives a low-friction entry point for non-developer vibe coders (the one-time
  audit) as well as devs who self-host.

## Gaps to fix

### 1. Named AI tools skew toward power-users, not vibe coders
Copy currently names **Claude, Cursor, Lovable**. Cursor is a power-user IDE/copilot, not
really "vibe coding" in the sense of "AI built my whole app." Given the chosen first
audience (solo indie hacker / vibe coder), the more relevant tools to name are
**Bolt.new, v0, and Replit Agent** — that's where non/semi-technical builders actually
are. Lovable is correctly kept (it's the most "AI builds the whole app" tool of the
three currently named).

**Fix:** In Hero subhead, "What It Checks" subtext, and FAQ stack-support answer, update
the named tool list to lead with Bolt/Lovable/v0/Replit, with Claude/Cursor as secondary
mentions for the power-user segment.

### 2. No founder/origin story anywhere on the page
The strongest hook to come out of ideation was personal, not product: "I vibe code a lot
and built this so I could sleep at night." None of that appears on the page — it reads as
a faceless product. For an indie-hacker-first audience (and a build-in-public GTM plan),
an authentic founder note outperforms corporate copy — people follow and trust a person
solving their own problem before they trust a company.

**Fix:** Add a short (2-3 sentence) founder note — could live near the Open Source
section or as a standalone small block before the Waitlist CTA. Something in the register
of: "I vibe code my own projects and got tired of not knowing what the AI actually wrote
into my codebase. codesafe is the tool I built so I could ship without checking every
line myself." Keep it short — this is a credibility anchor, not an About page.

### 3. No "why now" urgency framing
Ideation surfaced a strong, current "why now": the exponential rise in supply-chain
attacks tied to agentic coding (hallucinated/squatted package names, AI-scaffolded apps
shipping with default-open infra config). The page conveys urgency through tone ("SHIP
WITHOUT FEAR", "YOUR APP IS LIVE. IS IT SAFE?") but doesn't use this concrete trend as
evidence.

**Fix (optional, lower priority):** A single stat or line near the Hero or "What It
Checks" section referencing the rise in AI-codegen-related supply-chain/security
incidents would convert the emotional hook into an evidence-backed one. Only add this if
a credible, citable stat is found — don't fabricate a number.

### 4. Competitive note (not a copy change, just awareness)
`Rodrigotari1/supashield` is a live open-source CLI scanning specifically for Supabase RLS
misconfigurations — a narrower slice of what CodeSafe's "What It Checks" section already
covers (RLS is one of six categories, alongside secrets, injection, misconfig, auth,
code integrity). Current breadth is a real differentiator vs. that tool; no copy change
needed, just worth knowing it exists when writing future comparison content.

## Suggested priority order
1. Swap named AI tools (Bolt/v0/Replit alongside Lovable) — quick copy edit, directly
   fixes an audience-mismatch.
2. Add founder note — highest leverage for trust with the chosen first audience, ties
   directly into the build-in-public plan.
3. "Why now" stat — nice-to-have, only if a real citable number turns up during the
   manual-scan research.
