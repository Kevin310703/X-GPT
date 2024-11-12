"use client";

import { useState, useEffect } from "react";
import { createChatSessionService } from "@/app/data/services/chat-service";
import { fetchChatSessions } from "@/app/data/loaders";

const NewChatButton = ({ authToken }: { authToken: string }) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const createNewChat = async () => {
        if (isLoading) return; // Ngăn chặn nếu đang xử lý yêu cầu
        setIsLoading(true); // Bắt đầu tải

        try {
            const newChat = await createChatSessionService("New Chat", authToken);
            console.log("New Chat Session Created:", newChat);
            fetchChatSessions(authToken); // Cập nhật danh sách Chat Sessions
            // Làm mới trang sau khi tạo chat mới
            window.location.reload();
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
