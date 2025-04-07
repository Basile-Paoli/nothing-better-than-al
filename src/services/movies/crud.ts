import {db} from "../../db/database";
import {type Movie, moviesSeenTable, movieTable, sessionsTable} from "../../db/schema";
import type {CreateMovieParams, UpdateMovieParams} from "../../validators/movies";
import {eq} from "drizzle-orm";
import {NotFoundError} from "routing-controllers";
import { MoviesSeen } from "../../validators/movies";

export async function createMovie(params: CreateMovieParams): Promise<Movie> {
	const [movie] = await db.insert(movieTable)
		.values(params)
		.returning();

	return movie!;
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
		.where(eq(movieTable.id, id));

	if (!movie) {
		throw new NotFoundError('Movie not found');
	}

	return movie;
}

export async function getMyMovies(id_user: number): Promise<MoviesSeen> {
    const movies = await db
        .select({
            movieId: moviesSeenTable.movieId,
            date: moviesSeenTable.date,
            name: movieTable.name,
            duration: movieTable.duration,
			sessionId: moviesSeenTable.sessionId,
			booked_place: moviesSeenTable.booked_place
        })
        .from(moviesSeenTable)
        .innerJoin(movieTable, eq(moviesSeenTable.movieId, movieTable.id))
        .where(eq(moviesSeenTable.userId, id_user));

    if (movies.length === 0) {
		const movie_seen: MoviesSeen = []
		return movie_seen
    }

    if (movies.length === 0) {
        const movie_seen: MoviesSeen = []
		return movie_seen
    }

    return movies.map((record) => ({
        movies: {
            id: record.movieId,
            name: record.name,
            duration: record.duration,
			sessionId: record.sessionId,
			booked_place: record.booked_place,
        },
        date: new Date(record.date),
    }));
}
