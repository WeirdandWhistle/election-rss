import { District, get_district_from_ZIP } from '../ZIPs';

export async function update_district_anylitics(request: Request, env: Env, endpoint: string) {
	let district: Array<string> = [];
	if (endpoint === 'district' || endpoint === 'zip') {
		const zip = new URL(request.url).pathname.split('/')[2];
		const districts: Array<District> = await get_district_from_ZIP(env, zip);

		districts.forEach((d: District) => {
			district.push(d.district);
		});
	} else if (endpoint === 'election') {
		district.push(new URL(request.url).pathname.split('/')[2]);
	} else {
		return;
	}
	for (const d of district) {
		const exists: number = (await env.DB.prepare('SELECT 1 FROM analytics_district WHERE district=? LIMIT 1;').bind(district).run()).results.length;
		if (exists) {
			await env.DB.prepare('UPDATE analytics_district SET count=count+1 WHERE district=?;').bind(district).run();
			return;
		}
		await env.DB.prepare('INSERT INTO analytics_district (district, count) VALUES (?, ?)').bind(district, 1).run();
	}
}
