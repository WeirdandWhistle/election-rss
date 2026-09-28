import { get_endpoint, update_endpoint_anylitics } from "./endpoints";
import { update_ip_anylitics } from "./ip";
import { update_zip_anylitics } from "./zip";

export async function update_anylitics(request:Request, env:Env, ctx:any) {
    const endpoint = get_endpoint(request);
    await update_endpoint_anylitics(env, endpoint);
    await update_ip_anylitics(env, String(request.headers.get('CF-Connecting-IP')));
    await update_zip_anylitics(request, env, endpoint);
}