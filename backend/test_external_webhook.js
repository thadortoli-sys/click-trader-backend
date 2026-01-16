const fetch = require('node-fetch');

// ⚠️ We are testing the PUBLIC URL to ensure ngrok is 200 OK (no more 502s)
// This simulates exactly what TradingView does from the outside world.
const WEBHOOK_URL = 'https://rachell-hyperscrupulous-larissa.ngrok-free.dev/webhook';

const PAYLOAD = {
    ticker: "NQ",
    strategy: "horus_Buy",
    price: "20555",
    timeframe: "1m",
    signal: "BUY"
};

console.log("--- SIMULATING EXTERNAL (TRADINGVIEW) HIT ---");
console.log(`Target: ${WEBHOOK_URL}`);

(async () => {
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            body: JSON.stringify(PAYLOAD),
            headers: { 'Content-Type': 'application/json' }
        });

        console.log(`Response Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
            const data = await response.json();
            console.log("✅ SUCCESS! Ngrok passed the request to Backend.");
            console.log("Response:", data);
        } else {
            console.error("❌ ERROR: Ngrok returned an error.");
            const text = await response.text();
            console.error("Body:", text);
        }
    } catch (e) {
        console.error("❌ NETWORK ERROR:", e.message);
    }
})();
