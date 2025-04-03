import { pgTable, serial, integer, date, pgEnum } from "drizzle-orm/pg-core";
import { userTable } from "./user";

export const typeEnum = pgEnum('type', ['super', 'normal']);

export const ticketTable = pgTable('tickets', {
    id: serial().primaryKey(),
    userId: integer().notNull().references(() => userTable.id),
    max_usage: integer().notNull(),
    used: integer().notNull().default(0),
    type: typeEnum().notNull().default("normal"),
    buy_date: date().notNull().defaultNow()
});