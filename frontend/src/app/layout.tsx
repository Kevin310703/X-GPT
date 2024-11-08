import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/custom/header";
import { Footer } from "@/components/custom/footer";
import { getGlobalPageMetadata } from "@/app/data/loaders";
import { getUserMeLoader } from "./data/services/get-user-me-loader";
import { ModelProvider } from "@/components/provider/model-provider";
import Link from "next/link";
import { LogoutButton } from "@/components/custom/logout-button";
import { ModelForm } from "@/components/forms/model-form";

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

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ModelProvider>
          {user.ok ? (
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
                    className="w-5 h-5 transform transition-transform duration-200 hover:scale-125" />
                  Create new chat
                </button>

                <div className="flex-1 overflow-y-auto">
                  <div>
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
                  </div>
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
                        <input type="checkbox" id="toggle-dropdown" className="hidden" />
                        <label htmlFor="toggle-dropdown">
                          <img
                            src={`http://localhost:1337${user.data?.image?.url}`}
                            alt="Profile"
                            className="w-8 h-8 rounded-full cursor-pointer" />
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
        </ModelProvider>
      </body>
    </html>
  );
}
