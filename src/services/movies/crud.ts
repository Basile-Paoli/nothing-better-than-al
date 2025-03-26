import {db} from "../../db/database";
import {type Movie, movieTable} from "../../db/schema";
import type {CreateMovieParams, UpdateMovieParams} from "../../validators/movies";
import {eq} from "drizzle-orm";
import {NotFoundError} from "routing-controllers";

export async function createMovie(params: CreateMovieParams): Promise<Movie> {
	const [movie] = await db.insert(movieTable)
		.values(params)
		.returning();

	return movie;
}

export async function updateMovie(id: number, params: UpdateMovieParams) {
	const [movie] = await db.update(movieTable)
		.set(params)
		.where(eq(movieTable.id, id))
		.returning();
	if (!movie) {
		throw new NotFoundError('Movie not found');
	}

	return movie;
}

export async function deleteMovie(id: number): Promise<void> {
	const [movie] = await db.delete(movieTable)
		.where(eq(movieTable.id, id))
		.returning();
	if (!movie) {
		throw new NotFoundError('Movie not found');
	}
}

export async function getMovies(): Promise<Movie[]> {
	return db.select().from(movieTable);
}

export async function getMovieById(id: number): Promise<Movie> {
	const [movie] = await db.select()
		.from(movieTable)
		.where(eq(movieTable.id, id))
		.limit(1);

	if (!movie) {
		throw new NotFoundError('Movie not found');
	}

	return movie;
}
