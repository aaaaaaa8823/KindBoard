import { authFetch } from "./client";

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