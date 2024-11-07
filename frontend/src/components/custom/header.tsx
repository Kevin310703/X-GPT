import Link from "next/link";

import { getUserMeLoader } from "@/app/data/services/get-user-me-loader";
// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";

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

export async function Header() {
    const user = await getUserMeLoader();
    console.log("User:", user)
    // State for selected model
    // const [selectedModel, setSelectedModel] = useState("T5");

    // // Handle model selection change
    // const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     setSelectedModel(event.target.value);
    // };

    return (

        <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md dark:bg-gray-800">
            <h2 className="text-xl text-[#1B2559] text-center">
                <span className="font-bold">X-OR</span> AI GENERATIVE
            </h2>

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
            
            <div className="flex items-center gap-4">
                <Link href="/auth/signin"><Button>Sign In</Button></Link>
                <Link href="/auth/signup"><Button>Sign Up</Button></Link>
            </div>
        </div>
    );
}