const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 200 },
        email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
        mobile: { type: String, required: true, trim: true },
        department: { type: String, required: true, trim: true },
        gender: { type: String, required: true, enum: ['Male', 'Female'] },
        feedback: { type: String, required: true, trim: true, maxlength: 500 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
