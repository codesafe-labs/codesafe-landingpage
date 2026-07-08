import pg from 'pg';
import { getPgConnectionConfig } from './pg-config';

const pool = new pg.Pool({
	...getPgConnectionConfig(process.env.DATABASE_URL),
	max: Number(process.env.DB_POOL_MAX ?? 10),
	idleTimeoutMillis: 30_000,
	connectionTimeoutMillis: 5_000,
});

export async function insertSubscriber(
	email: string,
	type: 'waitlist' | 'changelog',
) {
	const normalized = email.trim().toLowerCase();
	await pool.query(
		`INSERT INTO subscribers (email, type)
     VALUES ($1, $2)
     ON CONFLICT (email, type) DO NOTHING`,
		[normalized, type],
	);
}

export function isValidEmail(email: string): boolean {
	const normalized = email.trim().toLowerCase();
	if (normalized.length === 0 || normalized.length > 320) return false;
	return normalized.includes('@');
}

export async function checkPoolAvailable(): Promise<boolean> {
	try {
		await pool.query('SELECT 1');
		return true;
	} catch {
		return false;
	}
}
