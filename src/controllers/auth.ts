import {Authorized, Body, BodyParam, CurrentUser, Get, JsonController, Post} from "routing-controllers";
import {zLoginParams, zRegisterParams} from "../validators/auth";
import {loginUser, refreshToken} from "../services/auth/login";
import {registerUser} from "../services/auth/register";
import type {User} from "../db/schema/user";

@JsonController('/auth')
export class AuthController {

	@Post('/login')
	async login(
		@Body() body: unknown
	): Promise<{
		accessToken: string
		refreshToken: string
	}> {
		const loginParams = zLoginParams.parse(body)

		const {refreshToken, accessToken} = await loginUser(loginParams)
		return {accessToken, refreshToken}
	}

	@Post('/register')
	async register(
		@Body() body: unknown
	): Promise<{
		accessToken: string
		refreshToken: string
	}> {
		const registerParams = zRegisterParams.parse(body)
		const {accessToken, refreshToken} = await registerUser(registerParams)

		return {accessToken, refreshToken}
	}

	@Post('/refresh')
	async refresh(
		@BodyParam('refreshToken', {type: String}) token: string
	): Promise<{
		accessToken: string
	}> {
		return await refreshToken(token)
	}

	@Get('/test')
	@Authorized()
	test(@CurrentUser() user: User) {
		return `Hello ${user.email}`
	}
}