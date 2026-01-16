import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabase';
import { Session } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo } from 'react-native-purchases';
import { ENTITLEMENT_ID, configurePurchases } from '../utils/purchases';

// Auth Context Type
interface AuthContextProps {
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
    user: any | null;
    isPro: boolean;
    setSimulatedPro: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextProps>({
    session: null,
    loading: true,
    signOut: async () => { },
    user: null,
    isPro: false,
    setSimulatedPro: () => { },
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
                }
            } catch (e) {
                console.warn('[AuthContext] Supabase check skipped/timed out');
            }

            // 2. RevenueCat (Only on Mobile)
            if (Platform.OS !== 'web') {
                try {
                    console.log('[AuthContext] Configuring RevenueCat...');
                    await withTimeout(configurePurchases(), 2000, 'Purchases.configure');

                    console.log('[AuthContext] Checking status...');
                    const info = await withTimeout(Purchases.getCustomerInfo(), 1500, 'Purchases.getInfo') as CustomerInfo;
                    if (info) {
                        setIsPro(!!info.entitlements.active[ENTITLEMENT_ID]);
                    }

                    if (typeof Purchases.addCustomerInfoUpdateListener === 'function') {
                        purchasesListener = Purchases.addCustomerInfoUpdateListener((customerInfo) => {
                            setIsPro(!!customerInfo.entitlements.active[ENTITLEMENT_ID]);
                        });
                    }
                } catch (e: any) {
                    console.warn('[AuthContext] RevenueCat skipped/timed out:', e?.message || e);
                }
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
        <AuthContext.Provider value={{ session, loading, signOut, user: session?.user ?? null, isPro, setSimulatedPro }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
