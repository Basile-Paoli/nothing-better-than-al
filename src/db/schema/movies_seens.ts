import { pgTable, serial, integer, date } from "drizzle-orm/pg-core";
import { relations/*, InferSelectModel*/ } from "drizzle-orm";
import { userTable } from "./user";
import { movieTable } from "./movies";

export const moviesSeenTable = pgTable('movies_seen', {
  id: serial().primaryKey(),
  userId: integer().notNull().references(() => userTable.id),
  movieId: integer().notNull().references(() => movieTable.id),
  date: date().notNull(),
});

export const moviesSeenRelations = relations(moviesSeenTable, ({ one }) => ({
  user: one(userTable, {
    fields: [moviesSeenTable.userId],
    references: [userTable.id],
  }),
  movie: one(movieTable, {
    fields: [moviesSeenTable.movieId],
    references: [movieTable.id],
  }),
}));

//export type MoviesSeenTable = InferSelectModel<typeof moviesSeenTable>;
