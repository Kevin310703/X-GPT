"use client";

import { useModel } from "@/components/provider/model-provider";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import { detectLanguage, queryStableDiffusion, queryVietAI } from "@/app/data/services/model-service";

interface ChatMessage {
    user_question: string;
    chatbot_response: string;
}

async function uploadImage(blob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append("files", blob);

    const response = await fetch("http://localhost:1337/api/upload", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const result = await response.json();
    return result[0].url; // Trả về URL của ảnh đã upload
}

async function downloadImage(imageUrl: string) {
    try {
        // Kiểm tra nếu URL hợp lệ
        if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
            throw new Error("Invalid image URL");
        }

        // Tải dữ liệu ảnh bằng fetch
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch the image. Status: ${response.status}`);
        }

        // Chuyển đổi dữ liệu thành Blob
        const blob = await response.blob();

        // Tạo URL Blob tạm thời
        const downloadUrl = URL.createObjectURL(blob);

        // Tạo thẻ <a> để tải xuống
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "downloaded_image.png";

        // Kích hoạt hành động tải xuống
        document.body.appendChild(link); // Thêm vào DOM để hoạt động
        link.click();
        document.body.removeChild(link); // Gỡ bỏ sau khi hoàn tất

        // Giải phóng URL Blob
        URL.revokeObjectURL(downloadUrl);

        console.log("Image downloaded successfully");
    } catch (error) {
        console.error("Error downloading the image:", error);
    }
}

export default function Chatting() {
    const params = useParams<{ id?: string | string[] }>();
    const idCombo = Array.isArray(params.id) ? params.id[0] : params.id;
    const id = idCombo ? idCombo.split('-')[0] : null;

    const searchParams = useSearchParams();
    const initialQuestion = searchParams.get("question"); // Lấy câu hỏi từ query parameter

    const { selectedModel } = useModel();
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [loadingIndex, setLoadingIndex] = useState<number | null>(null); // Trạng thái loading xử lý request
    const [isInitialLoading, setIsInitialLoading] = useState(true); // Thêm trạng thái loading tải dữ liệu ngay khi mới vào trang

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Hàm xử lý khi cuộn
    const handleScroll = () => {
        if (!chatContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;

        // Hiển thị nút scroll khi không ở cuối
        if (scrollHeight - scrollTop > clientHeight + 50) {
            setShowScrollButton(true);
        } else {
            setShowScrollButton(false);
        }
    };

    // Hàm cuộn xuống cuối
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        // Cuộn xuống cuối khi có tin nhắn mới
        scrollToBottom();
    }, [chatHistory]);

    useEffect(() => {
        if (id) {
            fetchChatMessages(id);
        }
    }, [id]);

    useEffect(() => {
        // Gọi API để tải dữ liệu
        const loadInitialData = async () => {
            try {
                setIsInitialLoading(true); // Bắt đầu hiệu ứng loading
                await fetchChatMessages(id ?? ""); // Hàm API
            } catch (err) {
                console.error("Error loading initial data:", err);
            } finally {
                setIsInitialLoading(false); // Kết thúc hiệu ứng loading
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        // Nếu có câu hỏi ban đầu, thêm nó vào chatHistory và xử lý
        if (initialQuestion) {
            setChatHistory((prevChat) => [
                ...prevChat,
                { user_question: initialQuestion, chatbot_response: "loading..." },
            ]);
            handleAutoReply(initialQuestion); // Tự động xử lý câu hỏi
        }
    }, [initialQuestion]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = async () => {
        if (inputValue.trim()) {
            const userQuestion = inputValue.trim();
            setInputValue("");
            setIsLoading(true);

            // Cập nhật chatHistory với câu hỏi của người dùng
            setChatHistory((prevChat) => [
                ...prevChat,
                { user_question: userQuestion, chatbot_response: "loading..." },
            ]);

            await handleAutoReply(userQuestion); // Xử lý câu hỏi
            setIsLoading(false);
        }
    };

    const handleAutoReply = async (question: string) => {
        try {
            let aiResponse = "";
            let imageUrl = "";

            if (selectedModel === "Stable Diffusion") {
                const imageBlob = await queryStableDiffusion(question);
                imageUrl = await uploadImage(imageBlob); // Upload ảnh lên máy chủ và lấy URL

                aiResponse = imageUrl;
            } else {
                const language = await detectLanguage(question);
                const language_target = language === "en" ? "vi" : "en";
                aiResponse = await queryVietAI(question);
                console.log("Translated text:", aiResponse); // Kết quả dịch
            }

            // Cập nhật message với phản hồi thật từ API
            setChatHistory((prevChat) => {
                const updatedChat = [...prevChat];
                updatedChat[updatedChat.length - 1].chatbot_response = aiResponse;
                return updatedChat;
            });

            await sendMessage(question, aiResponse);
            await fetchChatMessages(id ?? "");
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
            setLoadingIndex(null); // Tắt hiệu ứng loading
        }
    };

    const fetchChatMessages = async (chatId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:1337/api/chat-sessions/${chatId}`);
            const result = await response.json();

            if (result.data && result.data.chat_messages) {
                // Cập nhật chatbot_response nếu là đường dẫn tương đối
                const updatedMessages = result.data.chat_messages.map((message: ChatMessage) => {
                    if (message.chatbot_response.startsWith("/uploads/")) {
                        return {
                            ...message,
                            chatbot_response: `http://localhost:1337${message.chatbot_response}`,
                        };
                    }
                    return message;
                });

                setChatHistory(updatedMessages);
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

    const sendMessage = async (question: string, answer: string) => {
        if (!id) return;

        // Xác định loại dữ liệu trả về (text hoặc image)
        const isImage = answer.startsWith("blob:")
            || answer.startsWith("http://")
            || answer.startsWith("https://")
            || answer.startsWith("/uploads/");
        const requestType = isImage ? "image" : "text";

        const newMessage = {
            data: {
                request_type: requestType,
                chat_session: id,
                user_question: question,
                chatbot_response: answer,
            },
        };

        try {
            const response = await fetch(`http://localhost:1337/api/chat-messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newMessage),
            });

            if (!response.ok) {
                throw new Error(`Failed to save message: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    if (isInitialLoading) {
        // Hiển thị giao diện loading
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="loader-fetchdata"></div> {/* Hiệu ứng spinner */}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-white shadow p-6">
            <div className="flex-grow overflow-y-auto space-y-4"
                ref={chatContainerRef}
                onScroll={handleScroll}>
                {chatHistory.length === 0 ? (
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
                ) : (
                    chatHistory.map((message, index) => (
                        <div key={index} className="animate-fade-in">
                            <div className="flex justify-end mb-2">
                                <div className="bg-blue-500 text-white rounded-lg p-3 max-w-md text-right">
                                    <h2 className="text-md text-justify font-semibold">{message.user_question}</h2>
                                </div>
                                <img
                                    src="/default-male.jpg"
                                    alt="User Avatar"
                                    className="w-10 h-10 rounded-full ml-2 mr-5"
                                />
                            </div>
                            <div className="flex justify-start mb-2">
                                <img
                                    src="/avt-chatbot.svg"
                                    alt="AI Avatar"
                                    className="w-10 h-10 rounded-full mr-2"
                                />

                                {message.chatbot_response === "loading..." ? (
                                    <div className="bg-gray-200 text-black rounded-lg p-3 max-w-md">
                                        <div className="flex items-center space-x-2">
                                            <div className="loader"></div>
                                            <p>Processing...</p>
                                        </div>
                                    </div>
                                ) : message.chatbot_response.startsWith("http://") ||
                                    message.chatbot_response.startsWith("https://") ? (
                                    <div className="bg-gray-200 text-black rounded-lg p-3 max-w-md">
                                        <div className="flex flex-col items-start">
                                            <img
                                                src={message.chatbot_response}
                                                alt="Stable Diffusion Output"
                                                className="max-w-full h-auto mb-2"
                                            />
                                            <button
                                                onClick={() => {
                                                    downloadImage(message.chatbot_response)
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
                                    </div>
                                ) : (

                                    <div className="bg-gray-200 text-black rounded-lg p-3 max-w-md">
                                        {typeof message.chatbot_response === "string" ? (
                                            <p>{message.chatbot_response}</p>
                                        ) : (
                                            message.chatbot_response
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="sticky bottom-0 mt-4 mb-12 flex flex-col space-y-4">
                <div className="flex justify-center items-center">
                    {/* Nút cuộn xuống */}
                    {showScrollButton === true ? (
                        <button
                            onClick={scrollToBottom}
                            className="flex items-center font-bold gap-2 bg-gray-100 py-2 px-4 rounded-full 
                            shadow-md hover:bg-gray-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                    ) : (
                        <button
                            onClick={handleRegenerate}
                            className="flex items-center gap-2 bg-gray-100 py-2 px-4 rounded-full shadow-md hover:bg-gray-200"
                            disabled={isLoading}
                        >
                            <span className="text-gray-600">↻</span>
                            <span className="text-gray-600">Regenerate response</span>
                        </button>
                    )}
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
