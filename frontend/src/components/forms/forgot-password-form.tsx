"use client";

import Link from "next/link";
import { useActionState } from "react";
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
import { ZodErrors } from "@/components/custom/zod-errors";
import { SubmitButton } from "@/components/custom/submit-button";
import { forgotPasswordAction } from "@/app/data/actions/auth-actions";

const INITIAL_STATE = {
    zodErrors: null,
    data: null,
    message: null,
};

export function ForgotPasswordForm() {
    const [formState, formAction] = useActionState(
        forgotPasswordAction,
        INITIAL_STATE
    );

    return (
        <div className="w-full max-w-md relative">
            {/* Back to Sign In Link */}
            <Link href="/auth/signin" 
            className="absolute top-[-40px] left-0 text-gray-600 
            hover:text-indigo-600 transition-colors mb-4">
                ← Back to Sign In
            </Link>

            {/* Circular Image */}
            <img
                src="/star.png" // Replace with your image path
                alt="Circular Image"
                className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 w-10 h-10"
            />

            <form action={formAction}>
                <Card>
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-bold py-2">Forgot Password</CardTitle>
                        <CardDescription>
                            Enter your email to reset your password
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Username@example.com"
                            />
                            <ZodErrors error={formState?.zodErrors?.email} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <SubmitButton
                            className="w-full bg-gradient-to-r from-[#4A25E1] to-[#7B5AFF] text-white font-semibold py-2 rounded-md 
                            hover:shadow-lg transition-colors"
                            text="Reset Password"
                            loadingText="Loading"
                        />
                        {formState.message && (
                            <p className="mt-2 text-center text-sm text-green-600">{formState.message}</p>
                        )}
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
