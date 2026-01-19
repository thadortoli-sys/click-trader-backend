import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';

export const STORAGE_KEYS = {
    HISTORY: 'app_history_v1',
    SETTINGS: 'app_settings_v1',
    USER_PROFILE: 'app_profile_v1',
    PUSH_TOKEN: 'app_push_token_v1',
};

// Signal Types matching new 4-Category Architecture
export type SignalKey =
    // PRO4XX.2
    | 'pro4xx_Buy' | 'pro4xx_Sell'
    | 'pro4xx_GetReady_Buy' | 'pro4xx_GetReady_Sell'
    | 'pro4xx_GetReady' // Fallback
    // PRO4X
    | 'pro4x_GetReady' | 'pro4x_Buy' | 'pro4x_Sell'
    // HORUS
    | 'horus_GetReady' | 'horus_Buy' | 'horus_Sell' | 'horus_Adv_Buy' | 'horus_Adv_Sell'
    // SCALPING MODE
    | 'scalp_OverSold' | 'scalp_OverBought'
    | 'scalp_TakeProfitPump' | 'scalp_TakeProfitPush'
    | 'scalp_SyncroResBuy' | 'scalp_SyncroResSell'
    // SHADOW MODE
    | 'shadow_Buy' | 'shadow_Sell'
    // GUIDE TENDANCE H1
    | 'h1_SyncroBullish' | 'h1_SyncroBearish'
    // GUIDE TENDANCE M1 (New)
    // GUIDE TENDANCE M1 (New)
    | 'm1_SyncroBullish' | 'm1_SyncroBearish'
    // VOLATILITY CONTEXT
    | 'vol_Low' | 'vol_High' | 'vol_Extreme' | 'vol_Panic' | 'vol_Regime'
    // INFO SUPPORT
    | 'info_SupportBuy' | 'info_SupportSell';

export interface HistoryItem {
    id: string;
    pair: string;
    type: 'BUY' | 'SELL' | 'PENDING' | string; // Allow string for flexibility
    entry: string;
    tp: string;
    sl: string;
    time: string;
    status: 'WIN' | 'LOSS' | 'PENDING';
    pips?: string;
    timestamp: number; // For sorting
    strategyLabel?: string; // Formatted Title (e.g. "PRO4X | BUY")
    // Extended fields for Notification History
    title?: string;
    body?: string;
    data?: any;
    read?: boolean;
}

export interface UserSettings {
    notificationsEnabled: boolean;
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    // Dynamic Signal Toggles
    signals: Record<SignalKey, boolean>;
}

const DEFAULT_SETTINGS: UserSettings = {
    notificationsEnabled: true,
    soundEnabled: true,
    hapticsEnabled: true,
    signals: {
        // PRO4XX.2
        pro4xx_Buy: true, pro4xx_Sell: true,
        pro4xx_GetReady_Buy: true, pro4xx_GetReady_Sell: true,
        pro4xx_GetReady: true,

        // PRO4X
        pro4x_GetReady: true,
        pro4x_Buy: true,
        pro4x_Sell: true,
        // HORUS
        horus_GetReady: true,
        horus_Buy: true,
        horus_Sell: true,
        horus_Adv_Buy: true,
        horus_Adv_Sell: true,
        // SCALPING
        scalp_OverSold: true,
        scalp_OverBought: true,
        scalp_TakeProfitPump: true,
        scalp_TakeProfitPush: true,
        scalp_SyncroResBuy: true,
        scalp_SyncroResSell: true,
        // SHADOW
        shadow_Buy: true,
        shadow_Sell: true,
        // H1 TREND
        h1_SyncroBullish: true,
        h1_SyncroBearish: true,
        // H1 GUIDE (M1 also handled here or new section?)
        m1_SyncroBullish: true,
        m1_SyncroBearish: true,
        // CONTEXT
        vol_Low: true,
        vol_High: true,
        vol_Extreme: true,
        vol_Panic: true,
        vol_Regime: true,
        // INFO SUPPORT
        info_SupportBuy: true,
        info_SupportSell: true,
    }
};

// --- History Methods ---

const HISTORY_RETENTION_MS = 48 * 60 * 60 * 1000; // 48 Hours

export const getHistory = async (): Promise<HistoryItem[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
        if (!jsonValue) return [];

        const history: HistoryItem[] = JSON.parse(jsonValue);
        const now = Date.now();

        // 1. Filter out items older than 48 hours (Pruning)
        const validHistory = history.filter(item => {
            return (now - item.timestamp) < HISTORY_RETENTION_MS;
        });

        // If we pruned items, save the cleaner list back
        if (validHistory.length < history.length) {
            await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(validHistory));
        }

        return validHistory;
    } catch (e) {
        console.error('Failed to load history', e);
        return [];
    }
};

export const addToHistory = async (newItem: HistoryItem): Promise<HistoryItem[]> => {
    try {
        // Load current (already pruned by getHistory logic above)
        const currentHistory = await getHistory();

        // Prevent duplicates by ID
        if (currentHistory.some(item => item.id === newItem.id)) {
            return currentHistory;
        }

        // Add new item to the BEGINNING of the list
        const updatedHistory = [newItem, ...currentHistory];

        // Ensure we strictly enforce size limit as a safety net (e.g. 500)
        // Note: Time-based pruning is handled in getHistory, but we keep a max cap too.
        const trimmedHistory = updatedHistory.slice(0, 500);

        await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmedHistory));
        DeviceEventEmitter.emit('HISTORY_UPDATED', trimmedHistory);
        return trimmedHistory;
    } catch (e) {
        console.error('Failed to save history item', e);
        return [];
    }
};

export const clearHistory = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
        console.error('Failed to clear history', e);
    }
}

// --- Settings Methods ---

export const getSettings = async (): Promise<UserSettings> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (jsonValue != null) {
            const parsed = JSON.parse(jsonValue);
            // Merge with default to ensure all keys exist (if we add new signals later)
            return {
                ...DEFAULT_SETTINGS,
                ...parsed,
                signals: { ...DEFAULT_SETTINGS.signals, ...parsed.signals }
            };
        }
        return DEFAULT_SETTINGS;
    } catch (e) {
        console.error('Failed to load settings', e);
        return DEFAULT_SETTINGS;
    }
};

export const saveSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    try {
        const currentSettings = await getSettings();

        // Deep merge for signals if present
        let newSignals = currentSettings.signals;
        if (settings.signals) {
            newSignals = { ...currentSettings.signals, ...settings.signals };
        }

        const newSettings = {
            ...currentSettings,
            ...settings,
            signals: newSignals
        };

        await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));

        // Notify app of changes
        DeviceEventEmitter.emit('SETTINGS_CHANGED', newSettings);

        return newSettings;
    } catch (e) {
        console.error('Failed to save settings', e);
        return DEFAULT_SETTINGS;
    }
};

// --- Sync with Backend ---
export const syncHistoryWithBackend = async (): Promise<boolean> => {
    try {
        const BACKEND_URL = 'https://clicktraderappbackend-xjqwf.ondigitalocean.app'; // Production backend

        // Add 5 second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${BACKEND_URL}/signals`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) return false;

        const serverSignals: HistoryItem[] = await response.json();
        if (!serverSignals || !Array.isArray(serverSignals)) return false;

        console.log(`[Sync] Fetched ${serverSignals.length} signals from backend`);

        let hasNew = false;
        // Process in reverse (oldest first) so they stack correctly if bulk adding? 
        // No, addToHistory adds to top. So we should process newest first (which they are), 
        // BUT addToHistory checks duplicates. 
        // Actually, easiest is just loop.
        for (const signal of serverSignals) {
            const added = await addToHistory(signal);
            if (added.length > 0) hasNew = true; // Primitive check, assume if function returns array it worked
        }

        return hasNew;
    } catch (e) {
        console.warn('[Sync] Failed to sync with backend:', e);
        return false;
    }
};

// --- Signal Filtering Helper ---
export const getSignalKeyFromStrategy = (strategy: string): SignalKey | null => {
    if (!strategy) return null;

    // Normalize string (remove spaces, lowercase check)
    const normalized = strategy.replace(/\s+/g, '_'); // "Pro4x Buy" -> "Pro4x_Buy"

    // Direct match check (Case sensitive adjustment might be needed)
    // We try to match with the keys in DEFAULT_SETTINGS.signals
    const validKeys = Object.keys(DEFAULT_SETTINGS.signals) as SignalKey[];

    // 1. Exact Match
    if (validKeys.includes(strategy as SignalKey)) return strategy as SignalKey;

    // 2. Case Insensitive Match
    const keyMatch = validKeys.find(k => k.toLowerCase() === normalized.toLowerCase());
    if (keyMatch) return keyMatch;

    // 3. Partial / Fuzzy Match (for complex backend names)
    // Example: "Pro4x Buy Signal" -> "pro4x_Buy"
    if (normalized.toLowerCase().includes('pro4x_buy')) return 'pro4x_Buy';
    if (normalized.toLowerCase().includes('pro4x_sell')) return 'pro4x_Sell';
    if (normalized.toLowerCase().includes('get_ready') || normalized.toLowerCase().includes('getready')) {
        if (normalized.toLowerCase().includes('horus')) return 'horus_GetReady';
        return 'pro4x_GetReady';
    }

    // HORUS ADV (INSTITUTIONAL SCALPING)
    if (normalized.toLowerCase().includes('institutional') && normalized.toLowerCase().includes('scalping')) {
        if (normalized.toLowerCase().includes('buy')) return 'horus_Adv_Buy';
        if (normalized.toLowerCase().includes('sell')) return 'horus_Adv_Sell';
    }
    // HORUS ADV (EXPLICIT CHECK - NEW)
    if (normalized.toLowerCase().includes('horus') && (normalized.toLowerCase().includes('adv') || normalized.toLowerCase().includes('advanced'))) {
        if (normalized.toLowerCase().includes('buy')) return 'horus_Adv_Buy';
        if (normalized.toLowerCase().includes('sell')) return 'horus_Adv_Sell';
    }

    // 4. Info Support Match
    if (normalized.toLowerCase().includes('support') && normalized.toLowerCase().includes('buy')) return 'info_SupportBuy';
    if (normalized.toLowerCase().includes('support') && normalized.toLowerCase().includes('sell')) return 'info_SupportSell';

    // 5. M1 Syncro & Syncro Resistance/Support
    if (normalized.toLowerCase().includes('syncro')) {
        if (normalized.toLowerCase().includes('resistance') || normalized.toLowerCase().includes('sell')) return 'scalp_SyncroResSell';
        if (normalized.toLowerCase().includes('support') || normalized.toLowerCase().includes('buy')) return 'scalp_SyncroResBuy';

        // M1 Trend Sync fallback
        if (normalized.toLowerCase().includes('m1')) {
            if (normalized.toLowerCase().includes('bullish') || normalized.toLowerCase().includes('buy')) return 'm1_SyncroBullish';
            if (normalized.toLowerCase().includes('bearish') || normalized.toLowerCase().includes('sell')) return 'm1_SyncroBearish';
        }
    }

    // SHADOW MODE (Fallback Return)
    if (normalized.toLowerCase().includes('shadow')) {
        if (normalized.toLowerCase().includes('buy')) return 'shadow_Buy';
        if (normalized.toLowerCase().includes('sell')) return 'shadow_Sell';
        // 'shadow_Mode' key is NOT in SignalKey type yet, likely handled as generic or needs type update.
        // Checking SignalKey definition... it has 'shadow_Buy', 'shadow_Sell'.
        // If we return 'shadow_Mode' but it's not in SignalKey, TS might complain if strictly typed.
        // But the return type is SignalKey | null.
        // Let's check SignalKey definition in file...
        // It has 'pro4x_Buy' etc.
        // I should probably stick to known keys or update SignalKey.
        // For now, let's map generic shadow to shadow_Buy/Sell if possible or just null if we don't want to filter it?
        // Actually, user settings has shadow_Buy/Sell.
        // Let's safe return null for generic shadow if we can't map it, or map to a default if they exist.
    }

    // VOLATILITY CONTEXT - Mapped on Backend mostly, but for robust filtering:
    // We can no longer map generic "VOL_CONTEXT" string effectively without the level info 
    // BUT backend sends specific strategy keys now (vol_Low etc). 
    // This helper checks fuzzy matches if strategy name is loose.
    if (normalized.toLowerCase().includes('vol_low')) return 'vol_Low';
    if (normalized.toLowerCase().includes('vol_high')) return 'vol_High';
    if (normalized.toLowerCase().includes('vol_extreme')) return 'vol_Extreme';
    if (normalized.toLowerCase().includes('panic') || normalized.toLowerCase().includes('vol_panic')) return 'vol_Panic';
    if (normalized.toLowerCase().includes('vol_regime') || normalized.toLowerCase().includes('regime')) return 'vol_Regime';

    // Legacy Fallback for "Vol Context" string if backend ever sent it: Default to Low?
    if (normalized.toLowerCase().includes('vol_context')) return 'vol_Low';

    return null;
};

export const isSignalEnabled = (strategy: string, settings: UserSettings): boolean => {
    if (!settings || !settings.signals) return true; // Default to show if no settings?? Or fail safe

    const key = getSignalKeyFromStrategy(strategy);
    if (!key) {
        // console.warn(`[Filter] No mapping found for strategy: ${strategy}`);
        return true; // Unknown strategies are shown by default to avoid missing critical info
    }

    return !!settings.signals[key];
};

// --- Onboarding Persistence ---
export const hasOnboarded = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem('app_has_onboarded_v1');
        return value === 'true';
    } catch (e) {
        return false;
    }
};

export const setHasOnboarded = async (value: boolean): Promise<void> => {
    try {
        await AsyncStorage.setItem('app_has_onboarded_v1', String(value));
        DeviceEventEmitter.emit('ONBOARDING_CHANGED', value);
    } catch (e) {
        console.error('Failed to save onboarding status', e);
    }
};
