module.exports = {
    apps: [{
        name: "clicktrader-backend",
        script: "./server.js",
        env: {
            NODE_ENV: "production",
            PORT: 3000
        }
    }]
}
