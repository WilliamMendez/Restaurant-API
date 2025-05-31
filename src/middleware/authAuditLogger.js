const AuditLog = require("../models/AuditLog");

const authAuditLogger = async (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
        res.send = originalSend;
        const response = res.send.call(this, data);

        // Parse the response data
        let responseData;
        try {
            responseData = JSON.parse(data);
        } catch (e) {
            responseData = data;
        }

        // Log authentication events
        if (req.path === "/api/auth/register" || req.path === "/api/auth/login") {
            const auditLog = new AuditLog({
                userId: responseData.user?.id || null,
                action: req.path === "/api/auth/register" ? "USER_REGISTRATION" : "USER_LOGIN",
                details: {
                    email: req.body.email,
                    status: res.statusCode,
                    success: res.statusCode < 400,
                },
                ipAddress: req.ip,
                userAgent: req.get("user-agent"),
            });

            auditLog.save().catch((err) => console.error("Auth audit log error:", err));
        }

        return response;
    };

    next();
};

module.exports = authAuditLogger;
