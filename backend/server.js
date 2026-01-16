const express = require('express');
const { Expo } = require('expo-server-sdk');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const expo = new Expo();

app.use(cors());
app.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString(); // Save raw body for fallback
    }
}));

// MIDDLEWARE: Catch JSON Parse Errors and treat as Text
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.log('⚠️ JSON Parse Error detected. Treating body as plain text.');
        req.body = req.rawBody || ''; // Fallback to raw string
        next();
    } else {
        next(err);
    }
});

app.use(bodyParser.text({ type: '*/*' })); // Catch-all for TradingView sometimes sending text/plain
app.use('/public', express.static(path.join(__dirname, 'public')));

// STORE TOKENS (Persisted in JSON file)
// STORE TOKENS & SIGNALS
const TOKENS_FILE = path.join(__dirname, 'tokens.json');
const SIGNALS_FILE = path.join(__dirname, 'signals.json');
const SETTINGS_FILE = path.join(__dirname, 'user_settings.json');
let savedPushTokens = [];
let savedSignals = [];
let userSettings = {}; // { token: { signals: { ... } } }

// Load data on startup
if (fs.existsSync(TOKENS_FILE)) {
    try {
        const data = fs.readFileSync(TOKENS_FILE, 'utf8');
        savedPushTokens = JSON.parse(data);
        console.log(`Loaded ${savedPushTokens.length} tokens.`);
    } catch (e) {
        console.error("Error loading tokens:", e);
    }
}
if (fs.existsSync(SIGNALS_FILE)) {
    try {
        const data = fs.readFileSync(SIGNALS_FILE, 'utf8');
        savedSignals = JSON.parse(data);
        console.log(`Loaded ${savedSignals.length} signals.`);
    } catch (e) {
        console.error("Error loading signals:", e);
    }
}
if (fs.existsSync(SETTINGS_FILE)) {
    try {
        const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
        userSettings = JSON.parse(data);
        console.log(`Loaded settings for ${Object.keys(userSettings).length} tokens.`);
    } catch (e) {
        console.error("Error loading settings:", e);
    }
}

// Helpers
const saveTokens = () => {
    try { fs.writeFileSync(TOKENS_FILE, JSON.stringify(savedPushTokens, null, 2)); } catch (e) { console.error("Error saving tokens:", e); }
};
const saveSignals = () => {
    try { fs.writeFileSync(SIGNALS_FILE, JSON.stringify(savedSignals, null, 2)); } catch (e) { console.error("Error saving signals:", e); }
};
const saveSettings = () => {
    try { fs.writeFileSync(SETTINGS_FILE, JSON.stringify(userSettings, null, 2)); } catch (e) { console.error("Error saving settings:", e); }
};

// --- SIGNAL KEY MAPPING HELPER (Sync with App) ---
const getSignalKeyFromStrategy = (strategy) => {
    if (!strategy) return null;
    const normalized = strategy.replace(/\s+/g, '_').toLowerCase();

    // PRO4XX.2 / PRO4X.2
    if (normalized.includes('pro4xx') || normalized.includes('pro4x.2') || normalized.includes('pro4x_2')) {
        // 1. GET READY
        if (normalized.includes('gr') || normalized.includes('get_ready') || normalized.includes('getready')) {
            if (normalized.includes('buy')) return 'pro4xx_GetReady_Buy';
            if (normalized.includes('sell')) return 'pro4xx_GetReady_Sell';
            return 'pro4xx_GetReady'; // Default fallback
        }
        // 2. CONFIRMED ENTRIES
        if (normalized.includes('buy') && !normalized.includes('get')) return 'pro4xx_Buy';
        if (normalized.includes('sell') && !normalized.includes('get')) return 'pro4xx_Sell';
    }

    // PRO4X (Legacy)
    if (normalized.includes('pro4x')) {
        if (normalized.includes('get_ready') || normalized.includes('getready')) return 'pro4x_GetReady';
        if (normalized.includes('buy')) return 'pro4x_Buy';
        if (normalized.includes('sell')) return 'pro4x_Sell';
    }

    // HORUS ADV (INSTITUTIONAL SCALPING OLD KEY)
    if (normalized.includes('institutional') && normalized.includes('scalping')) {
        if (normalized.includes('buy')) return 'horus_Adv_Buy';
        if (normalized.includes('sell')) return 'horus_Adv_Sell';
    }
    // HORUS ADV (EXPLICIT CHECK - NEW)
    if (normalized.includes('horus') && (normalized.includes('adv') || normalized.includes('advanced'))) {
        if (normalized.includes('buy')) return 'horus_Adv_Buy';
        if (normalized.includes('sell')) return 'horus_Adv_Sell';
    }

    // Handle raw message parsing if strategy name isn't passed but message body is
    if (normalized.includes('level=') && normalized.includes('entry')) {
        if (normalized.includes('buy')) return 'horus_Adv_Buy';
        if (normalized.includes('sell')) return 'horus_Adv_Sell';
    }

    if (normalized.includes('horus_buy')) return 'horus_Buy';
    // Fallback for simple "Horus Buy" with space -> horus_buy
    if (normalized.includes('horus') && normalized.includes('buy')) return 'horus_Buy';

    if (normalized.includes('horus_sell')) return 'horus_Sell';
    if (normalized.includes('horus') && normalized.includes('sell')) return 'horus_Sell';

    if (normalized.includes('shadow') || normalized.includes('shadoow')) {
        if (normalized.includes('buy')) return 'shadow_Buy';
        if (normalized.includes('sell')) return 'shadow_Sell';
        return 'shadow_Mode'; // Return specific key instead of null for settings check
    }
    if (normalized.includes('oversold')) return 'scalp_OverSold';
    if (normalized.includes('overbought')) return 'scalp_OverBought';
    if (normalized.includes('pump')) return 'scalp_TakeProfitPump';
    if (normalized.includes('push')) return 'scalp_TakeProfitPush';
    if (normalized.includes('syncro')) {
        if (normalized.includes('resistance') || normalized.includes('sell_res')) return 'scalp_SyncroResSell';
        if (normalized.includes('support') || normalized.includes('buy_res')) return 'scalp_SyncroResBuy';

        // M1 Trends
        if (normalized.includes('m1')) {
            if (normalized.includes('bull') || normalized.includes('buy')) return 'm1_SyncroBullish';
            if (normalized.includes('bear') || normalized.includes('sell')) return 'm1_SyncroBearish';
        }
    }
    if (normalized.includes('h1') && normalized.includes('bull')) return 'h1_SyncroBullish';
    if (normalized.includes('h1') && normalized.includes('bear')) return 'h1_SyncroBearish';

    // Generic Fallbacks last
    if (normalized.includes('buy')) return 'pro4x_Buy'; // Dangerous default but safer than null for filtering? No, better return null if unknown.
    if (normalized.includes('sell')) return 'pro4x_Sell';

    return null;
};

// ROOT
app.get('/', (req, res) => {
    res.send('Click&Trader Backend is Running! 🚀');
});

// GET SIGNALS (Sync for App)
app.get('/signals', (req, res) => {
    console.log(`[API] GET /signals request received`);
    res.json(savedSignals);
});

// DEBUG ENDPOINT (For testing production connectivity)
app.get('/debug', (req, res) => {
    res.json({
        status: 'Online',
        tokensCount: savedPushTokens.length,
        signalsCount: savedSignals.length,
        lastSignalAt: savedSignals.length > 0 ? new Date(savedSignals[0].timestamp).toISOString() : 'Never',
        environment: process.env.NODE_ENV || 'production'
    });
});

// 1. REGISTER DEVICE (App sends token here)
app.post('/register', (req, res) => {
    const { token } = req.body;

    if (!Expo.isExpoPushToken(token)) {
        console.error(`Push token ${token} is not a valid Expo push token`);
        return res.status(400).send({ error: 'Invalid Token' });
    }

    if (!savedPushTokens.includes(token)) {
        savedPushTokens.push(token);
        saveTokens(); // Save to file
        console.log(`Token Saved: ${token}`);
    } else {
        console.log(`Token Refreshed: ${token}`);
    }

    res.send({ status: 'Token received' });
});

// 1.5 REGISTER SETTINGS
app.post('/settings', (req, res) => {
    const { token, signals } = req.body;
    if (!token) return res.status(400).send({ error: 'Missing token' });

    userSettings[token] = { signals };
    saveSettings();
    console.log(`[Settings] Updated for token: ${token.substring(0, 10)}... (Signals: ${Object.values(signals).filter(Boolean).length})`);
    res.send({ status: 'Settings saved' });
});

// 2. WEBHOOK (TradingView connects here)
app.post('/webhook', async (req, res) => {
    // Debug Incoming Data
    console.log('--- WEBHOOK HIT ---');
    console.log('Time:', new Date().toISOString());
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Headers:', JSON.stringify(req.headers, null, 2));

    let data = req.body;

    // Auto-parse if it came in as text
    if (typeof data === 'string') {
        // 1. Try JSON
        try {
            const parsed = JSON.parse(data);
            data = parsed;
            console.log('Parsed from String (JSON):', data);
        } catch (e) {
            // 2. Try Custom Pipe Format: ENTRY|SELL|LEVEL=...
            if (data.includes('ENTRY') && data.includes('|')) {
                console.log('Detected Pipe-Delimited Custom Format');
                const parts = data.split('|');

                let direction = parts.find(p => p === 'BUY' || p === 'SELL') || 'INFO';
                let pricePart = parts.find(p => p.startsWith('LEVEL='));
                let price = pricePart ? pricePart.split('=')[1] : '0';

                // Construct Object
                data = {
                    ticker: 'MNQ1!', // Default since user format doesn't have it
                    signal: direction,
                    strategy: direction === 'BUY' ? 'horus_Adv_Buy' : 'horus_Adv_Sell', // Map directly to Horus ADV
                    price: price,
                    message: data // Keep original raw message
                };
                console.log('Parsed from String (Pipe):', data);
            } else if (typeof data === 'string' && data.toUpperCase().includes('GET READY')) {
                console.log('Detected Text-based Get Ready Format');
                let direction = 'ALERT';
                if (data.toUpperCase().includes('BUY')) direction = 'BUY';
                if (data.toUpperCase().includes('SELL')) direction = 'SELL';

                data = {
                    ticker: 'MNQ1!',
                    signal: direction,
                    strategy: 'pro4x_GetReady',
                    message: data
                };
                console.log('Parsed from String (Text GR):', data);
            } else {
                console.error('Failed to parse webhook body:', req.body);
            }
        }
    }

    // Strategy Formatting Map
    let { ticker, signal, price, timeframe, strategy, videoUrl } = data || {};
    console.log(`> TICKER: ${ticker}`);
    console.log(`> SIGNAL: ${signal}`);
    console.log(`> STRATEGY: ${strategy}`);

    // --- FILTER: IGNORE INVALID/EMPTY REQUESTS ---
    // Prevents "undefined SIGNAL" spam when TradingView sends empty checks or malformed data
    if (!ticker && !strategy && !signal) {
        console.log('⚠️ SKIPPING: Payload missing critical fields (ticker/strategy/signal).');

        // SAVE INVALID PAYLOAD FOR DEBUGGING
        const errorItem = {
            id: Date.now().toString(),
            pair: 'DEBUG',
            type: 'ERROR',
            entry: '---',
            tp: 'OPEN', sl: 'OPEN',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'ERROR',
            timestamp: Date.now(),
            strategyLabel: '⚠️ Invalid Payload',
            title: 'Invalid Payload Received',
            body: `Raw Body: ${typeof req.body === 'object' ? JSON.stringify(req.body) : req.body}`,
            data: { message: 'Invalid JSON or missing fields', error: true },
            read: false
        };
        savedSignals.unshift(errorItem);
        saveSignals();

        return res.status(200).send({ status: 'Logged invalid payload' });
    }

    const STRATEGIES = {
        // PRO4XX.2
        'pro4xx_GetReady_Buy': {
            title: 'Pro4xx | Get Ready (Buy)',
            emoji: '⚠️',
            icon: 'trending-up-outline',
            color: '#FFC107', // Primary Yellow
            message: 'Pro4xx Algo: Watch for potential Buy entry. Market structure aligning.'
        },
        'pro4xx_GetReady_Sell': {
            title: 'Pro4xx | Get Ready (Sell)',
            emoji: '⚠️',
            icon: 'trending-down-outline',
            color: '#FFC107', // Primary Yellow
            message: 'Pro4xx Algo: Watch for potential Sell entry. Market structure aligning.'
        },
        'pro4xx_Buy': {
            title: 'Pro4x.2 | Buy Confirmed',
            emoji: '✅',
            icon: 'trending-up-outline',
            color: '#4ADE80',
            message: 'Pro4x.2 System: Buy Confirmed.\nTarget Scope: ~150 points Trend.\n*Note: Actual range depends on market volatility.*'
        },
        'pro4xx_Sell': {
            title: 'Pro4x.2 | Sell Confirmed',
            emoji: '✅',
            icon: 'trending-down-outline',
            color: '#FF5252',
            message: 'Pro4x.2 System: Sell Confirmed.\nTarget Scope: ~150 points Trend.\n*Note: Actual range depends on market volatility.*'
        },

        // PRO4X
        'pro4x_GetReady': {
            title: 'Pro4x | Get Ready',
            emoji: '⚠️',
            icon: 'pulse-outline', // Amber
            color: '#FFC107',
            message: 'Pro4x Algo: Watch for potential entry. Market structure aligning.'
        },
        'pro4x_Buy': {
            title: 'Pro4x | Buy Confirmed',
            emoji: '✅',
            icon: 'trending-up-outline', // Green
            color: '#4ADE80',
            message: 'Pro4x Algo: Buy signal confirmed. Institutional volume detected. Execute Long.'
        },

        // HORUS
        'horus_GetReady': {
            title: 'Horus | Ready',
            emoji: '👁️',
            icon: 'eye-outline',
            color: '#FFC107',
            message: 'Horus Eye: Analyzing price action. Prepare for signal.'
        },
        'horus_Buy': {
            title: 'Horus | Buy',
            emoji: '🦅',
            icon: 'trending-up-outline',
            color: '#4ADE80',
            message: 'Horus God Mode: Buy signal. Trend Momentum aligning with Volume.'
        },
        'horus_Sell': {
            title: 'Horus | Sell',
            emoji: '🦅',
            icon: 'trending-down-outline',
            color: '#FF5252',
            message: 'Horus God Mode: Sell signal. Trend Momentum aligning with Volume.'
        },
        'horus_Adv_Buy': {
            title: 'Horus ADV | Buy',
            emoji: '',
            icon: 'flash',
            color: '#00FF9D',
            message: 'Horus ADV: Institutional Scalping Buy. Check Power & RSI.'
        },
        'horus_Adv_Sell': {
            title: 'Horus ADV | Sell',
            emoji: '',
            icon: 'flash',
            color: '#FF5252', // or Bright Red
            message: 'Horus ADV: Institutional Scalping Sell. Check Power & RSI.'
        },

        // SCALPING
        'scalp_OverSold': {
            title: 'Horus OVS',
            emoji: '',
            icon: 'arrow-up-circle-outline',
            color: '#00FF9D',
            message: 'Scalp Buy | Oversold Condition. Target: 10-15 pts. Caution: Watch Magnet Levels 12/23/38/64/91 for rejection.'
        },
        'scalp_OverBought': {
            title: 'Horus OVB',
            emoji: '',
            icon: 'arrow-down-circle-outline',
            color: '#FF5252',
            message: 'Scalp Sell | Overbought Condition. Target: 10-15 pts. Caution: Watch Magnet Levels 12/23/38/64/91 for rejection.'
        },
        'scalp_TakeProfitPump': {
            title: 'Scalp | TP Pump',
            emoji: '💰',
            icon: 'arrow-up-circle-outline',
            color: '#FFD700',
            message: 'Take Profit Pump: Aggressive buying exhausted. Secure profits now.'
        },
        'TP PUMP': {
            title: 'Scalp | TP Pump',
            emoji: '💰',
            icon: 'arrow-up-circle-outline',
            color: '#FFD700',
            message: 'Take Profit Pump: Aggressive buying exhausted. Recommend securing profits on Short positions.'
        },
        'scalp_TakeProfitPush': {
            title: 'Scalp | TP Push',
            emoji: '💰',
            icon: 'arrow-down-circle-outline',
            color: '#FFD700',
            message: 'Take Profit Push: Aggressive selling exhausted. Secure profits now.'
        },
        'TP PUSH': {
            title: 'Scalp | TP Push',
            emoji: '💰',
            icon: 'arrow-down-circle-outline',
            color: '#FFD700',
            message: 'Take Profit Push: Aggressive selling exhausted. Recommend securing profits on Long positions.'
        },
        'scalp_SyncroResBuy': {
            title: 'Syncro | Support Buy',
            emoji: '🛡️',
            icon: 'shield-half-outline',
            color: '#4ADE80',
            message: 'Syncro: Major Support Hit. High probability bounce. Look for Long.'
        },
        'scalp_SyncroResSell': {
            title: 'Syncro | Resistance Sell',
            emoji: '🛡️',
            icon: 'shield-half-outline',
            color: '#FF5252',
            message: 'Syncro: Major Resistance Hit. High probability rejection. Look for Short.'
        },

        // SHADOW MODE
        // SHADOW MODE
        'shadow_Mode': {
            title: 'Shadow Mode',
            emoji: '🌑',
            icon: 'moon-outline', // Changed to outline per user request
            color: '#9CA3AF', // Grey
            message: 'Shadow Mode: High probability reversal zone detected. Watch for confirmation.'
        },
        'shadow_Buy': {
            title: 'Shadow | BUY',
            emoji: '🌑',
            icon: 'moon-outline',
            color: '#9CA3AF',
            message: 'Shadow BUY: Confluence CASH / FUTURES detected. Institutional liquidty sweep.'
        },
        'shadow_Sell': {
            title: 'Shadow | SELL',
            emoji: '🌑',
            icon: 'moon-outline',
            color: '#9CA3AF',
            message: 'Shadow SELL: Confluence CASH / FUTURES detected. Institutional liquidty sweep.'
        },

        // H1 TREND
        'h1_SyncroBullish': {
            title: 'H1 Trend | Bullish',
            emoji: '📈',
            icon: 'stats-chart-outline',
            color: '#4ADE80',
            message: 'H1 Macro: Trend shifted to BULLISH. H1 Syncro confirms upward bias.'
        },
        'h1_SyncroBearish': {
            title: 'H1 Trend | Bearish',
            emoji: '📉',
            icon: 'stats-chart-outline',
            color: '#FF5252',
            message: 'H1 Macro: Trend shifted to BEARISH. H1 Syncro confirms downward bias.'
        },
        'm1_SyncroBullish': {
            title: 'M1 Syncro | Bullish',
            emoji: '🌊',
            icon: 'cellular-outline',
            color: '#4ADE80',
            message: 'M1 Trend Sync: Short-term momentum is Bullish. Institutional buyers are active.'
        },
        'm1_SyncroBearish': {
            title: 'M1 Syncro | Bearish',
            emoji: '🌊',
            icon: 'cellular-outline',
            color: '#FF5252',
            message: 'M1 Trend Sync: Short-term momentum is Bearish. Institutional sellers are active.'
        },
        // GENERIC FALLBACKS
        'SHADOW': {
            title: 'Shadow Mode | Signal',
            emoji: '🌑',
            icon: 'moon',
            color: '#A855F7',
            message: 'Shadow Mode: Liquidity event detected.'
        },
        'SCALP': {
            title: 'Scalp Signal',
            emoji: '⚡',
            icon: 'flash-outline',
            color: '#00FF9D',
            message: 'Scalp Opportunity: Check chart for setup.'
        },
        'HORUS': {
            title: 'Horus Signal',
            emoji: '👁️',
            icon: 'eye-outline',
            color: '#FFC107',
            message: 'Horus: Market surveillance active.'
        },
        'PRO4X': {
            title: 'Pro4x Signal',
            emoji: '📊',
            icon: 'analytics-outline',
            color: '#4ADE80',
            message: 'Pro4x: Algorithmic setup detected.'
        }
    };

    let notificationTitle = `${ticker} SIGNAL`;
    let notificationBody = `Price: ${price}`;
    let icon = undefined;
    let color = undefined;

    // --- FUZZY MATCHING & DIRECTION DETECTION ---
    const s = (strategy || '').toUpperCase();
    const sig = (signal || '').toUpperCase();
    const fullText = (s + ' ' + sig);

    // 1. EXTRACT DIRECTION (BUY/SELL/LONG/SHORT/BULL/BEAR)
    let detectedDirection = null;
    if (fullText.includes('BUY') || fullText.includes('LONG') || fullText.includes('BULL')) detectedDirection = 'BUY';
    else if (fullText.includes('SELL') || fullText.includes('SHORT') || fullText.includes('BEAR')) detectedDirection = 'SELL';

    if (detectedDirection) {
        signal = detectedDirection; // Normalize signal field
    }

    // 2. MAP TO STRATEGY KEY
    const mapped = getSignalKeyFromStrategy(strategy);
    if (mapped) strategy = mapped;

    if (strategy && !STRATEGIES[strategy]) {
        // HORUS ADV (Prioritize over generic HORUS)
        if ((s.includes('HORUS') && s.includes('ADV')) || (s.includes('INSTITUTIONAL') && s.includes('SCALPING'))) {
            if (detectedDirection === 'BUY') strategy = 'horus_Adv_Buy';
            else if (detectedDirection === 'SELL') strategy = 'horus_Adv_Sell';
        }
        else if (s.includes('SHADOW') || s.includes('SHADOOW')) {
            if (detectedDirection === 'BUY') strategy = 'shadow_Buy';
            else if (detectedDirection === 'SELL') strategy = 'shadow_Sell';
            else strategy = 'shadow_Mode';
        }
        else if (s.includes('HORUS')) {
            if (s.includes('OVERSOLD') || sig.includes('OVERSOLD') || s.includes('OVS') || sig.includes('OVS')) strategy = 'scalp_OverSold';
            else if (s.includes('OVERBOUGHT') || sig.includes('OVERBOUGHT') || s.includes('OVB') || sig.includes('OVB')) strategy = 'scalp_OverBought';
            else if (s.includes('GET READY') || s.includes('READY')) strategy = 'horus_GetReady';
            else if (detectedDirection === 'BUY') strategy = 'horus_Buy';
            else if (detectedDirection === 'SELL') strategy = 'horus_Sell';
        }
        else if (s.includes('RESISTANCE') || (s.includes('SYNCRO') && detectedDirection === 'SELL' && s.includes('RESISTANCE'))) strategy = 'scalp_SyncroResSell';
        else if (s.includes('SUPPORT') || (s.includes('SYNCRO') && detectedDirection === 'BUY' && s.includes('SUPPORT'))) strategy = 'scalp_SyncroResBuy';
        else if (s.includes('SYNCRO') && s.includes('M1')) {
            if (detectedDirection === 'BUY') strategy = 'm1_SyncroBullish';
            else if (detectedDirection === 'SELL') strategy = 'm1_SyncroBearish';
        }
        else if (s.includes('PUMP')) strategy = 'TP PUMP';
        else if (s.includes('PUSH')) strategy = 'TP PUSH';
        else if (s.includes('BULL TREND SYNC') || (s.includes('H1') && detectedDirection === 'BUY')) strategy = 'h1_SyncroBullish';
        else if (s.includes('BEAR TREND SYNC') || (s.includes('H1') && detectedDirection === 'SELL')) strategy = 'h1_SyncroBearish';

        // Final Fallbacks
        else if (detectedDirection === 'BUY') strategy = 'pro4x_Buy';
        else if (detectedDirection === 'SELL') strategy = 'pro4x_Sell';
        else if (s.includes('GET READY') || s.includes('READY')) strategy = 'pro4x_GetReady';
    }

    if (strategy && STRATEGIES[strategy]) {
        const strat = STRATEGIES[strategy];
        notificationTitle = `${strat.emoji} ${strat.title}`;
        icon = strat.icon;
        color = strat.color;

        // --- PREMIUM CONTENT FORMATTING ---
        // --- PREMIUM CONTENT FORMATTING ---
        // const GLOBAL_FOOTER = ... (Using inline footer now)

        // 1. GET READY (GR)
        if (strategy.includes('GetReady') || strategy === 'pro4x_GetReady' || strategy === 'horus_GetReady') {
            notificationBody = `Early institutional positioning detected.\nPrice is approaching a potential liquidity zone.\n\n` +
                `How to use:\n` +
                `• Do not enter immediately\n` +
                `• Observe price behavior near key magnet levels (12 / 23 / 38 / 64 / 91)\n` +
                `• GR can be used as an early entry only if rejection is clean and structure is clear\n\n` +
                `Important:\n` +
                `• Strong trends may require multiple GRs before reversal\n` +
                `• A final stop-hunt may occur before the real move\n\n` +
                `Discipline:\n` +
                `Prepare. Observe. Wait for confirmation.`;

            // 2. SCALP OVERSOLD
        } else if (strategy === 'scalp_OverSold') {
            notificationBody = `Short-term exhaustion detected.\n` +
                `A quick technical rebound is possible.\n\n` +
                `Execution Rules:\n` +
                `• Best near magnet levels: 12 / 23 / 38 / 64 / 91\n` +
                `• Target: 10–15 points max\n` +
                `• This is a scalp, not a hold\n\n` +
                `Risk Reminder:\n` +
                `Avoid overexposure. One clean trade is enough.`;

            // 3. SCALP OVERBOUGHT
        } else if (strategy === 'scalp_OverBought') {
            notificationBody = `Short-term exhaustion detected.\n` +
                `A quick technical rebound is possible.\n\n` +
                `Execution Rules:\n` +
                `• Best near magnet levels: 12 / 23 / 38 / 64 / 91\n` +
                `• Target: 10–15 points max\n` +
                `• This is a scalp, not a hold\n\n` +
                `Risk Reminder:\n` +
                `Avoid overexposure. One clean trade is enough.`;

            // 4. TP PUMP/PUSH (Take Profit)
            // 4. PRO4XX.2 (Explicit handling to preserve title)
        } else if (strategy === 'pro4xx_Buy') {
            notificationBody = `Bullish confirmation detected.\n` +
                `Pro4x.2 System confirms institutional trend alignment.\n\n` +
                `Target Scope:\n` +
                `• ~150 points Trend (Market dependent)\n` +
                `• Note: Actual range depends on volatility\n\n` +
                `Execution Rules:\n` +
                `• Prefer entries near magnet levels (12/23/38/64/91)\n` +
                `• Stronger if ES confirms\n` +
                `• If price accelerates vertically → wait for pullback\n` +
                `• A final stop-hunt may still occur\n\n` +
                `Discipline:\n` +
                `• Do not chase price\n` +
                `• Trade small\n` +
                `• One clean trade is enough`;

        } else if (strategy === 'pro4xx_Sell') {
            notificationBody = `Bearish confirmation detected.\n` +
                `Pro4x.2 System confirms institutional trend alignment.\n\n` +
                `Target Scope:\n` +
                `• ~150 points Trend (Market dependent)\n` +
                `• Note: Actual range depends on volatility\n\n` +
                `Execution Rules:\n` +
                `• Prefer entries near magnet levels (12/23/38/64/91)\n` +
                `• Stronger if ES confirms\n` +
                `• If price accelerates vertically → wait for pullback\n` +
                `• A final stop-hunt may still occur\n\n` +
                `Discipline:\n` +
                `• Do not chase price\n` +
                `• Trade small\n` +
                `• One clean trade is enough`;

        } else if (strategy === 'TP PUMP' || strategy === 'scalp_TakeProfitPump' || strategy.includes('PUMP')) {
            notificationTitle = `${ticker} — TP PUMP (BUY)`;
            signal = 'BUY'; // Enforce UP direction
            notificationBody = `Price surging upwards.\n` +
                `Profit Opportunity on Longs or Cover Shorts.\n\n` +
                `Action:\n` +
                `• Protect gains near magnet levels\n` +
                `• Watch for potential reversal or continuation\n\n` +
                `Discipline:\n` +
                `Don't give back open profits.`;

        } else if (strategy === 'TP PUSH' || strategy === 'scalp_TakeProfitPush' || strategy.includes('PUSH')) {
            notificationTitle = `${ticker} — TP PUSH (SELL)`;
            signal = 'SELL'; // Enforce DOWN direction
            notificationBody = `Price pushing downwards.\n` +
                `Profit Opportunity on Shorts or Sell Longs.\n\n` +
                `Action:\n` +
                `• Protect gains near support levels\n` +
                `• Watch for reaction at magnets\n\n` +
                `Discipline:\n` +
                `Realized profit is the only real profit.`;

            // 5. SHADOW MODE
        } else if (strategy && (strategy.startsWith('shadow_') || strategy === 'SHADOW' || strategy.toLowerCase().includes('shadow'))) {
            // Append Direction if available
            let direction = '';
            if (strategy.toLowerCase().includes('buy') || (signal && signal.toString().toUpperCase().includes('BUY'))) direction = 'Buy';
            else if (strategy.toLowerCase().includes('sell') || (signal && signal.toString().toUpperCase().includes('SELL'))) direction = 'Sell';

            notificationTitle = `${ticker} — Shadow Mode ${direction}`;
            notificationBody = `Institutional liquidity sweep detected.\n` +
                `This is a scalping opportunity, not a trend entry.\n\n` +
                `Guidelines:\n` +
                `• Wait for reaction near key magnet levels (12 / 23 / 38 / 64 / 91)\n` +
                `• A final stop-hunt may occur before reversal\n` +
                `• Do not chase price\n\n` +
                `Discipline:\n` +
                `Trade small. Precision over frequency.`;

            // 5.5 HORUS ADV (INSTITUTIONAL SCALPING) - NEW SPECIAL MESSAGE
        } else if (strategy === 'horus_Adv_Buy' || strategy === 'horus_Adv_Sell' || strategy.includes('horus_Adv')) {
            notificationTitle = strategy.includes('Buy') ? `Horus ADV | Buy` : `Horus ADV | Sell`;
            notificationBody = `Performance Insight:\n` +
                `System stability typically improves after 11:00 AM NY.\n\n` +
                `Execution Strategy:\n` +
                `• Standard: High-frequency scalping (quick execution).\n` +
                `• Post-11 AM: Extended hold times may be viable during stable conditions.\n\n` +
                `Disclaimer:\n` +
                `Market conditions dictate results. Manage risk strictly.`;

            // 5. H1 SYNC TREND
        } else if (strategy === 'h1_SyncroBullish' || (strategy.includes('H1') && strategy.includes('Buy')) || strategy.includes('BULL TREND SYNC')) {
            notificationTitle = `H1 Sync — Trend BUY`;
            notificationBody = `Higher-timeframe (H1) trend turning bullish.\nInstitutional flow favors the upside.\n\n` +
                `How to use:\n` +
                `• Favors long setups only\n` +
                `• Look for GR or BUY signals in the same direction\n` +
                `• Stronger with pivot & magnet confluence\n\n` +
                `Timing note:\n` +
                `If triggered near the open, wait 15 minutes before acting\n\n` +
                `Discipline:\n` +
                `Trade with the trend. Not against it.`;
        } else if (strategy === 'h1_SyncroBearish' || (strategy.includes('H1') && strategy.includes('Sell')) || strategy.includes('BEAR TREND SYNC')) {
            notificationTitle = `H1 Sync — Trend SELL`;
            notificationBody = `Higher-timeframe (H1) trend turning bearish.\nDownside pressure increasing.\n\n` +
                `How to use:\n` +
                `• Favors short setups only\n` +
                `• Combine with GR or SELL signals\n` +
                `• Best when price reacts at key levels\n\n` +
                `Timing note:\n` +
                `Allow the market to settle after the open\n\n` +
                `Discipline:\n` +
                `Let the higher timeframe lead.`;

            // 6. BUY ENTRY (Generic Fallback)
        } else if (strategy === 'pro4x_Buy' || strategy === 'horus_Buy' || (strategy.includes('Buy') && !strategy.includes('GetReady') && !strategy.includes('horus_Adv'))) {
            notificationTitle = `${ticker} — Buy Signal`;
            notificationBody = `Bullish confirmation detected\n\n` +
                `Liquidity reaction aligns with upside bias.\n\n` +
                `How to use this signal\n\n` +
                `This is a confirmation signal, not a chase.\n` +
                `It validates bullish intent after institutional activity.\n\n` +
                `Execution\n` +
                `Prefer entries near magnet levels\n` +
                `12 / 23 / 38 / 64 / 91\n` +
                `Stronger if ES confirms\n` +
                `Stronger with 4H / Daily pivot confluence\n` +
                `If price accelerates vertically → wait for pullback\n` +
                `A final stop-hunt may still occur\n\n` +
                `Discipline rules\n` +
                `Do not chase price\n` +
                `Trade small\n` +
                `One clean trade is enough\n\n` +
                `Reminder\n\n` +
                `This is a signal, not an obligation.`;

            // 7. SELL ENTRY (Generic Fallback)
        } else if (strategy === 'pro4x_Sell' || strategy === 'horus_Sell' || (strategy.includes('Sell') && !strategy.includes('GetReady') && !strategy.includes('horus_Adv'))) {
            notificationTitle = `${ticker} — Sell Signal`;
            notificationBody = `Bearish confirmation detected\n\n` +
                `Liquidity reaction aligns with downside bias.\n\n` +
                `How to use this signal\n\n` +
                `This is a confirmation signal, not a chase.\n` +
                `It validates bearish intent after institutional activity.\n\n` +
                `Execution\n` +
                `Prefer entries near magnet levels\n` +
                `12 / 23 / 38 / 64 / 91\n` +
                `Stronger if ES confirms\n` +
                `Stronger with 4H / Daily pivot confluence\n` +
                `If price accelerates vertically → wait for pullback\n` +
                `A final stop-hunt may still occur\n\n` +
                `Discipline rules\n` +
                `Do not chase price\n` +
                `Trade small\n` +
                `One clean trade is enough\n\n` +
                `Reminder\n\n` +
                `This is a signal, not an obligation.`;

        } else {
            notificationBody = strat.message || `${ticker} | ${timeframe || 'M1'} | $${price}`;
        }

        // APPEND GLOBAL FOOTER TO ALL ALERTS
        notificationBody += `\n\nLegal\n\n` +
            `Market information only.\n` +
            `Execution and risk management remain your responsibility.`;

    } else if (signal) {
        // Fallback for generic signals - CLEAN FORMAT
        const prettySignal = signal.toString().charAt(0).toUpperCase() + signal.toString().slice(1).toLowerCase(); // Buy / Sell
        notificationTitle = `${ticker} — ${prettySignal}`;
        notificationBody = `Market Activity Detected\n\n` +
            `Price: ${price}\nTimeframe: ${timeframe || '1m'}\n\n` +
            `Legal\n\n` +
            `Market information only.\n` +
            `Execution and risk management remain your responsibility.`;
    }

    // Construct Message
    const signalId = require('crypto').randomUUID(); // Valid in Node 19+, but for compat use simple unique
    const uniqueId = Date.now().toString() + Math.random().toString().slice(2, 6);

    // Save to Backend History
    const historyItem = {
        id: uniqueId,
        pair: ticker || 'SYSTEM',
        type: signal || 'INFO',
        entry: price || '---',
        tp: 'OPEN', sl: 'OPEN',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'PENDING',
        timestamp: Date.now(),
        strategyLabel: notificationTitle,
        title: notificationTitle,
        body: notificationBody,
        data: { strategy, ticker, price, timeframe, signal, message: notificationBody, title: notificationTitle, icon, color, videoUrl },
        read: false
    };

    savedSignals.unshift(historyItem);
    if (savedSignals.length > 20) savedSignals = savedSignals.slice(0, 20);
    saveSignals();

    const messages = [];
    const signalKey = getSignalKeyFromStrategy(strategy);
    console.log(`> FINAL MAPPING - Strategy: ${strategy}, SignalKey: ${signalKey}, Title: ${notificationTitle}`);
    console.log(`> SIGNAL KEY DETECTED for filter: ${signalKey || 'Unknown'}`);

    console.log(`> PREPARING TO SEND TO ${savedPushTokens.length} DEVICES`);
    for (let pushToken of savedPushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        // --- FILTERING LOGIC ---
        // --- FILTERING LOGIC ---
        if (signalKey) {
            const settings = userSettings[pushToken];
            if (settings && settings.signals) {
                const isEnabled = settings.signals[signalKey];
                console.log(`[Filter] Token: ...${pushToken.slice(-6)} | Key: ${signalKey} | Enabled: ${isEnabled}`);

                if (isEnabled === false) {
                    console.log(`⛔ SKIPPING (User Disabled): ${signalKey}`);
                    continue;
                }
            } else {
                console.log(`[Filter] No settings found for token ...${pushToken.slice(-6)} (Defaulting to Allow)`);
            }
        } else {
            console.log(`[Filter] No SignalKey determined for strategy: ${strategy} (Cannot Filter)`);
        }

        messages.push({
            to: pushToken,
            sound: 'default',
            title: notificationTitle,
            body: notificationBody,
            priority: 'high',
            channelId: 'default',
            _displayInForeground: true,
            data: { strategy, ticker, price, timeframe, signal, message: notificationBody, title: notificationTitle, icon, color, tp: 'OPEN', sl: 'OPEN', videoUrl }, // Pass full data for app to handle
        });
        console.log(`+ Queueing for: ${pushToken.substring(0, 10)}...`);
    }

    // Send Notifications
    if (messages.length === 0) {
        console.log('No notifications to send (all filtered or no and no tokens).');
        return res.send({ status: 'Webhook processed', tickets: [] });
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];

    try {
        for (let chunk of chunks) {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        }
        console.log('Notifications sent!');
        console.log('Tickets:', JSON.stringify(tickets, null, 2));
        res.send({ status: 'Webhook processed', tickets });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to send notifications' });
    }
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
