// pages/Home.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Chatting } from "../components/custom/chatting";
import Link from 'next/link';
import { ChatMessage, HeaderBlock, FooterBlock, PageBlock, ChattingBlock } from "../components/types";

async function getStrapiData(url: string) {
  const baseUrl = "http://localhost:1337";
  try {
    const response = await fetch(baseUrl + url);
    if (!response.ok) {
      console.error("Failed to fetch data: ", response.status);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
}

export default function Home() {
  const [chatData, setChatData] = useState<ChatMessage[]>([]);
  const [header, setHeader] = useState<HeaderBlock | null>(null);
  const [footer, setFooter] = useState<FooterBlock | null>(null);
  const [selectedModel, setSelectedModel] = useState("T5");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    // const userLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Kiểm tra trạng thái đăng nhập
    // if (userLoggedIn) {
    //   // Nếu đã đăng nhập, chuyển hướng tới trang Dashboard
    //   router.push("/dashboard/");
    // }

  //   if (userLoggedIn) {
  //     const fetchData = async () => {
  //       const strapiData = await getStrapiData("/api/home-page?populate=*");
  //       if (strapiData && strapiData.data && strapiData.data.blocks) {
  //         // Extract chat messages
  //         const chatMessages = strapiData.data.blocks
  //           .filter((block: PageBlock): block is ChattingBlock => block.__component === "layout.chatting")
  //           .map((block: ChattingBlock) => ({
  //             question: block.question,
  //             answer: block.answer,
  //           }));
  //         setChatData(chatMessages);

  //         // Extract header and footer if available
  //         const headerData = strapiData.data.blocks.find(
  //           (block: PageBlock) => block.__component === "layout.header"
  //         ) as HeaderBlock;
  //         const footerData = strapiData.data.blocks.find(
  //           (block: PageBlock) => block.__component === "layout.footer"
  //         ) as FooterBlock;

  //         setHeader(headerData || null);
  //         setFooter(footerData || null);
  //       }
  //     };

  //     fetchData();
  //   }
  // }, []);

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  return (
    <div className="flex h-screen">
      <main className="flex-1 container mx-auto p-2">
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <Chatting data={chatData} selectedModel={selectedModel} isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </main>
    </div>
  );
}
