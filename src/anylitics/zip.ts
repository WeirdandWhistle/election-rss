export async function update_zip_anylitics(request: Request, env: Env, endpoint: string) {
	if (endpoint !== 'zip' && endpoint !== 'district') return;
	const zip: string = new URL(request.url).pathname.split('/')[2];

	const exists: number = (await env.DB.prepare('SELECT 1 FROM analytics_zip WHERE zip=? LIMIT 1;').bind(zip).run()).results.length;
	if (exists) {
		await env.DB.prepare('UPDATE analytics_zip SET count=count+1 WHERE zip=?;').bind(zip).run();
		return;
	}
	await env.DB.prepare('INSERT INTO analytics_zip (zip, count) VALUES (?, ?)').bind(zip, 1).run();
}
