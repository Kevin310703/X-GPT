// components/chatting-start.tsx

"use client";

import { ChatMessage } from "@/components/types";
import { useState, ChangeEvent, useEffect, useRef, useContext } from "react";
import { useDashboardContext } from "@/components/provider/dashboard-provicder";
import { createChatSessionService } from "@/app/data/services/chat-service";

export default function ChattingStartRoute({ authToken, userId }: { authToken: string, userId: string }) {
    const { selectedModel } = useDashboardContext(); // Lấy selectedModel từ DashboardContext
    const [inputValue, setInputValue] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    async function queryStableDiffusion(prompt: string) {
        const API_KEY = "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";
        if (!API_KEY) {
            throw new Error("API key is not set.");
        }

        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        return await response.blob();
    }

    const handleSubmit = async () => {
        if (inputValue.trim()) {
            const userQuestion = inputValue.trim();
            setInputValue("");
            setIsLoading(true);
    
            try {
                // Gọi API để tạo phiên chat mới
                const newChat = await createChatSessionService("New chat", userId, authToken);
                if (!newChat || !newChat.data || !newChat.data.id) {
                    throw new Error("Failed to create a new chat session.");
                }
    
                const newChatId = newChat.data.id;
    
                // Điều hướng sang trang Chatting với câu hỏi
                const chatSessionURL = `/dashboard/chat/${newChatId}?question=${encodeURIComponent(
                    userQuestion
                )}`;
                window.location.href = chatSessionURL; // Chuyển sang Chatting
            } catch (error) {
                console.error("Error creating or navigating to new chat session:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    return (
        <div className="flex flex-col h-full p-6 items-center justify-center max-h-max">
            <div className="flex flex-col items-center justify-center space-y-4 py-14">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-gray-800">
                    How can I assist you today?
                </h1>

                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-500 rounded-full shadow text-blue-600 hover:bg-blue-100"
                        disabled
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                        Generate Image
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-500 rounded-full shadow text-yellow-600 hover:bg-yellow-100"
                        disabled
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        Summarize Text
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-500 rounded-full shadow text-purple-600 hover:bg-purple-100"
                        disabled
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 6h13M8 12h10m-6 6h6M3 6h.01M3 12h.01M3 18h.01"
                            />
                        </svg>
                        Help Me Write
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-500 rounded-full shadow text-green-600 hover:bg-green-100"
                        disabled
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 10h11M9 21V3m11 7h-7m0 0l-3 3m3-3l3-3"
                            />
                        </svg>
                        Analyze Data
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-500 rounded-full shadow text-gray-600 hover:bg-gray-100"
                        disabled
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 10h11M9 21V3m11 7h-7m0 0l-3 3m3-3l3-3"
                            />
                        </svg>
                        More
                    </button>
                </div>
            </div>

            <div
                ref={chatContainerRef}
                className="flex-grow overflow-y-auto space-y-4 w-full max-w-2xl"
            >
                {/* Hiển thị phần chat của người dùng nếu có */}
                {chatHistory.map((block: ChatMessage, index: number) => (
                    <div key={index} className="animate-fade-in">
                        <div className="flex justify-end mb-2">
                            <div className="bg-blue-500 text-white rounded-lg p-3 max-w-md text-right">
                                <h2 className="text-md font-semibold">{block.question}</h2>
                            </div>
                            <img
                                src="/default-male.jpg"
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full ml-2 mr-5"
                            />
                        </div>

                        {block.answer && (
                            <div className="flex justify-start mb-2">
                                <img
                                    src="/avt-chatbot.svg"
                                    alt="AI Avatar"
                                    className="w-10 h-10 rounded-full mr-2"
                                />
                                <div className="bg-gray-200 text-black rounded-lg p-3 max-w-md">
                                    {typeof block.answer === "string" ? (
                                        <p>{block.answer}</p>
                                    ) : (
                                        block.answer
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex flex-col space-y-4 w-full max-w-2xl">
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={`Message for ${selectedModel}`}
                        className="flex-grow w-full max-w-2xl px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:border-indigo-500"
                        disabled={isLoading}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }}
                    />
                    <button
                        onClick={handleSubmit}
                        className={`bg-gradient-to-r from-[#4A25E1] to-[#7B5AFF] text-white font-semibold py-2 px-6 rounded-full shadow-md ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-600"
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : "Submit"}
                    </button>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">
                    {selectedModel} may produce inaccurate information about people,
                    places, or facts.
                </p>
            </div>
        </div>
    );
}
