import { useMemo, useState } from "react";
import SettingsPanel from "../components/profile/SettingsPanel";
import HistoryPanel from "../components/profile/HystoryPanel";
import "./css/ProfilePage.css";

type Tab = "history" | "settings";

function getStoreUser(){
  try{
    const raw = localStorage.getItem("user");
    if(!raw) return null;

    return JSON.parse(raw) as {
      id: number;
      username: string;
      email: string;
    }
  }catch {
    return null;
  }
}

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("settings");
  const user = useMemo(() => getStoreUser(), []);

  return(
    <div className="profile-page">
      <h1 className="profile-title">My profile</h1>

      <div className="profile-tabs">
        <button type="button"
        className={tab === "history" ? "profile-tab active" : "profile-tab"}
        onClick={() => setTab("history")}>
        History
        </button>

        <button type="button"
          className={tab === "settings" ? "profile-tab active" : "profile-tab"}
          onClick={() => setTab("settings")}>
          Settings
        </button>
      </div>

      <div className="profile-panel">
        {tab === "settings" && <SettingsPanel user={user} />}
        {tab === "history" && <HistoryPanel />}
      </div>
    </div>
  );
}