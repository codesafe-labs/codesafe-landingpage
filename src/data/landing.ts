export type TerminalSegment = { t: string; c: string };

export const terminalLines: TerminalSegment[][] = [
	[
		{ t: '$ ', c: '#5E6E64' },
		{ t: 'npx codesafe scan .', c: '#E8EFE9' },
	],
	[{ t: '▸ scanning 214 files…', c: '#8A968E' }],
	[{ t: '', c: '#8A968E' }],
	[
		{ t: '✗ HIGH  ', c: '#E4785A' },
		{ t: 'hardcoded Stripe secret', c: '#E8EFE9' },
		{ t: '      src/lib/stripe.ts:4', c: '#5E6E64' },
	],
	[
		{ t: '✗ HIGH  ', c: '#E4785A' },
		{ t: '/api/admin has no auth check', c: '#E8EFE9' },
		{ t: ' app/api/admin/route.ts', c: '#5E6E64' },
	],
	[
		{ t: '✗ MED   ', c: '#E0B45C' },
		{ t: 'SQL built from template string', c: '#E8EFE9' },
		{ t: ' src/db/queries.ts:31', c: '#5E6E64' },
	],
	[{ t: '', c: '#8A968E' }],
	[
		{ t: '✓ scan complete', c: '#6FBF9A' },
		{ t: ': 3 findings · score ', c: '#8A968E' },
		{ t: 'C−', c: '#E4785A' },
	],
	[{ t: '', c: '#8A968E' }],
	[
		{ t: '$ ', c: '#5E6E64' },
		{ t: 'npx codesafe fix --all', c: '#E8EFE9' },
	],
	[{ t: '▸ generating minimal diffs…', c: '#8A968E' }],
	[{ t: '✓ fixes re-scanned, 0 findings remain', c: '#6FBF9A' }],
	[
		{ t: '✓ branch ', c: '#6FBF9A' },
		{ t: 'codesafe/fix-3-findings', c: '#E8EFE9' },
		{ t: ' pushed', c: '#6FBF9A' },
	],
	[
		{ t: '✓ PR #12 opened', c: '#6FBF9A' },
		{ t: ' → github.com/you/app/pull/12', c: '#8A968E' },
	],
	[{ t: '', c: '#8A968E' }],
	[{ t: '  Review it. Merge it. Ship without fear.', c: '#6FBF9A' }],
];

export const checksData = [
	{
		owasp: 'OWASP A01',
		title: 'Broken access control',
		desc: 'API routes without auth checks, unprotected admin and debug endpoints, missing Supabase RLS, IDOR patterns like params.id straight into a query.',
	},
	{
		owasp: 'OWASP A02',
		title: 'Secrets & crypto failures',
		desc: 'Hardcoded API keys (Stripe, AWS, service_role, JWT), committed .env files, secrets leaking into client components, weak password hashing.',
	},
	{
		owasp: 'OWASP A03',
		title: 'Injection',
		desc: 'SQL built from template literals or string concat, command injection via exec/spawn, dangerouslySetInnerHTML fed with variables.',
	},
	{
		owasp: 'OWASP A05',
		title: 'Misconfiguration',
		desc: 'CORS set to *, missing security headers in next.config, debug mode left on, TLS verification disabled.',
	},
	{
		owasp: 'OWASP A07',
		title: 'Auth failures',
		desc: 'Tokens stored in localStorage, login routes without rate limiting, session handling an attacker can walk right through.',
	},
	{
		owasp: 'OWASP A08',
		title: 'Code integrity',
		desc: 'eval() or Function() fed with external input: the shortcut AI codegen loves and attackers love more.',
	},
];

export const plansData = [
	{
		name: 'Free (Open Source)',
		price: '$0',
		per: 'forever',
		tagline: 'Every feature. Your server.',
		featured: false,
		cta: 'Self-host with Docker',
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
		name: 'Full Audit',
		price: '$39',
		per: 'one-time',
		tagline: 'One repo, fully fixed.',
		featured: false,
		cta: 'Audit my repo',
		features: [
			'Deep audit of one repo',
			'Fix PRs for every finding',
			'Re-scan after merge',
			'No setup, done for you',
		],
	},
	{
		name: 'Cloud',
		price: '$19',
		per: '/month',
		tagline: 'Same features, zero ops.',
		featured: true,
		cta: 'Join the waitlist',
		features: [
			'GitHub App in 30 seconds',
			'No Docker, Redis, or Postgres',
			'Automatic updates',
			'Managed auto-PRs on every deploy',
		],
	},
	{
		name: 'Teams',
		price: '$99',
		per: '/month',
		tagline: 'For teams & agent fleets.',
		featured: false,
		cta: 'Talk to us',
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
		q: 'Will the fix PR break my app?',
		a: 'Fixes are minimal diffs: codesafe changes the fewest lines possible and never refactors around the fix. Every diff is re-scanned before the PR opens, and you review it like any other pull request. Nothing merges without you.',
	},
	{
		q: 'Do you store my code?',
		a: 'The cloud clones your repo for the duration of the scan and deletes it right after. If even that is too much, run the open-source CLI locally, so your code never leaves your machine.',
	},
	{
		q: 'I know nothing about security. Is this for me?',
		a: 'Especially for you. Every finding and every fix comes with a plain-English explanation of what could have happened and what the change does. If you can merge a PR, you can use codesafe.',
	},
	{
		q: 'Which stacks does it support?',
		a: 'v1 focuses on what AI codegen actually produces: Next.js and TypeScript apps with Supabase, Firebase, Stripe, and friends. More stacks follow based on what the community scans most.',
	},
	{
		q: 'How is this different from Snyk or a pentest report?',
		a: "Those tell you what's wrong; codesafe ships the fix. The output is a merged pull request, not a PDF. And because the core is open source with zero runtime dependencies, you can verify exactly what it does.",
	},
];
