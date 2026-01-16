const axios = require('axios');

const PAYLOAD = {
    strategy: "scalp_OverBought",
    ticker: "NQ-TEST-OVB",
    price: 20500.50,
    timeframe: "1m",
    signal: "SELL",
    message: "Market Overbought test signal"
};

async function sendSignal() {
    try {
        console.log("Sending HORUS OVB Signal...");
        const response = await axios.post('http://localhost:3000/webhook', PAYLOAD);
        console.log("STATUS:", response.status);
        console.log(JSON.stringify(response.data));
    } catch (error) {
        console.error("ERROR:", error.message);
    }
}

sendSignal();
