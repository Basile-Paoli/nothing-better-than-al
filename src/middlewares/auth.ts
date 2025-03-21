import {type Action} from "routing-controllers";
import {type User, userTable} from "../db/schema/user";
import {decodeJwt} from "../services/auth/jwt";
import {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";
import {db} from "../db/database";
import {eq} from "drizzle-orm";

export function authMiddleware(action: Action, roles: User['role'][]) {
	const jwt = action.request.headers.authorization?.split(" ")[1]
	if (!jwt) {
		return false
	}

	try {
		const jwtPayload = decodeJwt(jwt)

		action.response.locals.userId = jwtPayload.userId
		action.response.locals.role = jwtPayload.role

		return roles.includes(jwtPayload.role)
	} catch (error) {
		if (error instanceof JsonWebTokenError) {
			return false
		}
		if (error instanceof TokenExpiredError) {
			//TODO
		}
		return false
	}
}

export async function getCurrentUser(action: Action) {
	const users = await db.select().from(userTable).where(eq(userTable.id, action.response.locals.userId)).execute()
	return users[0]
}