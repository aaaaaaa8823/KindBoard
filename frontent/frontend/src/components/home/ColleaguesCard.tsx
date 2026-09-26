import type { UserDto } from "../../api/users";
import "./ColleaguesCard.css"

type Props = {
  colleagues: UserDto[];
  onRecognize: (user: UserDto) => void;
};

export default function ColleaguesCard({ colleagues, onRecognize }: Props) {
  return (
    <section className="colleagues-card">
      <h2>Quick recognize</h2>
      <ul className="colleagues-list">
        {colleagues.map((u) => (
          <li key={u.id} className="colleague-row">
            <div className="colleague-info">
              <div className="colleague-avatar">
                {u.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="colleague-name">{u.username}</div>
                <div className="colleague-dept">Colleague</div>
              </div>
            </div>
            <button
              type="button"
              className="btn-recognize"
              onClick={() => onRecognize(u)}
            >
              Recognize
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}