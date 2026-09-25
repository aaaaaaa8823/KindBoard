import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./AppLayout.css";

export default function AppLayout(){
    return(
        <div className="app-chell">
            <Navbar />
            <div className="app-body">
                <Sidebar />
                <main className="app-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}