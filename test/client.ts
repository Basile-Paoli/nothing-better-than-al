import axios from "axios";

export const adminUser = {
	email: 'patrick@endtoendtest.com',
	password: 'LeMdpAPatoche'
}
axios.defaults.baseURL = 'http://localhost:3000/';

export const adminClient = axios.create()
adminClient.defaults.baseURL = 'http://localhost:3000/'

export async function loginAdmin() {
	const res = await adminClient.post('auth/login', adminUser)
	adminClient.defaults.headers.authorization = `Bearer ${res.data.accessToken}`
	console.log(adminClient.defaults.headers.authorization)
}

