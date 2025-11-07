import Cookies from "js-cookie";

const BASE_URL = "/api"; // Proxied via Next route handler to https://back-3-yciv.onrender.com

// ---------------- TYPES ----------------
export interface SignupData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface User {
  username: string;
  email?: string;
  full_name?: string;
  disabled?: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// Other interfaces (Album, Song, Artist, DashboardData) remain unchanged

// ---------------- AUTH ----------------

// Signup
export const signup = async (data: SignupData): Promise<User> => {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);
  if (data.full_name) formData.append("full_name", data.full_name);

  const res = await fetch(`/auth/signup`, {
    method: "POST",
    body: formData,
     credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// Login
export const login = async (username: string, password: string): Promise<Token> => {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const res = await fetch(`/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    credentials: "include", // uses cookies
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// Logout
export const logout = async (): Promise<void> => {
  await fetch(`/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};

// Get current user (no arguments needed)
export const getCurrentUser = async (): Promise<User> => {
  const res = await fetch(`/auth/users/me`, { credentials: "include" });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};
