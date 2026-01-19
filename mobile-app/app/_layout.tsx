import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, Platform, LogBox, ActivityIndicator, View } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import {
  registerForPushNotificationsAsync,
  sendTokenToBackend,
  addNotificationReceivedListener,
  removeNotificationSubscription,
  addNotificationResponseReceivedListener
} from '../utils/notifications';
import * as Notifications from 'expo-notifications';
import { addToHistory, hasOnboarded as checkOnboarded } from '../utils/storage';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { configurePurchases } from '../utils/purchases';
import { useSegments, useRouter } from 'expo-router';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'login',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
// Ignoring error "No native splash screen registered" which can happen in dev
try {
  SplashScreen.preventAutoHideAsync().catch(() => {
    // Ignore errors if the splash screen is already hidden or not native
  });
} catch (e) {
  // Ignore native splash screen errors
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Notification State
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.EventSubscription>(undefined);
  const responseListener = useRef<Notifications.EventSubscription>(undefined);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) {
      console.warn("Font loading error (Continuing with system fonts):", error);
    }
  }, [error]);

  // SPLASH SCREEN MANAGEMENT
  const [isSplashHidden, setSplashHidden] = useState(false);

  useEffect(() => {
    if (loaded || error) {
      if (isSplashHidden) return;

      const hideSplash = async () => {
        try {
          await SplashScreen.hideAsync();
          setSplashHidden(true);
          console.log("Stats: Splash Screen Hidden");
        } catch (e) {
          // Ignore
        }
      };

      setTimeout(hideSplash, 500);
    }
  }, [loaded, error, isSplashHidden]);

  // Failsafe Timeout
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!isSplashHidden) {
        try {
          await SplashScreen.hideAsync();
          setSplashHidden(true);
        } catch (e) { }
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [isSplashHidden]);

  // REGISTER NOTIFICATIONS
  useEffect(() => {
    const handleNotification = async (notification: Notifications.Notification, isTap: boolean) => {
      try {
        console.log("🔔 GLOBAL NOTIFICATION HANDLER [Layout]", isTap ? "(TAP)" : "(RECEIVED)");
        const content = notification.request.content;
        let data = content.data || {};

        if (typeof data === 'string') {
          try { data = JSON.parse(data); } catch (e) { data = {}; }
        }

        const newSignal = {
          id: notification.request.identifier,
          title: content.title || 'NEW SIGNAL',
          data: { ...data, body: content.body },
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          receivedAt: Date.now(),
        };

        await addToHistory({
          id: newSignal.id,
          pair: (newSignal.data as any).ticker || 'SYSTEM',
          type: (newSignal.data as any).signal || 'INFO',
          entry: (newSignal.data as any).price || '---',
          tp: 'OPEN', SL: 'OPEN',
          time: newSignal.time,
          status: 'PENDING',
          timestamp: newSignal.receivedAt,
          strategyLabel: newSignal.title,
          title: newSignal.title,
          data: newSignal.data,
          body: content.body || '',
          read: false
        } as any);

        setTimeout(() => {
          DeviceEventEmitter.emit('HISTORY_UPDATED', undefined);
        }, 50);

        if (isTap) {
          setTimeout(() => {
            DeviceEventEmitter.emit('OPEN_SIGNAL_MODAL', newSignal);
          }, 500);
        }

      } catch (e) {
        console.error("Global Notification Error:", e);
      }
    };

    const setupNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        setExpoPushToken(token);
        if (token) await sendTokenToBackend(token);
      } catch (error) { console.error("Error setting up notifications:", error); }
    };

    if (Platform.OS !== 'web') {
      setupNotifications();

      Notifications.getLastNotificationResponseAsync().then(response => {
        if (response) {
          handleNotification(response.notification, true);
        }
      });

      notificationListener.current = addNotificationReceivedListener(notification => {
        handleNotification(notification, false);
      });

      responseListener.current = addNotificationResponseReceivedListener(response => {
        handleNotification(response.notification, true);
      });
    }


    return () => {
      if (notificationListener.current) removeNotificationSubscription(notificationListener.current);
      if (responseListener.current) removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthGuard>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            <Stack.Screen name="premium" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="confirmation" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="profile" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="guide" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="guide-manual-v3" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="about" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="terms" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="privacy" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen
              name="history"
              options={{
                presentation: 'modal',
                headerShown: true,
                gestureEnabled: true,
                gestureDirection: 'vertical',
                animation: 'slide_from_bottom',
                headerStyle: { backgroundColor: '#000' },
                headerTintColor: '#fff',
                title: 'Signal Log'
              }}
            />
          </Stack>
        </AuthGuard>
      </ThemeProvider>
    </AuthProvider>
  );
}

// ─── AUTH GUARD COMPONENT ─────────────────────────────────────────────────────

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  // Check onboarding status & Listen for updates
  useEffect(() => {
    checkOnboarded().then(setIsOnboarded);

    const sub = DeviceEventEmitter.addListener('ONBOARDING_CHANGED', (val) => {
      setIsOnboarded(val);
    });

    return () => sub.remove();
  }, [session]);

  useEffect(() => {
    // Wait for both session check and onboarding check
    if (loading || isOnboarded === null) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'terms' || segments[0] === 'privacy';
    const inOnboarding = segments[0] === 'onboarding';

    if (!session && !inAuthGroup) {
      // 1. Not logged in -> Go to Login
      router.replace('/login');
    } else if (session) {
      // 2. Logged in logic
      if (!isOnboarded && !inOnboarding) {
        // New user -> Go to Onboarding (Setup)
        router.replace('/onboarding');
      } else if (isOnboarded && (inAuthGroup || inOnboarding)) {
        // User trying to access Login or Onboarding again -> Go to Dashboard
        router.replace('/');

        // If coming from Onboarding, show Premium Offer immediately
        if (inOnboarding) {
          setTimeout(() => {
            router.push('/premium');
          }, 500);
        }
      }
    }
  }, [session, loading, segments, isOnboarded]);

  if (loading || isOnboarded === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  return <>{children}</>;
}
