import { authFetch } from "./client";

export type MonthlyRankingEntry = {
    rank: number;
    userId: number;
    username: string;
    departmentName: string;
    title: string | null;
    uniqueGivers?: number;
    pointsSum?: number;
}

export function fetchMonthlyTop(limit = 3): Promise<MonthlyRankingEntry[]>{
    return authFetch(`/rankings/monthly?limit=${limit}`);
}