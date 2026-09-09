const bcrypt = require('bcryptjs');
const connectDB = require('../lib/db');
const User = require('../models/user');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    try {
        const { fullName, username, email, password } = req.body || {};

        if (!fullName || !username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        if (password.length < 8) {
            return res
                .status(400)
                .json({ error: 'Password must be at least 8 characters long.' });
        }

        await connectDB();

        const normalizedEmail = String(email).toLowerCase().trim();

        const existing = await User.findOne({
            $or: [{ email: normalizedEmail }, { username }],
        });

        if (existing) {
            return res
                .status(409)
                .json({ error: 'An account with that email or username already exists.' });
        }

        // Never store the raw password — only the bcrypt hash.
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            username,
            email: normalizedEmail,
            password: passwordHash,
        });

        return res.status(201).json({
            message: 'Account created successfully.',
            name: user.fullName,
        });
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};
