const axios = require('axios');

const URL = 'http://localhost:3000/webhook';

// 1. Pro4x.2 (Active Trade) - should be GREEN ARROW
const pro4x = {
    strategy: "Pro4x.2",
    ticker: "NQ-TEST",
    price: 20500,
    action: "BUY",
    message: "✅ Pro4x.2 | Long Confirmed\n\nMarket aligned for bullish continuation."
};

// 2. Pro4x.2 (Setup Forming) - should be AMBER PULSE
const setupForming = {
    strategy: "Pro4x.2",
    ticker: "NQ-TEST",
    price: 20510,
    action: "INFO",
    message: "⚠️ Setup Forming Bullish\n\nPrice approaching key level. Wait for confirmation."
};

// 3. Shadow (Active Trade) - should be GREEN ARROW
const shadow = {
    strategy: "Shadow Buy",
    ticker: "NQ-TEST",
    price: 20520,
    action: "BUY",
    message: "Shadow Mode Bullish\nExhaustion sequence detected."
};

// 4. Horus (Active Trade) - should be GREEN ARROW
const horus = {
    strategy: "Horus Buy",
    ticker: "NQ-TEST",
    price: 20530,
    action: "BUY",
    message: "Horus System Bullish\nReversal confirmed."
};

// 5. Horus ADV (Active Trade) - should be GREEN ARROW
const horusAdv = {
    strategy: "horus_Adv_Buy",
    ticker: "NQ-TEST",
    price: 20540,
    action: "BUY",
    message: "Horus ADV Institutional Scalp\nBullish Momentum."
};

// 6. Scalp (OVS - OverSold) - should be GREEN ARROW
const scalp = {
    strategy: "scalp_OverSold",
    ticker: "NQ-TEST",
    price: 20550,
    action: "BUY",
    message: "Horus OVS (OverSold)\nBounce Expected."
};

// 7. Syncro (Context) - should be GREEN ARROW
const syncro = {
    strategy: "h1_SyncroBullish",
    ticker: "NQ-TEST",
    price: 20560,
    action: "INFO",
    message: "Syncro H1 Bullish\nMajor trend alignment."
};

const sequence = [pro4x, setupForming, shadow, horus, horusAdv, scalp, syncro];

async function runSequence() {
    console.log("🚀 Starting Sequential Category Test...");

    for (let i = 0; i < sequence.length; i++) {
        const signal = sequence[i];
        console.log(`\n-----------------------------------`);
        console.log(`Sending Signal ${i + 1}/${sequence.length}: ${signal.strategy}`);

        try {
            await axios.post(URL, signal);
            console.log("✅ Sent!");
        } catch (error) {
            console.error("❌ Error sending:", error.message);
        }

        if (i < sequence.length - 1) {
            console.log("Waiting 8 seconds...");
            await new Promise(resolve => setTimeout(resolve, 8000));
        }
    }

    console.log("\n✅ Sequence Complete!");
}

runSequence();
