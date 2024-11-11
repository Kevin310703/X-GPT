"use client";

import { useModel } from "@/components/provider/model-provider";
import { useParams } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";

interface ChatMessage {
    user_question: string;
    chatbot_response: string;
}

export default function Chatting() {
    const params = useParams<{ id?: string | string[] }>();
    const idCombo = Array.isArray(params.id) ? params.id[0] : params.id;
    const id = idCombo ? idCombo.split('-')[0] : null;

    const { selectedModel } = useModel();
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (id) {
            fetchChatMessages(id as string); // Lấy tin nhắn bằng ID
        }
    }, [id]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

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
                { chatbot_response: userQuestion, user_question: "" },
            ]);

            try {
                let aiResponse;
                let imageUrl = "";

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

                    // Nếu aiResponse là React element, bạn có thể chuyển thành chuỗi mô tả hoặc lưu một giá trị thay thế
                    const responseAsString = typeof aiResponse === "string"
                        ? aiResponse
                        : "[Generated Image]"; // Hoặc một chuỗi mô tả khác

                    updatedChat[updatedChat.length - 1].chatbot_response = responseAsString;
                    return updatedChat;
                });

                console.log(userQuestion + " " + typeof aiResponse === "string" ? aiResponse : "Image response")

                // Sau khi có câu trả lời từ AI, lưu tin nhắn vào database
                await sendMessage(userQuestion, imageUrl || aiResponse);

            } catch (error) {
                console.error("An error occurred:", error);
                setChatHistory((prevChat) => {
                    const updatedChat = [...prevChat];
                    updatedChat[updatedChat.length - 1].chatbot_response =
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
            const lastQuestion = chatHistory[chatHistory.length - 1].chatbot_response;

            if (lastQuestion) {
                setIsLoading(true);

                // Cập nhật chatHistory với câu hỏi cuối cùng để hiển thị lại
                setChatHistory((prevChat) => [
                    ...prevChat,
                    { chatbot_response: lastQuestion, user_question: "" },
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

                        // Nếu aiResponse là React element, bạn có thể chuyển thành chuỗi mô tả hoặc lưu một giá trị thay thế
                        const responseAsString = typeof aiResponse === "string"
                            ? aiResponse
                            : "[Generated Image]"; // Hoặc một chuỗi mô tả khác

                        updatedChat[updatedChat.length - 1].chatbot_response = responseAsString;
                        return updatedChat;
                    });
                } catch (error) {
                    console.error("An error occurred:", error);
                    setChatHistory((prevChat) => {
                        const updatedChat = [...prevChat];
                        updatedChat[updatedChat.length - 1].chatbot_response =
                            "An error occurred while processing your request.";
                        return updatedChat;
                    });
                } finally {
                    setIsLoading(false);
                }
            }
        }
    };

    const fetchChatMessages = async (chatId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:1337/api/chat-sessions/${chatId}`);
            const result = await response.json();

            // Kiểm tra và lấy dữ liệu từ đúng vị trí
            if (result.data && result.data.chat_messages) {
                setChatHistory(result.data.chat_messages); // Sử dụng chat_messages
            } else {
                console.warn("No messages found in chat session.");
                setChatHistory([]);
            }
        } catch (err) {
            console.error("Error fetching chat messages:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (question: string, answer: string | React.ReactNode) => {
        if (!id || !inputValue.trim()) return;

        // Helper function để kiểm tra nếu `answer` là React element
        const isReactElement = (node: React.ReactNode): node is React.ReactElement =>
            typeof node === "object" && node !== null && "props" in node;

        // Xác định `chatbot_response` dựa trên kiểu dữ liệu của `answer`
        let chatbotResponse = "";

        if (typeof answer === "string") {
            chatbotResponse = answer;
        } else if (isReactElement(answer)) {
            chatbotResponse = answer.props?.children?.[0]?.props?.src || "";
        }

        // Thiết lập message mới trước khi gửi
        const newMessage = {
            data: {
                request_type: typeof answer === "string" ? "text" : "image",                  // Loại yêu cầu, có thể là "text" hoặc "image"
                chat_session: id,          // ID của session chat
                user_question: question,               // Câu hỏi từ người dùng
                chatbot_response: chatbotResponse // Đảm bảo chatbot_response là chuỗi
            }
        };

        // Thêm message vào chat history tạm thời để hiển thị nhanh trên giao diện
        setChatHistory((prev) => [
            ...prev,
            {
                user_question: question,
                chatbot_response: typeof answer === "string" ? answer : "[Generated Image]",
            },
        ]);

        try {
            // Gửi request POST để lưu message vào Strapi
            const response = await fetch(
                `http://localhost:1337/api/chat-messages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newMessage),
                }
            );

            // Lấy message đã lưu từ phản hồi của Strapi
            const savedMessage = await response.json();

            // Cập nhật chat history với message đã lưu (nếu cần thiết)
            setChatHistory((prev) =>
                prev.map((msg, idx) => (idx === prev.length - 1 ? savedMessage.data : msg))
            );
        } catch (err) {
            console.error("Error sending message:", err);
        } finally {
            // Xóa nội dung trong input sau khi gửi
            setInputValue("");
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 shadow rounded-lg p-6">
            <div className="flex-grow overflow-y-auto space-y-4">
                {isLoading ? (
                    <p>Loading messages...</p>
                ) : (
                    <>
                        {chatHistory.map((message, index) => (
                            <div key={index} className="animate-fade-in">
                                <div className="flex justify-end mb-2">
                                    <div className="bg-blue-500 text-white rounded-lg p-3 max-w-md text-right">
                                        <h2 className="text-md font-semibold">{message.user_question}</h2>
                                    </div>
                                    <img
                                        src="/default-male.jpg"
                                        alt="User Avatar"
                                        className="w-10 h-10 rounded-full ml-2 mr-5"
                                    />
                                </div>
                                {message.chatbot_response && (
                                    <div className="flex justify-start mb-2">
                                        <img
                                            src="/avt-chatbot.svg"
                                            alt="AI Avatar"
                                            className="w-10 h-10 rounded-full mr-2"
                                        />
                                        <div className="bg-gray-200 text-black rounded-lg p-3 max-w-md">
                                            {typeof message.chatbot_response === "string" ? (
                                                <p>{message.chatbot_response}</p>
                                            ) : (
                                                message.chatbot_response
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>

            <div className="mt-4 flex flex-col space-y-4">
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
}
