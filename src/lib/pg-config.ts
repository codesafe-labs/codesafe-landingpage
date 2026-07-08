import type { ClientConfig } from 'pg';

/**
 * pg v8 treats sslmode=require as verify-full. Coolify Postgres often uses a
 * self-signed cert, so set DATABASE_SSL_REJECT_UNAUTHORIZED=false when needed.
 *
 * Prefer Coolify's internal DB URL (no SSL) when app and DB are on the same host.
 */
export function getPgConnectionConfig(
	connectionString: string | undefined,
): ClientConfig {
	if (!connectionString) {
		throw new Error('Database connection string is required');
	}

	const config: ClientConfig = { connectionString };

	if (process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'false') {
		config.ssl = { rejectUnauthorized: false };
	}

	return config;
}
