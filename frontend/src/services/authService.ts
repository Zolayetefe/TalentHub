import { api } from "./api";
import type { User } from "../types/types";

type AuthResponse = {
  user: User;
};

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
  return data;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: User["role"] = "applicant"
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", { name, email, password, role });
  return data;
}

// Check user session (for page reload)
export async function getCurrentUser(): Promise<AuthResponse> {
  const { data } = await api.get<AuthResponse>("/auth/me"); // Backend should provide this
  return data;
}

// Logout
export async function logoutUser(): Promise<void> {
  await api.post("/auth/logout"); // This clears the cookie on server side
}
