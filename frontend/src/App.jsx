import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";

function LoginPlaceholder() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                background: "#05080A",
                color: "#EAF1F1",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <h1>Login Page — Coming Next</h1>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<LoginPlaceholder />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;