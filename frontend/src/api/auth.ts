import apiClient from "./client";

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
}

export async function fetchProfile(): Promise<UserProfile> {
  const res = await apiClient.get<UserProfile>("/auth/profile");
  return res.data;
}

export async function updateProfile(data: { name?: string; email?: string; password?: string }): Promise<UserProfile> {
  const res = await apiClient.patch<UserProfile>("/auth/profile", data);
  return res.data;
}
