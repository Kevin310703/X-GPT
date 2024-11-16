'use client';

import { deleteChatSessionService, updateNameChatSessionService } from '@/app/data/services/chat-service';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ConfirmModal from './confirm-modal';

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

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
      updateNameChatSessionService(sessionId, newName.trim(), authToken ?? "");
      setRenameSessionId(null); // Close rename input

      setSuccessMessage('Chat renamed successfully!'); // Hiển thị thông báo thành công
      setErrorMessage(null);


      setTimeout(() => {
        window.location.reload();
        setSuccessMessage(null);
      }, 2000); // Ẩn sau 3 giây
    } else {
      setErrorMessage("Failed to rename chat. Please try again."); // Hiển thị thông báo lỗi
      setSuccessMessage(null);
    }
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;

    try {
      const result = await deleteChatSessionService(sessionToDelete, authToken);

      if (result.success) {
        setSessionToDelete(null); // Reset session ID
        setIsModalOpen(false); // Đóng modal

        setSuccessMessage('Chat session deleted successfully!');
        setErrorMessage(null);

        setTimeout(() => {
          window.location.reload();
          setSuccessMessage(null);
        }, 2000);
      } else {
        console.error('Error deleting chat session:', result.error);
        setErrorMessage("Failed to delete chat session. Please try again.");
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error('Error deleting chat session:', error);
      setErrorMessage("Failed to delete chat session. Please try again.");
      setSuccessMessage(null);
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

        {/* Hiển thị ConfirmModal */}
        <ConfirmModal
          isOpen={isModalOpen}
          title="Delete Chat Session"
          message="Are you sure you want to delete this chat session? This action cannot be undone."
          onConfirm={handleDeleteSession}
          onCancel={() => {
            setIsModalOpen(false);
            setSessionToDelete(null);
          }}
        />

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
                    <li onClick={() => {
                      setIsModalOpen(true);
                      setSessionToDelete(session.id);
                    }}
                      className="px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer">
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
      {/* Thông báo thành công */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md 
        transition-transform transform duration-500 ease-out animate-fadeIn z-50">
          {successMessage}
        </div>
      )}

      {/* Hiển thị thông báo lỗi */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-2 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {renderChatGroup("Today", sortedChats.today)}
      {renderChatGroup("Yesterday", sortedChats.yesterday)}
      {renderChatGroup("This Week", sortedChats.thisWeek)}
      {renderChatGroup("Last Week", sortedChats.lastWeek)}
      {renderChatGroup("This Month", sortedChats.thisMonth)}
      {renderChatGroup("Last Month", sortedChats.lastMonth)}
    </div>
  );
}
