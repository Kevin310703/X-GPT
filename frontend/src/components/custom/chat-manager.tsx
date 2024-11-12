"use client";

import { useEffect } from "react";
import { useChat } from "@/components/provider/chat-provider";
import { fetchChatSessions } from "@/app/data/loaders";

const ChatManager = ({ authToken }: { authToken: string }) => {
  const { setChatSessions } = useChat();

  useEffect(() => {
    const loadChatSessions = async () => {
      const chatSessions = await fetchChatSessions(authToken);
      setChatSessions(chatSessions);
    };

    loadChatSessions();
  }, [authToken]);

  return null; // Không cần render gì
};

export default ChatManager;
