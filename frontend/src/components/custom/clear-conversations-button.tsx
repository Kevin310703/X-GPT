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

            {message && (
                <p className={`mt-2 ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
