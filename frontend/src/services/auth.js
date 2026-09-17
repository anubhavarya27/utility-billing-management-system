const AUTH_KEY = "ubill_session";

const DEMO_USERS = {
    user: {
        username: "user",
        password: "user123",
        role: "user",
        name: "System User",
    },
    admin: {
        username: "admin",
        password: "admin123",
        role: "admin",
        name: "U/BILL Administrator",
    },
};

export function login(username, password) {
    const user = DEMO_USERS[username];

    if (!user || user.password !== password) {
        return {
            success: false,
            message: "Invalid username or password",
        };
    }

    const session = {
        username: user.username,
        role: user.role,
        name: user.name,
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(session));

    return {
        success: true,
        user: session,
    };
}

export function logout() {
    localStorage.removeItem(AUTH_KEY);
}

export function getSession() {
    const session = localStorage.getItem(AUTH_KEY);

    if (!session) {
        return null;
    }

    try {
        return JSON.parse(session);
    } catch {
        localStorage.removeItem(AUTH_KEY);
        return null;
    }
}

export function isLoggedIn() {
    return !!getSession();
}

export function isAdmin() {
    return getSession()?.role === "admin";
}