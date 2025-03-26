import type {LoginParams} from "../../validators/auth";
import {tokenTable, userTable} from "../../db/schema";
import {db} from "../../db/database";
import {eq} from "drizzle-orm";
import {BadRequestError} from "routing-controllers";
import {decodeJwt, generateToken, type JwtPayload, JwtType} from "./jwt";
import {hashPassword} from "./password";

export async function loginUser(params: LoginParams): Promise<{
	accessToken: string;
	refreshToken: string
}> {
	const [user] = await db.select().from(userTable).where(eq(userTable.email, params.email))

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


export async function refreshToken(token: string): Promise<string> {
	const [dbToken] = await db.select().from(tokenTable).where(eq(tokenTable.token, token))
	if (!dbToken) {
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

	return generateToken({
		userId: payload.userId,
		role: payload.role,
		type: JwtType.AccessToken
	})

}
