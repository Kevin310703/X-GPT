import type { Metadata } from "next";
import React from 'react';
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/custom/header";
import { Footer } from "@/components/custom/footer";
import { fetchChatSessions, getGlobalPageMetadata } from "@/app/data/loaders";
import { getUserMeLoader } from "./data/services/get-user-me-loader";
import { ModelProvider } from "@/components/provider/model-provider";
import Link from "next/link";
import { LogoutButton } from "@/components/custom/logout-button";
import { ModelForm } from "@/components/forms/model-form";
import NewChatButton from "@/components/custom/create-new-chat-button";
import { getAuthToken } from "./data/services/get-token";
import { ChatProvider } from "@/components/provider/chat-provider";
import {
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  subWeeks,
  startOfMonth,
  endOfMonth,
  subMonths
} from 'date-fns';
import ChatList from "@/components/custom/chat-list";

const classifyChatsByDate = (chatSessions: any[]) => {
  const today: any[] = [];
  const yesterday: any[] = [];
  const thisWeek: any[] = [];
  const lastWeek: any[] = [];
  const thisMonth: any[] = [];
  const lastMonth: any[] = [];
  const earlier: any[] = [];

  const now = new Date();

  // Tuần này và tuần trước
  const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 }); // Tuần bắt đầu vào thứ Hai
  const endOfThisWeek = endOfWeek(now, { weekStartsOn: 1 }); // Tuần kết thúc vào Chủ nhật
  const startOfLastWeek = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
  const endOfLastWeek = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

  // Tháng này và tháng trước
  const startOfThisMonth = startOfMonth(now);
  const endOfThisMonth = endOfMonth(now);
  const startOfLastMonth = startOfMonth(subMonths(now, 1));
  const endOfLastMonth = endOfMonth(subMonths(now, 1));

  chatSessions.forEach((session: { createdAt: string | number | Date; }) => {
    const createdAt = new Date(session.createdAt);

    if (isToday(createdAt)) {
      today.push(session);
    } else if (isYesterday(createdAt)) {
      yesterday.push(session);
    } else if (isWithinInterval(createdAt, { start: startOfThisWeek, end: endOfThisWeek })) {
      thisWeek.push(session);
    } else if (isWithinInterval(createdAt, { start: startOfLastWeek, end: endOfLastWeek })) {
      lastWeek.push(session);
    } else if (isWithinInterval(createdAt, { start: startOfThisMonth, end: endOfThisMonth })) {
      thisMonth.push(session);
    } else if (isWithinInterval(createdAt, { start: startOfLastMonth, end: endOfLastMonth })) {
      lastMonth.push(session);
    } else {
      earlier.push(session);
    }
  });

  return { today, yesterday, thisWeek, lastWeek, thisMonth, lastMonth, earlier };
};

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getGlobalPageMetadata();
  const { title, description } = metadata?.data;

  return {
    title: title ?? "Epic Next Course",
    description: description ?? "Epic Next Course",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserMeLoader();
  const authToken = await getAuthToken();

  if (!authToken) {
    throw new Error("Authentication token is missing");
  }
  const chatSessions = await fetchChatSessions(authToken);
  const sortedChats = classifyChatsByDate(chatSessions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ModelProvider>
          <ChatProvider>
            {user.ok ? (
              <div className="flex h-screen">
                {/* Sidebar */}
                <aside className="w-80 bg-white text-gray-800 h-screen flex flex-col shadow-lg p-3">
                  <div className="mb-6">
                    <h2 className="text-xl text-[#1B2559] text-center">
                      <span className="font-bold">X-OR</span> AI GENERATIVE
                    </h2>
                  </div>

                  <NewChatButton authToken={authToken ?? ""} />

                  <div className="flex-1 overflow-y-auto mt-4">
                    {/* Hiển thị lịch sử chat khi có dữ liệu */}
                    <ChatList sortedChats={sortedChats} />
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4 text-sm text-gray-600">
                    <button className="flex items-center gap-2 hover:text-gray-800 mb-3">
                      <img
                        src="/trash.svg"
                        alt="Clear"
                        className="w-5 h-5 transform transition-transform duration-200 hover:scale-125" />
                      Clear conversations
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-800 mb-3">
                      <img
                        src="/external-link.svg"
                        alt="Updates"
                        className="w-5 h-5 transform transition-transform duration-200 hover:scale-125" />
                      Updates & FAQ
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <Link href="/dashboard/account" passHref>
                      <div className="flex items-center mr-28 gap-2">
                        <img src={`http://localhost:1337${user.data?.image?.url}`} alt="Profile" className="w-8 h-8 rounded-full" />
                        <div className="flex-1">
                          <p className="font-semibold">{user.data.username}</p>
                        </div>
                      </div>
                    </Link>
                    <LogoutButton />
                  </div>
                </aside>

                {/* Header */}
                <div className="flex-1 container mx-auto p-2">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-6 py-2 bg-white shadow">
                      {<ModelForm />}

                      {/* Right icons */}
                      <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-500 hover:text-indigo-600">
                          <img src="/bell.svg" alt="Notifications" className="w-5 h-5" />
                        </button>

                        <button className="p-2 text-gray-500 hover:text-indigo-600">
                          <img src="/moon.svg" alt="Dark Mode" className="w-5 h-5" />
                        </button>

                        <button className="p-2 text-gray-500 hover:text-indigo-600">
                          <img src="/information.svg" alt="Informations" className="w-5 h-5" />
                        </button>

                        {/* Ảnh đại diện với chức năng dropdown */}
                        <div className="relative inline-block">
                          <input type="checkbox" id="toggle-dropdown" className="hidden peer" />
                          <label htmlFor="toggle-dropdown" className="cursor-pointer">
                            <img
                              src={`http://localhost:1337${user.data?.image?.url}`}
                              alt="Profile"
                              className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-md hover:border-blue-500 transition-all duration-300"
                            />
                          </label>

                          {/* Dropdown menu */}
                          <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl ring-1 ring-gray-200 z-50 opacity-0 scale-95 transition-all duration-300 ease-out peer-checked:opacity-100 peer-checked:scale-100 peer-checked:translate-y-0">
                            <ul className="py-2 text-sm text-gray-700">
                              <li>
                                <a
                                  href="/dashboard/account"
                                  className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-700 transition-all rounded-lg"
                                >
                                  Profile
                                </a>
                              </li>
                              <li>
                                <a
                                  href="/auth/changepassword"
                                  className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-700 transition-all rounded-lg"
                                >
                                  Change password
                                </a>
                              </li>
                              <li>
                                <a
                                  href="/logout"
                                  className="block px-4 py-2 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all rounded-lg"
                                >
                                  Logout
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-grow">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Header />
                {children}
                <Footer />
              </>
            )}
          </ChatProvider>
        </ModelProvider>
      </body>
    </html>
  );
}
