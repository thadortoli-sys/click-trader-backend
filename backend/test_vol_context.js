
const axios = require('axios');

const BACKEND_URL = 'http://localhost:3000/webhook';

const TESTS = [
    { level: 'CALM', payload: 'VOL_CONTEXT|CALM|MNQ1!|1m|PRICE=24500.50|TIME=10:00' },
    { level: 'NORMAL', payload: 'VOL_CONTEXT|NORMAL|MNQ1!|1m|PRICE=24510.50|TIME=10:05' },
    { level: 'HOT', payload: 'VOL_CONTEXT|HOT|MNQ1!|1m|PRICE=24550.00|TIME=10:10' },
    { level: 'EXTREME', payload: 'VOL_CONTEXT|EXTREME|MNQ1!|1m|PRICE=24600.00|TIME=10:15' },
    { level: 'PANIC', payload: 'VOL_CONTEXT|PANIC|MNQ1!|1m|PRICE=23000.00|TIME=10:20' },
    { level: 'TREND', payload: 'VOL_CONTEXT|TREND|MNQ1!|1m|PRICE=24520.00|TIME=10:25' },
    { level: 'RANGE', payload: 'VOL_CONTEXT|RANGE|MNQ1!|1m|PRICE=24530.00|TIME=10:30' }
];

async function runTests() {
    console.log(`Starting VOL_CONTEXT tests against ${BACKEND_URL}...`);

    for (const test of TESTS) {
        try {
            console.log(`\nTesting ${test.level}...`);
            const response = await axios.post(BACKEND_URL, test.payload, {
                headers: { 'Content-Type': 'text/plain' }
            });
            console.log(`✅ ${test.level} Sent. Status: ${response.status}`);
        } catch (error) {
            console.error(`❌ ${test.level} Failed:`, error.message);
        }
        // Wait a bit between requests
        await new Promise(r => setTimeout(r, 1000));
    }
}

runTests();
