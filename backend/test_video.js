const axios = require('axios');
const os = require('os');

// Helper to get local IP
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const LOCAL_IP = getLocalIP();
const PORT = 3000;
// Note: If using a real device, ensure it can reach this IP. 
// If using Emulator, '10.0.2.2' is often localhost, but for Expo Go LAN, the LAN IP is best.
const VIDEO_URL = `http://${LOCAL_IP}:${PORT}/public/pro4x_sell.mov`;

const payload = {
    ticker: 'TEST/VIDEO',
    strategy: 'pro4x_Sell',
    signal: 'SELL',
    price: 12345.67,
    timeframe: '1m',
    videoUrl: VIDEO_URL
};

console.log(`Sending payload with Video URL: ${VIDEO_URL}`);

axios.post(`http://localhost:${PORT}/webhook`, payload)
    .then(res => {
        console.log('Status:', res.status);
        console.log('Body:', res.data);
    })
    .catch(err => {
        console.error('Error:', err.message);
        if (err.response) console.error(err.response.data);
    });
