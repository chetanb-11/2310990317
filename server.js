const express = require('express');
const Log = require('./log.js')
const app = express();

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjaGV0YW4wMzE3LmJlMjNAY2hpdGthcmEuZWR1LmluIiwiZXhwIjoxNzc3OTU5ODIxLCJpYXQiOjE3Nzc5NTg5MjEsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJlZWM2NTNjNy02NTRmLTQzMTEtYWMwMC0wOGU1NDlhNTYzMmEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJjaGV0YW4gYmFuc2FsIiwic3ViIjoiZTNiZDZkZTgtYjU2NS00MTJjLTljZTMtMWViMzEyOGNkZmM5In0sImVtYWlsIjoiY2hldGFuMDMxNy5iZTIzQGNoaXRrYXJhLmVkdS5pbiIsIm5hbWUiOiJjaGV0YW4gYmFuc2FsIiwicm9sbE5vIjoiMjMxMDk5MDMxNyIsImFjY2Vzc0NvZGUiOiJFWGZ2RHAiLCJjbGllbnRJRCI6ImUzYmQ2ZGU4LWI1NjUtNDEyYy05Y2UzLTFlYjMxMjhjZGZjOSIsImNsaWVudFNlY3JldCI6InB1ZnR3VkNrYURjSERYdEUifQ.qnkBLwXIrmlLsLmyopg0I8e9sHjzxkO_55UvZW4nM6I";



// Request logging middleware
app.use((req, res, next) => {
    Log("backend", "info", "server", `Received ${req.method} request at ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.get('/depots', async (req, res) => {
    const url = "http://20.207.122.201/evaluation-service/depots";

    try {
        Log("backend", "info", "handler", "Attempting to fetch depots from evaluation service.");
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            Log("backend", "error", "handler", `Failed to fetch depots with status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        Log("backend", "info", "handler", "Successfully fetched depots data.");
        res.json(data);
    } catch (error) {
        Log("backend", "error", "handler", `Exception occurred fetching depots: ${error.message}`);
        console.error("Error fetching depots:", error);
        res.status(500).json({ error: 'Failed to fetch depots' });
    }
});
app.get('/vehicles', async (req, res) => {
    const url = "http://20.207.122.201/evaluation-service/vehicles";

    try {
        Log("backend", "info", "handler", "Attempting to fetch vehicles from evaluation service.");
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            Log("backend", "error", "handler", `Failed to fetch vehicles with status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        Log("backend", "info", "handler", "Successfully fetched vehicles data.");
        res.json(data);
    } catch (error) {
        Log("backend", "error", "handler", `Exception occurred fetching vehicles: ${error.message}`);
        console.error("Error fetching depots:", error);
        res.status(500).json({ error: 'Failed to fetch depots' });
    }
});

app.listen(3000, () => {
    Log("backend", "info", "server", "Server started and is running on port 3000");
    console.log('Server is running on port 3000');
});