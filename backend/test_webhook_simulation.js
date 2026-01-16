const axios = require('axios');

const WEBHOOK_URL = 'http://localhost:3000/webhook';

const PAYLOAD = {
    ticker: "NQ",
    strategy: "horus_Buy",
    price: "20500",
    timeframe: "1m",
    signal: "BUY"
};

console.log("--- SIMULATING TRADINGVIEW WEBHOOK ---");
console.log(`Target: ${WEBHOOK_URL}`);
console.log(`Payload:`, PAYLOAD);

(async () => {
    try {
        const response = await axios.post(WEBHOOK_URL, PAYLOAD);

        console.log("Response:", response.data);
        console.log("✅ Webhook accepted by server. Check your phone!");

    } catch (e) {
        console.error("❌ CONNECTION ERROR. Is the server running?", e.message);
        if (e.response) {
            console.error("Server responded with:", e.response.status, e.response.data);
        }
    }
})();
