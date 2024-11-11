'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type ChatSession = {
    id: string;
    documentId: string;
    title: string;
};

type SortedChats = {
    today: ChatSession[];
    yesterday: ChatSession[];
    thisWeek: ChatSession[];
    lastWeek: ChatSession[];
    thisMonth: ChatSession[];
    lastMonth: ChatSession[];
};

export default function ChatList({ sortedChats }: { sortedChats: SortedChats }) {
    const pathname = usePathname();

    const isActive = (sessionId: string, documentId: string) => {
        return pathname === `/dashboard/chat/${sessionId}-${documentId}`;
    };

    return (
        <div>
            {sortedChats.today.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-bold text-black">To day</h3>
                    <ul className="mt-2 space-y-1">
                        {sortedChats.today.map((session) => (
                            <li
                                key={session.id}
                                className={`cursor-pointer hover:bg-gradient-to-r hover:from-[#4A25E1] hover:to-[#7B5AFF] hover:text-white
                                    ${isActive(session.id, session.documentId) ? 'bg-gradient-to-r from-[#4A25E1] to-[#7B5AFF] text-white' : 'bg-inherit'} p-2 rounded-md`}>
                                <Link href={`/dashboard/chat/${session.id}-${session.documentId}`}>
                                    {session.title || 'Untitled Chat'}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {sortedChats.yesterday.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-bold text-black">Yesterday</h3>
                    <ul className="mt-2 space-y-1 text-gray-600">
                        {sortedChats.yesterday.map(session =>
                            <li key={session.id}
                                className={`cursor-pointer hover:bg-gradient-to-r hover:from-[#4A25E1] hover:to-[#7B5AFF] hover:text-white
                            ${isActive(session.id, session.documentId) ? 'bg-gradient-to-r from-[#4A25E1] to-[#7B5AFF] text-white' : 'bg-inherit'} p-2 rounded-md`}>
                                <Link href={`/dashboard/chat/${session.id}-${session.documentId}`}>
                                    {session.title || "Untitled Chat"}
                                </Link>
                            </li>)}
                    </ul>
                </div>
            )}

            {sortedChats.thisWeek.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-bold text-black">This week</h3>
                    <ul className="mt-2 space-y-1 text-gray-600">
                        {sortedChats.thisWeek.map(session =>
                            <li key={session.id}
                                className={`cursor-pointer hover:bg-gradient-to-r hover:from-[#4A25E1] hover:to-[#7B5AFF] hover:text-white
                            ${isActive(session.id, session.documentId) ? 'bg-gradient-to-r from-[#4A25E1] to-[#7B5AFF] text-white' : 'bg-inherit'} p-2 rounded-md`}>
                                <Link href={`/dashboard/chat/${session.id}-${session.documentId}`}>
                                    {session.title || "Untitled Chat"}
                                </Link>
                            </li>)}
                    </ul>
                </div>
            )}

            {sortedChats.lastWeek.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-bold text-black">Last week</h3>
                    <ul className="mt-2 space-y-1 text-gray-600">
                        {sortedChats.lastWeek.map(session =>
                            <li key={session.id}
                                className={`cursor-pointer hover:bg-gradient-to-r hover:from-[#4A25E1] hover:to-[#7B5AFF] hover:text-white
                            ${isActive(session.id, session.documentId) ? 'bg-gradient-to-r from-[#4A25E1] to-[#7B5AFF] text-white' : 'bg-inherit'} p-2 rounded-md`}>
                                <Link href={`/dashboard/chat/${session.id}-${session.documentId}`}>
                                    {session.title || "Untitled Chat"}
                                </Link>
                            </li>)}
                    </ul>
                </div>
            )}

            {sortedChats.thisMonth.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-bold text-black">This month</h3>
                    <ul className="mt-2 space-y-1 text-gray-600">
                        {sortedChats.thisWeek.map(session =>
                            <li key={session.id}
                                className={`cursor-pointer hover:bg-gradient-to-r hover:from-[#4A25E1] hover:to-[#7B5AFF] hover:text-white
                            ${isActive(session.id, session.documentId) ? 'bg-gradient-to-r from-[#4A25E1] to-[#7B5AFF] text-white' : 'bg-inherit'} p-2 rounded-md`}>
                                <Link href={`/dashboard/chat/${session.id}-${session.documentId}`}>
                                    {session.title || "Untitled Chat"}
                                </Link>
                            </li>)}
                    </ul>
                </div>
            )}

            {sortedChats.lastMonth.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-bold text-black">Last month</h3>
                    <ul className="mt-2 space-y-1 text-gray-600">
                        {sortedChats.lastMonth.map(session =>
                            <li key={session.id}
                                className={`cursor-pointer hover:bg-gradient-to-r hover:from-[#4A25E1] hover:to-[#7B5AFF] hover:text-white
                            ${isActive(session.id, session.documentId) ? 'bg-gradient-to-r from-[#4A25E1] to-[#7B5AFF] text-white' : 'bg-inherit'} p-2 rounded-md`}>
                                <Link href={`/dashboard/chat/${session.id}-${session.documentId}`}>
                                    {session.title || "Untitled Chat"}
                                </Link>
                            </li>)}
                    </ul>
                </div>
            )}
        </div>
    );
}
