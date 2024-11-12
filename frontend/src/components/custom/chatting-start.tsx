// components/chatting-start.tsx

"use client";

import { useState, ChangeEvent, useEffect, useRef } from "react";
import { ChatMessage } from "../types";

interface ChattingStartProps {
    data: ChatMessage[];
    selectedModel: string;
}

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

export function ChattingStart({ data, selectedModel }: ChattingStartProps) {
    const [inputValue, setInputValue] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>(data || []);
    const [isLoading, setIsLoading] = useState(false);
    const [questionCount, setQuestionCount] = useState(0); // Đếm số câu hỏi
    const [showModal, setShowModal] = useState(false); // Trạng thái hiển thị modal
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSubmit = async () => {
        if (questionCount >= 5) {
            setShowModal(true); // Hiển thị modal nếu đạt giới hạn
            return; // Không xử lý thêm nếu đã đạt giới hạn
        }

        if (inputValue.trim()) {
            const userQuestion = inputValue.trim();
            setInputValue("");
            setIsLoading(true);
            setQuestionCount((prev) => prev + 1); // Tăng số lượng câu hỏi

            // Cập nhật chatHistory với câu hỏi từ người dùng
            setChatHistory((prevChat) => [
                ...prevChat,
                { question: userQuestion, answer: "loading..." },
            ]);

            try {
                let aiResponse;

                if (selectedModel === "Stable Diffusion") {
                    const imageBlob = await queryStableDiffusion(userQuestion);
                    const imageUrl = URL.createObjectURL(imageBlob);

                    aiResponse = (
                        <div className="flex flex-col items-start">
                            <img
                                src={imageUrl}
                                alt="Stable Diffusion Output"
                                className="max-w-full h-auto mb-2"
                            />
                            <button
                                onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = imageUrl;
                                    link.download = "stable_diffusion_output.png";
                                    link.click();
                                }}
                                className="flex items-center gap-2 bg-gradient-to-r from-[#4A25E1] to-[#7B5AFF] 
                                text-white px-3 py-1 rounded-lg text-sm hover:opacity-90"
                            >
                                <img
                                    src="/download-icon.svg"
                                    alt="Download Icon"
                                    className="w-4 h-4"
                                />
                                Download Image
                            </button>
                        </div>
                    );

                } else {
                    aiResponse = "This is a response from the T5 model.";
                }

                // Cập nhật chatHistory với phản hồi từ AI
                setChatHistory((prevChat) => {
                    const updatedChat = [...prevChat];
                    updatedChat[updatedChat.length - 1].answer = aiResponse;
                    return updatedChat;
                });
            } catch (error) {
                console.error("An error occurred:", error);
                setChatHistory((prevChat) => {
                    const updatedChat = [...prevChat];
                    updatedChat[updatedChat.length - 1].answer =
                        "An error occurred while processing your request.";
                    return updatedChat;
                });
            } finally {
                setIsLoading(false);
                setLoadingIndex(null); // Tắt hiệu ứng loading
            }
        }
    };

    const handleRegenerate = async () => {
        if (chatHistory.length > 0 && !isLoading) {
            const lastQuestion = chatHistory[chatHistory.length - 1].question;

            if (lastQuestion) {
                setIsLoading(true);

                // Cập nhật chatHistory với câu hỏi cuối cùng để hiển thị lại
                setChatHistory((prevChat) => [
                    ...prevChat,
                    { question: lastQuestion, answer: "" },
                ]);

                try {
                    let aiResponse;

                    if (selectedModel === "Stable Diffusion") {
                        const imageBlob = await queryStableDiffusion(lastQuestion);
                        const imageUrl = URL.createObjectURL(imageBlob);

                        aiResponse = (
                            <div className="flex flex-col items-start">
                                <img
                                    src={imageUrl}
                                    alt="Stable Diffusion Output"
                                    className="max-w-full h-auto mb-2"
                                />
                                <button
                                    onClick={() => {
                                        const link = document.createElement("a");
                                        link.href = imageUrl;
                                        link.download = "stable_diffusion_output.png";
                                        link.click();
                                    }}
                                    className="flex items-center gap-2 bg-gradient-to-r from-[#4A25E1] to-[#7B5AFF] 
                                    text-white px-3 py-1 rounded-lg text-sm hover:opacity-90"
                                >
                                    <img
                                        src="/download-icon.svg"
                                        alt="Download Icon"
                                        className="w-4 h-4"
                                    />
                                    Download Image
                                </button>
                            </div>
                        );
                    } else {
                        aiResponse = "This is a response from the T5 model.";
                    }

                    setChatHistory((prevChat) => {
                        const updatedChat = [...prevChat];
                        updatedChat[updatedChat.length - 1].answer = aiResponse;
                        return updatedChat;
                    });
                } catch (error) {
                    console.error("An error occurred:", error);
                    setChatHistory((prevChat) => {
                        const updatedChat = [...prevChat];
                        updatedChat[updatedChat.length - 1].answer =
                            "An error occurred while processing your request.";
                        return updatedChat;
                    });
                } finally {
                    setIsLoading(false);
                }
            }
        }
    };

    return (
        <div className="flex flex-col h-full p-6 items-center justify-center max-h-max">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-gray-800">
                How can I assist you today?
            </h1>
            <div
                ref={chatContainerRef}
                className="flex-grow w-full max-w-2xl p-4 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 280px)" }} // Giới hạn chiều cao
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
                                    {block.answer === "loading..." ? (
                                        <div className="bg-gray-200 text-black rounded-lg p-3 max-w-md">
                                            <div className="flex items-center space-x-2">
                                                <div className="loader"></div>
                                                <p>Processing...</p>
                                            </div>
                                        </div>
                                    ) : (
                                        typeof block.answer === "string" ? (
                                            <p>{block.answer}</p>
                                        ) : (
                                            block.answer
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex flex-col space-y-4 w-full max-w-2xl">
                <div className="flex justify-center items-center">
                    <button
                        onClick={handleRegenerate}
                        className="flex items-center gap-2 bg-gray-100 py-2 px-4 rounded-full shadow-md hover:bg-gray-200"
                        disabled={isLoading}
                    >
                        <span className="text-gray-600">↻</span>
                        <span className="text-gray-600">Regenerate response</span>
                    </button>
                </div>
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
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
                        <h2 className="text-xl font-bold text-gray-800">Limit Reached</h2>
                        <p className="text-gray-600 mt-2">
                            You have reached the limit of 5 questions. Please{" "}
                            <a
                                href="/auth/signin"
                                className="text-blue-600 hover:underline"
                            >
                                sign in
                            </a>{" "}
                            to continue.
                        </p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
