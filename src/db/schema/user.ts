import {pgEnum, pgTable, serial, varchar, integer} from "drizzle-orm/pg-core";
import {getTableColumns, type InferSelectModel, relations} from "drizzle-orm";
import {tokenTable} from "./token";

export const roleEnum = pgEnum('role', ['admin', 'customer']);

export const userTable = pgTable('user', {
	id: serial().primaryKey(),
	email: varchar({length: 120}).notNull().unique(),
	password: varchar({length: 120}).notNull(),
	role: roleEnum().notNull(),
	balance : integer().default(0)
})

export const userRelations = relations(userTable, ({many}) => ({
	tokens: many(tokenTable)
}))


type UserTable = typeof userTable;

const {password, ...rest} = getTableColumns(userTable)
//export const userPublicColumns = rest satisfies Omit<UserTable['_']['columns'], 'password'>
export const userPublicColumns = rest satisfies Omit<
  UserTable["_"]["columns"],
  "password" | "balance"
>;

export type User = InferSelectModel<UserTable>
//export type PublicUser = Omit<User, 'password'>;
export type PublicUser = Omit<User, "password" | "balance">;