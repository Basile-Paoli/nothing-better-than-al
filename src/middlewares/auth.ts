import {type Action, UnauthorizedError} from "routing-controllers";
import {type User, userTable} from "../db/schema";
import {decodeJwt, type JwtPayload, JwtType} from "../services/auth/jwt";
import {db} from "../db/database";
import {eq} from "drizzle-orm";
import {tokenTable} from "../db/schema";
import {TokenExpiredError} from "jsonwebtoken";

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Locals {
			userId: User['id']
			role: User['role']
		}
	}
}


export async function authMiddleware(action: Action, roles: User['role'][]) {
	const jwt = action.request.headers.authorization?.split(" ")[1]
	if (!jwt) {
		throw new UnauthorizedError('Unauthorized')
	}

	const [dbToken] = await db.select().from(tokenTable).where(eq(tokenTable.token, jwt))
	if (!dbToken) {
		throw new UnauthorizedError('Unauthorized')
	}

	let jwtPayload: JwtPayload
	try {
		jwtPayload = decodeJwt(jwt)
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			throw new UnauthorizedError('Token expired')
		}
		throw new UnauthorizedError('Unauthorized')
	}

	if (jwtPayload.type !== JwtType.AccessToken || roles.length > 0 && !roles.includes(jwtPayload.role)) {
		throw new UnauthorizedError('Unauthorized')
	}

	action.response.locals.userId = jwtPayload.userId
	action.response.locals.role = jwtPayload.role

	return true
}

export async function getCurrentUser(action: Action) {
	const [user] = await db.select().from(userTable).where(eq(userTable.id, action.response.locals.userId))
	if (!user) {
		throw new UnauthorizedError('Unauthorized')
	}
	return user
}