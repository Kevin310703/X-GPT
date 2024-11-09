import { getStrapiURL } from "@/lib/utils";
import { getAuthToken } from "./get-token";

interface RegisterUserProps {
  username: string;
  password: string;
  email: string;
}

interface LoginUserProps {
  identifier: string;
  password: string;
}

interface ResetPasswordProps {
  password: string;
  passwordConfirmation: string;
}

interface ChangePasswordProps {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

const baseUrl = getStrapiURL();

export async function registerUserService(userData: RegisterUserProps) {
  const url = new URL("/api/auth/local/register", baseUrl);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
      cache: "no-cache",
    });

    return response.json();
  } catch (error) {
    console.error("Registration Service Error:", error);
  }
}

export async function loginUserService(userData: LoginUserProps) {
  const url = new URL("/api/auth/local", baseUrl);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
      cache: "no-cache",
    });

    return response.json();
  } catch (error) {
    console.error("Login Service Error:", error);
    throw error;
  }
}

export async function forgotPasswordService(email: string) {
  const url = new URL("/api/auth/forgot-password", baseUrl);

  console.log(email)

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      // In ra thông báo lỗi chi tiết từ backend để debug
      console.error("Error response data:", data);
      throw new Error(data.message || "Failed to send reset email");
    }

    return data;
  } catch (error) {
    // Log lỗi chi tiết để dễ dàng xử lý
    console.error("Error in forgotPasswordService:", error);
    throw error;
  }
}

export async function resetPasswordService(passwordData: ResetPasswordProps, code: string) {
  const url = new URL("/api/auth/reset-password", baseUrl);

  try {
    const authToken = await getAuthToken();
    if (!authToken) return { ok: false, data: null, error: null };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        password: passwordData.password,
        passwordConfirmation: passwordData.passwordConfirmation,
        code: code,
      }),      
      cache: "no-cache",
    });

    return response.json();
  } catch (error) {
    console.error("Reset Password Service Error:", error);
    throw error;
  }
}

export async function changePasswordService(passwordData: ChangePasswordProps) {
  const url = new URL("/api/auth/change-password", baseUrl);

  try {
    const authToken = await getAuthToken();
    if (!authToken) return { ok: false, data: null, error: null };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify(passwordData),
      cache: "no-cache",
    });

    return response.json();
  } catch (error) {
    console.error("Change Password Service Error:", error);
    throw error;
  }
}