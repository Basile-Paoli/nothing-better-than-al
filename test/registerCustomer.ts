import axios from "axios";

export async function registerCustomer(
	{
		email,
		password
	}: {
		email: string,
		password: string
	}
): Promise<{ accessToken: string; refreshToken: string }> {
	const res = await axios.post("auth/register", {
		email,
		password
	})

	return res.data
}