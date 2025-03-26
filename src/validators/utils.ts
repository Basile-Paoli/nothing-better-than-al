import {z} from "zod";

export const zId = z.coerce.number().int().positive();