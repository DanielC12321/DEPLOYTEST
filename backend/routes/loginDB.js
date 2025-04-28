const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const Database = require("./Database"); // Import the Database instance
const router = express.Router(); // Create an Express router
require('dotenv').config();
// Google OAuth2 client setup
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify endpoint
router.post("/verify", async (req, res) => {
    const { token } = req.body;

    try {
        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;

        // Check if the user exists in the cashier table
        const cashierResult = await Database.executeCustomQuery(
            "SELECT * FROM cashier WHERE email = $1",
            [email]
        );

        if (cashierResult.length > 0) {
            return res.status(200).json({
                message: "User exists as cashier",
                user: { ...cashierResult[0], role: "cashier" },
            });
        }

        // Check if the user exists in the manager table
        const managerResult = await Database.executeCustomQuery(
            "SELECT * FROM manager WHERE email = $1",
            [email]
        );

        if (managerResult.length > 0) {
            return res.status(200).json({
                message: "User exists as manager",
                user: { ...managerResult[0], role: "manager" },
            });
        }

        // If the user does not exist in either table, return an error
        res.status(404).json({ error: "User does not exist in any role" });
    } catch (error) {
        console.error("Error verifying token or querying database:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Email/password login verification endpoint (without bcrypt)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // Check if the user exists in the cashier table with matching password
        const cashierResult = await Database.executeCustomQuery(
            "SELECT * FROM cashier WHERE email = $1 AND password = $2",
            [email, password]
        );

        if (cashierResult.length > 0) {
            return res.status(200).json({
                message: "Login successful as cashier",
                user: { 
                    cashierid: cashierResult[0].cashierid,
                    name: cashierResult[0].name,
                    email: cashierResult[0].email,
                    role: "cashier" 
                }
            });
        }

        // Check if the user exists in the manager table with matching password
        const managerResult = await Database.executeCustomQuery(
            "SELECT * FROM manager WHERE email = $1 AND password = $2",
            [email, password]
        );

        if (managerResult.length > 0) {
            return res.status(200).json({
                message: "Login successful as manager",
                user: { 
                    managerid: managerResult[0].managerid,
                    name: managerResult[0].name,
                    email: managerResult[0].email,
                    role: "manager" 
                }
            });
        }

        // If no valid credentials were found
        res.status(401).json({ error: "Invalid email or password" });
    } catch (error) {
        console.error("Error during login verification:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;