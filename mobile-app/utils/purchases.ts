import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import Constants from 'expo-constants';

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// TODO: Replace with your actual RevenueCat API Keys
const API_KEYS = {
    apple: 'test_RjbVXVtrBleMGMfmBSPjlpiiwSA', // Using provided test key
    google: 'test_RjbVXVtrBleMGMfmBSPjlpiiwSA',
};

export const configurePurchases = async () => {
    try {
        if (Platform.OS === 'web' || isExpoGo) {
            console.log('RevenueCat skipped (Web or Expo Go)');
            return;
        }

        const apiKey = Platform.select({
            ios: API_KEYS.apple,
            android: API_KEYS.google,
        });

        if (!apiKey || apiKey.includes('_...')) {
            console.warn('RevenueCat API Key not configured. Skipping initialization.');
            return;
        }

        console.log('Initializing RevenueCat safely...');
        await Purchases.configure({ apiKey });
        console.log('RevenueCat initialized successfully.');

    } catch (error) {
        // CRITICAL: We catch the error so the app DOES NOT CRASH
        console.error('RevenueCat Initialization Failed (Safe Mode):', error);
    }
};

export const ENTITLEMENT_ID = 'pro';

export const getOfferings = async () => {
    if (isExpoGo) {
        console.log('Mocking getOfferings for Expo Go');
        return null;
    }
    try {
        const offerings = await Purchases.getOfferings();
        return offerings.current;
    } catch (e) {
        console.error('Error fetching offerings:', e);
        return null;
    }
};

export const purchasePackage = async (pack: any) => {
    if (isExpoGo) {
        alert('In-App Purchases are not supported in Expo Go. Please use a development build.');
        return null;
    }
    try {
        const { customerInfo } = await Purchases.purchasePackage(pack);
        return customerInfo;
    } catch (e: any) {
        if (!e.userCancelled) {
            console.error('Purchase error:', e);
            throw e; // Rethrow for UI handling
        }
        return null; // User cancelled
    }
};

export const restorePurchases = async () => {
    if (isExpoGo) return null;
    try {
        const customerInfo = await Purchases.restorePurchases();
        return customerInfo;
    } catch (e) {
        console.error('Restore error:', e);
        throw e;
    }
};

export const getCustomerInfo = async () => {
    if (isExpoGo) return null;
    try {
        return await Purchases.getCustomerInfo();
    } catch (e) {
        return null;
    }
};
