const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Read secrets from files if they exist
const readSecret = (secretPath) => {
    try {
        return fs.readFileSync(secretPath, "utf8").trim();
    } catch (error) {
        return process.env[secretPath.split("/").pop().toUpperCase()];
    }
};

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Set secrets from files or environment variables
process.env.JWT_SECRET = readSecret("/run/secrets/jwt_secret") || process.env.JWT_SECRET;
process.env.GOOGLE_MAPS_API_KEY = readSecret("/run/secrets/google_maps_key") || process.env.GOOGLE_MAPS_API_KEY;

// Database connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Import middleware
const authAuditLogger = require("./middleware/authAuditLogger");
const auditLogger = require("./middleware/auditLogger");

// Routes
app.use("/api/auth", authAuditLogger, require("./routes/auth"));
app.use("/api/restaurants", auditLogger, require("./routes/restaurants"));
app.use("/api/audit", auditLogger, require("./routes/audit"));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
