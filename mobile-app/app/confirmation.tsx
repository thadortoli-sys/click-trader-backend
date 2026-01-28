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
    const plan = params.plan === 'premium' ? 'PREMIUM' : 'BASIC';

    const priceText = plan === 'BASIC' ? '$9.99' : '$44.95';
    const periodText = plan === 'BASIC' ? '/ 1st month' : '/ month';

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
                        <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                            {/* Logo Left */}
                            <Image
                                source={require('../assets/images/logo-ct.png')}
                                style={{ width: 65, height: 65, resizeMode: 'contain' }}
                            />

                            {/* Text Column */}
                            <View style={{ marginLeft: 12 }}>
                                <Text style={{
                                    fontSize: 26,
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
                                    <Ionicons name="checkmark" size={45} color="white" />
                                </View>
                            </View>
                        </View>

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
                            <Text style={styles.planName}>{plan} PLAN</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginTop: 15, marginBottom: 20 }}>
                                <Text style={styles.planPrice}>{priceText}</Text>
                                <Text style={styles.planPeriod}> {periodText}</Text>
                            </View>

                            {plan === 'PREMIUM' && (
                                <View style={styles.trialBadge}>
                                    <Ionicons name="star" size={14} color="#fff" />
                                    <Text style={styles.trialText}>7-day free trial</Text>
                                </View>
                            )}

                            <Text style={styles.description}>
                                Unlock full access to institutional-grade signals, real-time alerts, and priority support.
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
                                            START TRADING
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
        marginBottom: 40,
        marginTop: 10,
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
        marginBottom: 20,
        marginTop: 40, // Descend further
        alignItems: 'center',
        zIndex: 10,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
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
        marginBottom: 5, // Reduced from 15 (closer to card)
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
        padding: 25,
        marginBottom: 10, // Reduced from 30
    },
    planName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 2,
    },
    planPrice: {
        fontSize: 48,
        fontWeight: 'bold',
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
