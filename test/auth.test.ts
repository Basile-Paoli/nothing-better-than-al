import {adminClient, customerUser, loginCustomer} from "./clients";
import axios from "axios";

describe('register', () => {
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
			role: 'customer',
			balance:0,
			id:3
		}))
	})

	it('should not register if email is already taken', async () => {
		const email = 'patoulefou@example.com'

		await axios.post("auth/register", {
			email,
			password: 'MotDePasseRobuste'
		})

		const promise = axios.post("auth/register", {
			email,
			password: 'MotDePasseRobuste'
		})

		await expect(promise).rejects.toHaveProperty('response.status', 400)
	})
});

describe('login', () => {
	it('should login a user', async () => {
		const res = await axios.post("auth/login", {
			email: customerUser.email,
			password: customerUser.password
		})

		expect(res.data).toHaveProperty('accessToken')
		expect(res.data).toHaveProperty('refreshToken')
	})
})

describe('refresh', () => {
	it('refresh the access token', async () => {
		const {refreshToken} = await loginCustomer()

		const res = await axios.post("auth/refresh", {
			refreshToken
		})

		expect(res.data).toHaveProperty('accessToken')
	})
});
