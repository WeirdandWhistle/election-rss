export interface Election {
	civicsapi_id: string;
	type: string;
	name: string;
	date: string;
    scope: string;
    credit?: string;
}
export async function get_elections_from_district(district: string): Promise<Array<Election>> {
	const currentDate = new Date();
	const YYYY_MM_DD = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

	const res = await fetch(`https://civicapi.org/api/v2/race/search?startDate=${YYYY_MM_DD}&country=US&district=${district}&limit=500`);
	if (!res.ok) throw new Error('External civicapi.org faild with code: ' + res.status);

	const json: any = await res.json();
	// console.log(json);
	const out: Array<Election> = [];

	for (const race of json.races) {
		out.push({
			civicsapi_id: race.id,
			type: race.type,
			name: race.election_name,
			date: race.election_date,
            scope: race.election_type,
            credit: 'Election data powered by https://civicsapi.org',
		});
	}
	return out;
}
