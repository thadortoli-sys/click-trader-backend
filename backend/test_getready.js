const axios = require('axios');

const PAYLOAD = {
    strategy: "horus_GetReady",
    ticker: "NQ-TEST-GR",
    price: 20550.00,
    timeframe: "1m",
    signal: "BUY",
    message: "Horus Get Ready - Potential Long Setup"
};

async function sendSignal() {
    try {
        console.log("Sending HORUS GET READY Signal...");
        const response = await axios.post('http://localhost:3000/webhook', PAYLOAD);
        console.log("STATUS:", response.status);
        console.log(JSON.stringify(response.data));
    } catch (error) {
        console.error("ERROR:", error.message);
    }
}

sendSignal();
