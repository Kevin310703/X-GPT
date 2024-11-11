"use client";

import axios from "axios";
import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
import { useChat } from "@/components/provider/chat-provider";
import { createChatSessionService } from "@/app/data/services/chat-service";
import { fetchChatSessions } from "@/app/data/loaders";

interface ChatSession {
    id: number;
    documentId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

const NewChatButton = ({ authToken }: { authToken: string }) => {
    // const router = useRouter();
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const { setSelectedChatId } = useChat(); // Sử dụng setSelectedChatId từ ChatProvider
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // const fetchChatSessions = async () => {
    //     try {
    //         const response = await axios.get("http://localhost:1337/api/chat-sessions", {
    //             headers: { Authorization: `Bearer ${authToken}` },
    //         });

    //         setChatSessions(response.data.data || []);
    //         setError(null); // Xóa lỗi nếu có
    //     } catch (err) {
    //         setError("Failed to fetch chat sessions. Please try again later.");
    //         console.error("Error fetching chat sessions:", err);
    //     }
    // };

    const createNewChat = async () => {
        if (isLoading) return; // Ngăn chặn nếu đang xử lý yêu cầu
        setIsLoading(true); // Bắt đầu tải

        try {
            const newChat = await createChatSessionService("New Chat", authToken);
            console.log("New Chat Session Created:", newChat);
            fetchChatSessions(authToken); // Cập nhật danh sách Chat Sessions
        } catch (err) {
            console.error("Error creating a new chat:", err);
        } finally {
            setIsLoading(false); // Kết thúc tải
        }
    };

    useEffect(() => {
        if (authToken) {
            fetchChatSessions(authToken);
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
        </aside>

    );
};

export default NewChatButton;
