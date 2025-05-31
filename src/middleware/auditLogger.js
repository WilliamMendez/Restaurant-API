const AuditLog = require("../models/AuditLog");

const auditLogger = async (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
        res.send = originalSend;
        const response = res.send.call(this, data);

        // Only log if user is authenticated
        if (req.user) {
            const auditLog = new AuditLog({
                userId: req.user._id,
                action: `${req.method} ${req.originalUrl}`,
                details: {
                    requestBody: req.body,
                    responseStatus: res.statusCode,
                },
                ipAddress: req.ip,
                userAgent: req.get("user-agent"),
            });

            auditLog.save().catch((err) => console.error("Audit log error:", err));
        }

        return response;
    };

    next();
};

module.exports = auditLogger;
