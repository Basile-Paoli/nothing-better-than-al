import axios from "axios";

export const adminUser = {
	email: 'patrick@endtoendtest.com',
	password: 'LeMdpAPatoche'
}
axios.defaults.baseURL = 'http://localhost:3000/';

export const adminClient = axios.create()
adminClient.interceptors.request.use(
	async (config) => {
		const {accessToken} = await loginAdmin()
		config.headers.authorization = `Bearer ${accessToken}`
		return config
	}
)

export async function loginAdmin() {
	const res = await axios.post('auth/login', adminUser)
	return {
		accessToken: res.data.accessToken as string,
		refreshToken: res.data.refreshToken as string
	}
}


export const customerUser = {
	email: 'michel@endtoend.com',
	password: 'LeMdpAMichel'
}

export const customerClient = axios.create()
customerClient.interceptors.request.use(
	async (config) => {
		const {accessToken} = await loginCustomer()
		config.headers.authorization = `Bearer ${accessToken}`
		return config
	}
)

export async function loginCustomer() {
	const res = await axios.post('auth/login', customerUser)
	return {
		accessToken: res.data.accessToken as string,
		refreshToken: res.data.refreshToken as string
	}
}
