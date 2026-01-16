const axios = require('axios');

const WEBHOOK_URL = 'http://localhost:3000/webhook';

const signals = [
    {
        name: "1. GR BUY (GetReady)",
        payload: {
            "strategy": "pro4x_GetReady",
            "ticker": "NQ-TEST-GR-BUY",
            "price": 20400,
            "timeframe": "1m",
            "signal": "BUY", // Using generic 'BUY' signal inside GR context
            "message": "Get Ready Long"
        }
    },
    {
        name: "2. GR SELL (GetReady)",
        payload: {
            "strategy": "pro4x_GetReady",
            "ticker": "NQ-TEST-GR-SELL",
            "price": 20600,
            "timeframe": "1m",
            "signal": "SELL", // Using generic 'SELL' signal inside GR context
            "message": "Get Ready Short"
        }
    },
    {
        name: "3. PRO4X BUY",
        payload: {
            "strategy": "pro4x_Buy",
            "ticker": "NQ-TEST-PRO4X-LONG",
            "price": 20450,
            "timeframe": "1m",
            "signal": "BUY",
            "message": "Pro4x Buy Confirmed"
        }
    },
    {
        name: "4. PRO4X SELL",
        payload: {
            "strategy": "pro4x_Sell",
            "ticker": "NQ-TEST-PRO4X-SHORT",
            "price": 20550,
            "timeframe": "1m",
            "signal": "SELL",
            "message": "Pro4x Sell Confirmed"
        }
    },
    {
        name: "5. HORUS OVS (OverSold)",
        payload: {
            "strategy": "scalp_OverSold",
            "ticker": "NQ-TEST-HORUS-OVS",
            "price": 20380,
            "timeframe": "1m",
            "signal": "BUY",
            "message": "Scalp Oversold Alert"
        }
    },
    {
        name: "6. HORUS OVB (OverBought)",
        payload: {
            "strategy": "scalp_OverBought",
            "ticker": "NQ-TEST-HORUS-OVB",
            "price": 20720,
            "timeframe": "1m",
            "signal": "SELL",
            "message": "Scalp Overbought Alert"
        }
    }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function sendSignals() {
    console.log("🚀 Starting Full Signal Sequence Simulation...");

    for (const sig of signals) {
        console.log(`\n---------------------------------`);
        console.log(`📡 Sending: ${sig.name}`);
        try {
            const response = await axios.post(WEBHOOK_URL, sig.payload);
            console.log(`✅ Status: ${response.status} ${response.statusText}`);
        } catch (error) {
            console.error(`❌ Error sending ${sig.name}:`, error.message);
        }

        // Wait 3 seconds between signals so user can see them pop up
        if (sig !== signals[signals.length - 1]) {
            console.log("⏳ Waiting 3 seconds...");
            await sleep(3000);
        }
    }

    console.log(`\n✅ Sequence Completed.`);
}

sendSignals();
