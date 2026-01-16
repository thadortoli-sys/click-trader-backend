const axios = require('axios');

const WEBHOOK_URL = 'http://localhost:3000/webhook';

// Payload matching "Info Support Buy"
const PAYLOAD = {
    ticker: "NQ",
    strategy: "Info Support Buy", // Should map to info_SupportBuy
    price: "20650",
    timeframe: "15m",
    signal: "BUY"
};

console.log("--- SIMULATING INFO SUPPORT SIGNAL ---");
console.log(`Payload:`, PAYLOAD);

(async () => {
    try {
        const response = await axios.post(WEBHOOK_URL, PAYLOAD);
        console.log("Response:", response.data);
        console.log("✅ Sent! Check the mobile dashboard.");
    } catch (e) {
        console.error("❌ Error:", e.message);
    }
})();
