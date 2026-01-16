const https = require('https');

const data = JSON.stringify({
    ticker: "NQ-NGROK-TEST",
    price: "20555",
    timeframe: "1m",
    strategy: "scalp_OverSold",
    signal: "BUY"
});

const options = {
    hostname: 'rachell-hyperscrupulous-larissa.ngrok-free.dev',
    path: '/webhook',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Sending Test Signal to Ngrok URL...');

const req = https.request(options, (res) => {
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
