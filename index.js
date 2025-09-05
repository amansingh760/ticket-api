
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db();
  }
}



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



{/*
app.get('/tickets', async (req, res) => {
  await connectDB();
  const tickets = await db.collection('tickets').find().toArray();
  res.json(tickets);
});

app.post('/tickets', async (req, res) => {
  await connectDB();
  const result = await db.collection('tickets').insertOne(req.body);
  res.status(201).json(result);
});
*/}
module.exports = app;
