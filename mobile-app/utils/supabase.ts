
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// TODO: Replace with your actual project URL and Anon Key
const SUPABASE_URL = 'https://mtzppdmnenrqvhzazscr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10enBwZG1uZW5ycXZoemF6c2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTc3NDAsImV4cCI6MjA3NzQ5Mzc0MH0.NdaDuyBkqAuZtLFI2uTehQTYcdS-FjhMl06Z8j_aiaY';

// Custom Storage Adapter for Supabase Auth
// Uses SecureStore on iOS/Android for better security, falls back to AsyncStorage on Web
const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        return SecureStore.getItemAsync(key, { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY });
    },
    setItem: (key: string, value: string) => {
        return SecureStore.setItemAsync(key, value, { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY });
    },
    removeItem: (key: string) => {
        return SecureStore.deleteItemAsync(key, { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY });
    },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: Platform.OS === 'web' ? AsyncStorage : ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
