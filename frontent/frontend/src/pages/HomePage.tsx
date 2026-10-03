import { useEffect, useState } from "react";
import StatsCard from "../components/home/StatsCard";
import ColleaguesCard from "../components/home/ColleaguesCard";
import { fetchUsers, type UserDto } from "../api/users";
import { fetchMyBalance } from "../api/balance";
import "./css/HomePage.css";
import RecognizeModal from "../components/home/RecognizeModal";
import FeedPost from "../components/home/FeedPost";
import {
  createRecognition,
  fetchRecognition,
  type RecognitionDto,
} from "../api/recognition";

import{useMemo} from "react";

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
  const [posts, setPosts] = useState<RecognitionDto[]>([]);
  const [composerText, setComposerText] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const me = getCurrentUserId();

  Promise.all([fetchMyBalance(), fetchUsers(), fetchRecognition()])
    .then(([balance, users, recognitions]) => {
      setGiveable(balance.giveablePoints);
      setColleagues(users.filter((u) => u.id !== me));

      const sorted = [...recognitions].sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
      );
      setPosts(sorted);
    })
    .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  function handleRecognize(user: UserDto) {
    setSelected(user);
    setModalOpen(true);
  }

function openModalFromComposer() {
  setModalMessage(composerText.trim());
  setSelected(colleagues[0] ?? null);
  setModalOpen(true);
}

function handleCloseModal() {
  setModalOpen(false);
  setModalMessage("");
  setSelected(null);
}

type StoreUser = {
    id: number;
    username: string;
};

function getStoreUser(): StoreUser | null {
    const raw = localStorage.getItem("user");
    if(!raw) return null;
    try{
        return JSON.parse(raw) as StoreUser;
    } catch {
        return null;
    }
}

const user = useMemo(() => getStoreUser(), []);

    const name = user?.username ?? "user";
    const initial = name.charAt(0).toUpperCase();

  return (
    <div className="home-page">
      <div className="home-main">

        <section className="composer-card">
        <h3 className="composer-title">Post recognition</h3>
        <div className="composer-row">
          <div className="composer-avatar">{initial}</div>
          <input
            className="composer-input"
            type="text"
            placeholder="Make a recognition to…"
            value={composerText}
            onChange={(e) => setComposerText(e.target.value)}
          />
        </div>
        {composerText.trim() && (
          <div className="composer-actions">
            <button type="button" className="btn-choose" onClick={openModalFromComposer}>
              Choose colleague
            </button>
          </div>
        )}
      </section>
       {posts.length === 0 ? (
    <p className="home-placeholder">No recognitions yet</p>):(
      posts.map((post) => <FeedPost key={post.id} post={post} />)
  )}
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
    initialMessage={modalMessage}
    onClose={handleCloseModal}
    
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

      const [b, recognitions] = await Promise.all([
    fetchMyBalance(),
    fetchRecognition(),
  ]);

  setGiveable(b.giveablePoints);
  setComposerText("");
  setModalMessage("");

  setPosts(
    [...recognitions].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    )
  );
      }}
        />
      )}

      {error && <p className="home-error">{error}</p>}
    </div>
  );
}