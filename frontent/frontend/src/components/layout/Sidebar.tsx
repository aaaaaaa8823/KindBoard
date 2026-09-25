import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar(){
    return(
        <aside className="sidebar">
            <div className="sidebar-logo">KindBoard</div>

            <nav className="sidebar-nav">
                <NavLink to="/home" className={({isActive}) => isActive ? "nav-item active": "nav-item"}>
                    Home
                </NavLink>

                <NavLink to="/rankings" className={({isActive}) => isActive ? "nav-item active": "nav-item"}>
                    Rankigs
                </NavLink>

                <NavLink to="/profile" className={({isActive}) => isActive ? "nav-item active": "nav-item"}>
                    Profile
                </NavLink>

                <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active": "nav-item"}>
                    Settings
                </NavLink>
            </nav>
        </aside>
    );
}