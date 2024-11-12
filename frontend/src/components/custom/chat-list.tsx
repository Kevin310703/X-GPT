'use client';

import { updateChatSessionService } from '@/app/data/services/chat-service';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type ChatSession = {
  id: string;
  documentId: string;
  title: string;
  updatedAt: string;
};

type SortedChats = {
  today: ChatSession[];
  yesterday: ChatSession[];
  thisWeek: ChatSession[];
  lastWeek: ChatSession[];
  thisMonth: ChatSession[];
  lastMonth: ChatSession[];
};

function sortChatsByDate(chats: ChatSession[]): ChatSession[] {
  return chats.sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA; // Sắp xếp giảm dần
  });
}

function sortAllGroups(sortedChats: SortedChats): SortedChats {
  return {
    today: sortChatsByDate(sortedChats.today),
    yesterday: sortChatsByDate(sortedChats.yesterday),
    thisWeek: sortChatsByDate(sortedChats.thisWeek),
    lastWeek: sortChatsByDate(sortedChats.lastWeek),
    thisMonth: sortChatsByDate(sortedChats.thisMonth),
    lastMonth: sortChatsByDate(sortedChats.lastMonth),
  };
}

export default function ChatList({ sortedChats, authToken }: { sortedChats: SortedChats, authToken: string }) {
  const pathname = usePathname();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [renameSessionId, setRenameSessionId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const [sortedGroups, setSortedGroups] = useState<SortedChats>(sortedChats);
  useEffect(() => {
    const sortedData = sortAllGroups(sortedChats);
    setSortedGroups(sortedData); // Cập nhật state với dữ liệu đã sắp xếp
  }, [sortedChats]);

  const isActive = (sessionId: string, documentId: string) => {
    return pathname === `/dashboard/chat/${sessionId}-${documentId}`;
  };

  // Hàm xử lý khi bấm ra ngoài
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenMenuId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuToggle = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleRenameSubmit = (e: React.FormEvent<HTMLFormElement>, sessionId: string) => {
    e.preventDefault();
    if (newName.trim()) {
      const updatedChat = updateChatSessionService(sessionId, newName.trim(), authToken ?? "");
      console.log("Chat renamed successfully", updatedChat);

      setRenameSessionId(null); // Close rename input
      // Làm mới trang sau khi tạo chat mới
      window.location.reload();
    }
  };

  const renderChatGroup = (
    groupTitle: string,
    chatGroup: ChatSession[],
    className?: string
  ) => (
    chatGroup.length > 0 && (
      <div className="mb-4">
        <h3 className="text-sm font-bold text-black">{groupTitle}</h3>
        <ul className={`mt-2 space-y-1 ${className || "text-gray-600"}`}>
          {chatGroup.map((session) => (
            <li
              key={session.id}
              className={`relative cursor-pointer hover:bg-gradient-to-r hover:from-[#4A25E1] hover:to-[#7B5AFF] hover:text-white
                ${isActive(session.id, session.documentId)
                  ? "bg-gradient-to-r from-[#4A25E1] to-[#7B5AFF] text-white"
                  : "bg-inherit"
                } p-2 rounded-md flex justify-between items-center`}
            >
              {/* Nếu đang rename */}
              {renameSessionId === session.id ? (
                <form
                  onSubmit={(e) => handleRenameSubmit(e, session.id)}
                  className="flex items-center gap-1 w-full"
                >
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-black px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 w-3/4"
                    placeholder="Enter new name"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition duration-200 shadow-md"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <Link href={`/dashboard/chat/${session.id}-${session.documentId}`}>
                  {session.title || "Untitled Chat"}
                </Link>
              )}

              {/* Dấu ... để mở menu */}
              <button
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuToggle(session.id);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v.01M12 12v.01M12 18v.01"
                  />
                </svg>
              </button>
              {/* Menu tùy chọn */}
              {openMenuId === session.id && (
                <div ref={menuRef}
                  className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                  <ul className="py-1 text-gray-700">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Share
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setRenameSessionId(session.id);
                        setNewName(session.title || "");
                        setOpenMenuId(null);
                      }}
                    >
                      Rename
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Archive
                    </li>
                    <li className="px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer">
                      Delete
                    </li>
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    )
  );

  return (
    <div>
      {renderChatGroup("Today", sortedChats.today)}
      {renderChatGroup("Yesterday", sortedChats.yesterday)}
      {renderChatGroup("This Week", sortedChats.thisWeek)}
      {renderChatGroup("Last Week", sortedChats.lastWeek)}
      {renderChatGroup("This Month", sortedChats.thisMonth)}
      {renderChatGroup("Last Month", sortedChats.lastMonth)}
    </div>
  );
}
