import {db} from "../../db/database";
import {type PublicUser, userPublicColumns, userTable} from "../../db/schema";
import type {ListUsersParams} from "../../validators/users";
import {eq} from "drizzle-orm";

export function getUsers(listUsersParams: ListUsersParams): Promise<PublicUser[]> {
	let query = db.select(userPublicColumns).from(userTable).$dynamic()

	if (listUsersParams.role) {
		query = query.where(eq(userTable.role, listUsersParams.role))
	}

	return query
}

export async function getUserById(user_id: number): Promise<PublicUser | null> {
	const user = await db.select(userPublicColumns).from(userTable).where(eq(userPublicColumns.id, user_id))
	if(user && user.length > 0){
		return user[0] as PublicUser
	}
	return null
}