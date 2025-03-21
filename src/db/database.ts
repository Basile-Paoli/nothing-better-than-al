import 'dotenv/config';
import {drizzle} from 'drizzle-orm/node-postgres';
import {config} from "../config/config";

const db = drizzle(config.databaseHost, {
	casing: 'snake_case'
});
