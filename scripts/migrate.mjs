import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { loadEnv } from './load-env.mjs';

loadEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '..', 'db', 'migrations');

const connectionString =
	process.env.DATABASE_MIGRATE_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
	console.error('DATABASE_MIGRATE_URL or DATABASE_URL is required');
	process.exit(1);
}

const client = new pg.Client({ connectionString });

async function migrate() {
	await client.connect();

	const files = fs
		.readdirSync(migrationsDir)
		.filter((f) => f.endsWith('.sql'))
		.sort();

	for (const file of files) {
		const version = file.replace(/\.sql$/, '');
		const { rows: tableExists } = await client.query(
			`SELECT EXISTS (
				SELECT FROM information_schema.tables
				WHERE table_schema = 'public' AND table_name = 'schema_migrations'
			) AS exists`,
		);

		let applied = false;
		if (tableExists[0].exists) {
			const { rows } = await client.query(
				'SELECT 1 FROM schema_migrations WHERE version = $1',
				[version],
			);
			applied = rows.length > 0;
		}

		if (applied) {
			console.log(`skip  ${file}`);
			continue;
		}

		const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

		try {
			await client.query('BEGIN');
			await client.query(sql);
			await client.query(
				'INSERT INTO schema_migrations (version) VALUES ($1)',
				[version],
			);
			await client.query('COMMIT');
			console.log(`apply ${file}`);
		} catch (err) {
			await client.query('ROLLBACK');
			console.error(`failed ${file}:`, err);
			process.exit(1);
		}
	}

	await client.end();
	console.log('migrations complete');
}

migrate().catch((err) => {
	console.error(err);
	process.exit(1);
});
