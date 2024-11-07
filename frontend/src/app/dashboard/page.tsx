import Link from "next/link";
import { Chatting } from "../../components/custom/chatting";
import { ChatMessage, HeaderBlock, FooterBlock, PageBlock, ChattingBlock } from "../../components/types";
import { getUserMeLoader } from "@/app/data/services/get-user-me-loader";

import { LogoutButton } from "../../components/custom/logout-button";

interface AuthUserProps {
  username: string;
  email: string;
}

export function LoggedInUser({
  userData,
}: {
  readonly userData: AuthUserProps;
}) {
  return (
    <div className="flex gap-2">
      <Link
        href="/dashboard/account"
        className="font-semibold hover:text-primary"
      >
        {userData.username}
      </Link>
      <LogoutButton />
    </div>
  );
}

async function getChatSessions(userId: number) {
  const baseUrl = "http://localhost:1337";
  try {
    const response = await fetch(baseUrl + `/api/chat-sessions?filters[user][id][$eq]=${userId}&populate=messages`);
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

export default async function DashboardRoute() {
  // const [chatData, setChatData] = useState<ChatMessage[]>([]);
  // const [header, setHeader] = useState<HeaderBlock | null>(null);
  // const [footer, setFooter] = useState<FooterBlock | null>(null);
  // const [selectedModel, setSelectedModel] = useState("T5");

  const user = await getUserMeLoader();
  console.log(user);

  // useEffect(() => {
  //   const fetchChatData = async () => {
  //     const chatSessions = await getChatSessions(1);

  //     if (chatSessions && chatSessions.data) {
  //       const chatData = chatSessions.data.map((session: any) => ({
  //         sessionId: session.id,
  //         title: session.attributes.title,
  //         messages: session.attributes.messages.data.map((message: any) => ({
  //           question: message.attributes.question,
  //           answer: message.attributes.answer,
  //           timestamp: message.attributes.timestamp,
  //         })),
  //       }));

  //       setChatData(chatData);
  //     }
  //   };

  //   fetchChatData();
  // }, []);

  // const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedModel(event.target.value);
  // };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-80 bg-white text-gray-800 h-screen flex flex-col shadow-lg p-3">
        <div className="mb-6">
          <h2 className="text-xl text-[#1B2559] text-center">
            <span className="font-bold">X-OR</span> AI GENERATIVE
          </h2>
        </div>

        <button className="flex items-center gap-2 w-full text-[#1B2559] font-semibold bg-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-50 mb-6">
          <img
            src="/star.svg"
            alt="Star"
            className="w-5 h-5 transform transition-transform duration-200 hover:scale-125"
          />
          Create new chat
        </button>

        <div className="flex-1 overflow-y-auto">
          <>
            {/* Hiển thị lịch sử chat khi có dữ liệu */}
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
          </>
        </div>

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
              <p className="font-semibold">{user.data.username}</p>
            </div>
            <LogoutButton />
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
                // value={selectedModel}
                // onChange={handleModelChange}
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
                <img src="/information.svg" alt="Informations" className="w-5 h-5" />
              </button>

              {/* Ảnh đại diện với chức năng dropdown */}
              <div className="relative inline-block">
                <input type="checkbox" id="toggle-dropdown" className="hidden" />
                <label htmlFor="toggle-dropdown">
                  <img
                    src="/default-male.jpg"
                    alt="Profile"
                    className="w-8 h-8 rounded-full cursor-pointer"
                  />
                </label>

                {/* Dropdown menu */}
                <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 hidden">
                  <ul className="py-1 text-gray-700">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <a href="/dashboard/account">Profile</a>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <a href="/settings">Settings</a>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <a href="/logout">Logout</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </header>

          {/* Chatting component */}
          <div className="flex-grow">
            {/* <Chatting data={chatData} selectedModel={selectedModel} isLoggedIn={true} /> */}
            {user.ok ? (
              <LoggedInUser userData={user.data} />
            ) : (
              <div>No content</div>
            )}
          </div>

          {/* Optional: Display footer content if available */}
          {/* {footer && <div className="text-center mt-4">{footer.Description}</div>} */}
        </div>
      </main >
    </div >
  );
}
