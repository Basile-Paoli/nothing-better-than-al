import {Authorized, Body, BodyParam, CurrentUser, HttpCode, JsonController, Post} from "routing-controllers";
import {zLoginParams, zRegisterParams, zTokens} from "../validators/auth";
import {loginUser, refreshToken} from "../services/auth/login";
import {registerUser} from "../services/auth/register";
import type {User} from "../db/schema";
import {logout} from "../services/auth/logout";
import {RequestBody, ResponseBody} from "../open-api/decorators";
import {z} from "zod";

@JsonController('/auth')
export class AuthController {

	@Post('/login')
	@RequestBody(zLoginParams)
	@ResponseBody(200, zTokens)
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
	@HttpCode(201)
	@RequestBody(zRegisterParams)
	@ResponseBody(201, zTokens)
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
	@RequestBody(zTokens.pick({refreshToken: true}))
	@ResponseBody(200, z.object({accessToken: z.string()}))
	async refresh(
		@BodyParam('refreshToken', {type: String}) token: string
	): Promise<{ accessToken: string }> {
		const accessToken = await refreshToken(token)
		return {accessToken}
	}

	@Post('/logout')
	@HttpCode(204)
	@Authorized()
	async logout(@CurrentUser() user: User): Promise<void> {
		await logout(user)
	}
}