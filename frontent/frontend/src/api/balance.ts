import { authFetch } from "./client";

export type BalanceDto = {
  giveablePoints: number;
  lastResetDate: string;
  receivedThisMonth: number;
  ranking: number | null;
}

export function fetchMyBalance(): Promise<BalanceDto> {
  return authFetch("/balances/me");
}