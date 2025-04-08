import { pgTable, serial, integer, date } from "drizzle-orm/pg-core";
import { relations/*, InferSelectModel*/ } from "drizzle-orm";
import { userTable } from "./user";
import { movieTable } from "./movies";
import { sessionsTable } from "./session";
import { ticketTable } from "./tickets";

export const moviesSeenTable = pgTable('movies_seen', {
  id: serial().primaryKey(),
  userId: integer().notNull().references(() => userTable.id),
  movieId: integer().notNull().references(() => movieTable.id),
  sessionId: integer().references(()=> sessionsTable.id),
  ticketId: integer().references(()=> ticketTable.id),
  booked_place: integer().notNull(),
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
  session: one(sessionsTable, {
    fields: [moviesSeenTable.sessionId],
    references: [sessionsTable.id]
  }),
  ticket: one(ticketTable, {
    fields: [moviesSeenTable.ticketId],
    references: [ticketTable.id]
  })
}));

//export type MoviesSeenTable = InferSelectModel<typeof moviesSeenTable>;
