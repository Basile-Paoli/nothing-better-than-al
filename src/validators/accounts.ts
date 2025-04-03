import { z } from "zod"
import { zPublicUser } from "./users"
import { zMyMovies } from "./movies"
import { zMyTicket } from "./tickets"

export const zMyAccount = z.object({
    user: zPublicUser,
    movies: zMyMovies,
    balance: z.number().int().positive().openapi({example: 12}),
    last_ticket: zMyTicket.nullable()
})

export const zMyBalance = z.object({
    balance: z.number().int().positive().openapi({example: 12}),
})

export type Account = z.infer<typeof zMyAccount>;
