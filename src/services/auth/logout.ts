import {type User} from "@/db/schema";
import {db} from "@/db/database";
import {tokenTable} from "@/db/schema";
import {eq} from "drizzle-orm";

export async function logout(user: User) {
	await db.delete(tokenTable).where(eq(tokenTable.userId, user.id)).execute()
}