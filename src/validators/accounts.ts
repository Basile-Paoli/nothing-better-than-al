import { z } from "zod"
import { zPublicUser } from "./users"
import { zMyMovies } from "./movies"
import { zMyTicket } from "./tickets"

export const zMyAccount = z.object({
    user: zPublicUser,
    movies: zMyMovies,
    valid_ticket: z.array(zMyTicket).nullable()
})

export const zMyBalance = z.object({
    balance: z.number().int().positive().openapi({example: 12}),
})

export const zBalance = z.object({
    id: z.number().int().positive().openapi({example: 1}),
    user_id: z.number().int().positive().openapi({example: 1}),
    deposit_amount: z.number().int().positive().openapi({example: 1}),
    deposit_date: z.date().nullable()
})

export const zDepositMoneyBalance = z.object({
    balance: z.number().int().positive().openapi({example: 12}),
})


export type Account = z.infer<typeof zMyAccount>;
export type UpdateBalance = z.infer<typeof zDepositMoneyBalance>;
export type Balance = z.infer<typeof zBalance>
