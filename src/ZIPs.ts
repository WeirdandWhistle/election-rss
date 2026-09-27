import { get_elections_from_district, Election } from "./elections";

interface District {
    state_code: string;
    state: string;
    zip: string;
    congressional_district: string;
    district: string;
}

export async function get_district_from_ZIP(env: Env, zip: string): Promise<Array<District>> {
	const db_info = await env.DB.prepare('SELECT state_fips, state_abbr, zip, cd FROM districts WHERE zip = ? LIMIT 5;').bind(zip).run();
	const out: Array<District> = [];

	for (const r of db_info.results) {
		out.push({
			state_code: String(r.state_fips),
			state: String(r.state_abbr),
			zip: String(r.zip),
			congressional_district: String(r.cd),
			district: String(r.state_abbr) + '-' + String(r.cd),
		});
	}
	return out;
}
export async function get_elections_from_ZIP(env: Env, zip: string): Promise<Array<Election>> {
	const districts = await get_district_from_ZIP(env, zip);
	const out: Array<Election> = [];
	for (const { district } of districts) {
        console.log(district);
        const elections = await get_elections_from_district(district);
        elections.forEach((e)=> out.push(e));
	}
    console.log(out);
    return [...new Set(out)];
}
