
// --- MOCK THE FUNCTION FROM SERVER.JS ---
const getSignalKeyFromStrategy = (strategy) => {
    if (!strategy) return null;
    const normalized = strategy.replace(/\s+/g, '_').toLowerCase();

    // PRO4XX.2 / PRO4X.2
    if (normalized.includes('pro4xx') || normalized.includes('pro4x.2') || normalized.includes('pro4x_2')) {
        // 1. GET READY
        if (normalized.includes('gr') || normalized.includes('get_ready') || normalized.includes('getready')) {
            if (normalized.includes('buy')) return 'pro4xx_GetReady_Buy';
            if (normalized.includes('sell')) return 'pro4xx_GetReady_Sell';
            return 'pro4xx_GetReady'; // Default fallback
        }
        // 2. CONFIRMED ENTRIES
        if (normalized.includes('buy') && !normalized.includes('get')) return 'pro4xx_Buy';
        if (normalized.includes('sell') && !normalized.includes('get')) return 'pro4xx_Sell';
    }

    // PRO4X (Legacy)
    if (normalized.includes('pro4x')) {
        if (normalized.includes('get_ready') || normalized.includes('getready')) return 'pro4x_GetReady';
        if (normalized.includes('buy')) return 'pro4x_Buy';
        if (normalized.includes('sell')) return 'pro4x_Sell';
    }

    // HORUS ADV (INSTITUTIONAL SCALPING OLD KEY)
    if (normalized.includes('institutional') && normalized.includes('scalping')) {
        if (normalized.includes('buy')) return 'horus_Adv_Buy';
        if (normalized.includes('sell')) return 'horus_Adv_Sell';
    }
    // HORUS ADV (EXPLICIT CHECK - NEW)
    if (normalized.includes('horus') && (normalized.includes('adv') || normalized.includes('advanced'))) {
        if (normalized.includes('buy')) return 'horus_Adv_Buy';
        if (normalized.includes('sell')) return 'horus_Adv_Sell';
    }

    // Handle raw message parsing if strategy name isn't passed but message body is
    if (normalized.includes('level=') && normalized.includes('entry')) {
        if (normalized.includes('buy')) return 'horus_Adv_Buy';
        if (normalized.includes('sell')) return 'horus_Adv_Sell';
    }

    if (normalized.includes('horus_buy')) return 'horus_Buy';
    // Fallback for simple "Horus Buy" with space -> horus_buy
    if (normalized.includes('horus') && normalized.includes('buy')) return 'horus_Buy';

    if (normalized.includes('horus_sell')) return 'horus_Sell';
    if (normalized.includes('horus') && normalized.includes('sell')) return 'horus_Sell';

    if (normalized.includes('shadow') || normalized.includes('shadoow')) {
        if (normalized.includes('buy')) return 'shadow_Buy';
        if (normalized.includes('sell')) return 'shadow_Sell';
        return 'shadow_Mode'; // Return specific key instead of null for settings check
    }
    if (normalized.includes('oversold')) return 'scalp_OverSold';
    if (normalized.includes('overbought')) return 'scalp_OverBought';
    if (normalized.includes('pump')) return 'scalp_TakeProfitPump';
    if (normalized.includes('push')) return 'scalp_TakeProfitPush';
    if (normalized.includes('syncro')) {
        if (normalized.includes('resistance') || normalized.includes('sell_res')) return 'scalp_SyncroResSell';
        if (normalized.includes('support') || normalized.includes('buy_res')) return 'scalp_SyncroResBuy';

        // M1 Trends
        if (normalized.includes('m1')) {
            if (normalized.includes('bull') || normalized.includes('buy')) return 'm1_SyncroBullish';
            if (normalized.includes('bear') || normalized.includes('sell')) return 'm1_SyncroBearish';
        }
    }
    if (normalized.includes('h1') && normalized.includes('bull')) return 'h1_SyncroBullish';
    if (normalized.includes('h1') && normalized.includes('bear')) return 'h1_SyncroBearish';

    // Generic Fallbacks last
    if (normalized.includes('buy')) return 'pro4x_Buy';
    if (normalized.includes('sell')) return 'pro4x_Sell';

    return null;
};

// --- TEST CASES ---
const testCases = [
    { input: "Pro4xx Buy", expected: "pro4xx_Buy" },
    { input: "Pro4xx Sell", expected: "pro4xx_Sell" },
    { input: "Pro4xx Get Ready Buy", expected: "pro4xx_GetReady_Buy" },
    { input: "Pro4xx Get Ready Sell", expected: "pro4xx_GetReady_Sell" },

    { input: "Pro4x Buy", expected: "pro4x_Buy" },
    { input: "Pro4x Sell", expected: "pro4x_Sell" },
    { input: "Pro4x Get Ready", expected: "pro4x_GetReady" },

    { input: "Horus Buy", expected: "horus_Buy" },
    { input: "Horus Sell", expected: "horus_Sell" },
    { input: "Horus ADV Buy", expected: "horus_Adv_Buy" },
    { input: "Horus Advanced Sell", expected: "horus_Adv_Sell" },
    { input: "Institutional Scalping Buy", expected: "horus_Adv_Buy" }, // Webhook legacy format

    { input: "Shadow Buy", expected: "shadow_Buy" },
    { input: "Shadow Sell", expected: "shadow_Sell" },

    { input: "Horus Oversold", expected: "scalp_OverSold" },
    { input: "Horus Overbought", expected: "scalp_OverBought" },

    { input: "TP Pump", expected: "scalp_TakeProfitPump" },
    { input: "TP Push", expected: "scalp_TakeProfitPush" },

    { input: "Syncro Resistance Sell", expected: "scalp_SyncroResSell" },
    { input: "Syncro Support Buy", expected: "scalp_SyncroResBuy" },

    { input: "M1 Syncro Bullish", expected: "m1_SyncroBullish" },
    { input: "M1 Syncro Bearish", expected: "m1_SyncroBearish" },

    { input: "H1 Syncro Bullish", expected: "h1_SyncroBullish" },
    { input: "H1 Syncro Bearish", expected: "h1_SyncroBearish" }
];

console.log("--- RUNNING STRATEGY MAPPING TESTS (VANILLA) ---");
let passed = 0;
let failed = 0;

testCases.forEach(({ input, expected }) => {
    const result = getSignalKeyFromStrategy(input);
    if (result === expected) {
        console.log(`✅ [PASS] "${input}" -> ${result}`);
        passed++;
    } else {
        console.error(`❌ [FAIL] "${input}" -> Got: ${result}, Expected: ${expected}`);
        failed++;
    }
});

console.log(`\nResults: ${passed} Passed, ${failed} Failed`);
if (failed > 0) process.exit(1);
