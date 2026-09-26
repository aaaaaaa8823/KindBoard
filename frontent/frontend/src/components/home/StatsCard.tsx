import "./StatsCard.css"

type Props = {
  giveablePoints: number;
  receivedThisMonth?: number;
  ranking?: number | null;
};

export default function StatsCard({
  giveablePoints,
  receivedThisMonth = 0,
  ranking = null,
}: Props) {
  return (
    <section className="stats-card">
      <p className="stats-daily">
        Today you have <strong>{giveablePoints}</strong> points
      </p>
      <div className="stats-row">
        <div>
          <div className="stats-num">{receivedThisMonth}</div>
          <div className="stats-label">Received this month</div>
        </div>
        <div>
          <div className="stats-num">{ranking ?? "—"}</div>
          <div className="stats-label">Ranking</div>
        </div>
      </div>
    </section>
  );
}