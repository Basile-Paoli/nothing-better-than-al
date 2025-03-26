import {integer, pgTable, serial, date} from "drizzle-orm/pg-core";
import {movieTable} from "./movies";
import {screenTable} from "./cinema";
import {relations} from "drizzle-orm";


export const screeningTable = pgTable('screening', {
	id: serial().primaryKey(),
	idMovie: integer().notNull().references(() => movieTable.id),
	idCinema: integer().notNull().references(() => screenTable.id),
	duration: integer().notNull(),
	dateMovie: date().notNull()
});

export const screeningRelations = relations(screeningTable, ({one}) => ({
	movie: one(movieTable, {
		fields: [screeningTable.idMovie],
		references: [movieTable.id],
	}),
	cinema: one(screenTable, {
		fields: [screeningTable.idCinema],
		references: [screenTable.id],
	})
}))