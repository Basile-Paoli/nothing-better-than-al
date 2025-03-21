interface Config {
	databaseHost: string
}

const {DB_HOST: databaseHost} = process.env;

if (!databaseHost) {
	throw new Error('Missing database host');
}

export const config = {
	databaseHost,
} as const satisfies Config
