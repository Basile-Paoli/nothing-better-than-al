import {tokenTable, type User} from "../../db/schema";
import {eq} from "drizzle-orm";
import {db} from "../../db/database";

export async function logout(user: User) {
	await db.delete(tokenTable).where(eq(tokenTable.userId, user.id)).execute()
}