const http = require('http');

const data = JSON.stringify({
    ticker: "NQ-TEST-SHADOW-CUSTOM",
    price: "20888",
    timeframe: "1m",
    strategy: "shadow_BuyAbsolute", // Testing specific strategy logic
    signal: "BUY"
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/webhook',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Sending Test SHADOW CUSTOM TEXT Signal...');

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
