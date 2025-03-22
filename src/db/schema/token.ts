import {index, integer, pgTable, text} from "drizzle-orm/pg-core";
import {userTable} from "./user";
import {relations} from "drizzle-orm";

export const tokenTable = pgTable('token', {
	token: text().notNull(),
	userId: integer().references(() => userTable.id, {onDelete: 'cascade'}).notNull()
}, (table) => [
	index("token_idx").on(table.token)
])

export const tokenRelations = relations(tokenTable, ({one}) => ({
	user: one(userTable, {
		fields: [tokenTable.userId],
		references: [userTable.id],
	})
}))
