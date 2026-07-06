import pg from 'pg';
import { loadEnv } from './load-env.mjs';

loadEnv();

const connectionString = process.env.DATABASE_READONLY_URL;

if (!connectionString) {
	console.error('DATABASE_READONLY_URL is required');
	process.exit(1);
}

const type = process.argv[2] ?? 'waitlist';
const client = new pg.Client({ connectionString });

async function exportSubscribers() {
	await client.connect();

	console.log('id,email,type,created_at');

	let lastId = 0;

	while (true) {
		const { rows } = await client.query(
			`SELECT id, email, type, created_at
       FROM subscribers
       WHERE type = $1 AND id > $2
       ORDER BY id
       LIMIT 1000`,
			[type, lastId],
		);

		if (rows.length === 0) break;

		for (const row of rows) {
			console.log(
				`${row.id},${row.email},${row.type},${row.created_at.toISOString()}`,
			);
			lastId = row.id;
		}
	}

	await client.end();
}

exportSubscribers().catch((err) => {
	console.error(err);
	process.exit(1);
});
