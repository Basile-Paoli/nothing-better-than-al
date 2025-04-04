import {pgEnum, pgTable, serial, varchar, text, integer, boolean} from "drizzle-orm/pg-core";
import {type InferSelectModel, relations} from "drizzle-orm";
import {sessionsTable} from "./session";

export const cinematypeEnum = pgEnum('type', ['3D', '2D', '4DX']);

export const screenTable = pgTable('screen', {
	id: serial().primaryKey(),
	name: varchar({length: 40}).notNull(),
	description: text(),
	imageUrl: varchar({length: 120}).notNull(),
	type: cinematypeEnum(),
	capacity: integer().notNull().default(0),
	disability: boolean().notNull()
});

export const screenRelations = relations(screenTable, ({many}) => ({
	sessions: many(sessionsTable)
}))

export type Screen = InferSelectModel<typeof screenTable>