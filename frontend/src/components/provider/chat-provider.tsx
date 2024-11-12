"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ChatSession {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatContextType {
  selectedChatId: number | null;
  setSelectedChatId: (id: number | null) => void;
  chatSessions: ChatSession[];
  setChatSessions: (sessions: ChatSession[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  return (
    <ChatContext.Provider
      value={{ selectedChatId, setSelectedChatId, chatSessions, setChatSessions }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
