import { pgTable, serial, varchar,integer} from "drizzle-orm/pg-core";

export const movieTable = pgTable('movie', {
    id: serial().primaryKey(),
    name: varchar({length: 60}).notNull(),
    duration: integer().notNull(),
});