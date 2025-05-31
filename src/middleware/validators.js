const { validationResult } = require("express-validator");

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Invalid request parameters",
            errors: errors.array().map((err) => ({
                param: err.param,
                message: err.msg,
                value: err.value,
            })),
        });
    }
    next();
};

module.exports = validate;
