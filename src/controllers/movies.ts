import {
	Authorized,
	Body,
	Delete,
	Get,
	HttpCode,
	JsonController,
	OnUndefined,
	Param,
	Patch,
	Post
} from "routing-controllers";
import {RequestBody, ResponseBody} from "../open-api/decorators";
import {zCreateMovieParams, zMovie, zUpdateMovieParams} from "../validators/movies";
import {createMovie, deleteMovie, getMovieById, getMovies, updateMovie} from "../services/movies/crud";
import {z} from "zod";
import type {Movie} from "../db/schema";
import {zId} from "../validators/utils";

@JsonController('/movies')
export class MovieController {
	@Get('/')
	@ResponseBody(200, z.array(zMovie))
	async getMovies(): Promise<Movie[]> {
		return getMovies();
	}

	@Get('/:id')
	@ResponseBody(200, zMovie)
	async getMovie(@Param('id') id: string): Promise<Movie> {
		const validatedId = zId.parse(id);
		const movie = await getMovieById(validatedId);
		if (!movie) {
			throw new Error('Movie not found');
		}
		return movie;
	}

	@Post('/')
	@Authorized('admin')
	@HttpCode(201)
	@RequestBody(zCreateMovieParams)
	@ResponseBody(201, zMovie)
	async addMovie(@Body() movieData: unknown): Promise<Movie> {
		const validatedData = zCreateMovieParams.parse(movieData);
		return await createMovie(validatedData);
	}

	@Patch('/:id')
	@Authorized('admin')
	@RequestBody(zUpdateMovieParams)
	@ResponseBody(200, zMovie)
	async updateMovie(@Param('id') id: string, @Body() movieData: unknown): Promise<Movie> {
		const validatedData = zUpdateMovieParams.parse(movieData);
		const validatedId = zId.parse(id);
		return await updateMovie(validatedId, validatedData);
	}

	@Delete('/:id')
	@Authorized('admin')
	@HttpCode(204)
	@OnUndefined(204)
	async deleteMovie(@Param('id') id: string) {
		const validatedId = zId.parse(id);
		await deleteMovie(validatedId);
	}
}
