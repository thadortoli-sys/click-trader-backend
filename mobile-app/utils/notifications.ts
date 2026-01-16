import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Configure how notifications should behave when received while the app is open
if (Platform.OS !== 'web') {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowList: true,
            shouldShowBanner: true,
        }),
    });
}

export async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'web') {
        return;
    }

    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }

        try {
            const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
            console.log("Debug: Resolved Project ID:", projectId);

            if (!projectId) {
                console.warn('Project ID not found in app.json. Skipping push token registration.');
            }

            // Get the token
            token = (await Notifications.getExpoPushTokenAsync({
                projectId,
            })).data;
            console.log("✅ Push Token GENERATED:", token);
        } catch (e) {
            console.error("Error getting push token:", e);
        }

    } else {
        console.log('Must use physical device for Push Notifications'); // Changed alert to log to avoid blocking startup
    }

    return token;
}

// Helper to safely add listeners
export function addNotificationReceivedListener(listener: (event: Notifications.Notification) => void): Notifications.EventSubscription {
    if (Platform.OS === 'web') {
        return { remove: () => { } } as any;
    }
    return Notifications.addNotificationReceivedListener(listener);
}

export function addNotificationResponseReceivedListener(listener: (event: Notifications.NotificationResponse) => void): Notifications.EventSubscription {
    if (Platform.OS === 'web') {
        return { remove: () => { } } as any;
    }
    return Notifications.addNotificationResponseReceivedListener(listener);
}

export function removeNotificationSubscription(subscription: Notifications.EventSubscription) {
    if (Platform.OS === 'web') return;
    subscription.remove();
}

// Helper to send token to backend
export async function sendTokenToBackend(token: string) {
    // Top-level imports
    if (Platform.OS === 'web') return;

    // Use 10.0.2.2 for Android Emulator, localhost for iOS Simulator
    // Ideally this comes from an environment variable
    // For physical device testing, use your computer's local network IP
    // For physical device testing, use your computer's local network IP
    const BACKEND_URL = 'https://rachell-hyperscrupulous-larissa.ngrok-free.dev';

    try {
        console.log(`Attempting to send token to ${BACKEND_URL}...`);
        // Add 5 second timeout to prevent hanging the app startup
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${BACKEND_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await response.json();
        console.log('Backend response:', data);
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.warn('⚠️ Token send timed out (Backend likely unreachable). App will continue.');
        } else {
            console.warn('⚠️ Error sending token to backend (Non-fatal):', error.message || error);
        }
    }
}

// Helper to send settings to backend
export async function sendSettingsToBackend(token: string, signals: Record<string, boolean>) {
    if (Platform.OS === 'web' || !token) return;

    // For physical device testing, use your computer's local network IP
    const BACKEND_URL = 'https://rachell-hyperscrupulous-larissa.ngrok-free.dev';

    try {
        console.log(`[Sync] Sending updated settings to backend...`);
        const response = await fetch(`${BACKEND_URL}/settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, signals }),
        });

        const data = await response.json();
        console.log('[Sync] Backend response:', data);
    } catch (error: any) {
        console.warn('[Sync] Error sending settings to backend:', error.message || error);
    }
}

// Helper to trigger a local test notification
let testIndex = 0;
const TEST_SCENARIOS = [
    {
        title: "NQ - PRO4X BUY",
        body: "Entry: 20550 | TP: 20600 | SL: 20500",
        data: { ticker: "NQ", signal: "BUY", price: "20550", strategy: "Pro4x Buy" }
    },
    {
        title: "MNQ - PRO4X SELL",
        body: "Entry: 20400 | TP: 20350 | SL: 20450",
        data: { ticker: "MNQ", signal: "SELL", price: "20400", strategy: "Pro4x Sell" }
    },
    {
        title: "NQ - GET READY",
        body: "Scanning Key Levels... Wait for confirmation.",
        data: { ticker: "NQ", signal: "NEUTRAL", price: "20480", strategy: "Get Ready" }
    },
    {
        title: "MNQ - SYNCRO SUPPORT",
        body: "H1/M5/M1 Alignment Detected.",
        data: { ticker: "MNQ", signal: "INFO", price: "20420", strategy: "Syncro Support" }
    }
];

export async function triggerLocalTestNotification(overrideIndex?: number) {
    if (Platform.OS === 'web') {
        console.log('Local notifications not supported on web');
        return;
    }

    // Use override if provided, otherwise fallback to internal (which might be resetting)
    const indexToUse = (typeof overrideIndex === 'number') ? overrideIndex : testIndex;

    // Increment if no override
    if (typeof overrideIndex !== 'number') testIndex++;

    const scenario = TEST_SCENARIOS[indexToUse % TEST_SCENARIOS.length];

    await Notifications.scheduleNotificationAsync({
        content: {
            title: scenario.title,
            body: scenario.body,
            data: scenario.data,
            sound: true, // Play system sound
        },
        trigger: null, // Immediate
    });
    console.log('Test notification scheduled:', scenario.title);
}
