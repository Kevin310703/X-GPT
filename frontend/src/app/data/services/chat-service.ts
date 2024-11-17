import { getStrapiURL } from "@/lib/utils";

const baseUrl = getStrapiURL();

// Define the type of a single chat session
interface ChatSession {
    id: string | number;
    documentId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

// Define the structure of the API response
interface ChatSessionsResponse {
    data: ChatSession[];
}

export async function createChatSessionService(title: string, userId: string, authToken: string) {
    const url = new URL("/api/chat-sessions", baseUrl);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                data: { title,
                    users_permissions_user: userId,
                 }, // Đúng cấu trúc JSON Strapi yêu cầu
            }),
            cache: "no-cache",
        });

        return response.json();
    } catch (error) {
        console.error("Create chat session service error:", error);
    }
}

const getChatSessionsDocumentIdById = async (id: string) => {
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

export async function updateNameChatSessionService(sessionId: string, title: string, authToken: string) {
    const documentId = await getChatSessionsDocumentIdById(sessionId);
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

export async function deleteChatSessionService(sessionId: string, authToken: string) {
    const documentId = await getChatSessionsDocumentIdById(sessionId);
    const sessionUrl = new URL(`/api/chat-sessions/${documentId}`, baseUrl);
    const messagesUrl = new URL(`/api/chat-messages`, baseUrl); // URL cho các messages

    try {
        // Gọi API để lấy tất cả các messages liên kết với session
        const messagesResponse = await fetch(`${messagesUrl}?filters[chat_session][id][$eq]=${sessionId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!messagesResponse.ok) {
            throw new Error(`Failed to fetch messages for chat session. Status: ${messagesResponse.status}`);
        }

        const messagesData = await messagesResponse.json();

        // Xóa từng message liên kết với session
        const deletePromises = messagesData.data.map(async (message: { documentId: string }) => {
            const messageUrl = new URL(`/api/chat-messages/${message.documentId}`, baseUrl);
            const response = await fetch(messageUrl.toString(), {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete message with ID: ${message.documentId}. Status: ${response.status}`);
            }
        });

        // Chờ tất cả các promises xóa message hoàn thành
        await Promise.all(deletePromises);

        // Xóa session sau khi xóa các messages
        const sessionResponse = await fetch(sessionUrl, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!sessionResponse.ok) {
            throw new Error(`Failed to delete chat session. Status: ${sessionResponse.status}`);
        }

        // Trả về trạng thái thành công
        return { success: true };
    } catch (error) {
        console.error("Delete chat session service error:", error);
        return { success: false, error: error };
    }
}

export async function fetchChatSessionId(authToken: string): Promise<string[]> {
    const url = new URL(`/api/chat-sessions`, baseUrl);

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch chat sessions: ${response.statusText}`);
        }

        const result: ChatSessionsResponse = await response.json();

        // Log the data for debugging
        console.log("Chat session data:", result);

        return result.data.map((session) => {
            if (!session.id) {
                throw new Error("Missing `Id` in chat session object.");
            }
            return String(session.id); // Ensure ID is a string
        });
    } catch (error) {
        console.error("Error fetching chat session Id:", error);
        return [];
    }
}

export async function deleteAllChatSessions(authToken: string): Promise<void> {
    try {
        const sessionIds = await fetchChatSessionId(authToken);

        console.log(sessionIds)

        if (sessionIds.length === 0) {
            console.log("No chat sessions to delete.");
            return;
        }

        // Delete sessions sequentially
        for (const sessionId of sessionIds) {
            deleteChatSessionService(sessionId, authToken);
        }

        console.log("All chat sessions deleted successfully.");
    } catch (error) {
        console.error("Error deleting all chat sessions:", error);
        throw error; // Rethrow to handle the error in the calling function
    }
}
