import {z} from "zod";

export const zLoginValidator = z.object({
	email: z.string().email(),
	password: z.string().min(8)
})

export type LoginParams = z.infer<typeof zLoginValidator>;

export const zRegisterValidator = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

export type RegisterParams = z.infer<typeof zRegisterValidator>;