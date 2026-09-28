import { UAParser } from 'ua-parser-js';
interface UAClassifaction {
	useragent: string;
	name: string;
	version: string;
	category: string;
}
function classify_ua(userAgent: string = ''): UAClassifaction {
	if (!userAgent)
		return {
			useragent: 'empty',
			name: 'none',
			version: 'none',
			category: 'none',
		};

	const parser = new UAParser(userAgent);
	const result = parser.getResult();

	const ua = userAgent.toLowerCase();

	let category = 'unknown';
	let name = '';
	let version = '';

	if (result.browser.name) {
		category = 'browser';
		name = result.browser.name;
		version = String(result.browser.version);
	}
	if (
		/\b(axios|node-fetch|undici|got|superagent|request|okhttp|curl|wget|python-requests|httpx|libwww-perl|ruby|go-http-client|java)\b/i.test(
			userAgent,
		)
	) {
		category = 'libary';
		name = String(result.engine.name);
		version = String(result.engine.version);
	}
	if (/\b(bot|crawler|spider|slurp|facebookexternalhit|googlebot|bingbot)\b/i.test(userAgent)) {
		category = 'bot';
		name = String(result.engine.name);
		version = String(result.engine.version);
	}
	if (/\b(myapp|my-company-sdk|mobile-sdk|ios-sdk|android-sdk)\b/i.test(userAgent)) {
		category = 'sdk';
		name = String(result.engine.name);
		version = String(result.engine.version);
	}
	const out: UAClassifaction = {
		category: category,
		version: version,
		name: name,
		useragent: ua,
	};
	return out;
}
export async function update_ua_analytics(request: Request, env: Env) {
	const ua_header = request.headers.get('User-Agent');
	const ts = Math.floor(Date.now() / 1000);

	const c: UAClassifaction = classify_ua(String(ua_header));
	await env.DB.prepare('INSERT INTO analytics_useragent (ua_full, ua_name, ua_version, ua_catecory, ts) VALUES (?, ?, ?, ?, ?)').bind(
		c.useragent,
		c.name,
		c.version,
		c.category,
		ts,
	);
}
