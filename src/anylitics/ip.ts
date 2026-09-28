export async function update_ip_anylitics(env: Env, ip: string) {
	const exists: number = (await env.DB.prepare('SELECT 1 FROM analytics_ip WHERE ip=? LIMIT 1;').bind(ip).run()).results.length;
	if (exists) {
		await env.DB.prepare('UPDATE analytics_ip SET count=count+1 WHERE ip=?;').bind(ip).run();
		return;
	}
	await env.DB.prepare('INSERT INTO analytics_ip (ip, count) VALUES (?, ?)').bind(ip, 1).run();
}
