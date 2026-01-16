const axios = require('axios');

const PAYLOAD = {
    strategy: "pro4x_Buy",
    ticker: "NQ-TEST-PRO4X",
    price: 20550.00,
    timeframe: "1m",
    signal: "BUY",
    message: "Pro4x Buy test signal"
};

async function sendSignal() {
    try {
        console.log("Sending PRO4X BUY Signal to localhost:3000/webhook...");
        const response = await axios.post('http://localhost:3000/webhook', PAYLOAD);
        console.log("STATUS:", response.status);
        console.log(JSON.stringify(response.data));
    } catch (error) {
        console.error("ERROR:", error.message);
    }
}

sendSignal();
