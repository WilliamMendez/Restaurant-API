const { body, query, param } = require("express-validator");

const restaurantValidationRules = {
    getRecommendations: [
        query("latitude").exists().withMessage("Latitude is required").isFloat({ min: -90, max: 90 }).withMessage("Latitude must be between -90 and 90"),
        query("longitude").exists().withMessage("Longitude is required").isFloat({ min: -180, max: 180 }).withMessage("Longitude must be between -180 and 180"),
        query("radius").optional().isInt({ min: 100, max: 50000 }).withMessage("Radius must be between 100 and 50000 meters"),
    ],
    getAuditLogs: [
        query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
        query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    ],
    getUserAuditLogs: [
        param("userId").isMongoId().withMessage("Invalid user ID format"),
        query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
        query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    ],
};

const authValidationRules = {
    register: [
        body("email").exists().withMessage("Email is required").isEmail().withMessage("Invalid email format").normalizeEmail(),
        body("password").exists().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
        body("name").exists().withMessage("Name is required").isLength({ min: 2 }).withMessage("Name must be at least 2 characters long").trim(),
    ],
    login: [
        body("email").exists().withMessage("Email is required").isEmail().withMessage("Invalid email format").normalizeEmail(),
        body("password").exists().withMessage("Password is required"),
    ],
};

module.exports = {
    restaurantValidationRules,
    authValidationRules,
};
