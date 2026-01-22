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

// --- EDUCATIONAL CONTENT MAPPING ---
const STRATEGY_CONTENT: Record<string, string> = {
    // HORUS OVS/OVB
    'horus_OVS': "Context\nThis is the most powerful analytical response in the app. It detects high-density technical rejection zones.\n\nHow to use this signal\nTarget: 10-15 points on NQ.\nInvalidation: A clear close beyond the rejection candle.\n\nDiscipline rules\nWait for the M1 candle to close.\nDo not chase if price has already moved more than 5 points from the level alignment.",
    'horus_OVB': "Context\nThis is the most powerful analytical response in the app. It detects high-density technical rejection zones.\n\nHow to use this signal\nTarget: 10-15 points on NQ.\nInvalidation: A clear close beyond the rejection candle.\n\nDiscipline rules\nWait for the M1 candle to close.\nDo not chase if price has already moved more than 5 points from the level alignment.",

    // HORUS ADV
    'horus_Adv_Buy': "High-Density Reaction Detected\n\nTechnical friction identified at institutional liquidity zones.\n\nFramework & ATR Context\n• Volatility Filter: Alerts must be interpreted alongside current ATR levels for precise technical calibration.\n• Institutional Map: Primary focus on 12, 23, 38, 64, and 91 technical reference layers.\n• Behavior: Monitors fast liquidity taps and immediate bullish recoil zones.\n\nTechnical Note\nMonitoring M1 stabilization waves is a requirement for data alignment.\n\nDiscipline\nRigorous risk management is the sole responsibility of the user.",
    'horus_Adv_Sell': "High-Density Reaction Detected\n\nTechnical friction identified at institutional liquidity zones.\n\nFramework & ATR Context\n• Volatility Filter: Alerts must be interpreted alongside current ATR levels to calibrate reaction expectations.\n• Institutional Map: Focus on the 12, 23, 38, 64, and 91 technical reference layers.\n• Behavior: Monitors fast liquidity taps and immediate recoil zones.\n\nTechnical Note\nObservation of M1 price stabilization is recommended for data validation.\n\nDiscipline\nRigorous risk management is the sole responsibility of the user.",

    // PRO4X.2
    'pro4xx_Buy': "Context\nTrend following alignment. Monitors institutional market flow.\n\nHow to use this signal\nIdentify the primary trend on M15 before executing.\nLook for a reclaim of the key level if the first touch is too fast.\n\nExecution\nEntry on technical alignment.\nCommon TP: 20-50 points.",
    'pro4xx_Sell': "Context\nTrend following alignment. Monitors institutional market flow.\n\nHow to use this signal\nIdentify the primary trend on M15 before executing.\nLook for a reclaim of the key level if the first touch is too fast.\n\nExecution\nEntry on technical alignment.\nCommon TP: 20-50 points.",

    // PRO4X CLASSIC
    'pro4x_Buy': "Context\nThis setup indicates that technical bullish conditions have been met based on the PRO4X model.\n\nHow to use this signal\nAnalytical parameters are aligned around a key level alignment, highlighting a potential directional market bias.\nDepending on the broader context, this setup highlights a potential short-term reaction zone.",
    'pro4x_Sell': "Context\nThis setup indicates that technical bearish conditions have been met based on the PRO4X model.\n\nHow to use this signal\nAnalytical parameters are aligned around a key level alignment, highlighting a potential directional market bias.\nDepending on the broader context, this setup highlights a potential short-term reaction zone.",

    // SHADOW
    'shadow_Buy': "Context\nShadow of Liquidity. Detects sweeps of previous highs/lows.\n\nTechnical Note\nHigher volatility is expected.\nWait for the reclaim of the sweep level to confirm the trap.",
    'shadow_Sell': "Context\nShadow of Liquidity. Detects sweeps of previous highs/lows.\n\nTechnical Note\nHigher volatility is expected.\nWait for the reclaim of the sweep level to confirm the trap.",

    // VOLATILITY
    'vol_Panic': "Extreme Market Volatility Warning\n\nCurrent data indicates critical price velocity with a very high probability of significant overshoots.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is currently ≥ 23 pts.\n• Observation Note: In these conditions, price moves can frequently overshoot technical layers. High-density analysis suggests observing 5–8 M1 candles or a strong price reclaim for data alignment.\n• Market Structure: Trend continuation is statistically common during panic phases. Exercise extreme caution as price reactions may be delayed.\n\nSystem Behavior\nThis alert identifies \"Black Swan\" or high-impact news environments. It is designed to prioritize data stabilization over immediate reaction.\n\nDiscipline\nCapital preservation is the primary focus. All trading decisions and risk management remain the sole responsibility of the user.",
    'vol_Extreme': "Extreme Market Conditions Detected\n\nCurrent data indicates a significant increase in price velocity and overshoot risk.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is currently between 20–23 pts.\n• Observation Note: Fast market conditions often result in frequent overshoots. Technical context suggests monitoring for 3–5 M1 candles or a clear sweep-and-reclaim structure for data alignment.\n• Validation Requirement: Monitoring 2 to 3 waves on the M1 timeframe is a primary requirement for technical validation under these conditions.\n\nSystem Behavior\nThis alert serves as a technical warning for high-density price movements. Statistical trend continuation is common during these phases.\n\nDiscipline\nRigorous risk management and capital protection are the sole responsibility of the user.",
    'vol_High': "Active Market Volatility\n\nCurrent data indicates a sustained increase in price velocity and a higher risk of price sweeps.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is currently between 18–20 pts.\n• Observation Note: The technical context suggests monitoring for stabilization after 1–3 M1 candles as a common technical baseline.\n• Market Structure: Continuation or sweep-and-reclaim structures are frequently identified at this volatility level.\n\nSystem Behavior\nThis alert serves as a technical monitoring tool for active trend phases. It is designed to assist in identifying potential volatility shifts.\n\nDiscipline\nAdapt your analysis to current volatility. Risk management remains the sole responsibility of the user.",

    // REINTEGRATION
    'scalp_TakeProfitPump': "Context\nRe-integration setup. Price extended from MA 50.\n\nTechnical Note\nStatistical probability of mean reversion. Target the MA 50 as a primary target.",
    'scalp_TakeProfitPush': "Context\nRe-integration setup. Price extended from MA 50.\n\nTechnical Note\nStatistical probability of mean reversion. Target the MA 50 as a primary target.",

    // MARKET REGIMES
    'vol_Regime_Trend': "Directional Momentum Alignment\n\nCurrent data indicates a sustained directional flow with structural stability.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is currently in a Normal/Standard range (< 18 pts).\n• Observation Note: Price action shows clear higher highs or lower lows. The technical context suggests monitoring for pullbacks to institutional Magnet Levels for trend continuation.\n• Market Structure: High probability of directional follow-through. Technical validation is primarily based on M1 wave alignment.\n\nSystem Behavior\nThis alert identifies phases where momentum outweighs mean-reversion. It is designed to assist in monitoring trend health.\n\nDiscipline\nAvoid counter-trend bias during active regimes. Risk management remains the sole responsibility of the user.",
    'vol_Regime_Range': "Mean-Reversion Context Identified\n\nCurrent data indicates a lack of directional momentum, with price oscillating between defined technical boundaries.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is in a Stable/Low range (< 18 pts).\n• Observation Note: Price action shows back-and-forth behavior within a horizontal corridor. Technical context suggests monitoring for rejections at the extremes of the range.\n• Market Structure: High density of \"Magnet Level\" interactions. The model prioritizes identification of exhaustion points over breakout attempts.\n\nSystem Behavior\nThis alert identifies rotational market phases. It is designed to assist in monitoring price stabilization within fixed limits.\n\nDiscipline\nAnticipate rotational behavior; avoid chasing moves at the range boundaries. All decisions are the sole responsibility of the user.",
    'Trend': "Directional Momentum Alignment\n\nCurrent data indicates a sustained directional flow with structural stability.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is currently in a Normal/Standard range (< 18 pts).\n• Observation Note: Price action shows clear higher highs or lower lows. The technical context suggests monitoring for pullbacks to institutional Magnet Levels for trend continuation.\n• Market Structure: High probability of directional follow-through. Technical validation is primarily based on M1 wave alignment.\n\nSystem Behavior\nThis alert identifies phases where momentum outweighs mean-reversion. It is designed to assist in monitoring trend health.\n\nDiscipline\nAvoid counter-trend bias during active regimes. Risk management remains the sole responsibility of the user.",
    'Range': "Mean-Reversion Context Identified\n\nCurrent data indicates a lack of directional momentum, with price oscillating between defined technical boundaries.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is in a Stable/Low range (< 18 pts).\n• Observation Note: Price action shows back-and-forth behavior within a horizontal corridor. Technical context suggests monitoring for rejections at the extremes of the range.\n• Market Structure: High density of \"Magnet Level\" interactions. The model prioritizes identification of exhaustion points over breakout attempts.\n\nSystem Behavior\nThis alert identifies rotational market phases. It is designed to assist in monitoring price stabilization within fixed limits.\n\nDiscipline\nAnticipate rotational behavior; avoid chasing moves at the range boundaries. All decisions are the sole responsibility of the user.",
    'REGIME RANGE': "Mean-Reversion Context Identified\n\nCurrent data indicates a lack of directional momentum, with price oscillating between defined technical boundaries.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is in a Stable/Low range (< 18 pts).\n• Observation Note: Price action shows back-and-forth behavior within a horizontal corridor. Technical context suggests monitoring for rejections at the extremes of the range.\n• Market Structure: High density of \"Magnet Level\" interactions. The model prioritizes identification of exhaustion points over breakout attempts.\n\nSystem Behavior\nThis alert identifies rotational market phases. It is designed to assist in monitoring price stabilization within fixed limits.\n\nDiscipline\nAnticipate rotational behavior; avoid chasing moves at the range boundaries. All decisions are the sole responsibility of the user.",
    'REGIME TREND': "Directional Momentum Alignment\n\nCurrent data indicates a sustained directional flow with structural stability.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is currently in a Normal/Standard range (< 18 pts).\n• Observation Note: Price action shows clear higher highs or lower lows. The technical context suggests monitoring for pullbacks to institutional Magnet Levels for trend continuation.\n• Market Structure: High probability of directional follow-through. Technical validation is primarily based on M1 wave alignment.\n\nSystem Behavior\nThis alert identifies phases where momentum outweighs mean-reversion. It is designed to assist in monitoring trend health.\n\nDiscipline\nAvoid counter-trend bias during active regimes. Risk management remains the sole responsibility of the user.",

    // GET READY
    'pro4x_GetReady': "Structural Zone Identified\n\nThe market has reached a high-density technical coordinate. Analytical parameters suggest a potential shift in liquidity.\n\nTechnical Context & ATR\n\n• Status: This is a pre-analytical notification (GR). It identifies institutional magnet levels before data validation occurs.\n\n• Volatility Filter: The current reaction must be interpreted through the ATR (Hot/Extreme/Panic) to define the required stabilization period.\n\n• Institutional Map: Monitoring focus is now on the 12, 23, 38, 64, or 91 reference layers.\n\nObservation Phase\n\nAwaiting technical reclaim or rejection at the magnet level. This is a monitoring phase, not a directional validation.\n\nPRO TIP: View \"Pro4x Set up Forming\" as a volatility compass. It eliminates noise by focusing your attention on the only numbers that historically influence institutional flow.",
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
    const strategy = String(signal.data?.strategy || signal.strategyLabel || signal.title || 'System Alert').replace(/Signal/gi, '').trim();
    const ticker = String(signal.data?.ticker || signal.data?.pair || signal.pair || 'UNKNOWN');
    let type = String(signal.data?.signal || signal.type || 'ALERT').toUpperCase();

    // Sanitization for Long Backend Messages
    const typeLower = type.toLowerCase();
    const strategyUpper = strategy.toUpperCase();

    if (strategyUpper.includes('PUMP') || typeLower.includes('sell position')) {
        type = 'PARTIAL TP / BULLISH';
    } else if (strategyUpper.includes('PUSH') || typeLower.includes('buy position')) {
        type = 'PARTIAL REACTION / BEARISH';
    } else if (type.length > 15) {
        if (typeLower.includes('short')) type = 'REACTION BEARISH';
        else if (typeLower.includes('long')) type = 'REACTION BULLISH';
        else type = 'ALERT';
    }

    // Theme Colors
    const isBuy = type === 'BUY' || strategy.includes('Buy') || strategy.includes('Bullish') || strategy.includes('Pump');
    const isSell = type === 'SELL' || strategy.includes('Sell') || strategy.includes('Bearish') || strategy.includes('Push');

    let accentColor = '#D4AF37';
    if (isBuy) accentColor = '#4ADE80';
    if (isSell) accentColor = '#EF4444';
    if (strategy.includes('GetReady') || strategy.includes('Forming')) accentColor = '#FFD700'; // Force Gold for Get Ready / Forming

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
    const tp = signal.data?.tp;
    const sl = signal.data?.sl;
    const hasRefLevels = tp && sl && tp !== 'OPEN' && sl !== 'OPEN';
    const isDemoPnL = signal.isDemoPnL;

    // MESSAGE ENRICHMENT LOGIC
    let finalBody = signal.data?.message || signal.body;

    // If message is short or missing, try to enrich it with educational content
    if (!finalBody || finalBody.length < 50) {
        let contentKey = strategy;
        const sLower = strategy.toLowerCase();
        const bUpper = (signal.data?.message || signal.body || '').toUpperCase();

        // 1. PRIORITIZE REGIME DETECTION
        if (sLower.includes('regime') || sLower.includes('vol_regime')) {
            if (sLower.includes('trend') || bUpper.includes('DIRECTIONAL') || bUpper.includes('MOMENTUM') || (bUpper.includes('TREND') && !bUpper.includes('RANGE'))) {
                contentKey = 'vol_Regime_Trend';
            } else if (sLower.includes('range') || bUpper.includes('REVERSION') || bUpper.includes('MEAN') || bUpper.includes('HORIZONTAL') || bUpper.includes('RANGE')) {
                contentKey = 'vol_Regime_Range';
            }
        }

        // 2. TRY DIRECT OR FUZZY MATCH
        if (STRATEGY_CONTENT[contentKey]) {
            finalBody = STRATEGY_CONTENT[contentKey];
        } else {
            // IMPROVED FUZZY MATCH (Bidirectional)
            const match = Object.keys(STRATEGY_CONTENT).find(k =>
                sLower.includes(k.toLowerCase()) || k.toLowerCase().includes(sLower)
            );
            if (match) finalBody = STRATEGY_CONTENT[match];
        }
    }

    // SANITIZE FINAL BODY: Replace "Entry Price" or "entry" in generic cases
    if (finalBody) {
        finalBody = finalBody.replace(/entry price/gi, 'level alignment')
            .replace(/signal price/gi, 'level alignment')
            .replace(/execution price/gi, 'level alignment');
    }


    // Icon selection logic (STRICT ARROWS)
    let iconName: keyof typeof Ionicons.glyphMap = "pulse";

    if (strategy.includes('GetReady') || strategy.includes('Setup Forming') || strategy.includes('Forming')) {
        iconName = "pulse";
    } else {
        // DEFAULT TO ARROWS FOR EVERYTHING ELSE
        if (isBuy) iconName = "trending-up-outline";
        else if (isSell) iconName = "trending-down-outline";
        else iconName = "pulse"; // True fallback only
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
            "Risk Discipline",
            "Technical Note",
            "Framework & ATR Context",
            "ATR & Technical Context",
            "Market Structure",
            "System Behavior",
            "Discipline",
            "Directional Momentum Alignment",
            "Mean-Reversion Context Identified"
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
                                        {(signal.data?.title || signal.title || strategy.replace('Entry', '').replace('_', ' ').trim())
                                            .replace(/Buy/g, 'Bullish').replace(/Sell/g, 'Bearish')
                                            .replace(/BUY/g, 'BULLISH').replace(/SELL/g, 'BEARISH')
                                            .replace(/Signal/gi, '').trim()}
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
                                        <Text style={styles.label}>LEVEL ALIGNMENT</Text>
                                        <Text style={styles.value}>{price}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>TIME / TF</Text>
                                        <Text style={styles.value}>{signal.time || 'NOW'} • {signal.data?.timeframe || 'M1'}</Text>
                                    </View>
                                    {hasRefLevels && (
                                        <View style={styles.row}>
                                            <Text style={styles.label}>REF LEVELS</Text>
                                            <Text style={styles.value}>{tp} / {sl}</Text>
                                        </View>
                                    )}
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
                                            This is <Text style={{ fontWeight: 'bold' }}>the most powerful</Text> analytical detection in the app. Many traders focus solely on these alerts to reach their daily targets.
                                        </Text>
                                    </View>
                                )}

                                {/* 4. BODY with STRUCTURED RENDERING */}
                                {renderStructuredBody(finalBody)}


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
