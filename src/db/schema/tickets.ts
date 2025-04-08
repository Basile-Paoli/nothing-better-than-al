import { pgTable, serial, integer, date, pgEnum } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { relations } from "drizzle-orm";

export const ticketTypeEnum = pgEnum('ttype', ['super', 'normal']);

export const ticketTable = pgTable('tickets', {
    id: serial().primaryKey(),
    userId: integer().notNull().references(() => userTable.id),
    max_usage: integer().notNull(),
    used: integer().notNull().default(0),
    type: ticketTypeEnum().notNull().default("normal"),
    buy_date: date().notNull().defaultNow()
});


export const ticketsRelations = relations(ticketTable, ({ one }) => ({
  user: one(userTable, {
    fields: [ticketTable.userId],
    references: [userTable.id],
  }),
}));