import type { MonthlyRankingEntry } from "../../api/rankings";
import "./MonthlyPodium.css";

type Props = {
    entries: MonthlyRankingEntry[];
    period: string;
};

function badgeClass(rank: number){
    if (rank === 1) return "podium-badge gold";
    if (rank === 2) return "podium-badge silver";
    if (rank === 3) return "podium-badge bronze";
    return "podium-badge";
}

export default function MonthlyPodium({ entries, period }: Props) {
  return (
    <section className="monthly-podium">
      <h2 className="podium-title">Top employees of the month</h2>
      <p className="podium-period">{period}</p>

      <ul className="podium-list">
        {entries.map((e) => (
          <li key={e.userId} className="podium-row">
            <div className="podium-user">
              <div className="podium-avatar">
                {e.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="podium-name">{e.username}</div>
                <div className="podium-dept">
                  {e.departmentName
                    ? `${e.departmentName} department`
                    : "Colleague"}
                </div>
                {e.title && (
                  <div className="podium-role">{e.title}</div>
                )}
              </div>
            </div>
            <div className={badgeClass(e.rank)}>{e.rank}</div>
          </li>
        ))}
      </ul>

      {entries.length === 0 && (
        <p className="podium-empty">No rankings yet this month</p>
      )}
    </section>
  );
}