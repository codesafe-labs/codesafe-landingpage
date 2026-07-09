# Manual scan candidates — vibe-coded repos

Research notes for validating CodeSafe's core vuln-hunting wedge before building the CLI.
Goal: manually check these for exposed keys, permissive RLS policies, open debug routes,
missing auth checks — the failure modes CodeSafe is meant to catch.

## Known competitor — check first

- **[Rodrigotari1/supashield](https://github.com/Rodrigotari1/supashield)** —
  "Automated Supabase RLS security testing CLI - catch vulnerabilities before production."
  Direct competitor in the Supabase RLS niche. Review what it covers/misses before finalizing
  the wedge (self-host + BYOK + broader vuln classes + LLM-based reasoning vs. rule checks are
  the likely differentiators).

## Real apps to manually scan

From the `GPT-Engineer-App` org — this is Lovable's default export destination, and Lovable
auto-provisions Supabase, so these are good bets for exposed keys / permissive RLS:

- https://github.com/GPT-Engineer-App/voice-agent-dashboard
- https://github.com/GPT-Engineer-App/ai-sales-insightful-assist
- https://github.com/GPT-Engineer-App/vessel-dock-master
- https://github.com/GPT-Engineer-App/webapp-builder
- https://github.com/GPT-Engineer-App/fusion-clothing-brand
- https://github.com/GPT-Engineer-App/music-importer-downloader

Full org listing (browse for more candidates):
https://github.com/orgs/GPT-Engineer-App/repositories

Bolt.new-built apps (topic page was mostly meta-tools/frameworks; these two looked like
real generated output):

- https://github.com/aaronksaunders/bolt-expo-payload-main-video — full-stack Expo + Payload CMS
- https://github.com/Cynone-com/AI-Powered-No-Code-Website-Builder-SaaS-Platform

## Higher-signal move: GitHub code search (requires login, my tools can't auth)

GitHub's code search API needs authentication, so this has to be done by hand, logged into
github.com. Search for exact strings vibe-coded apps tend to leak — higher hit rate than
browsing repos one by one:

- `SUPABASE_SERVICE_ROLE_KEY` committed directly in `.tsx`/`.ts` client files (not `.env`)
- `"USING (true)"` or `eq.true` in RLS policy SQL files — classic "AI made the policy
  permissive to make it work" bug
- `sk-` or `sk-proj-` OpenAI key prefixes in frontend code

## Next step

Spend ~1 day manually scanning the above. If real hits show up at a meaningful rate:
that's the first "look what I found" blog post *and* validation the vuln classes are real,
before spending on hardware (GMKtec EVO-X2) or writing the CLI.
