"use client";

import axios from "axios";
import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
import { useChat } from "@/components/provider/chat-provider";

interface ChatSession {
    id: number;
    documentId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export async function createChatSession(title: string, authToken: string) {
    const url = "http://localhost:1337/api/chat-sessions";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ title }),
    });

    if (!response.ok) {
        throw new Error(`Failed to create chat session: ${response.statusText}`);
    }

    return await response.json();
}

const NewChatButton = ({ authToken }: { authToken: string }) => {
    // const router = useRouter();
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const { setSelectedChatId } = useChat(); // Sử dụng setSelectedChatId từ ChatProvider
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchChatSessions = async () => {
        try {
            const response = await axios.get("http://localhost:1337/api/chat-sessions", {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            setChatSessions(response.data.data || []);
            setError(null); // Xóa lỗi nếu có
        } catch (err) {
            setError("Failed to fetch chat sessions. Please try again later.");
            console.error("Error fetching chat sessions:", err);
        }
    };

    const createNewChat = async () => {
        if (isLoading) return; // Ngăn chặn nếu đang xử lý yêu cầu
        setIsLoading(true); // Bắt đầu tải

        try {
            const newChat = await createChatSession("New Chat", authToken);
            console.log("New Chat Session Created:", newChat);
            await fetchChatSessions(); // Cập nhật danh sách Chat Sessions

            // if (response.data && response.data.data) {
            //     const newChat = response.data.data;
            //     await fetchChatSessions(); // Đồng bộ danh sách
            //     setSelectedChatId(newChat.id);
            // } else {
            //     console.error("Unexpected response format:", response.data);
            // }

            // if (!response.ok) {
            //     console.error("Failed to create new chat:", response.statusText);
            //     throw new Error(`Error: ${response.status}`);
            // }

            // return response.json();
        } catch (err) {
            console.error("Error creating a new chat:", err);
        } finally {
            setIsLoading(false); // Kết thúc tải
        }
    };

    const handleChatSelection = (chatId: number) => {
        setSelectedChatId(chatId); // Cập nhật chat session ID
        // router.push(`/dashboard/chat/${chatId}`);
        // console.log("ok");
    };

    useEffect(() => {
        if (authToken) {
            fetchChatSessions();
        }
    }, [authToken]);

    return (
        <aside>
            {error && (
                <div className="p-2 mb-4 text-red-700 bg-red-100 rounded">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <button
                disabled={isLoading}
                onClick={createNewChat}
                className={`${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-50"
                    } flex items-center gap-2 w-full text-[#1B2559] font-semibold bg-white py-2 px-4 rounded-lg shadow-md`}
            >
                <img
                    src="/star.svg"
                    alt="Star"
                    className="w-5 h-5 transform transition-transform duration-200 hover:scale-125"
                />
                {isLoading ? "Creating..." : "Create new chat"}
            </button>
            {/* <ul>
                {chatSessions.map((session) => (
                    <li
                        key={session.id}
                        className="cursor-pointer hover:text-indigo-500"
                        onClick={() => handleChatSelection(session.id)}
                    >
                        {session.title || "Untitled Chat"}
                    </li>
                ))}
            </ul> */}
        </aside>

    );
};

export default NewChatButton;
