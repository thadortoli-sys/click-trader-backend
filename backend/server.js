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

    // Ensure data is an object
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.log('⚠️ Payload is raw string (Non-JSON). Using regex extraction.');
            const text = data;
            data = {};
            // Regex helpers
            const extract = (key) => {
                // Look for Key: Value OR Key = Value, case insensitive
                const match = text.match(new RegExp(`${key}\\s*[:=]\\s*([^\\n,]+)`, 'i'));
                return match ? match[1].trim() : null;
            };
            data.strategy = extract('strategy');
            data.ticker = extract('ticker') || extract('symbol');
            data.price = extract('price');
            // Support both 'action' and 'signal' keys
            data.action = extract('action') || extract('signal');
            data.message = text;
        }
    }

    console.log('\n--- 🔔 INCOMING SIGNAL ---');
    console.log(JSON.stringify(data, null, 2));

    // 2. NORMALIZE DATA
    const timestamp = Date.now();

    // FUZZY KEY SEARCH HELPER
    const findValue = (obj, searchKeys) => {
        if (!obj || typeof obj !== 'object') return null;
        const keys = Object.keys(obj);
        for (let k of keys) {
            const keyLower = k.toLowerCase();
            for (let search of searchKeys) {
                if (keyLower.includes(search)) return obj[k];
            }
        }
        return null;
    };

    // Fallback logic: check typical aliases if primary keys are missing
    let strategy = data.strategy || data.Strategy || findValue(data, ['strat', 'alert', 'name', 'type']) || 'System Message';
    let ticker = data.ticker || data.symbol || data.Symbol || findValue(data, ['pair', 'sym', 'coin', 'asset']) || 'SYSTEM';
    let price = data.price || data.close || findValue(data, ['price', 'val', 'level']) || '0';
    const timeframe = data.timeframe || data.Timeframe || 'M1';
    let signal = data.action || data.signal || findValue(data, ['action', 'side', 'direction']) || 'alert';

    // Safety for objects
    if (typeof strategy === 'object') strategy = JSON.stringify(strategy);
    if (typeof ticker === 'object') ticker = JSON.stringify(ticker);


    // --- ENRICHMENT LOGIC (Icon/Color) ---
    // --- ENRICHMENT LOGIC (Icon/Color) ---
    // (Kept same as before)
    // --- ENRICHMENT LOGIC REMOVED ---
    // Backend acts as a dumb pipe. Frontend handles all styling and titles via SIGNAL_CONFIG.

    // Default values if missing from payload
    let notificationTitle = data.title || `Signal: ${strategy}`;
    let notificationBody = data.message || `Alert for ${ticker}`;

    // Validations are handled in the blocking block below.



    // 3. VALIDATION / BLOCKING GHOST SIGNALS
    // STRICT MODE: Block anything that looks like a ghost signal or system message
    if (ticker === 'Unknown' || ticker === 'SYSTEM' || price === '0' || strategy === 'Unknown' || strategy === 'System Message') {
        console.log('🚫 Blocking Ghost Signal:', { strategy, ticker, price });
        return res.status(200).send({ status: 'ignored_ghost' });
    }

    // 4. PERSIST SIGNAL TO DB
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

            const s = (strategy || '').toLowerCase();
            if (!isUserPro && !s.startsWith('vol_') && !s.includes('regime')) {
                // console.log(`🔒 MASKING for: ${pushToken.slice(-4)}`);
                finalTitle = "🔒 Institutional Setup Detected";
                finalBody = "Institutional Alert. Tap to unlock.";
                finalData.message = "LOCKED";
                finalData.price = "LOCKED";
            }

            // --- FILTERING ---
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
