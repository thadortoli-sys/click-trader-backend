const http = require('http');

// Pro4x Get Ready JSON Payload simulation
const payload = JSON.stringify({
    ticker: "NQ",
    strategy: "pro4x_GetReady", // Exact string user might be sending
    price: "20550",
    timeframe: "1m",
    signal: "ALERT"
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/webhook',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    }
};

console.log("Simulating Pro4x GetReady Payload...");

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(payload);
req.end();
