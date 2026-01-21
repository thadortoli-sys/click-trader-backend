const express = require('express');
const { Expo } = require('expo-server-sdk');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

// --- CONFIGURATION ---
// TODO: Use Environment Variables in Production (dotenv)
const SUPABASE_URL = 'https://mtzppdmnenrqvhzazscr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10enBwZG1uZW5ycXZoemF6c2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTc3NDAsImV4cCI6MjA3NzQ5Mzc0MH0.NdaDuyBkqAuZtLFI2uTehQTYcdS-FjhMl06Z8j_aiaY'; // Anon Key (Safe for Public/Backend if Policies Set)

const app = express();
const expo = new Expo();
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(cors());
app.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString(); // Save raw body for fallback
    }
}));

// MIDDLEWARE: Catch JSON Parse Errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.log('⚠️ JSON Parse Error detected. Treating body as plain text.');
        req.body = req.rawBody || '';
        next();
    } else {
        next(err);
    }
});

app.use(bodyParser.text({ type: '*/*' }));

// --- ROUTES ---

// 1. REGISTER PUSH TOKEN
app.post('/register', async (req, res) => {
    const { token, settings } = req.body;

    if (!Expo.isExpoPushToken(token)) {
        console.log(`Invalid Expo Push Token: ${token}`);
        return res.status(400).send({ error: 'Invalid Expo Push Token' });
    }

    try {
        console.log(`Registering Token: ${token}`);

        // UPSERT into Supabase (Insert or Update)
        const { error } = await supabase
            .from('user_settings')
            .upsert({
                token: token,
                settings: settings || {},
                updated_at: new Date()
            }, { onConflict: 'token' });

        if (error) throw error;

        console.log('✅ Token saved to Supabase');
        res.send({ status: 'Token registered' });
    } catch (e) {
        console.error('❌ Database Error:', e.message);
        res.status(500).send({ error: 'Failed to save token' });
    }
});

// 2. GET SIGNALS HISTORY (SYNC)
app.get('/signals', async (req, res) => {
    try {
        // Fetch last 100 signals from Supabase
        const { data, error } = await supabase
            .from('signals')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(100);

        if (error) throw error;

        res.send(data);
    } catch (e) {
        console.error('❌ Failed to fetch signals:', e.message);
        res.status(500).send({ error: 'Failed to fetch signals' });
    }
});

// 3. WEBHOOK (TradingView)
app.post('/webhook', async (req, res) => {
    // 1. PARSE PAYLOAD
    let data = req.body;
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.log('⚠️ Payload is raw string (Non-JSON). Using regex extraction.');
            // Fallback Regex Extraction (same as before)
            const text = data;
            data = {};
            const extract = (key) => {
                const match = text.match(new RegExp(`${key}\\s*[:=]\\s*([^\\n,]+)`));
                return match ? match[1].trim() : null;
            };
            data.strategy = extract('strategy') || 'Unknown';
            data.ticker = extract('ticker') || 'Unknown';
            data.price = extract('price') || '0';
            data.action = extract('action') || 'alert';
            data.message = text;
        }
    }

    console.log('\n--- 🔔 INCOMING SIGNAL ---');
    console.log(JSON.stringify(data, null, 2));

    // 2. NORMALIZE DATA
    const timestamp = Date.now();
    const strategy = data.strategy || 'Unknown Strategy';
    const ticker = data.ticker || 'Unknown Ticker';
    const price = data.price || '0';
    const timeframe = data.timeframe || 'M1';
    const signal = data.action || 'alert'; // buy/sell/alert

    // --- ENRICHMENT LOGIC (Icon/Color) ---
    // (Kept same as before)
    let icon = 'notifications-outline';
    let color = '#ffffff';
    // SAFE STORE UPDATE: "Signal" -> "Setup" / "Alignment"
    let notificationTitle = `Setup: ${strategy}`;
    let notificationBody = `Technical Alignment at ${price}`;

    const s = strategy.toLowerCase();
    const a = signal.toLowerCase();

    // COLOR LOGIC
    if (a.includes('buy') || a.includes('bullish') || s.includes('bullish')) color = '#4ADE80'; // Green
    if (a.includes('sell') || a.includes('bearish') || s.includes('bearish')) color = '#EF4444'; // Red
    if (s.includes('gold') || s.includes('ready')) color = '#FFD700'; // Gold

    // ICON LOGIC
    if (s.includes('pro4x') || s.includes('pro4xx')) icon = 'layers-outline';
    if (s.includes('horus')) icon = 'eye-outline';
    if (s.includes('shadow')) icon = 'moon-outline';
    if (s.includes('scalp')) icon = 'flash-outline';
    if (s.includes('money')) icon = 'cash-outline';

    // TITLE LOGIC (Overrides)
    if (s.includes('pro4x')) notificationTitle = `PRO4X | ${ticker}`;
    if (s.includes('horus')) notificationTitle = `HORUS | ${ticker}`;
    if (s.includes('shadow')) notificationTitle = `SHADOW MODE | ${ticker}`;

    // BODY LOGIC (Overrides for specific strategies to be safer)
    if (s.includes('pro4x')) notificationBody = `Trend Alignment Detected at ${price}`;
    if (s.includes('horus')) notificationBody = `Reversal Readings at ${price}`;

    // VIDEO LOGIC
    let videoUrl = null;
    if (s.includes('pro4x') && a.includes('buy')) videoUrl = 'https://www.example.com/videos/pro4x_buy.mp4';


    // 3. PERSIST SIGNAL TO DB
    const signalRecord = {
        pair: ticker,
        type: signal,
        price: price.toString(),
        timestamp: timestamp,
        data: {
            strategy, ticker, price, timeframe, signal,
            message: notificationBody, title: notificationTitle,
            icon, color, videoUrl
        }
    };

    try {
        const { error } = await supabase.from('signals').insert(signalRecord);
        if (error) console.error('⚠️ Failed to save signal to DB:', error.message);
        else console.log('✅ Signal saved to Supabase');
    } catch (e) {
        console.error('❌ DB Insert Error:', e.message);
    }

    // 4. FETCH TOKENS & SEND NOTIFICATIONS
    try {
        // Fetch all tokens from Supabase
        // Note: For 1000s of users, we would use pagination or batching. 
        // For now (MVP), fetching all is okay (~100kb for 1000 users).
        const { data: users, error: userError } = await supabase
            .from('user_settings')
            .select('token, settings');

        if (userError) throw userError;

        if (!users || users.length === 0) {
            console.log('No users registered. Skipping push.');
            return res.send({ status: 'Signal saved, no users to notify' });
        }

        let messages = [];

        // 5. LOOP & FILTER
        for (let user of users) {
            const pushToken = user.token;
            const userConfig = user.settings || {};
            const isUserPro = !!userConfig.isPro;

            if (!Expo.isExpoPushToken(pushToken)) continue;

            // --- SECURITY MASKING ---
            let finalTitle = notificationTitle;
            let finalBody = notificationBody;
            let finalData = { ...signalRecord.data }; // Clone

            if (!isUserPro && !s.startsWith('vol_') && !s.includes('regime')) {
                // console.log(`🔒 MASKING for: ${pushToken.slice(-4)}`);
                finalTitle = "🔒 Institutional Signal Detected";
                finalBody = "Premium signal. Tap to unlock.";
                finalData.message = "LOCKED";
                finalData.price = "LOCKED";
            }

            // --- FILTERING ---
            // Simplistic check for now. Ideally use 'getSignalKey' logic shared with frontend, 
            // but backend doesn't have that file. 
            // We'll trust the user sends 'keys' in settings that match our strategy names roughly
            // OR implemented a simple backend filter mapping if strictly needed.
            // For this step, we'll SKIP strict complex filtering to ensure delivery, 
            // or check generic 'signals' toggle if present.

            // Check if user has globally disabled notifications?
            if (userConfig.notificationsEnabled === false) continue;

            messages.push({
                to: pushToken,
                sound: 'default',
                title: finalTitle,
                body: finalBody,
                data: finalData,
                priority: 'high',
            });
        }

        // 6. SEND BATCH
        let chunks = expo.chunkPushNotifications(messages);
        for (let chunk of chunks) {
            await expo.sendPushNotificationsAsync(chunk);
        }
        console.log(`🚀 Sent ${messages.length} notifications`);

    } catch (e) {
        console.error('❌ Notification Error:', e.message);
    }

    res.send({ status: 'Processed' });
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Connected to Supabase: ${SUPABASE_URL}`);
});
