import {userTable} from "../../db/schema/user";
import jwt from "jsonwebtoken";
import {config} from "../../config/config";

export interface JwtPayload {
	userId: typeof userTable.$inferSelect.id
	role: typeof userTable.$inferSelect.role
}

export function decodeJwt(token: string): JwtPayload {
	const payload = jwt.verify(token, config.jwtSalt)
	return payload as JwtPayload
}

export function encodeJwt(payload: JwtPayload): string {
	return jwt.sign(payload, config.jwtSalt, {expiresIn: "5m"})
}
