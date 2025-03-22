import {pgEnum, pgTable, serial, varchar} from "drizzle-orm/pg-core";
import {type InferSelectModel, relations} from "drizzle-orm";
import {tokenTable} from "./token";

export const roleEnum = pgEnum('role', ['admin', 'customer']);

export const userTable = pgTable('user', {
	id: serial().primaryKey(),
	email: varchar({length: 120}).notNull().unique(),
	password: varchar({length: 120}).notNull(),
	role: roleEnum().notNull()
})

export const userRelations = relations(userTable, ({many}) => ({
	tokens: many(tokenTable)
}))


type UserTable = typeof userTable;

export const userPublicColumns = {
	id: userTable.id,
	email: userTable.email,
	role: userTable.role,
} as const satisfies Omit<UserTable['_']['columns'], 'password'>

export type User = InferSelectModel<UserTable>

export type PublicUser = Omit<User, 'password'>;