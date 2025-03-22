import 'dotenv/config';
import {drizzle} from 'drizzle-orm/node-postgres';
import {config} from "@/config/config";
import * as schema from "./schema";

export const db = drizzle(config.databaseURL, {
	casing: 'snake_case',
	schema
});
