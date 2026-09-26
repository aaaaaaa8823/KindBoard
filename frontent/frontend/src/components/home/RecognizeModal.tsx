import { useEffect, useState } from "react";
import type { UserDto } from "../../api/users";

import "./RecognizeModal.css";

import { data } from "react-router-dom";

type Quality = {
    id: number; 
    name: string;
    code: string;
}

type Props = {
    colleagues: UserDto[];
  initialReceiver: UserDto;
  giveablePoints: number;
  onClose: () => void;
  onSubmit: (data: {
    receiverId: number;
    qualityId: number;
    message: string;
    points: number;
  }) => Promise<void>;
}

export default function RecognizeModal({
    colleagues,
    initialReceiver,
    giveablePoints,
    onClose,
    onSubmit,
}:Props){
    const[receiver, setReceiver] = useState(initialReceiver);
    const [points, setPoints] = useState(10);
    const [message, setMessage] = useState("");
    const [qualities, setQualities] = useState<Quality[]>([]);
    const [qualityId, setQualityId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/qualities", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })

        .then((r) => r.json())
        .then((data: Quality[]) => {
            setQualities(data);
            if (data[0]) setQualityId(data[0].id);
        })
        .catch(() => setError("Failed to load qualities"));
    }, []);

    const leftToday = giveablePoints;

    async function handleSave() {
    if (!qualityId) {
      setError("Choose a quality");
      return;
    }
    if (points < 1 || points > giveablePoints) {
      setError("Invalid points");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        receiverId: receiver.id,
        qualityId,
        message,
        points,
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="recognize-modal" onClick={(e) => e.stopPropagation()}>
        <aside className="recognize-modal-left">
          {colleagues.map((u) => (
            <button
              key={u.id}
              type="button"
              className={
                u.id === receiver.id
                  ? "receiver-item active"
                  : "receiver-item"
              }
              onClick={() => setReceiver(u)}
            >
              <span className="receiver-avatar">
                {u.username.charAt(0).toUpperCase()}
              </span>
              <span>
                <span className="receiver-name">{u.username}</span>
                <span className="receiver-dept">Colleague</span>
              </span>
            </button>
          ))}
        </aside>

        <div className="recognize-modal-right">
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
          <h2>To {receiver.username}</h2>

          <div className="points-row">
            <input
              type="number"
              min={1}
              max={giveablePoints}
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
            />
            <span>points</span>
            <span className="points-left">{leftToday} left today</span>
          </div>

          <textarea
            placeholder="Write a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />

          <div className="quality-chips">
            {qualities.map((q) => (
              <button
                key={q.id}
                type="button"
                className={
                  qualityId === q.id ? "quality-chip active" : "quality-chip"
                }
                onClick={() => setQualityId(q.id)}
              >
                {q.name}
              </button>
            ))}
          </div>

          {error && <p className="modal-error">{error}</p>}

          <button
            type="button"
            className="btn-save"
            disabled={loading}
            onClick={handleSave}
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}