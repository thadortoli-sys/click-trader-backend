// Test script to verify the notification title logic from server.js

function getFinalTitle(strategy, isUserPro) {
    let finalTitle = "Original Title"; // Default
    const s = (strategy || '').toLowerCase();

    // --- UNIVERSAL TITLE STANDARDIZATION (ALL USERS) ---
    // Copy-pasted logic from server.js
    if (!s.startsWith('vol_') && !s.includes('regime')) {
        if (s.includes('horus')) {
            finalTitle = "Horus Set up";
        } else if (s.includes('pro4x.2') || s.includes('pro4xx')) {
            finalTitle = "Pro4.2 set up";
        } else if (s.includes('get ready') || s.includes('prepare') || s.includes('forming')) {
            finalTitle = "Pro4x Set up forming";
        } else if (s.includes('pro4x')) {
            finalTitle = "Pro4x Set up";
        }
    }

    return finalTitle;
}

// Test Cases
const tests = [
    { strategy: "Horus Bullish", isPro: true, expected: "Horus Set up" },
    { strategy: "Horus Bearish", isPro: false, expected: "Horus Set up" },
    { strategy: "Pro4x Bullish", isPro: true, expected: "Pro4x Set up" },
    { strategy: "Pro4x.2 Bearish", isPro: true, expected: "Pro4.2 set up" },
    { strategy: "Pro4x Get Ready", isPro: false, expected: "Pro4x Set up forming" },
    { strategy: "Unknown Strategy", isPro: true, expected: "Original Title" }
];

console.log("--- RUNNING NOTIFICATION TEXT TESTS ---\n");
tests.forEach(t => {
    const result = getFinalTitle(t.strategy, t.isPro);
    const pass = result === t.expected;
    console.log(`Input: "${t.strategy}" (Pro: ${t.isPro})`);
    console.log(`Output: "${result}"`);
    console.log(`Status: ${pass ? "✅ PASS" : "❌ FAIL"}`);
    console.log("---");
});
