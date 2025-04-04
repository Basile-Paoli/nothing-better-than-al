import {z} from "zod";
import type {AssertTrue, IsExact} from "conditional-type-checks";
import type {Screen} from "../db/schema";
import {cinematypeEnum} from "../db/schema";

export const zScreen = z.object({
	id: z.number().int().positive().openapi({example: 1}),
	name: z.string().min(1).max(40).openapi({example: 'Screen 1'}),
	description: z.string().nullable().openapi({example: 'Salle sans piscine'}),
	imageUrl: z.string().max(120).openapi({example: 'https://monsite.fr/image.png'}),
	type: z.enum(cinematypeEnum.enumValues).nullable().openapi({example: '2D'}),
	capacity: z.number().int().positive().openapi({example: 150}),
	disability: z.boolean().openapi({example: true}),
});

export const zCreateScreenParams = zScreen.omit({id: true});

export type CreateScreenParams = z.infer<typeof zCreateScreenParams>;

export const zUpdateScreenParams = zScreen.partial().omit({id: true});

export type UpdateScreenParams = z.infer<typeof zUpdateScreenParams>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TestScreen = AssertTrue<IsExact<z.infer<typeof zScreen>, Screen>>;
