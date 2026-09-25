import{useMemo} from "react";
import "./Havbar.css";

type StoreUser = {
    id: number;
    username: string;
    email: string;
    role: string;
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

export default function Navbar(){
    const user = useMemo(() => getStoreUser(), []);

    const name = user?.username ?? "user";
    const email = user?.email ?? "";

    const initial = name.charAt(0).toUpperCase();

    return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo-dot" />
        <span className="navbar-title">KindBoard</span>
      </div>

        
      <div className="navbar-user">
        <div className="navbar-avatar" aria-hidden>
          {initial}
        </div>
        
        <div className="navbar-user-text">
          <span className="navbar-username">{name}</span>
          {email && (
            <span className="navbar-email">{email}</span>
          )}
        </div>
        
      </div>
    </header>
  );
}