const bcrypt = require('bcryptjs');
const connectDB = require('../lib/db');
const User = require('../models/user');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        await connectDB();

        const normalizedEmail = String(email).toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        // Same generic message whether the email doesn't exist or the
        // password is wrong — never reveal which one it was.
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const matches = await bcrypt.compare(password, user.password);

        if (!matches) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        return res.status(200).json({
            message: 'Login successful.',
            name: user.fullName,
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};
