import {adminClient, customerClient } from "./clients";

describe('Screens API', () => {
	const testScreen = {
		name: 'Test Screen',
		description: 'Test Description',
		imageUrl: 'https://test.com/image.jpg',
		type: '2D',
		capacity: 100,
		disability: true
	};

	let createdScreenId: string;

	beforeAll(async () => {
		const res = await adminClient.post('screens', testScreen);
		createdScreenId = res.data.id;
	});

	afterAll(async () => {
		try {
			await adminClient.delete(`screens/${createdScreenId}`);
		} catch (error) {
			// do nothing
		}
	});

	describe('GET /screens/:id', () => {
		it('should get a screen by ID', async () => {
			const res = await customerClient.get(`screens/${createdScreenId}`);

			expect(res.status).toBe(200);
			expect(res.data).toHaveProperty('id', createdScreenId);
			expect(res.data).toHaveProperty('name', testScreen.name);
		});

		it('should return 404', async () => {
			const nonExistentId = 23289;
			const promise = customerClient.get(`screens/${nonExistentId}`);
			await expect(promise).rejects.toHaveProperty('response.status', 404);
		});
	});

	describe('POST /screens', () => {
		it('should allow admin to create a screen', async () => {
			const newScreen = {
				name: 'New Test Screen',
				description: 'New Test Description',
				imageUrl: 'https://test.com/new-image.jpg',
				type: '3D',
				capacity: 150,
				disability: false
			};

			const res = await adminClient.post('screens', newScreen);

			expect(res.status).toBe(201);
			expect(res.data).toHaveProperty('id');
			expect(res.data).toHaveProperty('name', newScreen.name);

			await adminClient.delete(`screens/${res.data.id}`);
		});
	});

	describe('PATCH /screens/:id', () => {
		it('should allow admin to update a screen', async () => {
			const updatedScreen = {
				...testScreen,
				name: 'Updated Screen Name',
			};

			const res = await adminClient.patch(`screens/${createdScreenId}`, updatedScreen);

			expect(res.status).toBe(200);
			expect(res.data).toHaveProperty('id', createdScreenId);
			expect(res.data).toHaveProperty('name', updatedScreen.name);
		});
	});

	describe('DELETE /screens/:id', () => {
		it('should allow admin to delete a screen', async () => {
			const newScreen = {
				name: 'Screen to Delete',
				description: 'Will be deleted',
				imageUrl: 'https://test.com/delete-image.jpg',
				type: '2D',
				capacity: 90,
				disability: true
			};

			const createRes = await adminClient.post('screens', newScreen);
			const screenId = createRes.data.id;

			const deleteRes = await adminClient.delete(`screens/${screenId}`);
			expect(deleteRes.status).toBe(204);

			const promise = adminClient.get(`screens/${screenId}`);
			await expect(promise).rejects.toHaveProperty('response.status', 404);
		});
	});
});
