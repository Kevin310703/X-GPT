"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { signIn } from "next-auth/react";
import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    CardFooter,
    Card,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { registerUserAction } from "@/app/data/actions/auth-actions";
import { ZodErrors } from "@/components/custom/zod-errors";
import { StrapiErrors } from "@/components/custom/strapi-errors";
import { SubmitButton } from "@/components/custom/submit-button";

const INITIAL_STATE = {
    data: null,
};

export function SignupForm() {
    const [formState, formAction] = useActionState(
        registerUserAction,
        INITIAL_STATE
    );
    const [showPassword, setShowPassword] = useState(false); // Trạng thái cho mật khẩu
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Trạng thái cho xác nhận mật khẩu

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const usernameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (usernameRef.current) {
            usernameRef.current.focus();
        }
    }, []);

    const capitalizeFirstLetter = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    const handleKeyDown = (
        event: React.KeyboardEvent,
        nextRef: React.RefObject<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Ngừng hành động gửi form
            if (nextRef.current) {
                nextRef.current.focus(); // Chuyển focus sang trường tiếp theo
            }
        }
    };

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Khi tên người dùng thay đổi, chuẩn hóa và set lại giá trị
        const formattedUsername = capitalizeFirstLetter(event.target.value);
        event.target.value = formattedUsername;
    };

    return (
        <div className="w-full max-w-md mt-10">
            {/* Circular Image */}
            <img
                src="/star.png" // Replace with your image path
                alt="Circular Image"
                className="absolute top-[20px] left-1/2 transform -translate-x-1/2 w-10 h-10"
            />

            <form action={formAction}>
                <Card>
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-bold py-2">Sign Up</CardTitle>
                        <CardDescription>
                            Enter your details to create a new account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Nguyen Van A"
                                ref={usernameRef}
                                onChange={handleUsernameChange}
                                onKeyDown={(e) => handleKeyDown(e, emailRef)}
                            />
                            <ZodErrors error={formState?.zodErrors?.username} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="nguyenvana@gmail.com"
                                ref={emailRef}
                                onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                            />
                            <ZodErrors error={formState?.zodErrors?.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    ref={passwordRef}
                                    onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 576 512">
                                            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 640 512">
                                            <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>
                                    )}
                                </button>
                            </div>
                            <ZodErrors error={formState?.zodErrors?.password} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirm_password"
                                    name="confirm_password"
                                    type={showConfirmPassword ? "text" : "password"} // Thay đổi type
                                    placeholder="Confirm password"
                                    ref={confirmPasswordRef}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 576 512">
                                            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 640 512">
                                            <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>
                                    )}
                                </button>
                            </div>
                            <ZodErrors error={formState?.zodErrors?.confirm_password} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <SubmitButton
                            className="w-full bg-gradient-to-r from-[#4A25E1] to-[#7B5AFF] text-white font-semibold py-2 rounded-md 
                            hover:shadow-lg transition-colors"
                            text="Sign Up"
                            loadingText="Loading"
                        />
                        <StrapiErrors error={formState?.strapiErrors} />

                        <div className="flex items-center justify-center mt-4">
                            <hr className="flex-grow border-gray-300" />
                            <span className="mx-2 text-gray-500">_____or_____</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>
                        <div className="mt-4 flex space-x-2">
                            <button className="flex items-center justify-center bg-white border border-black font-semibold p-2 
                                rounded-full hover:backdrop-blur-lg hover:shadow-lg transition-colors"
                                onClick={() => signIn("google")}>
                                <img
                                    src="/color-icons-google.svg"
                                    alt="Google Icon"
                                    className="w-5 h-5 mx-4"
                                />
                            </button>

                            <button className="flex items-center justify-center bg-white border border-black font-semibold p-2 
                                rounded-full hover:backdrop-blur-lg hover:shadow-lg transition-colors"
                                onClick={() => signIn("github")}>
                                <img
                                    src="/color-icons-github.svg"
                                    alt="Google Icon"
                                    className="w-5 h-5 mx-4"
                                />
                            </button>

                            <button className="flex items-center justify-center bg-white border border-black font-semibold p-2 
                                rounded-full hover:backdrop-blur-lg hover:shadow-lg transition-colors"
                                onClick={() => signIn("facebook")}>
                                <img
                                    src="/color-icons-facebook.svg"
                                    alt="Google Icon"
                                    className="w-5 h-5 mx-4"
                                />
                            </button>
                        </div>
                    </CardFooter>
                </Card>
                <div className="mt-4 text-center text-sm">
                    Have an account?
                    <Link
                        className="font-bold bg-gradient-to-r from-[#4A25E1] to-[#7B5AFF] bg-clip-text 
                        text-transparent ml-2 hover:text-violet-900"
                        href="signin"
                    >
                        Sign In
                    </Link>
                </div>
            </form>
        </div>
    );
}
