import {db} from "../src/db/database";
import {userTable} from "../src/db/schema";
import {adminUser, customerUser} from "./clients";
import {hashPassword} from "../src/services/auth/password";

async function populate() {
	await db.insert(userTable).values([
		{
			email: adminUser.email,
			password: await hashPassword(adminUser.password),
			role: 'admin'
		},
		{
			email: customerUser.email,
			password: await hashPassword(customerUser.password),
			role: 'customer'
		}
	])
}

populate()