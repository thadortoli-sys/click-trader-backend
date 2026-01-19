import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// import { GlassCard } from '../components/GlassCard'; // Unused
import { HolographicGradient } from '../components/HolographicGradient';
import * as Notifications from 'expo-notifications';
import { setHasOnboarded } from '../utils/storage';

const { width } = Dimensions.get('window');

// Reusable Dopamine Card Component (Used for containers if needed, or matching Pro4x style)
const DopamineCard = ({ children, style, glowColor = 'rgba(255, 255, 255, 0.08)' }: { children: React.ReactNode, style?: any, glowColor?: string }) => (
    <View style={[{
        borderRadius: 24,
        borderWidth: 1,
        borderColor: glowColor,
        overflow: 'hidden',
        backgroundColor: 'rgba(10, 10, 10, 0.6)', // Darker base
    }, style]}>
        {/* Subtle Gradient Overlay */}
        <LinearGradient
            colors={['rgba(255,255,255,0.07)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.5 }}
            style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
        />
        {children}
    </View>
);

export default function OnboardingScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        setLoading(true);
        try {
            // Request Notifications Permission explicitly here
            // We don't await the result strictly to avoid blocking if user ignores prompt
            Notifications.requestPermissionsAsync().then(status => {
                console.log('Notification permission status:', status);
            });

            // Mark as onboarded - This emits event which AuthGuard listens to
            await setHasOnboarded(true);

            // Navigate to Dashboard (redundant if AuthGuard works, but safe to keep)
            router.replace('/(tabs)');
        } catch (e) {
            console.error('Onboarding Error:', e);
            router.replace('/(tabs)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Background */}
            <HolographicGradient />

            <View style={styles.content}>

                {/* Header Section (Centered Vertically since cards are gone) */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {/* Logo - No Frame, just Floating */}
                    <Image
                        source={require('../assets/images/logo-ct.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>Click&Trader</Text>
                    <Text style={styles.subtitle}>Your trading companion in the palm of your hand</Text>
                </View>

                {/* Action Button */}
                <View style={styles.footer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#FFFFFF" style={{ marginBottom: 20 }} />
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={handleStart}
                            style={{ alignItems: 'center', justifyContent: 'center' }}
                        >
                            {/* Scanning Ring (Static for now, implies target) */}
                            <View style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.3)', // Thin White Ring
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 15,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)' // Very subtle white fill
                            }}>
                                <Ionicons name="finger-print" size={40} color="#FFFFFF" style={{ opacity: 0.8 }} />
                            </View>

                            <Text style={{
                                color: '#FFFFFF',
                                fontSize: 10,
                                fontWeight: '300', // Fine text
                                letterSpacing: 4,
                                opacity: 0.6,
                                textTransform: 'uppercase'
                            }}>Tap to Initialize</Text>
                        </TouchableOpacity>
                    )}


                    <View style={{ marginTop: 40, alignItems: 'center' }}>
                        <Text style={{
                            color: '#FFFFFF',
                            fontSize: 9,
                            opacity: 0.3,
                            letterSpacing: 2,
                            fontWeight: '300'
                        }}>DESIGNED & DEVELOPED IN NEW YORK CITY</Text>
                    </View>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 60,
        paddingHorizontal: 30,
    },
    headerContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        letterSpacing: 1,
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#D4AF37', // Gold
        letterSpacing: 0.5,
        fontWeight: '300', // Thin
        fontStyle: 'italic', // Italic
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 24,
        maxWidth: 320,
    },
    gridContainer: {
        flexDirection: 'column',
        gap: 15,
    },
    featureCard: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    iconCircle: {
        width: 48, height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        alignItems: 'center', justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 2,
    },
    cardDesc: {
        fontSize: 12, color: '#aaa', maxWidth: 200, lineHeight: 16,
    },
    footer: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    buttonWrapper: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)', // Subtle border
        marginBottom: 15,
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center', alignItems: 'center',
    },
    buttonContent: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
    },
    buttonText: {
        color: '#FFFFFF', // White Text
        fontWeight: '600',
        fontSize: 14,
        letterSpacing: 1.5,
    },
    disclaimer: {
        color: '#444', fontSize: 10, textAlign: 'center',
    }
});
