import { useEffect, useState } from "react";
import StatsCard from "../components/home/StatsCard";
import ColleaguesCard from "../components/home/ColleaguesCard";
import { fetchUsers, type UserDto } from "../api/users";
import { fetchMyBalance } from "../api/balance";
import "./css/HomePage.css";
import RecognizeModal from "../components/home/RecognizeModal";
import { createRecognition } from "../api/recognition";

function getCurrentUserId(): number | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return (JSON.parse(raw) as { id: number }).id;
  } catch {
    return null;
  }
}

export default function HomePage() {
  const [giveable, setGiveable] = useState(0);
  const [colleagues, setColleagues] = useState<UserDto[]>([]);
  const [selected, setSelected] = useState<UserDto | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const me = getCurrentUserId();

    Promise.all([fetchMyBalance(), fetchUsers()])
      .then(([balance, users]) => {
        setGiveable(balance.giveablePoints);
        setColleagues(users.filter((u) => u.id !== me));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  function handleRecognize(user: UserDto) {
    setSelected(user);
    setModalOpen(true);
  }

  return (
    <div className="home-page">
      <div className="home-main">
        <p className="home-placeholder">скоро посты</p>
      </div>

      <aside className="home-aside">
        <StatsCard giveablePoints={giveable} receivedThisMonth={0} ranking={null} />
        <ColleaguesCard colleagues={colleagues} onRecognize={handleRecognize} />
      </aside>

      {modalOpen && selected && (
        <RecognizeModal
          colleagues={colleagues}
    initialReceiver={selected}
    giveablePoints={giveable}
    onClose={() => setModalOpen(false)}
    onSubmit={async (data) => {
      const raw = localStorage.getItem("user");
      const me = raw ? JSON.parse(raw) as { id: number } : null;
      if (!me?.id) {
        throw new Error("Not logged in");
      }

      await createRecognition({
        giverId: me.id,
        receiverId: data.receiverId,
        qualityId: data.qualityId,
        message: data.message,
        points: data.points,
      });

      const b = await fetchMyBalance();
      setGiveable(b.giveablePoints);
      setModalOpen(false); 
      }}
        />
      )}

      {error && <p className="home-error">{error}</p>}
    </div>
  );
}