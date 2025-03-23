import 'dotenv/config';
import {drizzle} from 'drizzle-orm/node-postgres';
import * as schema from "./schema";
import {config} from "../config/config";

export const db = drizzle(config.databaseURL, {
	casing: 'snake_case',
	schema,
	logger: true
});
