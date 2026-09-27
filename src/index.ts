import { wrap } from "./API_wrapper";
import { get_district_from_ZIP } from "./ZIPs";

export default {
	async fetch(request, env, ctx): Promise<Response> {
		return wrap(request, env, ctx);
	},
} satisfies ExportedHandler<Env>;
