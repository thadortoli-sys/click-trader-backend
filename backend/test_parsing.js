const express = require('express');
const bodyParser = require('body-parser');

// Mock helpers from server.js
const findValue = (obj, searchKeys) => {
    if (!obj || typeof obj !== 'object') return null;
    const keys = Object.keys(obj);
    for (let k of keys) {
        const keyLower = k.toLowerCase();
        for (let search of searchKeys) {
            if (keyLower.includes(search)) return obj[k];
        }
    }
    return null;
};

const parse = (body) => {
    let data = body;
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.log('Parsing raw text...');
            const text = data;
            data = {};
            const extract = (key) => {
                const match = text.match(new RegExp(`${key}\\s*[:=]\\s*([^\\n,]+)`, 'i'));
                return match ? match[1].trim() : null;
            };
            data.strategy = extract('strategy');
            data.ticker = extract('ticker') || extract('symbol');
            data.price = extract('price');
            data.action = extract('action') || extract('signal');
            data.message = text;
        }
    }

    let strategy = data.strategy || data.Strategy || findValue(data, ['strat', 'alert', 'name', 'type']) || 'System Message';
    let ticker = data.ticker || data.symbol || data.Symbol || findValue(data, ['pair', 'sym', 'coin', 'asset']) || 'SYSTEM';

    return { strategy, ticker, raw: data };
};

// Test Cases
const tests = [
    { name: "Standard JSON", input: { strategy: "Pro4x", ticker: "BTCUSD" } },
    { name: "TradingView Text", input: "Strategy: Pro4x\nTicker: BTCUSD" },
    { name: "Missing Strategy", input: { ticker: "BTCUSD", foo: "bar" } },
    { name: "Lowercase keys", input: { strat: "MyStrat", sym: "ETHUSD" } },
    { name: "Unknown Input", input: { val: 123, msg: "Hello" } },
    { name: "User Complaint Simulation", input: "Alert: Unknown" } // Does this produce "Unknown"?
];

tests.forEach(test => {
    console.log(`\n--- Test: ${test.name} ---`);
    console.log("Input:", test.input);
    const result = parse(test.input);
    console.log("Result:", result);
});
