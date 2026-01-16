const http = require('http');

const data = JSON.stringify({
    ticker: "NQ-TEST-SHADOW-GENERIC",
    price: "20700",
    timeframe: "1m",
    strategy: "SHADOW", // Testing the generic fallback
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

console.log('Sending Test GENERIC SHADOW Signal...');

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
