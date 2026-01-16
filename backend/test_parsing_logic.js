const { expect } = require('assert');

// Mock of the server.js logic we want to test
const getSignalKeyFromStrategy = (strategy) => {
    if (!strategy) return null;
    const normalized = strategy.replace(/\s+/g, '_').toLowerCase();

    // ... (Paste logic from server.js for quick verify)
    if (normalized.includes('pro4xx') || normalized.includes('pro4x.2')) {
        if (normalized.includes('gr') || normalized.includes('get_ready')) {
            if (normalized.includes('buy')) return 'pro4xx_GetReady_Buy';
            if (normalized.includes('sell')) return 'pro4xx_GetReady_Sell';
            return 'pro4xx_GetReady_Buy';
        }
        if (normalized.includes('entry_buy')) return 'pro4xx_Buy';
        if (normalized.includes('entry_sell')) return 'pro4xx_Sell';
    }

    if (normalized.includes('pro4x_sell')) return 'pro4x_Sell';

    if (normalized.includes('horus_buy')) return 'horus_Buy';
    if (normalized.includes('horus_sell')) return 'horus_Sell';

    if (normalized.includes('get_ready') || normalized.includes('getready')) {
        if (normalized.includes('horus')) return 'horus_GetReady';
        return 'pro4x_GetReady';
    }
    return null;
};

// Test Cases
const tests = [
    { input: "Pro4x Get Ready", expected: "pro4x_GetReady" },
    { input: "PRO4X | GETREADY", expected: "pro4x_GetReady" },
    { input: "Pro4x Sell", expected: "pro4x_Sell" }, // This might fail if exact string match isn't perfect in my mock above, but let's see
    { input: "ENTRY|SELL", expected: null } // This relies on the other parser, not this function
];

console.log("Running Parsing Logic Tests...");
tests.forEach(t => {
    const result = getSignalKeyFromStrategy(t.input);
    console.log(`Input: "${t.input}" -> Mapped: "${result}" | Expected: "${t.expected}"`);
    if (result !== t.expected && t.expected !== null) console.error("FAILED");
});
