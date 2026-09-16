import {
    BarChart3,
    Database,
    FileText,
    LayoutDashboard,
    Search,
    Settings,
    ShieldCheck,
    Users,
    Building2,
    Gauge,
    Receipt,
    CreditCard,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const mainNav = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Database explorer", path: "/database", icon: Database },
    { label: "Query studio", path: "/queries", icon: Search },
];

const recordNav = [
    { label: "Customers", icon: Users },
    { label: "Properties", icon: Building2 },
    { label: "Meters & readings", icon: Gauge },
    { label: "Tariffs", icon: FileText },
    { label: "Bills", icon: Receipt },
    { label: "Payments", icon: CreditCard },
];

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-logo">U</div>
                <div>
                    <strong>U/BILL</strong>
                    <span>UTILITY SYSTEM</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-group">
                    <span className="nav-label">OVERVIEW</span>

                    {mainNav.map(({ label, path, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `side-link ${isActive ? "active" : ""}`
                            }
                        >
                            <Icon size={15} />
                            {label}
                        </NavLink>
                    ))}
                </div>

                <div className="nav-group">
                    <span className="nav-label">RECORDS</span>

                    {recordNav.map(({ label, icon: Icon }) => (
                        <div className="side-link" key={label}>
                            <Icon size={15} />
                            {label}
                        </div>
                    ))}
                </div>

                <div className="nav-group">
                    <span className="nav-label">GOVERNANCE</span>

                    <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            `side-link ${isActive ? "active" : ""}`
                        }
                    >
                        <ShieldCheck size={15} />
                        Approvals
                        <span className="approval-count">17</span>
                    </NavLink>

                    <NavLink
                        to="/reports"
                        className={({ isActive }) =>
                            `side-link ${isActive ? "active" : ""}`
                        }
                    >
                        <BarChart3 size={15} />
                        Reports
                    </NavLink>
                </div>
            </nav>

            <div className="sidebar-footer">
                <Settings size={14} />
                <span>ADMIN · U/BILL</span>
            </div>
        </aside>
    );
}

export default Sidebar;