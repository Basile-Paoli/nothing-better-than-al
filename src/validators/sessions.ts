import { z } from "zod"
import { zScreen } from "./screens"
import { zMovie } from "./movies"

export const zBookSessionsParams = z.object({
	ticket_id_used: z.number().int().positive().openapi({example: 1}),
	nb_place_to_book: z.number().int().positive().openapi({example: 1}),
	screen_id:  z.number().int().positive().openapi({example: 1}),
})

export const zSessions = z.object({
	ticket_id_used: z.number().int().positive().openapi({example: 1}),
	nb_place_to_book: z.number().int().positive().openapi({example: 1}),
    screen : zScreen,
    movie: zMovie
})

export type BookSessions = z.infer<typeof zBookSessionsParams>
//export type Sessions = z.infer<typeof zSessions>