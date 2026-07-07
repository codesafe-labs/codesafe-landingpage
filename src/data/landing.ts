export type TerminalSegment = { t: string; c: string };

export const terminalLines: TerminalSegment[][] = [
	[
		{ t: '$ ', c: '#6B5F48' },
		{ t: 'npx codesafe scan .', c: '#F5E9CE' },
	],
	[{ t: '▸ SCANNING 214 FILES…', c: '#8F7F63' }],
	[{ t: '', c: '#8F7F63' }],
	[
		{
			t: '[HIGH] STRIPE SECRET EXPOSED ......... stripe.ts:4',
			c: '#E0705A',
		},
	],
	[
		{
			t: '[HIGH] /api/admin UNPROTECTED ........ route.ts:1',
			c: '#E0705A',
		},
	],
	[
		{
			t: '[MED ] SQL INJECTION RISK ............ queries.ts:31',
			c: '#D9B45B',
		},
	],
	[{ t: '──────────────────────────────────────', c: '#4A3E28' }],
	[
		{ t: 'SCAN COMPLETE · 3 FINDINGS · SCORE ', c: '#8F7F63' },
		{ t: 'C−', c: '#E0705A' },
	],
	[{ t: '', c: '#8F7F63' }],
	[
		{ t: '$ ', c: '#6B5F48' },
		{ t: 'npx codesafe fix --all', c: '#F5E9CE' },
	],
	[{ t: '▸ GENERATING MINIMAL DIFFS…', c: '#8F7F63' }],
	[{ t: '✓ FIXES RE-SCANNED, 0 FINDINGS REMAIN', c: '#9FBF6B' }],
	[{ t: '✓ BRANCH codesafe/fix-3-findings PUSHED', c: '#9FBF6B' }],
	[
		{ t: '✓ PR #12 OPENED ', c: '#9FBF6B' },
		{ t: '→ github.com/you/app/pull/12', c: '#8F7F63' },
	],
	[{ t: '', c: '#8F7F63' }],
	[{ t: 'READY TO SHIP.', c: '#F5A623' }],
];

export const checksData = [
	{
		owasp: 'OWASP A01',
		title: 'BROKEN ACCESS CONTROL',
		desc: 'API routes without auth checks, unprotected admin and debug endpoints, missing Supabase RLS, IDOR patterns like params.id straight into a query.',
	},
	{
		owasp: 'OWASP A02',
		title: 'SECRETS & CRYPTO FAILURES',
		desc: 'Hardcoded API keys (Stripe, AWS, service_role, JWT), committed .env files, secrets leaking into client components, weak password hashing.',
	},
	{
		owasp: 'OWASP A03',
		title: 'INJECTION',
		desc: 'SQL built from template literals or string concat, command injection via exec/spawn, dangerouslySetInnerHTML fed with variables.',
	},
	{
		owasp: 'OWASP A05',
		title: 'MISCONFIGURATION',
		desc: 'CORS set to *, missing security headers in next.config, debug mode left on, TLS verification disabled.',
	},
	{
		owasp: 'OWASP A07',
		title: 'AUTH FAILURES',
		desc: 'Tokens stored in localStorage, login routes without rate limiting, session handling an attacker can walk right through.',
	},
	{
		owasp: 'OWASP A08',
		title: 'CODE INTEGRITY',
		desc: 'eval() or Function() fed with external input: the shortcut AI codegen loves and attackers love more.',
	},
];

export const plansData = [
	{
		name: 'FREE (OPEN SOURCE)',
		price: '$0',
		per: 'forever',
		tagline: 'Every feature. Your server.',
		featured: false,
		cta: 'SELF-HOST WITH DOCKER',
		features: [
			'Apache 2.0',
			'Self-hosted',
			'BYOK (Claude/OpenAI)',
			'Unlimited repos & scans',
			'Fix PR generation',
			'All security rules',
			'Community updates',
		],
	},
	{
		name: 'FULL AUDIT',
		price: '$39',
		per: 'one-time',
		tagline: 'One repo, fully fixed.',
		featured: false,
		cta: 'AUDIT MY REPO',
		features: [
			'Deep audit of one repo',
			'Fix PRs for every finding',
			'Re-scan after merge',
			'No setup, done for you',
		],
	},
	{
		name: 'CLOUD',
		price: '$19',
		per: '/month',
		tagline: 'Same features, zero ops.',
		featured: true,
		cta: 'Join waitlist',
		features: [
			'GitHub App in 30 seconds',
			'No Docker, Redis, or Postgres',
			'Automatic updates',
			'Managed auto-PRs on every deploy',
		],
	},
	{
		name: 'TEAMS',
		price: '$99',
		per: '/month',
		tagline: 'For teams & agent fleets.',
		featured: false,
		cta: 'TALK TO US',
		features: [
			'Everything in Cloud',
			'Unlimited repos & seats',
			'Rule feed for self-hosters',
			'Priority support',
		],
	},
];

export const compareRows = [
	{ label: 'Apache 2.0', self: '✓', cloud: '✓' },
	{ label: 'All features', self: '✓', cloud: '✓' },
	{ label: 'BYOK (Claude/OpenAI)', self: '✓', cloud: 'optional, built-in available' },
	{ label: 'Updates', self: 'you run them', cloud: 'automatic' },
	{ label: 'GitHub App', self: 'set up yourself', cloud: 'included' },
	{ label: 'Auto-PRs', self: 'your own worker', cloud: 'managed' },
	{ label: 'Setup', self: 'Docker', cloud: '30 seconds' },
	{ label: 'Price', self: '$0', cloud: '$19/month' },
];

export const faqData = [
	{
		q: 'WILL THE FIX PR BREAK MY APP?',
		a: 'Fixes are minimal diffs: codesafe changes the fewest lines possible and never refactors around the fix. Every diff is re-scanned before the PR opens, and you review it like any other pull request. Nothing merges without you.',
	},
	{
		q: 'DO YOU STORE MY CODE?',
		a: 'The cloud clones your repo for the duration of the scan and deletes it right after. If even that is too much, run the open-source CLI locally, so your code never leaves your machine.',
	},
	{
		q: 'I KNOW NOTHING ABOUT SECURITY. IS THIS FOR ME?',
		a: 'Especially for you. Every finding and every fix comes with a plain-English explanation of what could have happened and what the change does. If you can merge a PR, you can use codesafe.',
	},
	{
		q: 'WHICH STACKS DOES IT SUPPORT?',
		a: 'v1 focuses on what AI codegen actually produces: Next.js and TypeScript apps with Supabase, Firebase, Stripe, and friends. More stacks follow based on what the community scans most.',
	},
	{
		q: 'HOW IS THIS DIFFERENT FROM SNYK OR A PENTEST REPORT?',
		a: "Those tell you what's wrong; codesafe ships the fix. The output is a merged pull request, not a PDF. And because the core is open source with zero runtime dependencies, you can verify exactly what it does.",
	},
];
