"use client";

import { useRouter } from "next/router"; // Nếu bạn dùng `next/navigation`, cần điều chỉnh.
import { useEffect, useState } from "react";
import { useChat } from "@/components/provider/chat-provider";
import { Chatting } from "./chat";

export default function ChatRoute() {
    const router = useRouter();
    const { id } = router.query; // Lấy ID từ URL
    const { setSelectedChatId } = useChat(); // Quản lý chat ID trong context provider
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            setSelectedChatId(Number(id)); // Gán ID chat vào context
            setIsLoading(false); // Dừng trạng thái loading khi ID được xử lý
        }
    }, [id]);

    if (isLoading) {
        return <div>Loading chat...</div>;
    }

    return (
        <div className="flex h-screen">
            <main className="flex-1 container mx-auto p-2">
                <Chatting />
            </main>
        </div>
    );
}
