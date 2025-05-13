const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from www directory
app.use(express.static(path.join(__dirname, 'www')));

// API routes
app.post('/api/compile', (req, res) => {
    // TODO: Implement compilation endpoint
    res.json({ status: 'not implemented yet' });
});

app.post('/api/upload', (req, res) => {
    // TODO: Implement upload endpoint
    res.json({ status: 'not implemented yet' });
});

// Serve serial.html for /serial route
app.get('/serial', (req, res) => {
    res.sendFile(path.join(__dirname, 'www', 'serial.html'));
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 