const axios = require('axios');

// Payload to trigger "Pro4x.2 Bearish"
// Strategy: Pro4x.2 -> Key 'pro4x'
// Message: "Bearish" to trigger improved fuzzy matching
const payload = {
    ticker: "TEST",
    strategy: "Pro4x.2",
    action: "sell", // Optional, but good for context
    price: 15000,
    message: "Bearish Structural Alignment - Test Verification",
};

async function sendTest() {
    try {
        console.log("🚀 Sending Test Payload:", payload);
        const res = await axios.post('http://localhost:3000/webhook', payload);
        console.log("✅ Response:", res.status, res.data);
    } catch (error) {
        console.error("❌ Error sending test:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
}

sendTest();
