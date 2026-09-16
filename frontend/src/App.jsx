import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DatabaseExplorer from "./pages/DatabaseExplorer";
import QueryStudio from "./pages/QueryStudio";
import RecordManagement from "./pages/RecordManagement";
import Reports from "./pages/Reports";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import AppLayout from "./layouts/AppLayout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />

                {/* Authenticated application */}
                <Route element={<AppLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                        path="/records"
                        element={<RecordManagement />}
                    />
                    <Route path="/queries" element={<QueryStudio />} />
                    <Route
                        path="/database"
                        element={<DatabaseExplorer />}
                    />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin" element={<AdminPanel />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;