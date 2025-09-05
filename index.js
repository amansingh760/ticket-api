const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
let db;
MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db(); // Set the database connection
    })
    .catch(err => console.log(err));

// Define a basic route
app.get('/', (req, res) => {
    res.send('Hello, this is your API!');
});

app.get('/state-data', async (req, res) => {
    try {
        const state_data = await db.collection('all').distinct('state');
        res.json(state_data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.post('/get-museum-data', async (req, res) => {
    try {
        const result = await db.collection('all').find({ state: req.body.state }).toArray();
        res.status(201).json(result); // Return the created user
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
