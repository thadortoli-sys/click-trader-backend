import React, { useEffect, useRef } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform, Animated, ScrollView, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { ProfitTicker } from './ProfitTicker';
import * as Haptics from 'expo-haptics';
import VideoPlayer from './VideoPlayer';

import { ThemedButton } from './ThemedButton';

const { width, height } = Dimensions.get('window');

interface SignalDetailModalProps {
    visible: boolean;
    onClose: () => void;
    onArchive?: () => void;
    signal: {
        title: string;
        body?: string;
        data?: any;
        time?: string;
        pair?: string;
        type?: string;
        strategyLabel?: string;
        isDemoPnL?: boolean;
    } | null;
}

// --- ASSETS MAPPING ---
// Pre-require all educational images to ensure they load instantly
const STRATEGY_IMAGES: Record<string, any> = {
    // SCALP
    'scalp_OverSold': require('../assets/images/education/horus_ovs.png'),
    'scalp_OverBought': require('../assets/images/education/horus_ovb.png'),
    'scalp_TakeProfitPump': require('../assets/images/education/tp_pump.png'),
    'scalp_TakeProfitPush': require('../assets/images/education/tp_push.png'),
    'TP PUMP': require('../assets/images/education/tp_pump.png'),
    'TP PUSH': require('../assets/images/education/tp_push.png'),

    // PRO4X
    'pro4x_Buy': require('../assets/images/education/pro4x_buy.png'),
    'pro4x_Sell': require('../assets/images/education/pro4x_sell.png'),
    'pro4x_GetReady': require('../assets/images/education/get_ready.png'),

    // HORUS
    'horus_Buy': require('../assets/images/education/pro4x_buy.png'), // Fallback to Pro4x style for now or use specific if available
    'horus_Sell': require('../assets/images/education/pro4x_sell.png'),
    'horus_GetReady': require('../assets/images/education/get_ready.png'),

    // SHADOW
    'shadow_Mode': require('../assets/images/education/shadow_mode_nq.png'),
    'shadow_Buy': require('../assets/images/education/shadow_mode_nq.png'),
    'shadow_Sell': require('../assets/images/education/shadow_mode_nq.png'),

    // TREND / SYNCRO (New)
    'm1_SyncroBullish': require('../assets/images/education/pro4x_buy.png'),
    'm1_SyncroBearish': require('../assets/images/education/pro4x_sell.png'),
    'h1_SyncroBullish': require('../assets/images/education/institutional_abstract.png'),
    'h1_SyncroBearish': require('../assets/images/education/institutional_abstract.png'),
    'scalp_SyncroResBuy': require('../assets/images/education/pro4x_buy.png'),
    'scalp_SyncroResSell': require('../assets/images/education/pro4x_sell.png'),
};

export const SignalDetailModal = ({ visible, onClose, onArchive, signal }: SignalDetailModalProps) => {
    // Animation Values
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    // Pulse animation for the icon glow
    const pulseAnim = useRef(new Animated.Value(0.2)).current;

    useEffect(() => {
        if (visible) {
            // Haptics
            if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }

            // Entrance Animation
            scaleAnim.setValue(0.85); // Start slightly smaller
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 60,
                useNativeDriver: true,
            }).start();

            // Glow Loop
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 0.6, duration: 1000, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 0.1, duration: 1000, useNativeDriver: true })
                ])
            ).start();

        } else {
            scaleAnim.setValue(0.9);
        }
    }, [visible]);

    if (!visible || !signal) return null;

    // Extract Data
    const strategy = String(signal.data?.strategy || signal.strategyLabel || signal.title || 'System Alert');
    const ticker = String(signal.data?.ticker || signal.data?.pair || signal.pair || 'UNKNOWN');
    let type = String(signal.data?.signal || signal.type || 'ALERT').toUpperCase();

    // Sanitization for Long Backend Messages
    const typeLower = type.toLowerCase();
    const strategyUpper = strategy.toUpperCase();

    if (strategyUpper.includes('PUMP') || typeLower.includes('sell position')) {
        type = 'PARTIAL TP / BUY';
    } else if (strategyUpper.includes('PUSH') || typeLower.includes('buy position')) {
        type = 'PARTIAL TP / SELL';
    } else if (type.length > 15) {
        if (typeLower.includes('short')) type = 'EXIT SHORT';
        else if (typeLower.includes('long')) type = 'EXIT LONG';
        else type = 'ALERT';
    }

    // Theme Colors
    const isBuy = type === 'BUY' || strategy.includes('Buy') || strategy.includes('Bullish') || strategy.includes('Pump');
    const isSell = type === 'SELL' || strategy.includes('Sell') || strategy.includes('Bearish') || strategy.includes('Push');

    let accentColor = '#D4AF37';
    if (isBuy) accentColor = '#4ADE80';
    if (isSell) accentColor = '#EF4444';
    if (strategy.includes('GetReady')) accentColor = '#FFD700'; // Force Gold for Get Ready

    // IMAGE SELECTION LOGIC
    let illustration = null;

    // 1. Try direct strategy match
    if (STRATEGY_IMAGES[strategy]) {
        illustration = STRATEGY_IMAGES[strategy];
    }
    // 2. Fuzzy Match if no direct match
    else {
        if (strategyUpper.includes('OVERSOLD') || strategyUpper.includes('OVS')) illustration = STRATEGY_IMAGES['scalp_OverSold'];
        else if (strategyUpper.includes('OVERBOUGHT') || strategyUpper.includes('OVB')) illustration = STRATEGY_IMAGES['scalp_OverBought'];
        else if (strategyUpper.includes('PUMP')) illustration = STRATEGY_IMAGES['TP PUMP'];
        else if (strategyUpper.includes('PUSH')) illustration = STRATEGY_IMAGES['TP PUSH'];
        else if (strategyUpper.includes('SHADOW')) illustration = STRATEGY_IMAGES['shadow_Mode'];
        else if (strategyUpper.includes('GET READY') || strategyUpper.includes('READY')) illustration = STRATEGY_IMAGES['pro4x_GetReady'];
        // Generic Buy/Sell fallbacks
        else if (isBuy) illustration = STRATEGY_IMAGES['pro4x_Buy'];
        else if (isSell) illustration = STRATEGY_IMAGES['pro4x_Sell'];
    }

    const price = signal.data?.price !== undefined ? String(signal.data.price) : '---';
    const tp = signal.data?.tp || 'OPEN';
    const sl = signal.data?.sl || 'OPEN';
    const isDemoPnL = signal.isDemoPnL;

    // Icon selection logic
    let iconName: keyof typeof Ionicons.glyphMap = "pulse";
    if (strategy.includes('GetReady')) {
        iconName = "pulse";
    } else if (isBuy) {
        iconName = "trending-up-outline";
    } else if (isSell) {
        iconName = "trending-down-outline";
    }

    // Structured Body Renderer
    const renderStructuredBody = (text: string | null | undefined) => {
        if (!text) return null;

        const sections = text.split('\n');
        const knownHeaders = [
            "How to use this signal",
            "Execution",
            "Discipline rules",
            "Reminder",
            "Legal",
            "Context",
            "Market Context Checks",
            "Risk Discipline"
        ];

        return (
            <View style={{ padding: 15 }}>
                {sections.map((line, index) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <View key={index} style={{ height: 10 }} />; // Spacing for empty lines

                    // Check if line is a Header
                    const isHeader = knownHeaders.some(h => trimmed.includes(h));

                    if (isHeader) {
                        return (
                            <Text key={index} style={[styles.bodyText, { fontStyle: 'italic', marginTop: 10 }]}>
                                {trimmed}
                            </Text>
                        );
                    }

                    // Standard Text
                    return (
                        <Text key={index} style={styles.bodyText}>
                            {trimmed}
                        </Text>
                    );
                })}
            </View>
        );
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Backdrop */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onClose}
                    style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.95)' }]}
                />

                {/* ANIMATED CARD */}
                <Animated.View
                    style={[
                        styles.contentWrapper,
                        {
                            transform: [{ scale: scaleAnim }],
                            marginTop: 40,
                            shadowColor: strategy.includes('GetReady') ? '#FFD700' : accentColor,
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.35,
                            shadowRadius: 24,
                            elevation: 15
                        }
                    ]}
                >
                    <GlassCard
                        intensity={0}
                        borderColor="rgba(255,255,255,0.1)"
                        borderWidth={1}
                        borderRadius={32}
                        disableGradient={true}
                        style={{ overflow: 'hidden', flex: 1, maxHeight: height * 0.8, backgroundColor: '#050505' }}
                        contentStyle={{ padding: 0 }}
                    >
                        {/* DEEP GLOSS LAYERS */}
                        <LinearGradient
                            colors={['rgba(255,255,255,0.03)', 'transparent']}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 0.2 }}
                            style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
                            pointerEvents="none"
                        />
                        <LinearGradient
                            colors={['#121212', '#000000']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={[StyleSheet.absoluteFill, { zIndex: -2 }]}
                            pointerEvents="none"
                        />

                        {/* SCROLLABLE CONTENT - Flex 1 to take available space */}
                        <View style={{ flex: 1 }}>
                            <ScrollView
                                bounces={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                showsVerticalScrollIndicator={false}
                            >
                                {/* 1. HEADER */}
                                <View style={styles.header}>
                                    <Animated.View style={[
                                        styles.iconCircle,
                                        {
                                            borderColor: accentColor,
                                            opacity: pulseAnim.interpolate({ inputRange: [0.1, 0.6], outputRange: [0.8, 1] }),
                                            borderRadius: 50,
                                            width: 60, height: 60,
                                            shadowColor: accentColor, shadowOpacity: 0.5, shadowRadius: 20
                                        }
                                    ]}>
                                        <Ionicons
                                            name={iconName}
                                            size={36}
                                            color={accentColor}
                                        />
                                    </Animated.View>
                                    <Text style={[styles.strategy, { color: '#FFFFFF', marginTop: 10 }]}>
                                        {signal.data?.title || signal.title || strategy.replace('Entry', '').replace('_', ' ').trim()}
                                    </Text>
                                    <Text style={styles.ticker}>{ticker}</Text>
                                </View>

                                {/* 2.5 ILLUSTRATION - VISUAL MASTER CLASS */}
                                {illustration && (
                                    <View style={{
                                        marginHorizontal: 15,
                                        marginBottom: 15,
                                        borderRadius: 12,
                                        overflow: 'hidden',
                                        borderWidth: 1,
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.5, // Fixed number
                                        shadowRadius: 8,
                                        elevation: 5
                                    }}>
                                        <Image
                                            source={illustration}
                                            style={{
                                                width: '100%',
                                                height: 180, // Fixed height for consistency
                                                resizeMode: 'cover',
                                                opacity: 0.9
                                            }}
                                        />
                                        {/* Optional Overlay to integrate it better */}
                                        <LinearGradient
                                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                                            style={StyleSheet.absoluteFill}
                                            start={{ x: 0.5, y: 0.5 }}
                                            end={{ x: 0.5, y: 1 }}
                                        />
                                        <View style={{ position: 'absolute', bottom: 10, left: 10 }}>
                                            <Text style={{
                                                color: 'rgba(255,255,255,0.8)',
                                                fontSize: 10,
                                                fontWeight: '600',
                                                letterSpacing: 1.5,
                                                textTransform: 'uppercase',
                                                textShadowColor: 'rgba(0,0,0,0.8)',
                                                textShadowRadius: 4
                                            }}>
                                                Visual Master Class
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                {/* 2. DATA GRID */}
                                <View style={styles.grid}>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>ENTRY PRICE</Text>
                                        <Text style={styles.value}>{price}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>TIME / TF</Text>
                                        <Text style={styles.value}>{signal.time || 'NOW'} • {signal.data?.timeframe || 'M1'}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>TP / SL</Text>
                                        <Text style={styles.value}>{tp} / {sl}</Text>
                                    </View>
                                </View>

                                {/* 3. SYSTEM NOTE (OVS / OVB HIGHLIGHT) */}
                                {(strategyUpper.includes('OVERSOLD') || strategyUpper.includes('OVERBOUGHT') || strategyUpper.includes('OVS') || strategyUpper.includes('OVB')) && (
                                    <View style={{
                                        marginHorizontal: 15,
                                        marginBottom: 15,
                                        padding: 15,
                                        borderRadius: 16,
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        borderWidth: 1,
                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                    }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                            <Text style={{
                                                color: '#FFFFFF',
                                                fontSize: 10,
                                                fontWeight: 'bold',
                                                letterSpacing: 1.5,
                                                opacity: 0.9
                                            }}>TOP TIER ALERT</Text>
                                        </View>
                                        <Text style={{
                                            color: '#FFF',
                                            fontSize: 12,
                                            lineHeight: 18,
                                            fontWeight: '400'
                                        }}>
                                            This is <Text style={{ fontWeight: 'bold' }}>the most powerful</Text> scalping signal in the app. Many traders focus solely on these alerts to reach their daily targets.
                                        </Text>
                                    </View>
                                )}

                                {/* 4. BODY with STRUCTURED RENDERING */}
                                {renderStructuredBody(signal.data?.message || signal.body)}

                                {/* 5. VIDEO ATTACHMENT */}
                                {signal.data?.videoUrl && (
                                    <View style={styles.videoContainer}>
                                        <Text style={styles.sectionHeader}>LIVE SIGNAL FEED</Text>
                                        <VideoPlayer
                                            source={signal.data.videoUrl}
                                            resizeMode="cover"
                                            shouldPlay
                                            isLooping
                                            useNativeControls
                                            style={styles.video}
                                        />
                                    </View>
                                )}

                            </ScrollView>
                        </View>

                        {/* 4. FOOTER - Pinned to bottom */}
                        <View style={styles.footer}>
                            {onArchive ? (
                                <TouchableOpacity
                                    onPressIn={() => {
                                        // Use onPressIn for instant reaction
                                        if (onArchive) onArchive();
                                        onClose();
                                    }}
                                    activeOpacity={0.6}
                                    style={styles.actionButton}
                                >
                                    <View style={[styles.buttonBase, { borderColor: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.1)' }]}>
                                        <Text style={[styles.actionText, { color: '#D4AF37' }]}>ARCHIVE & CLOSE</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={styles.actionButton}>
                                    <View style={[styles.buttonBase, { borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                                        <Text style={[styles.actionText, { color: '#fff' }]}>CLOSE</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>

                    </GlassCard>
                </Animated.View >
            </View >
        </Modal >
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    contentWrapper: {
        width: '100%',
        maxWidth: 340,
        maxHeight: '85%',
        flex: 1, // Ensure wrapper can flex
    },
    header: {
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: '#000',
    },
    ticker: {
        fontSize: 14,
        fontWeight: '400',
        color: '#888',
        letterSpacing: 1,
        marginTop: 4,
    },
    strategy: {
        fontSize: 20,
        fontWeight: '300',
        color: 'white',
        letterSpacing: 2,
        // textTransform: 'uppercase', // REMOVED
        textAlign: 'center',
    },
    grid: {
        padding: 15,
        gap: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        color: '#555',
        fontSize: 10,
        letterSpacing: 1.5,
        fontWeight: '400', // Removed Bold
    },
    value: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: 0.5,
        fontVariant: ['tabular-nums'],
    },
    bodyContainer: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        marginHorizontal: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    sectionHeader: {
        fontSize: 11,
        fontWeight: '400', // Removed Bold
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    bodyText: {
        color: '#FFFFFF',
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'left',
        fontWeight: '300', // THIN CONTENT
        marginBottom: 2,
    },
    footer: {
        padding: 15,
        // paddingTop: 10, 
        backgroundColor: 'transparent'
    },
    actionButton: {
        width: '100%',
    },
    buttonBase: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    actionText: {
        fontSize: 12,
        letterSpacing: 2,
        fontWeight: '600',
    },
    videoContainer: {
        marginHorizontal: 15,
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    video: {
        width: '100%',
        height: 200, // Fixed height or aspect ratio? 200 is safe.
        backgroundColor: '#000',
    }
});
