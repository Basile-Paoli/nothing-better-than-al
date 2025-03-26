import {Authorized, Get, JsonController, QueryParam} from "routing-controllers";
import {getUsers} from "../services/users/listUsers";
import {zListUsersParams, zPublicUser} from "../validators/users";
import {RequestParams, ResponseBody} from "../open-api/decorators";
import type {PublicUser} from "../db/schema";
import {z} from "zod";

@JsonController('/users')
@Authorized('admin')
export class UserController {
	@Get('/')
	@RequestParams(zListUsersParams)
	@ResponseBody(200, z.array(zPublicUser))
	async getUsers(@QueryParam('role') role: unknown): Promise<PublicUser[]> {
		const listUsersParams = zListUsersParams.parse({role});
		return getUsers(listUsersParams);
	}
}