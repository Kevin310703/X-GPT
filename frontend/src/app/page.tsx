// pages/Home.tsx
"use client";
import { useEffect, useState } from "react";
import { Chatting } from "./chatting";
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

  useEffect(() => {
    const userLoggedIn = false; // Thay đổi giá trị này thành true để giả lập đã đăng nhập
    setIsLoggedIn(userLoggedIn);

    if (userLoggedIn) {
      const fetchData = async () => {
        const strapiData = await getStrapiData("/api/home-page?populate=*");
        if (strapiData && strapiData.data && strapiData.data.blocks) {
          // Extract chat messages
          const chatMessages = strapiData.data.blocks
            .filter((block: PageBlock): block is ChattingBlock => block.__component === "layout.chatting")
            .map((block: ChattingBlock) => ({
              question: block.question,
              answer: block.answer,
            }));
          setChatData(chatMessages);

          // Extract header and footer if available
          const headerData = strapiData.data.blocks.find(
            (block: PageBlock) => block.__component === "layout.header"
          ) as HeaderBlock;
          const footerData = strapiData.data.blocks.find(
            (block: PageBlock) => block.__component === "layout.footer"
          ) as FooterBlock;

          setHeader(headerData || null);
          setFooter(footerData || null);
        }
      };

      fetchData();
    }
  }, []);

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  if (!isLoggedIn) {
    // Giao diện khi chưa đăng nhập
    return (
      <div className="relative flex flex-col items-center justify-center h-screen bg-gray-50">
        {/* Header */}
        <header className="w-full p-4 bg-white shadow-md flex justify-between items-center">
          {/* Chọn mô hình */}
          <div className="flex justify-center items-center">
            <h2 className="text-xl text-[#1B2559] text-center">
              <span className="font-bold">X-OR</span> AI GENERATIVE
            </h2>
  
            <select
              id="model-select"
              value={selectedModel}
              onChange={handleModelChange}
              className="text-lg font-bold bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:border-blue-500 p-2 transition duration-150 ease-in-out ml-4"
            >
              <option value="T5">T5</option>
              <option value="Stable Diffusion">Stable Diffusion</option>
            </select>
          </div>
  
          {/* Đăng nhập và Đăng ký */}
          <div className="flex gap-4">
            <button className="bg-gradient-to-r from-[#4A25E1] to-[#7B5AFF] text-white font-semibold rounded px-4 py-2 hover:bg-gray-800">
              Sign In
            </button>
            <button className="border border-gray-300 rounded px-4 py-2 hover:bg-gray-100">
              Sign Up
            </button>
          </div>
        </header>
  
        {/* Chatting component */}
        <div className="flex-grow mt-4 p-6 max-w-full w-full overflow-auto">
          <Chatting data={chatData} selectedModel={selectedModel} isLoggedIn={isLoggedIn} />
        </div>
      </div>
    );
  }  

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-80 bg-white text-gray-800 h-screen flex flex-col shadow-lg p-3">
        {/* Logo and Title */}
        <div className="mb-6">
          <h2 className="text-xl text-[#1B2559] text-center">
            <span className="font-bold">X-OR</span> AI GENERATIVE
          </h2>
        </div>

        {/* Button to create a new chat */}
        <button className="flex items-center gap-2 w-full text-[#1B2559] font-semibold bg-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-50 mb-6">
          <img
            src="/star.svg"
            alt="Star"
            className="w-5 h-5 transform transition-transform duration-200 hover:scale-125"
          />
          Create new chat
        </button>

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-700">Today</h3>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>The advantages of Artificial Intelligence</li>
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-700">Yesterday</h3>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>HTML basic</li>
              <li>What is AI</li>
              <li>T5 model</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-700">Last week</h3>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>Balanced Focal Loss Overview</li>
              <li>Competition vs Cooperation Strategies</li>
              <li>Translation Error Assistance</li>
            </ul>
          </div>
        </div>

        {/* Footer section */}
        <div className="border-t border-gray-200 pt-4 mt-4 text-sm text-gray-600">
          <button className="flex items-center gap-2 hover:text-gray-800 mb-3">
            <img
              src="/trash.svg"
              alt="Clear"
              className="w-5 h-5 transform transition-transform duration-200 hover:scale-125"
            />
            Clear conversations
          </button>
          <button className="flex items-center gap-2 hover:text-gray-800 mb-3">
            <img
              src="/external-link.svg"
              alt="Updates"
              className="w-5 h-5 transform transition-transform duration-200 hover:scale-125"
            />
            Updates & FAQ
          </button>
          <div className="flex items-center gap-3 mt-6">
            <img src="/default-male.jpg" alt="Profile" className="w-8 h-8 rounded-full" />
            <div className="flex-1">
              <p className="font-semibold">Chu Viet Kien</p>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700">
              <img
                src="/logout.svg"
                alt="Logout"
                className="w-5 h-5 transform transition-transform duration-200 hover:scale-125"
              />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 container mx-auto p-2">
        <div className="flex flex-col h-full">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-2 bg-white shadow">
            {/* Model Selection Dropdown */}
            <div className="text-2xl font-bold text-[#1B2559] flex items-center">
              <select
                id="model-select"
                value={selectedModel}
                onChange={handleModelChange}
                className="text-lg font-bold bg-white rounded-md shadow-sm focus:outline-none 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 transition duration-150 
                ease-in-out"
              >
                <option value="T5">T5</option>
                <option value="Stable Diffusion">Stable Diffusion</option>
              </select>
            </div>

            {/* Right icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-indigo-600">
                <img src="/bell.svg" alt="Notifications" className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-indigo-600">
                <img src="/moon.svg" alt="Dark Mode" className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-indigo-600">
                <img src="/information.svg" alt="Settings" className="w-5 h-5" />
              </button>
              <img
                src="/default-male.jpg"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </header>

          {/* Chatting component */}
          <div className="flex-grow">
            {chatData.length > 0 ? (
              <Chatting data={chatData} selectedModel={selectedModel} isLoggedIn={isLoggedIn} />
            ) : (
              <div>No chat data available.</div>
            )}
          </div>

          {/* Optional: Display footer content if available */}
          {footer && <div className="text-center mt-4">{footer.Description}</div>}
        </div>
      </main>
    </div>
  );
}
