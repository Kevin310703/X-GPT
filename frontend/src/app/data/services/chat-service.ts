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

const getDocumentIdById = async (id: string) => {
    try {
        const response = await fetch(`http://localhost:1337/api/chat-sessions/${id}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch chat session by ID: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || !data.data) {
            throw new Error(`No chat session found with ID: ${id}`);
        }

        const documentId = data.data.documentId;
        console.log("Document ID:", documentId);

        return documentId;
    } catch (error) {
        console.error("Error fetching documentId:", error);
        return null;
    }
};

export async function updateChatSessionService(sessionId: string, title: string, authToken: string) {
    const documentId = await getDocumentIdById(sessionId);
    const url = new URL(`/api/chat-sessions/${documentId}`, baseUrl);

    try {
        const response = await fetch(url, {
            method: "PUT",
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