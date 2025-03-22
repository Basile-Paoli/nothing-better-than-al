import {adminClient, loginAdmin} from "./client";
import axios from "axios";

describe('register', () => {
	beforeEach(loginAdmin)
	it('should register a user', async () => {
		const res = await axios.post("auth/register", {
			email: 'patrick@example.com',
			password: 'MotDePasseRobuste'
		})

		expect(res.data).toHaveProperty('accessToken')
		expect(res.data).toHaveProperty('refreshToken')

		const users = await adminClient.get('users')

		expect(users.data).toContainEqual(expect.objectContaining({
			email: 'patrick@example.com',
			role: 'customer'
		}))
	})
});