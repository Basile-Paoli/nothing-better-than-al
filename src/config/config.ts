import dotenv from 'dotenv'


interface Config {
	databaseURL: string
	jwtSalt: string
	passwordSalt: string
}

dotenv.config()

const {
	DB_URL: databaseURL,
	JWT_SALT: jwtSalt,
	PASSWORD_SALT: passwordSalt
} = process.env;

if (!databaseURL || !jwtSalt || !passwordSalt) {
	throw new Error('Missing environment variables')
}

export const config = {
	databaseURL,
	jwtSalt,
	passwordSalt
} as const satisfies Config

