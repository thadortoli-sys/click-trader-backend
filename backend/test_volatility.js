const axios = require('axios');

const ENDPOINT = 'http://localhost:3000/webhook';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ALERTS = [
    {
        name: "HOT (vol_High)",
        payload: {
            strategy: "vol_High",
            ticker: "NQ-VOL-TEST",
            price: 20600.00,
            interval: "1m",
            signal: "HOT",
            message: "VOL_CONTEXT|HOT|NQ-VOL-TEST|1m"
        }
    },
    {
        name: "EXTREME (vol_Extreme)",
        payload: {
            strategy: "vol_Extreme",
            ticker: "NQ-VOL-TEST",
            price: 20500.00,
            interval: "1m",
            signal: "EXTREME",
            message: "VOL_CONTEXT|EXTREME|NQ-VOL-TEST|1m"
        }
    },
    {
        name: "PANIC (vol_Panic)",
        payload: {
            strategy: "vol_Panic",
            ticker: "NQ-VOL-TEST",
            price: 20400.00,
            interval: "1m",
            signal: "PANIC",
            message: "VOL_CONTEXT|PANIC|NQ-VOL-TEST|1m"
        }
    }
];

async function sendAlerts() {
    console.log("Starting Volatility Test Sequence...");

    for (const alert of ALERTS) {
        try {
            console.log(`Sending ${alert.name}...`);
            const response = await axios.post(ENDPOINT, alert.payload);
            console.log(`STATUS: ${response.status} - ${JSON.stringify(response.data)}`);
        } catch (error) {
            console.error(`ERROR sending ${alert.name}:`, error.message);
        }
        await sleep(2000); // Wait 2s between alerts
    }

    console.log("Test Sequence Complete.");
}

sendAlerts();
