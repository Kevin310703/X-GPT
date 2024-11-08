// pages/Home.tsx
"use client";

import { useState } from "react";
import { ChatMessage } from "../components/types";
import { ChattingStart } from "@/components/custom/chatting-start";
import { useModel } from "@/components/provider/model-provider";

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

async function getServerSideProps() {
  try {
    // Fetch danh sách models từ Strapi
    const res = await fetch("http://localhost:1337/api/models");
    const data: StrapiResponse = await res.json();

    console.log("Response from Strapi:", data);

    // Lấy danh sách model từ API
    const models = data.data.map((item: Model) => item.Name);

    console.log("Available models:", models);

    return {
      props: {
        availableModels: models, // Truyền danh sách model
        currentModel: models[0] || "T5", // Model mặc định
      },
    };
  } catch (error) {
    console.error("Error fetching models:", error);
    return {
      props: {
        availableModels: [],
        currentModel: "T5", // Model mặc định khi xảy ra lỗi
      },
    };
  }
}

export default function Home() {
  const [chatData, setChatData] = useState<ChatMessage[]>([]);
  const { selectedModel } = useModel();
  getServerSideProps();
  return (
    <div className="flex h-screen">
      <main className="flex-1 container mx-auto p-2">
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <ChattingStart data={chatData} selectedModel={selectedModel} />
          </div>
        </div>
      </main>
    </div>
  );
}
