import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userTable } from "./user";

export const balanceTable = pgTable('balance', {
    id: serial().primaryKey(),
    user_id: integer().notNull(),
    deposit_amount: integer().notNull(),
    deposit_date: timestamp().notNull()
});

export const balanceRelations = relations(balanceTable, ({one}) => ({
    user: one(userTable, {
        fields: [balanceTable.user_id],
        references: [userTable.id],
    })
}))