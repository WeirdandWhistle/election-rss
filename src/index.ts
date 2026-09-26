export default {
	async fetch(request, env, ctx): Promise<Response> {
		const pathname = new URL(request.url).pathname;

		
		
		
		return new Response('404 Not Found.',{status: 404});
	},
} satisfies ExportedHandler<Env>;
