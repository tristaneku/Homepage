import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

const path = process.env.DB_FILE;

if (!path) {
	throw new Error("DB_FILE isn't set");
}

export const db = drizzle(path);
