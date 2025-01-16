import type { Metadata } from "next";
import React from 'react';
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/custom/header";
import { Footer } from "@/components/custom/footer";
import { fetchChatSessionsByDocumentId, getGlobalPageMetadata } from "@/app/data/loaders";
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
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  subWeeks,
  startOfMonth,
  endOfMonth,
  subMonths
} from 'date-fns';
import ChatList from "@/components/custom/chat-list";
import ChatManager from "@/components/custom/chat-manager";
import { logoutAction } from "./data/actions/auth-actions";
import ProfileDropdown from "@/components/custom/profile-dropdown";
import { ClearConversationsButton } from "@/components/custom/clear-conversations-button";
import { getStrapiURL } from "@/lib/utils";

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

  chatSessions.forEach((session: { updatedAt: string | number | Date; }) => {
    const createdAt = new Date(session.updatedAt);

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
    icons: {
      icon: '/favicon.ico', // Đường dẫn đến favicon
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authToken = await getAuthToken() ?? "";
  const user = authToken ? await getUserMeLoader() : null;
  const baseUrl = getStrapiURL();
  
  if (!authToken) {
    console.warn("Missing authentication token");
  } else if (!user?.ok) {
    console.warn("User is not authenticated");
  }

  // Kiểm tra trạng thái user và authToken
  const isAuthenticated = authToken && user?.ok;

  const chatSessions = await fetchChatSessionsByDocumentId(authToken, user?.data.documentId);
  const sortedChats = classifyChatsByDate(chatSessions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ModelProvider>
          <ChatProvider>
            {isAuthenticated ? (
              <><ChatManager authToken={authToken} documentId={user.data.documentId} />
                <div className="flex h-screen overflow-hidden">
                  {/* Sidebar */}
                  <aside className="w-80 bg-white text-gray-800 h-screen flex flex-col shadow-lg p-3">
                    <div className="mb-6">
                      <Link href="/dashboard" passHref>
                        <h2 className="text-xl text-[#1B2559] text-center cursor-pointer">
                          <span className="font-bold">X-OR</span> AI GENERATIVE
                        </h2>
                      </Link>
                    </div>

                    <NewChatButton authToken={authToken ?? ""} documentId={user.data.documentId} userId={user.data.id} />

                    <div className="flex-1 overflow-y-auto mt-4">
                      {/* Hiển thị lịch sử chat khi có dữ liệu */}
                      {Object.values(sortedChats).every((group) => group.length === 0) ? (
                        <div className="text-center text-gray-500 mt-24">
                          No conversations available.
                        </div>
                      ) : (
                        <ChatList sortedChats={sortedChats} authToken={authToken} />
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4 text-sm text-gray-600">
                      <ClearConversationsButton authToken={authToken} />
                      <Link href="/dashboard/updates-faq" passHref>
                        <button className="flex items-center gap-2 hover:text-gray-800 mb-3">
                          <img
                            src="/external-link.svg"
                            alt="Updates"
                            className="w-5 h-5 transform transition-transform duration-200 hover:scale-125"
                          />
                          <span>Updates & FAQ</span>
                        </button>
                      </Link>
                    </div>

                    <div className="flex items-center gap-3 mt-6">
                      <Link href={`/dashboard/account/${user.data.documentId}`} passHref>
                        <div className="flex items-center mr-28 gap-2">
                          <img src={baseUrl + `${user.data?.image?.url}`} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
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
                    <div className="flex flex-col h-full min-h-screen">
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

                          <Link href="/dashboard/information">
                            <button className="p-2 text-gray-500 hover:text-indigo-600">
                              <img src="/information.svg" alt="Informations" className="w-5 h-5" />
                            </button>
                          </Link>

                          {/* Ảnh đại diện với chức năng dropdown */}
                          <ProfileDropdown user={user} logoutAction={logoutAction} />
                        </div>
                      </div>

                      <div className="flex-grow overflow-y-auto min-h-screen">
                        {children}
                      </div>

                    </div>
                  </div>
                </div>
              </>
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
    </html >
  );
}
