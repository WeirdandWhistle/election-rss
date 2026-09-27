import { get_elections_from_district } from './elections';
import { random_quote } from './random_quotes';
import { ratelimit } from './ratelimiter';
import { get_district_from_ZIP, get_elections_from_ZIP } from './ZIPs';

export async function wrap(request: Request, env: Env, ctx: any) : Promise<Response> {
	const pathname = new URL(request.url).pathname;

	const pathArr = pathname.split('/');
	let input = '';
	if (pathArr.length >= 3) input = pathArr[2];

    const no_input_response = new Response(JSON.stringify({
        ok: false,
        message: 'Input is needed, but not provided.'
    }),{
        status: 400,
        headers:{
            'Content-Type': 'application/json',
		    'Cache-Control': 'max-age=3600, public',
        }
    });

	try {
		if(await ratelimit(request, env, 10)){
			return new Response(JSON.stringify({
				ok:false,
				message: '429 Too Many Requests. You are being ratelimited, try again in a few minutes.'
			}),{
				status: 429,
				headers:{
					'Content-Type':'application/json',
					'Cache-Control':'no-cache',
				}
			});
		}
        let out;
		if (pathname.startsWith('/district/')) {
            if(input === '') return no_input_response;
            out = await get_district_from_ZIP(env, input);
		} else if (pathname.startsWith('/elections/')){
            if(input === '') return no_input_response;
            out = await get_elections_from_district(input);
        } else if (pathname.startsWith('/zip/')){
            if(input === '') return no_input_response;
            out = await get_elections_from_ZIP(env, input);
        }

        else {
            return new Response(JSON.stringify({
                ok: false,
                message: '404 Not Found. This endpoint does not exist.'
            }),{
				status: 404,
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'max-age=3600, public',
				},
			})
        }
		return new Response(
			JSON.stringify({
				ok: true,
				message: random_quote(),
				results: out,
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'max-age=3600, public',
				},
			},
		);
	} catch (error) {
		console.log(error);
		return new Response(
			JSON.stringify({
				ok: false,
				message: String(error),
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'max-age=3600, public',
				},
			},
		);
	}
}
