require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Feedback = require('./models/Feedback');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_feedback';

app.use(cors());
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (req, res) => {
    const ready = mongoose.connection.readyState === 1;
    res.json({ ok: true, db: ready ? 'connected' : 'disconnected' });
});

app.post('/api/feedback', async (req, res) => {
    try {
        const { name, email, mobile, department, gender, feedback } = req.body || {};

        if (!name || !email || !mobile || !department || !gender || !feedback) {
            return res.status(400).json({ ok: false, message: 'All fields are required.' });
        }

        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
        if (!emailOk) {
            return res.status(400).json({ ok: false, message: 'Invalid email address.' });
        }

        if (!/^[0-9]{10}$/.test(String(mobile).trim())) {
            return res.status(400).json({ ok: false, message: 'Mobile must be 10 digits.' });
        }

        const doc = await Feedback.create({
            name: String(name).trim(),
            email: String(email).trim().toLowerCase(),
            mobile: String(mobile).trim(),
            department: String(department).trim(),
            gender,
            feedback: String(feedback).trim(),
        });

        res.status(201).json({ ok: true, id: doc._id.toString() });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ ok: false, message: err.message });
        }
        console.error(err);
        res.status(500).json({ ok: false, message: 'Could not save feedback.' });
    }
});

app.use(express.static(path.join(__dirname)));

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server: http://localhost:${PORT}`);
            console.log(`MongoDB: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    });
