import type {LoginParams, RegisterParams} from "../../validators/auth";
import {userTable} from "../../db/schema/user";
import {db} from "../../db/database";
import {eq} from "drizzle-orm";
import {BadRequestError} from "routing-controllers";
import {encodeJwt} from "./jwt";
import {hashPassword} from "./password";

export async function loginUser(params: LoginParams) {
	const users = await db.select().from(userTable).where(eq(userTable.email, params.email)).execute()
	const user = users[0]

	const hashedPassword = await hashPassword(params.password)
	if (!user || user.password !== hashedPassword) {
		throw new BadRequestError('Invalid email or password')
	}

	return encodeJwt({
		userId: user.id,
		role: user.role
	})
}

export async function registerUser(params: RegisterParams) {
	const users = await db.select().from(userTable).where(eq(userTable.email, params.email)).execute()
	if (users.length > 0) {
		throw new BadRequestError('Email already exists')
	}

	const hashedPassword = await hashPassword(params.password)
	const user = await db.insert(userTable).values({
		email: params.email,
		password: hashedPassword,
		role: 'customer'
	}).returning({id: userTable.id, role: userTable.role}).execute()

	return encodeJwt({
		userId: user[0].id,
		role: user[0].role
	})
}