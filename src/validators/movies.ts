import {z} from "zod";
import type {AssertTrue, IsExact} from "conditional-type-checks";
import type {Movie} from "../db/schema";

export const zMovie = z.object({
	id: z.number().int().positive().openapi({example: 1}),
	name: z.string().min(1).max(60).openapi({example: 'Birdemic'}),
	duration: z.number().int().positive().openapi({example: 120}),
});
export const zCreateMovieParams = zMovie.omit({id: true});

export type CreateMovieParams = z.infer<typeof zCreateMovieParams>;

export const zUpdateMovieParams = zMovie.partial().omit({id: true});

export type UpdateMovieParams = z.infer<typeof zUpdateMovieParams>;


// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TestMovie = AssertTrue<IsExact<z.infer<typeof zMovie>, Movie>>;
