import {pgEnum, pgTable, serial, varchar} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum('role', ['admin', 'customer']);

export const userTable = pgTable('user', {
	id: serial().primaryKey(),
	email: varchar({length: 120}).notNull().unique(),
	password: varchar({length: 120}).notNull(),
	role: roleEnum().notNull()
})

export type User = typeof userTable.$inferSelect;