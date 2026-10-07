import { authFetch } from "./client";

export type UserDto = {
    id: number;
    username: string;
    email: string;
    role?: string;
    active?: boolean;
    departmentName?: string | null;
}

export function fetchUsers(): Promise<UserDto[]> {
  return authFetch("/users");
}

