const get_minute_ts = () => Math.floor(Date.now() / 1000 / 60) * 60;
export async function update_timestamp_anylitics(env:Env) {
    const ts = get_minute_ts();

    const exists: number = (await env.DB.prepare('SELECT 1 FROM analytics_timestamp WHERE minute_ts=? LIMIT 1;').bind(ts).run()).results.length;
	if (exists) {
		await env.DB.prepare('UPDATE analytics_timestamp SET count=count+1 WHERE minute_ts=?;').bind(ts).run();
		return;
	}
	await env.DB.prepare('INSERT INTO analytics_timestamp (minute_ts, count) VALUES (?, ?)').bind(ts, 1).run();
}