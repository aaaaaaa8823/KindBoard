import { authFetch } from "./client";

export type RecognitionDto = {
  id: number;
  message: string;
  poits: number;
  createdAt: string;
  giver_id: number;
  receiver_id: number;
  quality_id: number;
  giverUsername: string | null;
  receiverUsername: string | null;
  qualityCode: string | null;
  qualityUsername: string | null;
};

export function fetchRecognition(): Promise<RecognitionDto[]> {
  return authFetch("/recognitions");
}
export function createRecognition(data: {
  giverId: number;
  receiverId: number;
  qualityId: number;
  message: string;
  points: number;
}) {
  return authFetch("/recognitions", {
    method: "POST",
    body: JSON.stringify({
      giver_id: data.giverId,
      receiver_id: data.receiverId,
      quality_id: data.qualityId,
      message: data.message,
      points: data.points,
    }),
  });
}