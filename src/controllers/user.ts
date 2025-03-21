import {Authorized, CurrentUser, Get, JsonController} from "routing-controllers";
import {z} from "zod";


const zUser = z.object({
	name: z.string(),
	email: z.string(),
	id: z.number()
})


@JsonController()
@Authorized()
export class UserController {

	@Get('/')
	getUsers(@CurrentUser() user: string) {

	}
}