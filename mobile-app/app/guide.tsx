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
                                The Click&Trader system is a high-precision tool. Effective use involves adherence to the structural principles of institutional market mechanics.
                            </Text>

                            <ProtocolCard
                                number="01"
                                color="#FFD700"
                                icon="hourglass-outline"
                                title="TECHNICAL PATIENCE"
                                content="Market mechanics often favor participants who wait for structural confirmation. The system logic is based on waiting for data synchronization rather than anticipating price movement."
                            />
                            <ProtocolCard
                                number="02"
                                color="#4ADE80"
                                icon="flash-outline"
                                title="DATA VALIDATION"
                                content="When a configuration aligns at a key level, technical validity is identified. The system is engineered to analyze visible data points rather than subjective projections."
                            />
                            <ProtocolCard
                                number="03"
                                color="#EF4444"
                                icon="shield-checkmark-outline"
                                title="RISK PARAMETERS"
                                content="Every configuration represents a statistical probability, not a certainty. Risk management is a fundamental component of institutional logic. Technical stability is prioritized over exposure."
                            />

                            <View style={{ alignItems: 'center', marginVertical: 30 }}>
                                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.2)', width: '60%' }} />
                                <Text style={{ color: '#666', fontSize: 10, letterSpacing: 2, marginTop: 10, fontWeight: 'bold' }}>ADVANCED MASTERCLASS</Text>
                            </View>

                            <ProtocolCard
                                number="04"
                                color="#A855F7"
                                icon="magnet-outline"
                                title="THE MAGNITUDE LEVELS"
                                content={`The coordinates 12, 23, 38, 64, and 91 represent key institutional magnets. These are zones where price typically presents structural stabilization, rotation, or technical reactions.\n\nTechnically, these levels act as mathematical attraction points within the algorithmic environment. Price movement often follows these specific coordinates.`}
                            />

                            <ProtocolCard
                                number="05"
                                color="#D4AF37"
                                icon="layers-outline"
                                title="STRUCTURAL HIERARCHY"
                                content={`Institutional coordinates carry different technical weight:\n\n• 91 (MAJOR): High-density structural pivot. Frequent zone for technical stabilization.\n• 64 / 38 (INTERMEDIATE): Transition coordinates, often identifying extensions or pullbacks.\n• 23 / 12 (LOW): Technical areas frequently associated with bullish re-alignments.\n\nObservation: Lower coordinates often correlate with bullish reactions, while higher coordinates correlate with bearish re-alignments.`}
                            />

                            <ProtocolCard
                                number="06"
                                color="#4ADE80"
                                icon="trending-up-outline"
                                title="H1 TIME FRAME DOMINANCE"
                                content={`The H1 timeframe typically dictates the primary market structure over M1 or ticks.\n\n• In a Bullish H1 Trend: Interactions with lower coordinates (e.g., 12) represent standard pullbacks.\n• In a Bearish H1 Trend: Higher coordinates (91, 64) function as primary structural resistance.\n\nTechnical probability is maximized when alignment matches the H1 structural context.`}
                            />

                            <ProtocolCard
                                number="07"
                                color="#A855F7"
                                icon="pulse-outline"
                                title="MARKET EQUILIBRIUM"
                                content={`A technical shift often occurs around the European Close / US Mid-session (~17:00 CET). During this window, price frequently returns to a state of equilibrium.\n\n• Vertical downward extension? A technical correction is statistically frequent.\n• Vertical upward extension? A technical pullback is often observed.`}
                            />

                            <ProtocolCard
                                number="08"
                                color="#FFD700"
                                icon="cash-outline"
                                title="MULTIPLE ASSET CONFLUENCE"
                                content={`Primary indices typically precede move stability in correlated markets. When Cash, Nasdaq Futures, and S&P Futures align on institutional coordinates simultaneously, technical confluence is maximized.\n\nThis identifies zones of high institutional commitment.`}
                            />

                            <ProtocolCard
                                number="09"
                                color="#EF4444"
                                icon="alert-circle-outline"
                                title="ATR EXTENSIONS"
                                content={`In high-volatility environments (high ATR), the market often extends beyond initial coordinates to engage liquidity before stabilization.\n\nExample: A Bearish configuration at 64 during high ATR often extends toward 91 before a structural reaction occurs. The system logic accounts for these technical extensions.`}
                            />

                            <ProtocolCard
                                number="10"
                                color="#A855F7"
                                icon="moon-outline"
                                title="SHADOW LOGIC"
                                content={`Conceptually similar to the 'Shadow' system: stealthy, precise, and calculated. Market participants typically wait for structural completion.\n\nThis app is engineered to identify these institutional footprints, allowing for alignment with professional market mechanics.`}
                            />

                            <ProtocolCard
                                number="11"
                                color="#FFD700"
                                icon="sunny-outline"
                                title="INSTITUTIONAL WINDOWS"
                                content={`For participants operating from Europe, market observation continues throughout the full US session (until 22:00 CET). Late session configurations frequently carry significant structural weight.\n\nUpon the return of US desks from the mid-day break (~19:00 CET), volume and technical intent typically stabilize. The system identifies these institutional movements until the US close.`}
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
