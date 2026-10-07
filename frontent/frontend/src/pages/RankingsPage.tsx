import { useEffect, useState } from "react";
import MonthlyPodium from "../components/rankings/MonthlyPodium";
import type { QualityDto } from "../api/qualities";
import { fetchQualities } from "../api/qualities";
import { fetchTopByQuality } from "../api/rankings";
import {
  fetchMonthlyTop,
  type MonthlyRankingEntry,
  type CategoryRankingEntry,
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
  const [qualities, setQualities] = useState<QualityDto[]>([]);
  const [activeQualityId, setActiveQualityId] = useState<number | null>(null);
  const [categoryRows, setCategoryRows] = useState<CategoryRankingEntry[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  useEffect(() => {
    fetchMonthlyTop(3)
      .then(setMonthly)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load")
      );
  }, []);

  useEffect(() => {
  fetchQualities()
    .then((list) => {
      setQualities(list);
      if (list[0]) {
        setActiveQualityId(list[0].id);
      }
    })
    .catch((e) =>
      setError(e instanceof Error ? e.message : "Failed to load qualities")
    );
  }, []);

  useEffect(() => {
  if (activeQualityId == null) return;

  setCategoryLoading(true);

  fetchTopByQuality(activeQualityId, 10)
    .then(setCategoryRows)
    .catch((e) =>
      setError(e instanceof Error ? e.message : "Failed to load category ranking")
    )
    .finally(() => setCategoryLoading(false));
}, [activeQualityId])

  return (
    <div className="rankings-page">
      <div className="rankings-main">
          <section className="category-rankings">
            <h2>Top employees by category</h2>

            <div className="quality-chips">
              {qualities.map((q) => (
              <button
              key={q.id}
              type="button"
              className={
              q.id === activeQualityId
              ? "quality-chip active"
              : "quality-chip"
              }
              onClick={() => setActiveQualityId(q.id)}>
              {q.name}
              </button>
               ))}
            </div>

            {categoryLoading && <p>Loading…</p>}

            {!categoryLoading && categoryRows.length === 0 && (
            <p>No ranking yet</p>
            )}
            
            <ul className="category-list">
            {categoryRows.map((row) => (
              <li key={row.userId} className="category-row">
        <div className="category-left">
              <span className="category-rank">{row.rank}</span>
              <div className="category-avatar">
              {row.username.charAt(0).toUpperCase()}
              </div>

              <div>
              <div className="category-name">{row.username}</div>
                <div className="category-dept">
                {row.departmentName
                ? `${row.departmentName} department`
                : "Colleague"}
                </div>
              </div>
        </div>
        <div className="category-count">{row.count}×</div>
      </li>
    ))}
  </ul>


          </section>
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