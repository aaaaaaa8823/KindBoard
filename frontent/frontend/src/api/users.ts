import { authFetch } from "./client";

export type UserDto = {
    id: number;
    username: string;
    email: string;
    // department: string;
}

export function fetchUsers(): Promise<UserDto[]> {
  return authFetch("/users");
}

