const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error("Invalid token");
    }
};

module.exports = {
    signToken,
    verifyToken,
};
