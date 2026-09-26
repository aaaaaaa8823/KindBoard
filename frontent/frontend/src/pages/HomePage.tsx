import { useEffect, useState } from "react";
import StatsCard from "../components/home/StatsCard";
import ColleaguesCard from "../components/home/ColleaguesCard";
import { fetchUsers, type UserDto } from "../api/users";
import { fetchMyBalance } from "../api/balance";
import "./css/HomePage.css";

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
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>To {selected.username}</h2>
            <p>модалке css сделать</p>
            <button type="button" onClick={() => setModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {error && <p className="home-error">{error}</p>}
    </div>
  );
}