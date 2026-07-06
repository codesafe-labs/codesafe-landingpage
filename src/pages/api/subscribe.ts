import type { APIRoute } from 'astro';
import {
	checkPoolAvailable,
	insertSubscriber,
	isValidEmail,
} from '../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	let body: { email?: string };
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const email = body.email;
	if (typeof email !== 'string' || !isValidEmail(email)) {
		return new Response(JSON.stringify({ error: 'Invalid email address' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	if (!(await checkPoolAvailable())) {
		return new Response(JSON.stringify({ error: 'Service unavailable' }), {
			status: 503,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		await insertSubscriber(email, 'changelog');
		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
