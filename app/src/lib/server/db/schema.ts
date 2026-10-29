import { index, int, sqliteTable } from 'drizzle-orm/sqlite-core';

export const scores = sqliteTable(
	'scores',
	{
		id: int().primaryKey({ autoIncrement: true }),
		score: int().notNull()
	},
	(t) => [index('highscore').on(t.score)]
);
