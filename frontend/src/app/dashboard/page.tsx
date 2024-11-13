import ChattingStartRoute from "./chat/page";
import { ChatMessage } from "../../components/types";
import { getUserMeLoader } from "@/app/data/services/get-user-me-loader";

import { DashboardProvider } from "@/components/provider/dashboard-provicder";

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
              <ChattingStartRoute />
            </div>
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}
