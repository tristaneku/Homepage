import { getHighscore, saveScore } from '#lib/server/score.js';

export async function GET() {
	const highscore = await getHighscore();

	return Response.json({ highscore });
}

export async function POST({ request }) {
	const { score } = await request.json();

	await saveScore(score);
	return Response.json({ ok: true });
}
