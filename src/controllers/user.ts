import {Authorized, Get, JsonController, QueryParam} from "routing-controllers";
import {getUsers} from "../services/users/listUsers";
import {zListUsersParams} from "../validators/users";

@JsonController('/users')
@Authorized('admin')
export class UserController {
	@Get('/')
	async getUsers(@QueryParam('role') role: unknown) {
		const listUsersParams = zListUsersParams.parse({role});
		return getUsers(listUsersParams);
	}
}