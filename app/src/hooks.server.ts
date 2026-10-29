import { db } from '#lib/server/db/service.ts';
import { migrate } from 'drizzle-orm/libsql/migrator';

await migrate(db, { migrationsFolder: './drizzle' });
