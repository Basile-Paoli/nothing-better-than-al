import {integer, pgTable, serial, date} from "drizzle-orm/pg-core";
 import { movies } from "./movies";
 import { rooms } from "./rooms";


export const sessionTable = pgTable('session', {
    id: serial().primaryKey(),
    idMovie: integer().notNull().references(() => movies.id),
    idRoom: integer().notNull().references(() => rooms.id),
    duration: integer().notNull(),
    dateMovie: date().notNull()
});