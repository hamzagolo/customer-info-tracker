

const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');
const env = require('dotenv')


const app = express();
const port = 3000;
env.config();


// PostgreSQL connection configuration
const pool = new Pool({
    user: process.env.PG_USER,   
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD, 
    port: process.env.PG_PORT,
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from 'public' folder

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const { 'PHONE NUMBER': phoneNumber, EMAIL: email } = req.body;

    // Basic validation on the backend (optional, since frontend already validates)
    if (!phoneNumber || !email) {
        return res.status(400).json({ message: 'Please fill out both fields' });
    }
    if (!email.includes('@')) {
        return res.status(400).json({ message: 'Please enter a valid email' });
    }

    try {
        const query = 'INSERT INTO customers (phone_number, email) VALUES ($1, $2) RETURNING *';
        const values = [phoneNumber, email];
        await pool.query(query, values);
        res.json({ message: 'Customer info has been successfully stored thank you!' });
    } catch (error) {
        console.error('Error storing customer info:', error);
        res.status(500).json({ message: 'Error storing customer info' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

