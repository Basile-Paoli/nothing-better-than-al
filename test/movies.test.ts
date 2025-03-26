import {adminClient, customerClient, customerUser} from "./clients";
import axios from "axios";

describe('Movies API', () => {
	const testMovie = {
		name: 'Test Movie',
		duration: 120,
	};

	let createdMovieId: string;

	beforeAll(async () => {
		const res = await adminClient.post('movies', testMovie);
		createdMovieId = res.data.id;
	});

	afterAll(async () => {
		try {
			await adminClient.delete(`movies/${createdMovieId}`);
		} catch (error) {
			// do nothing
		}
	});


	describe('GET /movies/:id', () => {
		it('should get a movie by ID', async () => {
			const res = await customerClient.get(`movies/${createdMovieId}`);

			expect(res.status).toBe(200);
			expect(res.data).toHaveProperty('id', createdMovieId);
			expect(res.data).toHaveProperty('name', testMovie.name);
		});

		it('should return 404', async () => {
			const nonExistentId = 23289;
			const promise = customerClient.get(`movies/${nonExistentId}`);
			await expect(promise).rejects.toHaveProperty('response.status', 404);
		});
	});

	describe('POST /movies', () => {
		it('should allow admin to create a movie', async () => {
			const newMovie = {
				name: 'New Test Movie',
				duration: 150,
			};

			const res = await adminClient.post('movies', newMovie);

			expect(res.status).toBe(201);
			expect(res.data).toHaveProperty('id');
			expect(res.data).toHaveProperty('name', newMovie.name);

			await adminClient.delete(`movies/${res.data.id}`);
		});
	});

	describe('PUT /movies/:id', () => {
		it('should allow admin to update a movie', async () => {
			const updatedMovie = {
				...testMovie,
				name: 'Updated Movie Title',
			};

			const res = await adminClient.patch(`movies/${createdMovieId}`, updatedMovie);

			expect(res.status).toBe(200);
			expect(res.data).toHaveProperty('id', createdMovieId);
			expect(res.data).toHaveProperty('name', updatedMovie.name);
		});
	});

	describe('DELETE /movies/:id', () => {
		it('should allow admin to delete a movie', async () => {
			const newMovie = {
				name: 'Movie to Delete',
				duration: 90,
			};

			const createRes = await adminClient.post('movies', newMovie);
			const movieId = createRes.data.id;

			const deleteRes = await adminClient.delete(`movies/${movieId}`);
			expect(deleteRes.status).toBe(204);

			const promise = adminClient.get(`movies/${movieId}`);
			await expect(promise).rejects.toHaveProperty('response.status', 404);
		});
	});
});
