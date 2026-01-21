const axios = require('axios');

const URL = 'http://localhost:3000/webhook';

const alerts = [
    {
        strategy: "vol_Panic",
        ticker: "NQ-TEST",
        price: 20400,
        action: "INFO",
        message: "☢️ PANIC DETECTED\nExtreme selling pressure. Hedges engaged."
    },
    {
        strategy: "vol_Extreme",
        ticker: "NQ-TEST",
        price: 20450,
        action: "INFO",
        message: "⚠️ EXTREME VOLATILITY\nVIX Spiking. Reduce size."
    },
    {
        strategy: "vol_High",
        ticker: "NQ-TEST",
        price: 20500,
        action: "INFO",
        message: "🔥 MARKET HOT\nHigh activity zone."
    }
];

async function run() {
    console.log("Testing Volatility Alerts...");
    for (const alert of alerts) {
        try {
            await axios.post(URL, alert);
            console.log(`✅ Sent ${alert.strategy}`);
        } catch (e) {
            console.error(e.message);
        }
        await new Promise(r => setTimeout(r, 2000));
    }
}

run();
