import { authFetch } from "./client";

export type UserDto = {
    id: number;
    username: string;
    email: string;
    role?: string;
    active?: boolean;
    departmentName?: string | null;
}

export type UpdateUserPayload = {
  username: string;
  email: string;
}


export function fetchUsers(): Promise<UserDto[]> {
  return authFetch("/users");
}

export async function changePassword(data:{
  currentPassword: string;
  newPassword: string;
}) {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:8080/api/users/me/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to change password");
  }
}

export async function updateUser(id: number, data: UpdateUserPayload){
  return authFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
