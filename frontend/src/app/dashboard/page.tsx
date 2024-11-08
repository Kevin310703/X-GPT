import Link from "next/link";
import { Chatting } from "../../components/custom/chatting";
import { ChatMessage } from "../../components/types";
import { getUserMeLoader } from "@/app/data/services/get-user-me-loader";

import { LogoutButton } from "../../components/custom/logout-button";
import { DashboardProvider } from "@/components/provider/dashboard-provicder";

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

export default async function DashboardRoute() {
  // const [chatData, setChatData] = useState<ChatMessage[]>([]);
  const chatData: ChatMessage[] = [];
  const user = await getUserMeLoader();
  console.log(user);

  return (
    <DashboardProvider>
      <div className="flex h-screen">
        <main className="flex-1 container mx-auto p-2">
          <div className="flex flex-col h-full">
            <div className="flex-grow">
              <Chatting data={chatData} />
            </div>
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}
