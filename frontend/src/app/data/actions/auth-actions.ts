"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { registerUserService, loginUserService, forgotPasswordService } from "@/app/data/services/auth-service";

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const schemaRegister = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .min(3, { message: "Username must be between 3 and 20 characters" })
    .max(20, { message: "Username must be between 3 and 20 characters" }),

  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password cannot exceed 20 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),

  confirm_password: z
    .string()
    .min(1, { message: "Confirm Password is required" }),

  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export async function registerUserAction(prevState: any, formData: FormData) {
  console.log(formData);
  if (!(formData instanceof FormData)) {
    console.error("Expected formData to be a FormData instance, received:", formData);
    return;
  }

  const validatedFields = schemaRegister.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors, // chứa lỗi cho từng trường
      strapiErrors: null,
      message: "Missing Fields. Failed to Register.",
    };
  }

  const { confirm_password, ...userData } = validatedFields.data;
  const responseData = await registerUserService(userData);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Failed to Register.",
    };
  }

  // const requestCookies = await cookies();
  // requestCookies.set("jwt", responseData.jwt, config);
  redirect("/auth/signin");
}

const schemaLogin = z.object({
  identifier: z
    .string()
    .min(3, {
      message: "Identifier must have at least 3 or more characters",
    })
    .max(100, {
      message: "Please enter a valid username or email address",
    }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password cannot exceed 20 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
});

export async function loginUserAction(prevState: any, formData: FormData) {
  console.log(formData);

  const validatedFields = schemaLogin.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Login.",
    };
  }

  const responseData = await loginUserService(validatedFields.data);
  
  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      message: "Failed to Login.",
    };
  }

  const requestCookies = await cookies();
  requestCookies.set("jwt", responseData.jwt, config);

  redirect("/dashboard/");
}

export async function logoutAction() {
  const requestCookies = await cookies();
  requestCookies.set("jwt", "", { ...config, maxAge: 0 });
  redirect("/");
}

const schemaForgotPassword = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const validatedFields = schemaForgotPassword.safeParse({
      email: formData.get("email"),
  });

  if (!validatedFields.success) {
      return {
          ...prevState,
          zodErrors: validatedFields.error.flatten().fieldErrors,
          message: "Invalid email address.",
      };
  }

  const responseData = await forgotPasswordService(validatedFields.data.email);

  if (responseData?.error) {
      return {
          ...prevState,
          strapiErrors: responseData.error,
          zodErrors: null,
          message: "Failed to send reset email.",
      };
  }

  return {
      ...prevState,
      message: "Password reset email sent successfully.",
      strapiErrors: null,
      zodErrors: null,
  };
}