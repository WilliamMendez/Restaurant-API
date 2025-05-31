const express = require("express");
const router = express.Router();
const AuditLog = require("../models/AuditLog");
const auth = require("../middleware/auth");

// Get audit logs (with pagination)
router.get("/", auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const logs = await AuditLog.find().sort({ timestamp: -1 }).skip(skip).limit(limit).populate("userId", "email name");

        const total = await AuditLog.countDocuments();

        res.json({
            logs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalLogs: total,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching audit logs", error: error.message });
    }
});

// Get audit logs for specific user
router.get("/user/:userId", auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const logs = await AuditLog.find({ userId: req.params.userId }).sort({ timestamp: -1 }).skip(skip).limit(limit).populate("userId", "email name");

        const total = await AuditLog.countDocuments({ userId: req.params.userId });

        res.json({
            logs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalLogs: total,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user audit logs", error: error.message });
    }
});

module.exports = router;
