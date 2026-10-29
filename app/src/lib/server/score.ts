import { desc } from 'drizzle-orm';
import { scores } from './db/schema';
import { db } from './db/service';

export async function saveScore(score: number) {
	await db.insert(scores).values({ score });
}

export async function getHighscore() {
	const [row] = await db.select().from(scores).orderBy(desc(scores.score)).limit(1);
	return row?.score ?? 0;
}
