const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const { signToken } = require("../utils/jwt");
const validate = require("../middleware/validators");
const { authValidationRules } = require("../middleware/validationRules");

// Register
router.post("/register", authValidationRules.register, validate, async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const user = new User({
            email,
            password,
            name,
        });

        await user.save();

        // Generate token
        const token = signToken({ userId: user._id });

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

// Login
router.post("/login", authValidationRules.login, validate, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = signToken({ userId: user._id });

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});

// Get current user
router.get("/me", auth, async (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
        },
    });
});

module.exports = router;
