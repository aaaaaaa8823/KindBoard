import { authFetch } from "./client";

export type UserDto = {
    id: number;
    username: string;
    email: string;
    role?: string;
    active?: boolean;
    departmentName?: string | null;
}

export type UpdateProfileResponse = {
  user: {
    id: number;
    username: string;
    email: string;
    role?: string;
    active?: boolean;
    departmentName?: string | null;
  };
  token: string;
  type: string;
};


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

export function updateProfile(data: {
  username: string;
  email: string;
}): Promise<UpdateProfileResponse> {
  return authFetch("/users/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
