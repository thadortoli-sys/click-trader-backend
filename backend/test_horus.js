const http = require('http');

const payload = JSON.stringify({
    ticker: "NQ-TEST-HORUS",
    price: "20450",
    timeframe: "1m",
    strategy: "scalp_OverSold",
    signal: "BUY",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
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

console.log('Sending SCALP HORUS Signal to localhost:3000...');

const req = http.request(options, (res) => {
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
