import {
    BarChart3,
    ClipboardList,
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
import { isAdmin } from "../services/auth";

const mainNav = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Database explorer",
        path: "/database",
        icon: Database,
    },
    {
        label: "Query studio",
        path: "/queries",
        icon: Search,
    },
    {
        label: "Processing",
        path: "/records",
        icon: ClipboardList,
    },
    {
        label: "Reports",
        path: "/reports",
        icon: BarChart3,
    },
];

const operationsNav = [
    { label: "Customer 360", icon: Users },
    { label: "Property Portfolio", icon: Building2 },
    { label: "Meter Monitor", icon: Gauge },
    { label: "Tariff Lab", icon: FileText },
    { label: "Billing Center", icon: Receipt },
    { label: "Payment Hub", icon: CreditCard },
];

function Sidebar() {
    const admin = isAdmin();

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-logo">
                    <Gauge size={21} strokeWidth={1.8} />
                </div>

                <div>
                    <strong>U/BILL</strong>
                    <span>
                        {admin ? "ADMIN CONSOLE" : "UTILITY SYSTEM"}
                    </span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {/* OVERVIEW */}
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

                {/* OPERATIONS */}
                <div className="nav-group">
                    <span className="nav-label">OPERATIONS</span>

                    {operationsNav.map(({ label, icon: Icon }) => (
                        <div className="side-link" key={label}>
                            <Icon size={15} />
                            {label}
                        </div>
                    ))}
                </div>

                {/* ADMIN */}
                {admin && (
                    <div className="nav-group">
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
                    </div>
                )}
            </nav>

            <div className="sidebar-footer">
                <Settings size={14} />
                <span>
                    {admin ? "ADMIN · U/BILL" : "USER · U/BILL"}
                </span>
            </div>
        </aside>
    );
}

export default Sidebar;