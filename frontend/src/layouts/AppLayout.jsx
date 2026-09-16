import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AppLayout() {
    return (
        <div className="app-shell">
            <Sidebar />

            <div className="app-main">
                <Navbar />

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppLayout;