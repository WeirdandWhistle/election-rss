/**
 * @returns true if request should be deniend; or false if request should be let through.
 */
export async function ratelimit(request: Request, env: Env, requests_per_minute: number): Promise<boolean> {
	const ip = request.headers.get('CF-Connecting-IP');
	const db_info = await env.DB.prepare(`SELECT ttl, requests FROM ratelimit WHERE ip=? LIMIT 1;`).bind(ip).run();
	const current_unix_time = Math.floor(Date.now() / 1000);
	if (db_info.results.length <= 0) {
		const arr = [];
		arr.push(current_unix_time);
		const ttl = current_unix_time + 5 * 60;

		await env.DB.prepare(`INSERT INTO ratelimit (ip, ttl, requests) VALUES (?, ?, ?);`).bind(ip, ttl, JSON.stringify(arr)).run();

		return false;
	}
	const data = db_info.results[0];
    console.log(data);
	if (Number(data.ttl) <= current_unix_time) {
		const arr = [];
		arr.push(current_unix_time);
		const ttl = current_unix_time + 5 * 60;

		await env.DB.prepare(`UPDATE ratelimit SET ttl=?, requests=? WHERE ip=?;`).bind(ttl, JSON.stringify(arr), ip).run();

		return false;
	}
	const in_arr: Array<number> = JSON.parse(String(data.requests));
	const arr: Array<number> = in_arr.filter((ts) => ts >= current_unix_time - 60 && ts <= current_unix_time);
    if(arr.length > requests_per_minute) return true;

    const ttl = current_unix_time + 5 * 60;
    arr.push(current_unix_time);
    await env.DB.prepare(`UPDATE ratelimit SET ttl=?, requests=? WHERE ip=?;`).bind(ttl, JSON.stringify(arr), ip).run();

    return false;
}
