import {z} from "zod";

export const zTicket = z.object({
    id: z.number().int().positive().openapi({example: 1}),
    userId: z.number().int().positive(),
    max_usage: z.number().int().positive().openapi({example: 10}),
    used: z.number().int().positive().openapi({example: 9}),
    buy_date: z.string(),
    type: z.enum(["super", "normal"])
})

export const zCreateTicketParams = z.object({
    type: z.enum(["super", "normal"]),
    used: z.number().int().min(0).nullable().openapi({example: 9}),
    max_usage: z.number().int().positive().openapi({example: 10}),
})

export const zUpdateTicketParams = z.object({
    ticket_id: z.number().int().positive().openapi({example: 1}),
    nb_increment: z.number().int().positive().openapi({example: 1}),
    movie_id: z.number().int().positive().openapi({example: 1}),
})

export type Ticket = z.infer<typeof zTicket>;
export const zMyTicket = zTicket.omit({userId: true})
export type MyTicket = z.infer<typeof zMyTicket>;
export type CreateTicketParam = z.infer<typeof zCreateTicketParams>
export type UpdateTicketParam = z.infer<typeof zUpdateTicketParams>