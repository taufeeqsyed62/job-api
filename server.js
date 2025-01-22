const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve frontend files

const DATA_FILE = 'data.json';

// Get all records
app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read data" });
        res.json(JSON.parse(data));
    });
});

// Add a new record
app.post('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        let jsonData = JSON.parse(data || '[]');
        // Ensure new fields are included in the request
        const { job, role, batch, deadline, apply_link } = req.body;
        if (!job || !role || !batch || !deadline || !apply_link) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        jsonData.push({ job, role, batch, deadline, apply_link });
        fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Failed to write data" });
            res.json({ message: "Record added" });
        });
    });
});

// Update a record by index
app.put('/api/data/:index', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        let jsonData = JSON.parse(data || '[]');
        const { job, role, batch, deadline, apply_link } = req.body;
        if (!job || !role || !batch || !deadline || !apply_link) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        jsonData[req.params.index] = { job, role, batch, deadline, apply_link };
        fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Failed to update data" });
            res.json({ message: "Record updated" });
        });
    });
});

// Delete a record by index
app.delete('/api/data/:index', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        let jsonData = JSON.parse(data || '[]');
        jsonData.splice(req.params.index, 1);
        fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Failed to delete data" });
            res.json({ message: "Record deleted" });
        });
    });
});

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
