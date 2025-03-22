import {index, pgTable, text} from "drizzle-orm/pg-core";

export const tokenTable = pgTable('token', {
	token: text().notNull(),
}, (table) => [
	index("token_idx").on(table.token)
])