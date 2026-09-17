const jwt = require("jsonwebtoken");


// Get JWT secret from environment variables
const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error(
            "JWT_SECRET is not configured in .env"
        );
    }

    return process.env.JWT_SECRET;
};


// Create normal login token
const createAuthToken = (username, role) => {
    return jwt.sign(
        {
            username,
            role,
            type: "AUTH"
        },
        getJwtSecret(),
        {
            expiresIn:
                process.env.JWT_EXPIRES_IN || "2h"
        }
    );
};


// Create short-lived approval token
const createApprovalToken = (username) => {
    return jwt.sign(
        {
            username,
            role: "ADMIN",
            type: "APPROVAL"
        },
        getJwtSecret(),
        {
            expiresIn:
                process.env.APPROVAL_TOKEN_EXPIRES_IN || "10m"
        }
    );
};


// Verify any JWT
const verifyToken = (token) => {
    return jwt.verify(
        token,
        getJwtSecret()
    );
};


module.exports = {
    createAuthToken,
    createApprovalToken,
    verifyToken
};