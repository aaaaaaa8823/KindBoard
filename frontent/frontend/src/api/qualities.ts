import { authFetch } from "./client";

export type QualityDto = {
  id: number;
  name: string;
  code?: string;
};

export function fetchQualities(): Promise<QualityDto[]> {
  return authFetch("/qualities");
}