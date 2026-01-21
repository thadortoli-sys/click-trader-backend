const axios = require('axios');

const URL = 'http://localhost:3000/webhook';

// 1. Horus ADV Bullish
const hAdvBuy = {
    strategy: "horus_Adv_Buy",
    ticker: "NQ-TEST",
    price: 20610,
    action: "BUY",
    message: "Horus ADV Institutional Entry"
};

// 2. Horus ADV Bearish
const hAdvSell = {
    strategy: "horus_Adv_Sell",
    ticker: "NQ-TEST",
    price: 20620,
    action: "SELL",
    message: "Horus ADV Institutional Short"
};

// 3. Scalp OVS (Bullish)
const scalpOVS = {
    strategy: "scalp_OverSold",
    ticker: "NQ-TEST",
    price: 20630,
    action: "BUY",
    message: "OVS Bounce Detected"
};

// 4. Scalp OVB (Bearish)
const scalpOVB = {
    strategy: "scalp_OverBought",
    ticker: "NQ-TEST",
    price: 20640,
    action: "SELL",
    message: "OVB Rejection Detected"
};

const sequence = [hAdvBuy, hAdvSell, scalpOVS, scalpOVB];

async function run() {
    console.log("🚀 Testing Horus ADV & Scalp Styles...");
    for (const s of sequence) {
        try {
            await axios.post(URL, s);
            console.log(`✅ Sent ${s.strategy}`);
        } catch (e) {
            console.error(e);
        }
        await new Promise(r => setTimeout(r, 4000));
    }
}

run();
