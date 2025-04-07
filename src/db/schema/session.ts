import {integer, pgTable, serial, date} from "drizzle-orm/pg-core";
import {Movie, movieTable} from "./movies";
import {Screen, screenTable} from "./cinema";
import {relations} from "drizzle-orm";


export const sessionsTable = pgTable('Sessions', {
	id: serial().primaryKey(),
	idMovie: integer().notNull().references(() => movieTable.id),
	idCinema: integer().notNull().references(() => screenTable.id),
	duration: integer().notNull(),
	dateMovie: date().notNull(),
	remaining_places: integer().notNull().default(0)
});

export const sessionsRelations = relations(sessionsTable, ({one}) => ({
	movie: one(movieTable, {
		fields: [sessionsTable.idMovie],
		references: [movieTable.id],
	}),
	cinema: one(screenTable, {
		fields: [sessionsTable.idCinema],
		references: [screenTable.id],
	})
}))


export type Session = {
	id: number,
	movie: Movie,
	cinema : Screen,
	dateMovie: Date,
	remaining_places: number
}