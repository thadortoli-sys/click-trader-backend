import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedButton } from '../components/ThemedButton';
import { GlassCard } from '../components/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';

export default function ConfirmationScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    // Rename PREMIUM -> PRO for display
    const planDisplay = params.plan === 'premium' ? 'PRO' : 'BASIC'; // Used for logic/display

    // We only display "PRO", not "PRO PLAN" anymore.

    const priceText = params.plan === 'basic' ? '$9.99' : '$44.95';
    const periodText = params.plan === 'basic' ? '/ 1st month' : '/ month';

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Pure Black Background */}
            <View style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.contentWrapper}>

                        {/* Header - Simplified */}
                        <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', width: '100%', paddingHorizontal: 20 }]}>
                            {/* Logo Left */}
                            <Image
                                source={require('../assets/images/logo-ct.png')}
                                style={{ width: 65, height: 65, resizeMode: 'contain' }}
                            />

                            {/* Text Column */}
                            <View style={{ marginLeft: 12, flex: 1, justifyContent: 'center' }}>
                                <Text style={{
                                    fontSize: 26, // Matched Dashboard/Premium (was 22)
                                    fontWeight: 'bold',
                                    color: 'white',
                                    letterSpacing: 0.5,
                                    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
                                }}>
                                    Click&Trader
                                </Text>
                                <Text style={{
                                    fontSize: 12,
                                    color: '#ccc',
                                    fontStyle: 'italic',
                                    marginTop: 2,
                                    flexWrap: 'wrap',
                                }}>
                                    Your set up companion in the palm of your hand
                                </Text>
                            </View>
                        </View>

                        <View style={styles.socialContainer}>
                            <View>
                                <View style={styles.iconCircle}>
                                    {/* Gloss Effect */}
                                    <LinearGradient
                                        colors={['rgba(255,255,255,0.1)', 'rgba(0,0,0,0)']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 0.4 }}
                                        style={StyleSheet.absoluteFill}
                                    />
                                    <LinearGradient
                                        colors={['#080808', '#000000']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
                                    />
                                    <Ionicons name="checkmark" size={30} color="white" />
                                </View>
                            </View>
                        </View>

                        {/* Divider */}
                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>Selected Plan</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Plan Details in Glass Card (matching form style) */}
                        <GlassCard
                            intensity={30}
                            borderColor="#FFFFFF"
                            glowColor="#FFFFFF"
                            disableGradient={true}
                            borderWidth={0.1}
                            borderRadius={32}
                            style={styles.formGlass}
                        >
                            {/* Gloss Effect */}
                            <LinearGradient
                                colors={['rgba(255,255,255,0.1)', 'rgba(0,0,0,0)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 0.4 }}
                                style={StyleSheet.absoluteFill}
                            />
                            <LinearGradient
                                colors={['#080808', '#000000']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
                            />
                            {/* Just "PRO" - Emphasized */}
                            <Text style={styles.planName}>{planDisplay}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginTop: 15, marginBottom: 20 }}>
                                <Text style={styles.planPrice}>{priceText}</Text>
                                <Text style={styles.planPeriod}> {periodText}</Text>
                            </View>

                            {planDisplay === 'PRO' && (
                                <View style={styles.trialBadge}>
                                    <Ionicons name="star" size={14} color="#fff" />
                                    <Text style={styles.trialText}>7-day free trial</Text>
                                </View>
                            )}

                            <Text style={styles.description}>
                                Unlock full access to institutional-grade analytics, real-time data stream, and priority support.
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => router.replace('/(tabs)')}
                                style={{ width: '100%', marginTop: 30 }}
                            >
                                <LinearGradient
                                    colors={['#1a1a1a', '#000000']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    style={{
                                        width: '100%',
                                        height: 60,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 30,
                                        borderWidth: 0.5,
                                        borderColor: 'rgba(255,255,255,0.15)',
                                        paddingHorizontal: 40,
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                                        <Ionicons name="flash" size={14} color="#FFFFFF" style={{ opacity: 0.8 }} />
                                        <Text style={{
                                            color: '#FFFFFF',
                                            fontWeight: '400',
                                            fontSize: 11,
                                            letterSpacing: 2,
                                            textTransform: 'uppercase'
                                        }}>
                                            ACCESS TERMINAL
                                        </Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={{
                                    alignSelf: 'center',
                                    marginTop: 20,
                                    paddingVertical: 10
                                }}
                            >
                                <Text style={{ color: '#666', fontSize: 13, textDecorationLine: 'underline' }}>Change Plan</Text>
                            </TouchableOpacity>

                        </GlassCard>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Cancel anytime. No hidden fees.</Text>
                            <Text style={styles.footerText}>Secure payment via App Store.</Text>
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        paddingTop: 20, // Reduced from 60
    },
    contentWrapper: {
        maxWidth: 400,
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30, // Adjusted for balance
        marginTop: 15,
    },
    appTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 1,
        marginBottom: -4,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    },
    appSubtitle: {
        fontSize: 14,
        color: '#E0E0E0',
        fontStyle: 'italic',
        marginBottom: 15,
        textAlign: 'center',
        opacity: 0.9,
    },
    socialContainer: {
        gap: 15,
        marginBottom: 10, // Reduced from 20 to bring closer to divider
        marginTop: 30,
        alignItems: 'center',
        zIndex: 10,
    },
    iconCircle: {
        width: 70, // Reduced from 90
        height: 70, // Reduced from 90
        borderRadius: 35,
        borderWidth: 0.1, // Visual stroke
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#000', // Ensure opacity
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0, // Reduced from 5 to touch card
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#333',
    },
    dividerText: {
        color: '#666',
        paddingHorizontal: 16,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    formGlass: {
        padding: 20,
        marginBottom: 10,
        marginTop: 10, // Reduced from 40 to bring closer to divider
    },
    planName: {
        fontSize: 16, // Reduced from 24 (not shouting)
        fontWeight: '600', // Semi-bold/medium (not heavy)
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 6, // WIDE spacing for premium look
        marginTop: 5,
        textTransform: 'uppercase',
    },
    planPrice: {
        fontSize: 42, // Matched premium.tsx
        fontWeight: 'bold', // Matched premium.tsx
        color: '#fff',
    },
    planPeriod: {
        fontSize: 16,
        color: '#888',
    },
    trialBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignSelf: 'center',
        gap: 6,
        marginBottom: 20,
    },
    trialText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    description: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        lineHeight: 22,
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
        gap: 5,
    },
    footerText: {
        color: '#666',
        fontSize: 13,
    },
    tagline: {
        fontSize: 16,
        color: '#E0E0E0',
        fontStyle: 'italic',
        marginTop: -5,
        marginBottom: 40, // consistent spacing
        opacity: 0.9,
    },
});
