export function get_endpoint(request: Request, pathname?: string): string {
	if (!pathname) pathname = new URL(request.url).pathname;
	const p = pathname.split('/')[1];
	switch (p) {
		case 'zip':
			return 'zip';
		case 'district':
			return 'district';
		case 'election':
			return 'election';
	}

	return 'unknown';
}
export async function update_endpoint_anylitics(env: Env, endpoint: string) {
	if (endpoint === 'unknown') return;
	const exists: number = (await env.DB.prepare('SELECT count FROM analytics_endpoint WHERE endpoint=? LIMIT 1;').bind(endpoint).run())
		.results.length;
	if (exists) {
		await env.DB.prepare('UPDATE analytics_endpoint SET count=count+1 WHERE endpoint=?;').bind(endpoint).run();
		return;
	}
	await env.DB.prepare('INSERT INTO analytics_endpoint (endpoint, count) VALUES (?, ?)').bind(endpoint, 1).run();
}
