import {z} from "zod";

export const zTicket = z.object({
    id: z.number().int().positive().openapi({example: 1}),
    userId: z.number().int().positive(),
    max_usage: z.number().int().positive().openapi({example: 10}),
    used: z.number().int().positive().openapi({example: 9}),
    buy_date: z.string(),
    type: z.enum(["super", "normal"])
})

export const zTicketCreate = z.object({
    id: z.number().int().positive().openapi({example: 1}),
    userId: z.number().int().positive(),
    type: z.enum(["super", "normal"])
})

export const zTicketUpdate = z.object({
    id: z.number().int().positive().openapi({example: 1})
})

export type Ticket = z.infer<typeof zTicket>;
export const zMyTicket = zTicket.omit({userId: true})
export type MyTicket = z.infer<typeof zMyTicket>;
