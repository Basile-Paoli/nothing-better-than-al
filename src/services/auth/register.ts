import type {RegisterParams} from "../../validators/auth";
import {generateToken, JwtType} from "./jwt";
import {hashPassword} from "./password";
import {db} from "../../db/database";
import {userTable} from "../../db/schema/user";
import {DatabaseError} from "pg";
import {BadRequestError} from "routing-controllers";

export async function registerUser(params: RegisterParams) {
	const user = await saveUser(params);

	const accessToken =await  generateToken({
		userId: user.id,
		role: user.role,
		type: JwtType.AccessToken
	})

	const refreshToken = await generateToken({
		userId: user.id,
		role: user.role,
		type: JwtType.RefreshToken
	})

	return {
		accessToken,
		refreshToken
	}
}

async function saveUser(params: RegisterParams) {
	const hashedPassword = await hashPassword(params.password)
	try {
		const userResult = await db
			.insert(userTable)
			.values({
				email: params.email,
				password: hashedPassword,
				role: 'customer'
			})
			.returning({
				id: userTable.id,
				role: userTable.role
			}).execute()
		return userResult[0];
	} catch (e) {
		if (e instanceof DatabaseError && e.code === '23505') {
			throw new BadRequestError('Email already exists')
		}
		throw e;
	}
}
