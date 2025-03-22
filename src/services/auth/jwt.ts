import {type User} from "../../db/schema/user";
import jwt from "jsonwebtoken";
import {config} from "../../config/config";
import {db} from "../../db/database";
import {tokenTable} from "../../db/schema/token";

export enum JwtType {
	AccessToken = 'access',
	RefreshToken = 'refresh'
}

export interface JwtPayload {
	userId: User['id']
	role: User['role']
	type: JwtType
}

/**
 * @throws jwt.VerifyErrors
 */
export function decodeJwt(token: string): JwtPayload {
	const payload = jwt.verify(token, config.jwtSalt)
	return payload as JwtPayload
}

function encodeJwt(payload: JwtPayload): string {
	const expiresIn = payload.type === JwtType.AccessToken ? "5m" : "7d"
	return jwt.sign(payload, config.jwtSalt, {expiresIn})
}

export async function generateToken({userId, role, type}: { userId: User['id'], role: User['role'], type: JwtType }) {
	const token = encodeJwt({
		userId,
		role,
		type
	})

	await db.insert(tokenTable).values({
		token,
	}).execute()

	return token;
}