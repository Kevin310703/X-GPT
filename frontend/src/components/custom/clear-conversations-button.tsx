"use client";

import React, { useState } from "react";
import { deleteAllChatSessions } from "@/app/data/services/chat-service";
import ConfirmModal from "./confirm-modal";

export function ClearConversationsButton({ authToken }: { authToken: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleClearConversations = async () => {
        setIsDeleting(true);
        setMessage(null);

        try {
            await deleteAllChatSessions(authToken);
            setMessage("All conversations have been cleared successfully!");

            setTimeout(() => {
                window.location.reload();
                window.location.href = "/dashboard/"; // Chuyển sang Chatting
                setMessage(null);
            }, 2000);
        } catch (error) {
            setMessage("Failed to clear conversations. Please try again.");
            console.error("Error clearing conversations:", error);
        } finally {
            setIsDeleting(false);
            setIsModalOpen(false); // Close modal after action
        }
    };

    return (
        <div>
            {message && (
                <div className={`fixed top-16 right-4 ${message.includes("success") ? "bg-green-500" : "text-red-500"} text-white px-4 py-2 rounded-lg shadow-md 
        transition-transform transform duration-500 ease-out animate-fadeIn z-50`}>
                    {message}
                </div>
            )}

            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 hover:text-gray-800 mb-3"
            >
                <img
                    src="/trash.svg"
                    alt="Clear"
                    className="w-5 h-5 transform transition-transform duration-200 hover:scale-125"
                />
                Clear conversations
            </button>

            <ConfirmModal
                isOpen={isModalOpen}
                title="Confirm Deletion"
                message="Are you sure you want to delete all chat sessions? This action cannot be undone."
                onConfirm={handleClearConversations}
                onCancel={() => setIsModalOpen(false)}
            />
        </div>
    );
}
