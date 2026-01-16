const fetch = require('node-fetch');

async function sendTestAlert(strategy, signal, ticker = 'NQ', price = '20750') {
    const payload = {
        strategy: strategy,
        ticker: ticker,
        price: price,
        signal: signal,
        timeframe: '1m',
        time: new Date().toISOString()
    };

    console.log(`Sending ${strategy} | ${signal}...`);
    try {
        const response = await fetch('http://localhost:3000/webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log('Response:', data.status);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function runTests() {
    // 1. Get Ready
    await sendTestAlert('PRO4X GET READY', 'INFO');

    // 2. M1 Syncro Bullish
    await sendTestAlert('M1 SYNCRO BULLISH', 'BUY');

    // 3. Syncro Resistance Sell
    await sendTestAlert('SYNCRO RESISTANCE', 'SELL');

    // 4. Horus Oversold
    await sendTestAlert('HORUS OVERSOLD', 'BUY');

    console.log('\nTests completed. Check the app dashboard and history.');
}

runTests();
