import { authFetch } from "./client";

export function fetchMyBalance(): Promise<{ giveablePoints: number; lastResetDate: string }> {
  return authFetch("/balances/me");
}