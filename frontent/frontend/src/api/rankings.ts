import { authFetch } from "./client";

export type MonthlyRankingEntry = {
    rank: number;
    userId: number;
    username: string;
    departmentName: string;
    title: string | null;
}

export type CategoryRankingEntry = {
    rank: number;
    userId: number;
    username: string;
    departmentName: string | null;
    count: number
}

export function fetchMonthlyTop(limit = 3): Promise<MonthlyRankingEntry[]>{
    return authFetch(`/rankings/monthly?limit=${limit}`);
}

export function fetchTopByQuality(qualityId: number, limit = 10): Promise<CategoryRankingEntry[]>{
    return authFetch(`/rankings/by-quality?qualityId=${qualityId}&limit=${limit}`);
}