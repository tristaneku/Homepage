import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const url = process.env.DB_FILE;

if (!url) {
	throw new Error("DB_FILE isn't set");
}

export default defineConfig({
	out: './drizzle',
	schema: './src/lib/server/db/schema.ts',
	dialect: 'sqlite',
	dbCredentials: { url }
});
