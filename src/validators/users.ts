import {z} from "zod";
import type {PublicUser} from "../db/schema";
import type {AssertTrue, IsExact} from "conditional-type-checks";

const zUserRole = z.enum(['admin', 'customer'])
export const zListUsersParams = z.object({
	role: zUserRole.optional()
})

export type ListUsersParams = z.infer<typeof zListUsersParams>

export const zPublicUser = z.object({
	id: z.number().int().openapi({example: 1}),
	email: z.string().email().openapi({example: 'email@example.com'}),
	role: zUserRole
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TestPublicUser = AssertTrue<IsExact<z.infer<typeof zPublicUser>, PublicUser>>