import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabase';
import { Session } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo } from 'react-native-purchases';
import { ENTITLEMENT_ID, configurePurchases, isExpoGo } from '../utils/purchases';
import { sendSettingsToBackend, registerForPushNotificationsAsync } from '../utils/notifications';
import { getSettings } from '../utils/storage';

// Auth Context Type
interface AuthContextProps {
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
    user: any | null;
    isPro: boolean;
    setSimulatedPro: (status: boolean) => void;
    proDebugInfo: string | null;
}

const AuthContext = createContext<AuthContextProps>({
    session: null,
    loading: true,
    signOut: async () => { },
    user: null,
    isPro: false,
    setSimulatedPro: () => { },
    proDebugInfo: null,
});

// Helper for timeout
const withTimeout = (promise: Promise<any>, ms: number, label: string) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} Timeout`)), ms))
    ]);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPro, setIsPro] = useState(false);
    const [proDebugInfo, setProDebugInfo] = useState<string | null>('INITIALIZING...');

    // --- GOD MODE HELPER ---
    const checkGodMode = (currentSession: Session | null) => {
        if (!currentSession?.user?.email) return;

        const email = currentSession.user.email;
        const WHITELIST = [
            'th.a.dortoli@gmail.com',
            'adortoli@icloud.com',
            'apple_reviewer@clickandtrader.com',
            'google_reviewer@clickandtrader.com'
        ];

        if (WHITELIST.includes(email)) {
            console.log(`[AuthContext] 👑 GOD MODE RE-ACTIVATED for ${email}`);
            setIsPro(true);
            registerForPushNotificationsAsync().then(async (token) => {
                if (token) {
                    const settings = await getSettings();
                    const s = settings.signals || {};
                    await sendSettingsToBackend(token, s, true);
                }
            });
        }
    };

    useEffect(() => {
        let purchasesListener: any = null;
        let authSubscription: any = null;
        let isInitialized = false;

        // Failsafe Timeout: 5 Seconds max for loading state (Aggressive)
        const loadingFailsafe = setTimeout(() => {
            if (!isInitialized) {
                console.warn('[AuthContext] 🚨 FINAL BOOT TIMEOUT reached. Forcing UI render.');
                setLoading(false);
            }
        }, 5000);

        const initializeAuth = async () => {
            console.log('[AuthContext] 🚀 STARTING INIT');

            // 1. Supabase Session
            try {
                console.log('[AuthContext] Fetching session...');
                const { data } = await withTimeout(supabase.auth.getSession(), 2000, 'Supabase') as any;
                if (data?.session) {
                    setSession(data.session);
                    console.log('[AuthContext] Session Found');
                    checkGodMode(data.session); // CHECK 1: ON MOUNT
                }
            } catch (e) {
                console.warn('[AuthContext] Supabase check skipped/timed out');
            }

            // 2. RevenueCat (Only on Mobile & Real Device)
            if (Platform.OS !== 'web' && !isExpoGo) {
                try {
                    console.log('[AuthContext] Configuring RevenueCat...');
                    await withTimeout(configurePurchases(), 2000, 'Purchases.configure');

                    console.log('[AuthContext] Checking status...');
                    const info = await withTimeout(Purchases.getCustomerInfo(), 1500, 'Purchases.getInfo') as CustomerInfo;
                    if (info) {
                        // Check for ANY common Pro entitlement (pro, lifetime, perpetual, premium)
                        const activeKeys = Object.keys(info.entitlements.active);
                        const foundKey = activeKeys.find(key =>
                            ['pro', 'lifetime', 'perpetual', 'premium', 'founder'].includes(key.toLowerCase())
                        );

                        // DEBUG MODE: ALWAYS SET DEBUG INFO
                        // If foundKey exists, we are PRO. If not, we just show what keys we found.
                        setProDebugInfo(activeKeys.length > 0 ? activeKeys.join(', ') : 'NO ENTITLEMENTS (0)');

                        if (foundKey) {
                            setIsPro(true);
                            // setProDebugInfo(foundKey); // Already set above with potentially more info
                        }
                    } else {
                        setProDebugInfo('RC INFO IS NULL');
                    }

                    if (typeof Purchases.addCustomerInfoUpdateListener === 'function') {
                        purchasesListener = Purchases.addCustomerInfoUpdateListener((customerInfo) => {
                            const activeKeys = Object.keys(customerInfo.entitlements.active);
                            const foundKey = activeKeys.find(key =>
                                ['pro', 'lifetime', 'perpetual', 'premium', 'founder'].includes(key.toLowerCase())
                            );

                            setProDebugInfo(activeKeys.length > 0 ? activeKeys.join(', ') : 'NO ENTITLEMENTS (0)');

                            if (foundKey) {
                                setIsPro(true);
                            }
                        });
                    }
                } catch (e: any) {
                    console.warn('[AuthContext] RevenueCat skipped/timed out:', e?.message || e);
                    setProDebugInfo(`RC ERROR: ${e?.message || 'Unknown'}`);
                }
            } else {
                setProDebugInfo(isExpoGo ? 'EXPO GO (SIMULATION)' : 'WEB/DESKTOP MODE');
            }

            // Always finish
            console.log('[AuthContext] ✅ INIT DONE');
            isInitialized = true;
            clearTimeout(loadingFailsafe);
            setLoading(false);
        };

        initializeAuth();

        // Background auth listener
        try {
            const { data } = supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
                checkGodMode(session); // CHECK 2: ON LOGIN/LOGOUT
                // Don't modify loading state here to avoid race conditions with initializeAuth
            });
            authSubscription = data.subscription;
        } catch (e) { }

        return () => {
            clearTimeout(loadingFailsafe);
            if (authSubscription) authSubscription.unsubscribe();
            if (purchasesListener?.remove) purchasesListener.remove();
        };
    }, []);

    const signOut = async () => {
        setLoading(true);
        try { await supabase.auth.signOut(); } catch (e) { }
        setLoading(false);
    };

    const setSimulatedPro = (status: boolean) => {
        setIsPro(status);
        console.log(`[AuthContext] Pro Status set to: ${status}`);
    };

    return (
        <AuthContext.Provider value={{ session, loading, signOut, user: session?.user ?? null, isPro, setSimulatedPro, proDebugInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
