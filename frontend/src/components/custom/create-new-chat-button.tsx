"use client";

import { useState, useEffect } from "react";
import { createChatSessionService } from "@/app/data/services/chat-service";
import { fetchChatSessions } from "@/app/data/loaders";

const NewChatButton = ({ authToken, userId }: { authToken: string, userId: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const createNewChat = async () => {
        if (isLoading) return; // Ngăn chặn nếu đang xử lý yêu cầu
        setIsLoading(true); // Bắt đầu tải

        try {
            const newChat = await createChatSessionService("New chat", userId, authToken);
            console.log("New Chat Session Created:", newChat);
            fetchChatSessions(authToken); // Cập nhật danh sách Chat Sessions
            setSuccessMessage('Created new chat successfully!'); // Hiển thị thông báo thành công
            setErrorMessage(null);

            setTimeout(() => {
                window.location.reload();
                setSuccessMessage(null);
            }, 2000); // Ẩn sau 5 giây
        } catch (err) {
            console.error("Error creating a new chat:", err);
            setErrorMessage("Failed to create new chat. Please try again."); // Hiển thị thông báo lỗi
            setSuccessMessage(null);
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
            {/* Thông báo thành công */}
            {successMessage && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md 
        transition-transform transform duration-500 ease-out animate-fadeIn z-50">
                    {successMessage}
                </div>
            )}

            {/* Hiển thị thông báo lỗi */}
            {errorMessage && (
                <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-2 rounded mb-4">
                    {errorMessage}
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
