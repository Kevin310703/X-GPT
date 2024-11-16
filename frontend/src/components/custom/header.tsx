import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ModelForm } from "../forms/model-form";

export async function Header() {
    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md dark:bg-gray-800">
            <Link href="/" passHref>
                <h2 className="text-xl text-[#1B2559] text-center cursor-pointer">
                    <span className="font-bold">X-OR</span> AI GENERATIVE
                </h2>
            </Link>

            {<ModelForm />}

            <div className="flex items-center gap-4">
                <Link href="/auth/signin">
                    <Button>
                        Sign In
                    </Button>
                </Link>
                <Link href="/auth/signup">
                    <Button>
                        Sign Up
                    </Button>
                </Link>
            </div>
        </div>
    );
}