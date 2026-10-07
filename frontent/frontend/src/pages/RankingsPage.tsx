import { useEffect, useState } from "react";
import MonthlyPodium from "../components/rankings/MonthlyPodium";
import {
  fetchMonthlyTop,
  type MonthlyRankingEntry,
} from "../api/rankings";
import "./css/RankingsPage.css";

function currentMonthLabel() {
  return new Date().toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export default function RankingsPage() {
  const [monthly, setMonthly] = useState<MonthlyRankingEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMonthlyTop(3)
      .then(setMonthly)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load")
      );
  }, []);

  return (
    <div className="rankings-page">
      <div className="rankings-main">
        {/* by category — следующим шагом */}
        <p className="rankings-placeholder">Category rankings coming next</p>
      </div>

      <aside className="rankings-aside">
        <MonthlyPodium
          entries={monthly}
          period={currentMonthLabel()}
        />
      </aside>

      {error && <p className="rankings-error">{error}</p>}
    </div>
  );
}