import ChattingStartRoute from "./chat/page";
import { getUserMeLoader } from "@/app/data/services/get-user-me-loader";

import { DashboardProvider } from "@/components/provider/dashboard-provicder";
import { getAuthToken } from "../data/services/get-token";

export default async function DashboardRoute() {
  const user = await getUserMeLoader();
  const authToken = await getAuthToken() ?? "";
  console.log(user);

  return (
    <DashboardProvider>
      <div className="flex h-screen">
        <main className="flex-1 container mx-auto p-2">
          <div className="flex flex-col h-full">
            <div className="flex-grow">
              <ChattingStartRoute authToken={authToken} userId={user.data.id} />
            </div>
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}
