import {db} from "../src/db/database";
import {userTable} from "../src/db/schema";
import {adminUser} from "./client";
import {hashPassword} from "../src/services/auth/password";

async function populate() {
	await db.insert(userTable).values({
		email: adminUser.email,
		password: await hashPassword(adminUser.password),
		role: 'admin'
	}).execute()
}

populate()