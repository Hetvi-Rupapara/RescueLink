const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

// In-memory store for SOS reports (later you can move to DB)
const sosReports = []; // [web:189][web:190]

// Allow requests from Expo web dev servers
app.use(
  cors({
    origin: ['http://localhost:8081', 'http://localhost:19006'],
  }),
); // [web:191][web:194]

// Parse JSON bodies
app.use(express.json()); // [web:190][web:194]

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'RescueLink backend is running' });
}); // [web:186][web:188]

// Create SOS report (called by mobile app)
app.post('/api/sos', (req, res) => {
  console.log('Received SOS body:', req.body);

  const {
    name,
    location,
    description,
    phone,
    peopleCount,
    severity,
  } = req.body || {};

  if (!name || !location || !description) {
    return res.status(400).json({
      message: 'Missing required fields',
      required: ['name', 'location', 'description'],
    });
  }

  const report = {
    id: sosReports.length + 1,
    name,
    location,
    description,
    phone: phone || null,
    peopleCount: peopleCount || null,
    severity: severity || 'medium',
    createdAt: new Date().toISOString(),
  };

  sosReports.push(report);

  return res.status(201).json({
    message: 'SOS received successfully',
    data: report,
  });
}); // [web:189][web:190]

// List all SOS reports (for future dashboard)
app.get('/api/sos', (req, res) => {
  res.json({
    count: sosReports.length,
    reports: sosReports,
  });
}); // [web:186][web:189]

// Start server
app.listen(PORT, () => {
  console.log(`RescueLink backend listening on http://localhost:${PORT}`);
}); // [web:192][web:195]
