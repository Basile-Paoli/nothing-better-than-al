import type {RegisterParams} from "../../validators/auth";
import {generateToken, JwtType} from "./jwt";
import {hashPassword} from "./password";
import {db} from "../../db/database";
import {type User, userTable} from "../../db/schema";
import {DatabaseError} from "pg";
import {BadRequestError} from "routing-controllers";

export async function registerUser(params: RegisterParams): Promise<{
	accessToken: string
	refreshToken: string
}> {
	const user = await saveUser(params);

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

async function saveUser(params: RegisterParams): Promise<User> {
	const hashedPassword = await hashPassword(params.password)
	try {
		const [user] = await db
			.insert(userTable)
			.values({
				email: params.email,
				password: hashedPassword,
				role: 'customer'
			})
			.returning()
		return user!
	} catch (e) {
		if (e instanceof DatabaseError && e.code === '23505') {
			throw new BadRequestError('Email already exists')
		}
		throw e;
	}
}
