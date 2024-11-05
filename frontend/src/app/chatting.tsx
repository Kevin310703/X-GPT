// components/chatting.tsx

"use client";

import { useState, ChangeEvent, useEffect, useRef } from "react";
import { ChatMessage } from "../components/types"; // Adjust the path as necessary

interface ChattingProps {
    data: ChatMessage[];
    selectedModel: string;
    isLoggedIn: boolean;
}

export function Chatting({ data, selectedModel, isLoggedIn }: ChattingProps) {
    const [inputValue, setInputValue] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>(data || []);
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

            // Cập nhật chatHistory với câu hỏi từ người dùng
            setChatHistory((prevChat) => [
                ...prevChat,
                { question: userQuestion, answer: "" },
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

    // Render UI cho người chưa đăng nhập
    const renderGuestView = () => (
        <div className="flex flex-col h-full p-6 items-center justify-center max-h-max">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">How can I assist you today?</h1>
            <div
                ref={chatContainerRef}
                className="flex-grow overflow-y-auto space-y-4 w-full max-w-2xl"
            >
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

    // Render UI cho người đã đăng nhập
    const renderChatView = () => (
        <div className="flex flex-col h-full bg-gray-100 shadow rounded-lg p-6">
            <div
                ref={chatContainerRef}
                className="flex-grow overflow-y-auto space-y-4"
                style={{ maxHeight: "calc(100vh - 250px)", /* adjust according to your layout */ }}
            >
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

            <div className="mt-4 flex flex-col space-y-4">
                <div className="flex justify-between">
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
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:border-indigo-500"
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

    return (
        <div>
            {isLoggedIn ? renderChatView() : renderGuestView()}
            {/* {chatHistory.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Chat History:</h3>
                    <ul>
                        {chatHistory.map((block, index) => (
                            <li key={index} className="mt-2">
                                <strong>Q:</strong> {block.question}<br />
                                <strong>A:</strong> {block.answer ? (typeof block.answer === "string" ? block.answer : <div>{block.answer}</div>) : "No response yet."}
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}
        </div>
    );
}
