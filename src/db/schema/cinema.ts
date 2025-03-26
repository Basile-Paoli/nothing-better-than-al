import {pgEnum, pgTable, serial, varchar,text,integer,boolean} from "drizzle-orm/pg-core";

export const typeEnum = pgEnum('type', ['3D', '2D','4DX']);

export const cinemaTable = pgTable('cinema', {
    id: serial().primaryKey(),
    name: varchar({length: 40}).notNull(),
    description: text(),
    imageUrl: varchar({length: 120}).notNull(),
    type: typeEnum(),
    capacity: integer().notNull(),
    disability: boolean().notNull()
});