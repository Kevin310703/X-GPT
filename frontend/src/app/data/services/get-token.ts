import { cookies } from "next/headers";

export async function getAuthToken() {
    const authToken = await cookies();
    authToken.get("jwt")?.value;

    const match = authToken.toString().match(/jwt=([^;]+)/);
    const jwtToken = match ? match[1] : null;
    return jwtToken;
}