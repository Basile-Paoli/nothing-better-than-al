import { z } from "zod"
import { zScreen } from "./screens"
import { zMovie } from "./movies"

export const zBookSessionsParams = z.object({
	ticket_id_used: z.number().int().positive().openapi({example: 1}),
	nb_place_to_book: z.number().int().positive().openapi({example: 1}),
})

export const zSessions = z.object({
	ticket_id_used: z.number().int().positive().openapi({example: 1}),
	nb_place_to_book: z.number().int().positive().openapi({example: 1}),
    screen : zScreen,
    movie: zMovie
})

export const zCreateSessions = z.object({
	duration: z.number().int().positive().openapi({example: 1}),
	idMovie: z.number().int().positive().openapi({example: 1}),
    idScreen : z.number().int().positive().openapi({example: 1}),
    dateMovie: z.string().datetime(),
})


export type BookSessions = z.infer<typeof zBookSessionsParams>
export type CreateSession = z.infer<typeof zCreateSessions>
//export type Sessions = z.infer<typeof zSessions>