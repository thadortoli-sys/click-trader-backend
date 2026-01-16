const https = require('https');

const payload = JSON.stringify({
    ticker: "NQ-TEST",
    price: "21500",
    timeframe: "1m",
    strategy: "pro4x_Buy",
    signal: "BUY"
});

const options = {
    hostname: 'rachell-hyperscrupulous-larissa.ngrok-free.dev',
    // port: 3000, 
    path: '/webhook',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    }
};

console.log('Sending Signal to:', options.hostname);

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(payload);
req.end();
