"use client";

import { useEffect } from "react";
import { useChat } from "@/components/provider/chat-provider";
import { fetchChatSessionsByDocumentId } from "@/app/data/loaders";

const ChatManager = ({ authToken, documentId }: { authToken: string, documentId: string }) => {
  const { setChatSessions } = useChat();

  useEffect(() => {
    const loadChatSessions = async () => {
      const chatSessions = await fetchChatSessionsByDocumentId(authToken, documentId);
      setChatSessions(chatSessions);
    };

    loadChatSessions();
  }, [authToken]);

  return null; // Không cần render gì
};

export default ChatManager;
