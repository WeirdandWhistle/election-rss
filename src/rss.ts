import { get_district_from_ZIP, get_elections_from_ZIP } from './ZIPs';

export interface RSSItemJson {
	title: string;
	link: string;
	description: string;
}
export interface RSSPageJson {
	version: string;
	title: string;
	link: string;
	description: string;
	items: Array<RSSItemJson>;
}

export async function load_zip_rss_json(env: Env, origin: string, zip: string): Promise<RSSPageJson> {
	const elections = await get_elections_from_ZIP(env, zip);

	const items: Array<RSSItemJson> = [];
	for (const e of elections) {
		const searchURL = new URL('https://duckduckgo.com/');
		searchURL.searchParams.set('q', `${e.name} ${e.type} ${e.scope} ${e.date}`);
		items.push({
			title: e.name,
			link: searchURL.toString(),
			description: `${e.name} for ${e.type}. As a ${e.scope} election.`,
		});
	}

	return {
		version: '2.0',
		title: 'Election Update',
		link: origin + '?zip=' + zip,
		description: 'Update on elections happening in the ZIP code ' + zip + '.',
		items: items,
	};
}
export async function load_zip_rss_feed(env: Env, origin: string, zip: string): Promise<string> {
	const j = await load_zip_rss_json(env, origin, zip);

	let xml: string = `<?xml version="1.0" encoding="UTF-8" ?><rss version="${j.version}">`;
	xml += '<channel>';

	xml += `<title>${j.title}</title>`;
	xml += `<link>${j.link}</link>`;
	xml += `<description>${j.description}</description>`;

	j.items.forEach((e) => {
		xml += `<item>`;
		xml += `<title>${e.title}</title>`;
		xml += `<link>${e.link}</link>`;
		xml += `<description>${e.description}</description>`;
		xml += `</item>`;
	});

	xml += '</channel>';
	xml += '</rss>';

    return xml;
}
