import {pgTable, serial, varchar, integer} from "drizzle-orm/pg-core";
import {sessionsTable} from "./session";
import {type InferSelectModel, relations} from "drizzle-orm";

export const movieTable = pgTable('movie', {
	id: serial().primaryKey(),
	name: varchar({length: 60}).notNull(),
	duration: integer().notNull(),
});

export const movieRelations = relations(movieTable, ({many}) => ({
	sessions: many(sessionsTable)
}))

export type Movie = InferSelectModel<typeof movieTable>;