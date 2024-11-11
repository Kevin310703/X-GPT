import { getStrapiURL } from "@/lib/utils";

const baseUrl = getStrapiURL();

export async function createChatSessionService(title: string, authToken: string) {
    const url = new URL("/api/chat-sessions", baseUrl);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                data: { title }, // Đúng cấu trúc JSON Strapi yêu cầu
            }),
            cache: "no-cache",
        });

        return response.json();
    } catch (error) {
        console.error("Create chat session service error:", error);
    }
}