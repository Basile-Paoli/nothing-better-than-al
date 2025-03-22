import type {LoginParams} from "../../validators/auth";
import {userTable} from "../../db/schema/user";
import {db} from "../../db/database";
import {eq} from "drizzle-orm";
import {BadRequestError} from "routing-controllers";
import {decodeJwt, generateToken, type JwtPayload, JwtType} from "./jwt";
import {hashPassword} from "./password";
import {tokenTable} from "../../db/schema/token";

export async function loginUser(params: LoginParams) {
	const userQuery = await db.select().from(userTable).where(eq(userTable.email, params.email)).execute()
	const user = userQuery[0]

	const hashedPassword = await hashPassword(params.password)
	if (!user || user.password !== hashedPassword) {
		throw new BadRequestError('Invalid email or password')
	}


	const [accessToken, refreshToken] = await Promise.all([
		generateToken({
			userId: user.id,
			role: user.role,
			type: JwtType.AccessToken
		}),
		generateToken({
			userId: user.id,
			role: user.role,
			type: JwtType.RefreshToken
		})
	])

	return {
		accessToken,
		refreshToken
	}
}


export async function refreshToken(token: string) {
	const dbToken = await db.select().from(tokenTable).where(eq(tokenTable.token, token)).execute()
	if (!dbToken[0]) {
		throw new BadRequestError('Invalid token')
	}

	let payload: JwtPayload
	try {
		payload = decodeJwt(token)
	} catch {
		throw new BadRequestError('Invalid token')
	}

	if (payload.type !== JwtType.RefreshToken) {
		throw new BadRequestError('Invalid token')
	}

	const accessToken = await generateToken({
		userId: payload.userId,
		role: payload.role,
		type: JwtType.AccessToken
	})

	return {
		accessToken
	}
}
