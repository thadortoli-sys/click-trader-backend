const axios = require('axios');

const PAYLOAD = {
    strategy: "Pro4x.2",
    ticker: "NQ",
    price: 20550.00,
    timeframe: "1m",
    signal: "BEARISH",
    message: "Trend Alignment Bearish", // The exact text user sees
    title: "Signal: Pro4x.2" // The exact title user sees (simulated default or explicit)
};

async function sendSignal() {
    try {
        console.log("Sending REPRODUCTION SIGNAL to localhost:3000/webhook...");
        const response = await axios.post('http://localhost:3000/webhook', PAYLOAD);
        console.log("STATUS:", response.status);
    } catch (error) {
        console.error("ERROR:", error.message);
    }
}

sendSignal();
