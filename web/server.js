// Simple Node.js server for the web interface
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Mock sensor data
let sensorData = {
    heartRate: 72,
    spO2: 98,
    temperature: 36.8,
    activity: 'Idle'
};

// Routes
app.get('/api/data', (req, res) => {
    // Add slight randomness to simulate real data
    sensorData = {
        heartRate: 72 + Math.random() * 10 - 5,
        spO2: 98 + Math.random() * 2 - 1,
        temperature: 36.8 + Math.random() * 0.5 - 0.25,
        activity: ['Idle', 'Walking', 'Running'][Math.floor(Math.random() * 3)]
    };
    res.json(sensorData);
});

app.post('/api/calibrate', (req, res) => {
    console.log('Calibration requested');
    res.json({ status: 'calibration_started' });
});

app.post('/api/reset', (req, res) => {
    console.log('Device reset requested');
    res.json({ status: 'device_reset' });
});

app.get('/api/history', (req, res) => {
    // Return mock historical data
    const history = [];
    for (let i = 0; i < 60; i++) {
        history.push({
            timestamp: new Date(Date.now() - i * 60000).toISOString(),
            heartRate: 60 + Math.random() * 40,
            spO2: 95 + Math.random() * 5,
            temperature: 36.5 + Math.random() * 1
        });
    }
    res.json(history);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
