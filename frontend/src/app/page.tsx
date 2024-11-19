// pages/Home.tsx
"use client";

import { useEffect, useState } from "react";
import { ChatMessage } from "../components/types";
import { ChattingStart } from "@/components/custom/chatting-start-home";
import { useModel } from "@/components/provider/model-provider";
import { ClientWrapper } from "@/components/custom/client-wrapper";
import { getStrapiURL } from "@/lib/utils";

interface Model {
  id: number;
  documentId: string;
  Name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiResponse {
  data: Model[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export default function Home() {
  const [chatData, setChatData] = useState<ChatMessage[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const baseUrl = getStrapiURL();

  useEffect(() => {
    async function fetchModels() {
      try {
        const url = new URL("/api/models", baseUrl);
        const res = await fetch(url);
        const data: StrapiResponse = await res.json();

        console.log("Response from Strapi:", data);

        const models = data.data.map((item: Model) => item.Name);
        setAvailableModels(models);
        console.log("Available models:", models);
      } catch (error) {
        console.error("Error fetching models:", error);
        setAvailableModels(["T5"]); // Model mặc định khi xảy ra lỗi
      }
    }

    fetchModels();
  }, []);

  return (
    <div className="flex h-screen">
      <main className="flex-1 container mx-auto p-2">
        <div className="flex flex-col h-full">
          <div className="flex-grow mt-6">
            <ClientWrapper>
              {({ selectedModel }) => (
                <ChattingStart data={chatData} selectedModel={selectedModel} />
              )}
            </ClientWrapper>
          </div>
        </div>
      </main>
    </div>
  );
}
