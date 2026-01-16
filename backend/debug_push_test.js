const { Expo } = require('expo-server-sdk');
const fs = require('fs');
const path = require('path');

const expo = new Expo();
const TOKENS_FILE = path.join(__dirname, 'tokens.json');

console.log("--- DEBUG PUSH TEST START ---");

// 1. Load Tokens
if (!fs.existsSync(TOKENS_FILE)) {
    console.error("ERROR: tokens.json file not found!");
    process.exit(1);
}

let savedPushTokens = [];
try {
    const data = fs.readFileSync(TOKENS_FILE, 'utf8');
    savedPushTokens = JSON.parse(data);
    console.log(`Loaded ${savedPushTokens.length} tokens.`);
} catch (e) {
    console.error("Error parsing tokens.json:", e);
    process.exit(1);
}

if (savedPushTokens.length === 0) {
    console.log("No tokens found to send to.");
    process.exit(0);
}

// 2. Create Message
const messages = [];
for (let pushToken of savedPushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Skipping invalid token: ${pushToken}`);
        continue;
    }

    console.log(`Preparing message for: ${pushToken}`);
    messages.push({
        to: pushToken,
        sound: 'default',
        title: "🛡️ DEBUG TEST NOTIFICATION",
        body: "If you read this, the backend connection is WORKING correcty.",
        priority: 'high',
        channelId: 'default',
        _displayInForeground: true,
        data: {
            strategy: 'debug',
            message: 'Debug test success',
            title: 'DEBUG TEST'
        },
    });
}

// 3. Send
(async () => {
    try {
        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        console.log(`Sending ${chunks.length} chunks...`);

        for (let chunk of chunks) {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log("Ticket Chunk Result:", ticketChunk);
            tickets.push(...ticketChunk);
        }
        console.log("--- DONE ---");
    } catch (error) {
        console.error("FATAL ERROR sending:", error);
    }
})();
