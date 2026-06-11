export const Role = {
  ADMIN: "ADMIN",
  CLIENT: "CLIENT",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}
