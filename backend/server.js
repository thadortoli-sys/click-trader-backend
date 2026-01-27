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

// --- HELPER: STRATEGY MAPPING (Sync with Frontend) ---
const getSignalKeyFromStrategy = (strategy) => {
    if (!strategy) return null;
    const normalized = strategy.replace(/\s+/g, '_').toLowerCase();

    // 1. Partial / Fuzzy Match
    if (normalized.includes('pro4x_buy')) return 'pro4x_Buy';
    if (normalized.includes('pro4x_sell')) return 'pro4x_Sell';

    // Get Ready
    if (normalized.includes('get_ready') || normalized.includes('getready')) {
        if (normalized.includes('horus')) return 'horus_GetReady';
        return 'pro4x_GetReady';
    }

    // Horus ADV
    if (normalized.includes('horus') && (normalized.includes('adv') || normalized.includes('advanced') || (normalized.includes('institutional') && normalized.includes('scalping')))) {
        if (normalized.includes('buy')) return 'horus_Adv_Buy';
        if (normalized.includes('sell')) return 'horus_Adv_Sell';
    }

    // Horus Standard
    if (normalized.includes('horus')) {
        if (normalized.includes('buy')) return 'horus_Buy';
        if (normalized.includes('sell')) return 'horus_Sell';
    }

    // Scalping (OVS/OVB)
    if (normalized.includes('ovs') || normalized.includes('oversold')) return 'scalp_OverSold';
    if (normalized.includes('ovb') || normalized.includes('overbought')) return 'scalp_OverBought';

    // Reintegration (Take Profit/Context)
    if (normalized.includes('re-integration') || normalized.includes('reintegration') || normalized.includes('pump') || normalized.includes('push')) {
        if (normalized.includes('bullish') || normalized.includes('pump')) return 'scalp_TakeProfitPump';
        if (normalized.includes('bearish') || normalized.includes('push')) return 'scalp_TakeProfitPush';
    }

    // Syncro
    if (normalized.includes('syncro')) {
        // H1
        if (normalized.includes('h1')) {
            if (normalized.includes('bullish') || normalized.includes('buy')) return 'h1_SyncroBullish';
            if (normalized.includes('bearish') || normalized.includes('sell')) return 'h1_SyncroBearish';
        }
        // Syncro Res/Sup (likely scalp)
        if (normalized.includes('resistance')) return 'scalp_SyncroResSell';
        if (normalized.includes('support')) return 'scalp_SyncroResBuy';
    }

    // Shadow
    if (normalized.includes('shadow')) {
        if (normalized.includes('buy')) return 'shadow_Buy';
        if (normalized.includes('sell')) return 'shadow_Sell';
    }

    // Volatility
    if (normalized.includes('vol_low')) return 'vol_Low';
    if (normalized.includes('vol_high')) return 'vol_High';
    if (normalized.includes('vol_extreme')) return 'vol_Extreme';
    if (normalized.includes('panic')) return 'vol_Panic';
    if (normalized.includes('regime')) return 'vol_Regime';

    // Info Support
    if (normalized.includes('info') || normalized.includes('support')) {
        if (normalized.includes('buy')) return 'info_SupportBuy';
        if (normalized.includes('sell')) return 'info_SupportSell';
    }

    return null;
};

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

// 1.5 UPDATE SETTINGS
app.post('/settings', async (req, res) => {
    const { token, signals, isPro } = req.body;

    if (!token) return res.status(400).send({ error: 'Token required' });

    try {
        console.log(`Updating settings for: ${token.slice(-4)}`);

        // Get existing to merge? For now just upsert the object
        // We construct the settings object. 
        // Note: Frontend sends 'signals' and 'isPro'. 
        // We should preserve existing 'notificationsEnabled' if it exists in DB, but fetching first adds latency.
        // For now, let's assume we can overwrite 'signals' key in the JSONB if we use jsonb_set, 
        // but Supabase/Postgres simple update overwrites the column.

        // Simpler approach: Upsert with merged data if possible, or just overwrite 'settings' column with what we have.
        // Since frontend is source of truth for settings, we can overwrite 'signals'.

        // Let's FIRST fetch existing to be safe
        const { data: existing } = await supabase.from('user_settings').select('settings').eq('token', token).single();

        const currentSettings = existing?.settings || {};
        const newSettings = {
            ...currentSettings,
            signals: signals || currentSettings.signals,
            isPro: isPro !== undefined ? isPro : currentSettings.isPro,
            // Ensure timestamp
            last_updated: new Date()
        };

        const { error } = await supabase
            .from('user_settings')
            .update({ settings: newSettings, updated_at: new Date() })
            .eq('token', token);

        if (error) throw error;

        console.log('✅ Settings updated');
        res.send({ status: 'Settings updated' });
    } catch (e) {
        console.error('❌ Settings Update Error:', e.message);
        res.status(500).send({ error: 'Failed to update settings' });
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

    // Log normalized values for debugging
    console.log(`[LOG] strategy: "${data.strategy}", ticker: "${data.ticker}", price: "${data.price}"`);

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
    let notificationTitle = data.title || strategy; // REMOVED "Signal: " prefix
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
            icon: data.icon || null,
            color: data.color || null,
            videoUrl: data.videoUrl || null
        }
    };

    try {
        const { error } = await supabase.from('signals').insert(signalRecord);
        if (error) {
            console.error('⚠️ Failed to save signal to DB:', error.message);
        } else {
            console.log('✅ Signal saved to Supabase');
        }
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


            // --- UNIVERSAL STANDARDIZATION & SANITIZATION (ALL USERS) ---
            // STRICT RULE: NO Direction (Buy/Sell/Bullish/Bearish), NO Price, NO "Signal:" prefix.

            // 1. Pro4x
            if (s.includes('pro4x')) {
                if (s.includes('forming') || s.includes('approaching') || s.includes('get ready') || s.includes('prepare')) {
                    finalTitle = "Pro4x Set up forming";
                } else {
                    finalTitle = "Pro4x Set up";
                }
                finalBody = "Technical Alignment";
            }
            // 2. Horus
            else if (s.includes('horus')) {
                finalTitle = "Horus Set up";
                finalBody = "Technical Alignment";
            }
            // 3. Shadow
            else if (s.includes('shadow')) {
                finalTitle = "Shadow Set up";
                finalBody = "Technical Alignment";
            }
            // 4. Reintegration / Context
            else if (s.includes('reintegration') || s.includes('re-integration')) {
                finalTitle = "Market Context";
                finalBody = "Reintegration Zone Active";
            }
            // 5. Volatility -> "Market Context" 
            else if (s.startsWith('vol_') || s.includes('volatility') || s.includes('panic') || s.includes('regime')) {
                finalTitle = "Market Context";
                if (s.includes('panic')) finalBody = "Panic Selling / Extreme Fear";
                else if (s.includes('extreme')) finalBody = "Extreme Volatility Warning";
                else if (s.includes('high')) finalBody = "High Volatility";
                else if (s.includes('low')) finalBody = "Low Volatility";
                else finalBody = "Volatility Regime Change";
            }
            // 6. Generic / Fallback
            else {
                finalTitle = "Market Alert";
                finalBody = "New Activity Detected";
            }

            // DOUBLE CHECK: Ensure no directional words leaked into Body (Paranoia check)
            const FORBIDDEN = ['buy', 'sell', 'bullish', 'bearish', 'long', 'short'];
            if (FORBIDDEN.some(word => finalBody.toLowerCase().includes(word))) {
                finalBody = "Market Update"; // Fallback if safe body leaked direction
            }

            // --- END SANITIZATION ---

            // --- FILTERING ---
            // 1. Global Disable
            if (userConfig.notificationsEnabled === false) continue;

            // 2. Strategy Specific Disable
            // Try to map strategy to a key
            const signalKey = getSignalKeyFromStrategy(strategy);

            // If we found a key, and the user has it explicitly disabled, SKIP.
            // If data is missing in user settings (undefined), default to TRUE (Alert Enabled)
            if (signalKey && userConfig.signals) {
                if (userConfig.signals[signalKey] === false) {
                    // console.log(`🔕 Skipped ${signalKey} for user (Disabled)`);
                    continue;
                }
            }

            // --- FINAL SAFETY CHECK ---
            if (finalTitle.includes('Signal:')) {
                finalTitle = finalTitle.replace('Signal:', '').trim();
            }

            console.log(`[PUSH PREVIEW] To: ${pushToken.slice(-4)} | Title: "${finalTitle}" | Body: "${finalBody}"`);

            messages.push({
                to: pushToken,
                sound: 'default',
                title: finalTitle, // CLEAN TITLE (No prefixes)
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
