import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Button, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { PremiumTeaserOverlay } from '../components/PremiumTeaserOverlay';

// --- COMPONENTS ---

import { LinearGradient } from 'expo-linear-gradient';
import { HolographicGradient } from '../components/HolographicGradient';

const TabButton = ({ title, isActive, onPress }: any) => (
    <TouchableOpacity
        onPress={onPress}
        style={{ flex: 1, alignItems: 'center', paddingVertical: 15, borderBottomWidth: 2, borderBottomColor: isActive ? '#FFF' : 'transparent' }}
    >
        <Text style={{ color: isActive ? '#FFF' : '#666', fontWeight: isActive ? 'bold' : '500', fontSize: 12, letterSpacing: 1, textAlign: 'center' }}>{title}</Text>
    </TouchableOpacity>
);

const DopamineCard = ({ children, style }: { children: React.ReactNode, style?: any }) => (
    <GlassCard
        intensity={20}
        borderColor="#FFFFFF"
        borderWidth={0.1}
        borderRadius={16}
        disableGradient={true}
        style={[{ marginBottom: 0 }, style]}
    >
        <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(0,0,0,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.4 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
        />
        <LinearGradient
            colors={['#1A1A1A', '#000000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
            pointerEvents="none"
        />
        {children}
    </GlassCard>
);

const ProtocolCard = ({ number, title, content, color, icon }: { number: string, title: string, content: string, color?: string, icon?: keyof typeof Ionicons.glyphMap }) => (
    <DopamineCard style={{ marginBottom: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{ alignItems: 'center', marginRight: 15, width: 40, opacity: 0.5 }}>
                <Text style={{
                    fontSize: 24, // Smaller size
                    fontWeight: '300',
                    color: color || 'rgba(255,255,255,0.15)',
                    lineHeight: 28,
                    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-light'
                }}>{number}</Text>
                {icon && <Ionicons name={icon} size={18} color={color} style={{ marginTop: 6 }} />}
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 8, letterSpacing: 0.5 }}>{title}</Text>
                <Text style={{ fontSize: 14, color: '#CCC', lineHeight: 22 }}>{content}</Text>
            </View>
        </View>
    </DopamineCard>
);

export default function SignalGuideScreen() {
    const router = useRouter();
    const { isPro } = useAuth();

    return (
        <View style={styles.container}>
            <HolographicGradient />
            <Stack.Screen options={{ headerShown: false }} />
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingTop: Platform.OS === 'ios' ? 20 : 10,
                paddingBottom: 10,
                backgroundColor: 'black'
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <Ionicons name="chevron-down" size={26} color="white" />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>SYSTEM GUIDE</Text>
                <View style={{ width: 34 }} />
            </View>

            {/* TABS HEADER - ROUTER LINKED */}
            <View style={[styles.tabContainer, { paddingTop: 15 }]}>
                <TabButton
                    title="ALERTS BEHAVIOR & MASTERCLASS"
                    isActive={false}
                    onPress={() => router.push('/guide-manual-v3')}
                />
                <TabButton
                    title="OPERATIONAL LOGIC"
                    isActive={true}
                    onPress={() => { }} // Already Here
                />
            </View>

            {/* CONTENT AREA - PROTOCOL ONLY */}
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View pointerEvents={isPro ? 'auto' : 'none'}>
                        <View style={{ paddingTop: 10 }}>
                            <Text style={styles.introText}>
                                The Click&Trader system is a high-precision tool. To use it effectively, you must abide by the core principles of institutional trading.
                            </Text>

                            <ProtocolCard
                                number="01"
                                color="#FFD700"
                                icon="hourglass-outline"
                                title="PATIENCE IS THE EDGE"
                                content="The market is a transfer mechanism from the impatient to the patient. System logic prioritizes waiting for the alert and confirmation over chasing price action."
                            />
                            <ProtocolCard
                                number="02"
                                color="#4ADE80"
                                icon="flash-outline"
                                title="EXECUTION"
                                content="When a confirmed signal appears at a key level, technical execution is validated. The system is designed to trade visible data rather than anticipated moves."
                            />
                            <ProtocolCard
                                number="03"
                                color="#EF4444"
                                icon="shield-checkmark-outline"
                                title="RISK MANAGEMENT"
                                content="No signal is a guarantee. Probability is not certainty. Standard educational practice suggests risking 1-2% of capital per trade. Live to trade another day."
                            />

                            <View style={{ alignItems: 'center', marginVertical: 30 }}>
                                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.2)', width: '60%' }} />
                                <Text style={{ color: '#666', fontSize: 10, letterSpacing: 2, marginTop: 10, fontWeight: 'bold' }}>ADVANCED MASTERCLASS</Text>
                            </View>

                            <ProtocolCard
                                number="04"
                                color="#A855F7"
                                icon="magnet-outline"
                                title="THE MAGNETIC LEVELS"
                                content={`The levels 12, 23, 38, 64, and 91 are not random. They are magnetic zones where price statistically tends to slow down, stabilize, bounce, or reverse.\n\nThese are psychological and algorithmic attraction zones used by institutional traders and market makers. Price doesn't go there by chance; it is drawn there.`}
                            />

                            <ProtocolCard
                                number="05"
                                color="#D4AF37"
                                icon="layers-outline"
                                title="LEVEL HIERARCHY"
                                content={`Not all levels carry the same weight:\n\n• 91 (MAJOR): The most powerful pivot. Frequent zone for stabilization or reversal.\n• 64 / 38 (INTERMEDIATE): Transition zones, often used for extensions or pullbacks.\n• 23 / 12 (LOW): Very effective for bullish bounces after a drop.\n\nRULE: Low numbers favor bullish bounces. High numbers favor bearish reversals.`}
                            />

                            <ProtocolCard
                                number="06"
                                color="#4ADE80"
                                icon="trending-up-outline"
                                title="CONTEXT IS KING (H1)"
                                content={`The H1 timeframe always dominates M1 or ticks.\n\n• In a Bullish H1 Trend: A pullback to a level like 12 is a natural buying opportunity.\n• In a Bearish H1 Trend: High levels (91, 64) become prime selling zones.\n\nScalping without observing the H1 context reduces the statistical probability of the setup.`}
                            />

                            <ProtocolCard
                                number="07"
                                color="#A855F7"
                                icon="pulse-outline"
                                title="MARKET RHYTHM"
                                content={`Observation of polarity inversion around the European Close / US Mid-session (~17:00 CET) is key. If there are no major news events, the market often "breathes" here.\n\n• Strong drop before? A technical bounce is statistically common.\n• Strong rally before? A technical pullback is often observed.`}
                            />

                            <ProtocolCard
                                number="08"
                                color="#FFD700"
                                icon="cash-outline"
                                title="CASH & CONFLUENCE"
                                content={`Cash indices (Spot) often lead Futures. When Cash, Nasdaq Futures, and S&P Futures all align on magnetic levels simultaneously, the signal probability increases significantly.\n\nThis is CONFLUENCE. Levels are stronger together than in isolation.`}
                            />

                            <ProtocolCard
                                number="09"
                                color="#EF4444"
                                icon="alert-circle-outline"
                                title="ATR & STOP HUNTS"
                                content={`If volatility (ATR) is high, the market typically hunts liquidity before reversing.\n\nExample: A sell signal at 64 with high ATR often implies price will extend to 91 to trigger stops before actually dropping. System logic waits for this extension.`}
                            />

                            <ProtocolCard
                                number="10"
                                color="#A855F7"
                                icon="moon-outline"
                                title="THE SHADOW PHILOSOPHY"
                                content={`Think of it like 'Atom' in Real Steel.\nSilent. Precise. Powerful.\n\nInstitutions don't chase price. They wait. \n\nThis app IS your Shadow Mode. It is hard-coded to replicate this behavior, helping you move WITH the giants, not against them.`}
                            />

                            <ProtocolCard
                                number="11"
                                color="#FFD700"
                                icon="sunny-outline"
                                title="THE GOLDEN HOURS"
                                content={`Institutional flow often extends beyond standard European hours. Late session setups (~18:30 CET) frequently carry significant structural weight.\n\nWhen Wall Street returns from lunch, they often take full control. From then until the close, volume and intent are driven by U.S. desks.\n\nKEY INSIGHT: Europe follows. The U.S. decides. Shadow Mode excels in capturing these late-session power moves (19:00 - 20:00 CET).`}
                            />

                            <View style={{ marginTop: 40, marginBottom: 50, alignItems: 'center', opacity: 0.5 }}>
                                <Text style={{ color: '#666', fontSize: 10, letterSpacing: 1 }}>
                                    © 2025-2026 Click&Trader App. All rights reserved.
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>

            {/* Teaser Overlay if NOT Pro */}
            {!isPro && <PremiumTeaserOverlay message="GUIDE LOCKED" />}
        </View >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', backgroundColor: '#000' },
    scrollContent: { padding: 20 },
    introText: {
        color: '#888',
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    acceptButton: {
        height: 50,
        width: '100%',
        borderRadius: 25,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    acceptButtonText: {
        color: '#000',
        fontWeight: 'bold',
        letterSpacing: 1,
        fontSize: 14,
        zIndex: 10,
    },
});
