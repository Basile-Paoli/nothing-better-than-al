import bcrypt from 'bcrypt';
import {config} from "../../config/config";

export function hashPassword(password: string) {
	return bcrypt.hash(password, config.passwordSalt);
}