import {Body, JsonController, Post} from "routing-controllers";
import {zLoginValidator, zRegisterValidator} from "../validators/auth";
import {loginUser, registerUser} from "../services/auth/login";

@JsonController('/auth')
export class AuthController {

	@Post('/login')
	async login(@Body() body: unknown) {
		const loginParams = zLoginValidator.parse(body)

		const token = await loginUser(loginParams)
		return {token}
	}

	@Post('/register')
	async register(@Body() body: unknown) {
		const registerParams = zRegisterValidator.parse(body)
		const token = await registerUser(registerParams)

		return {token}
	}
}