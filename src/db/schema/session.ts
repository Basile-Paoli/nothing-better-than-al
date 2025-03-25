import {integer, pgTable, serial, date} from "drizzle-orm/pg-core";
 import { movieTable } from "./movies";
 import { cinemaTable } from "./cinema";


export const sessionTable = pgTable('session', {
    id: serial().primaryKey(),
    idMovie: integer().notNull().references(() => movieTable.id),
    idCinema: integer().notNull().references(() => cinemaTable.id),
    duration: integer().notNull(),
    dateMovie: date().notNull()
});