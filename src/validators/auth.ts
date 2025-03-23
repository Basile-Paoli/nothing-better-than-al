import {z} from "zod";

export const zLoginParams = z.object({
	email: z.string().email(),
	password: z.string().min(8)
})

export type LoginParams = z.infer<typeof zLoginParams>;

export const zRegisterParams = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

export type RegisterParams = z.infer<typeof zRegisterParams>;

export const zTokens = z.object({
	accessToken: z.string(),
	refreshToken: z.string()
})