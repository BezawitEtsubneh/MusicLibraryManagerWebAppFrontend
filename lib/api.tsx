import Cookies from "js-cookie";

const BASE_URL = "/auth"; // All auth routes start with /auth

// ---------------- TYPES ----------------
export interface SignupData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface User {
  id?: number;
  username: string;
  email?: string;
  full_name?: string;
  disabled?: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// ---------------- AUTH ----------------

// Signup
export const signup = async (data: SignupData): Promise<User> => {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);
  if (data.full_name) formData.append("full_name", data.full_name);

  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// Login (OAuth2)
export const login = async (username: string, password: string): Promise<Token> => {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const res = await fetch(`${BASE_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    credentials: "include",
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// Logout
export const logout = async (): Promise<void> => {
  await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};
