import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layouts/AppLayout";

function Login() {
    return (
        <div className="placeholder-page">
            <h1>Login</h1>
            <p>Authentication coming next.</p>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />

                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/database" element={<div>Database Explorer</div>} />
                    <Route path="/queries" element={<div>Query Studio</div>} />
                    <Route path="/records" element={<div>Record Management</div>} />
                    <Route path="/reports" element={<div>Reports</div>} />
                    <Route path="/admin" element={<div>Admin Panel</div>} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;