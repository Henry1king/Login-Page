const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        // This is always a bcrypt HASH, never the plaintext password.
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// mongoose.models.User reuses an already-compiled model instead of
// recompiling it on every warm serverless invocation (avoids
// "OverwriteModelError" locally too).
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
