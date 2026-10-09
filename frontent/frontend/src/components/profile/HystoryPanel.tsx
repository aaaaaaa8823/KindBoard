import { useEffect, useMemo, useState } from "react";
import {
  fetchRecognition,
  type RecognitionDto,
} from "../../api/recognition";
import "./HystoryPanel.css";

type Direction = "received" | "given";

function getMyId(): number | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return (JSON.parse(raw) as { id: number }).id;
  } catch {
    return null;
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function HistoryPanel() {
  const meId = useMemo(() => getMyId(), []);
  const [direction, setDirection] = useState<Direction>("received");
  const [items, setItems] = useState<RecognitionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchRecognition()
      .then((list) => {
        const sorted = [...list].sort(
          (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
        );
        setItems(sorted);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load")
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((r) => {
    if (meId == null) return false;
    if (direction === "received") return r.receiver_id === meId;
    return r.giver_id === meId;
  });

  return (
    <div className="history-panel">
      <div className="history-tabs">
        <button
          type="button"
          className={
            direction === "received" ? "history-tab active" : "history-tab"
          }
          onClick={() => setDirection("received")}
        >
          Received
        </button>
        <button
          type="button"
          className={
            direction === "given" ? "history-tab active" : "history-tab"
          }
          onClick={() => setDirection("given")}
        >
          Given
        </button>
      </div>

      {loading && <p className="history-muted">Loading…</p>}
      {error && <p className="history-error">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p className="history-muted">No recognitions yet</p>
      )}

      <ul className="history-list">
        {filtered.map((r) => {
          const otherName =
            direction === "received"
              ? r.giverUsername ?? "Someone"
              : r.receiverUsername ?? "Someone";
          const initial = otherName.charAt(0).toUpperCase();
          const quality = r.qualityUsername ?? r.qualityCode ?? "Thank you";

          return (
            <li key={r.id} className="history-item">
              <div className="history-item-main">
                <div className="history-avatar">{initial}</div>
                <div className="history-body">
                  <div className="history-top">
                    <span className="history-name">{otherName}</span>
                    <span className="history-date">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                  <p className="history-message">“{r.message}”</p>
                  <div className="history-meta">
                    <span className="history-quality">{quality}</span>
                    <span className="history-points">{r.points} points</span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}