import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import { useState } from "react";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DatabaseExplorer from "./pages/DatabaseExplorer";
import QueryStudio from "./pages/QueryStudio";
import RecordManagement from "./pages/RecordManagement";
import AdminPanel from "./pages/AdminPanel";
import Reports from "./pages/Reports";

import AppLayout from "./layouts/AppLayout";

import { getSession, isAdmin } from "./services/auth";

function ProtectedRoute({ children }) {
    const location = useLocation();
    const session = getSession();

    if (!session) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return children;
}

function AdminRoute({ children }) {
    const location = useLocation();
    const session = getSession();

    if (!session) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    if (!isAdmin()) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

/*
 * SECOND PASSWORD FOR APPROVALS ONLY
 */
function ApprovalPasswordRoute() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [verified, setVerified] = useState(false);

    const APPROVAL_PASSWORD = "admin123";

    if (verified) {
        return <AdminPanel />;
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (password === APPROVAL_PASSWORD) {
            setVerified(true);
            setError("");
        } else {
            setError("Incorrect approval password.");
            setPassword("");
        }
    }

    return (
        <div
            style={{
                minHeight: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    padding: "32px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "#111617",
                    borderRadius: "12px",
                }}
            >
                <span
                    style={{
                        fontSize: "11px",
                        letterSpacing: "0.12em",
                        color: "#9aa5a6",
                    }}
                >
                    RESTRICTED AREA
                </span>

                <h1
                    style={{
                        margin: "8px 0 10px",
                        color: "#eaf1f1",
                    }}
                >
                    Approval Access
                </h1>

                <p
                    style={{
                        marginBottom: "24px",
                        color: "#8f9a9b",
                        fontSize: "14px",
                        lineHeight: 1.6,
                    }}
                >
                    Enter the approval password to access
                    administrative record approvals.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="Approval password"
                        autoFocus
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "12px 14px",
                            background: "#0b0f10",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            color: "#eaf1f1",
                            outline: "none",
                            marginBottom: "12px",
                        }}
                    />

                    {error && (
                        <p
                            style={{
                                color: "#ff6b6b",
                                fontSize: "13px",
                                margin: "0 0 12px",
                            }}
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                        }}
                    >
                        UNLOCK APPROVALS
                    </button>
                </form>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* PUBLIC */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />

                {/* ALL AUTHENTICATED USERS */}
                <Route
                    element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/database"
                        element={<DatabaseExplorer />}
                    />

                    <Route
                        path="/queries"
                        element={<QueryStudio />}
                    />

                    <Route
                        path="/records"
                        element={<RecordManagement />}
                    />

                    {/* REPORTS — EVERY LOGGED-IN USER */}
                    <Route
                        path="/reports"
                        element={<Reports />}
                    />

                    {/* APPROVALS — ADMIN + SECOND PASSWORD */}
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <ApprovalPasswordRoute />
                            </AdminRoute>
                        }
                    />
                </Route>

                {/* FALLBACK */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;