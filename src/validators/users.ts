import {z} from "zod";

const zUserRole = z.enum(['admin', 'customer'])
export const zListUsersParams = z.object({
	role: zUserRole.optional()
})

export type ListUsersParams = z.infer<typeof zListUsersParams>