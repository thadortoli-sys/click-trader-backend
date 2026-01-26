import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Switch, FlatList, StatusBar, Dimensions, TouchableOpacity, Animated, Easing, Platform, Image, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemedButton } from '../components/ThemedButton';
import { GlassCard } from '../components/GlassCard';
import { HolographicGradient } from '../components/HolographicGradient';
import { registerForPushNotificationsAsync, sendSettingsToBackend } from '../utils/notifications';
import { getSettings, saveSettings, SignalKey } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { PremiumTeaserOverlay } from '../components/PremiumTeaserOverlay';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

interface SignalItem {
    key: SignalKey;
    label: string;
    description: string | React.ReactNode;
    icon: keyof typeof Ionicons.glyphMap;
    badge?: string;
    color?: string;
    fullText?: boolean;
    guideTarget?: string; // New Link Key
}

// 1. BEGINNER — "TRAVEL LIGHT"
// 1. PRO4X SYSTEM (CLASSIC)
// 1. BEGINNER (PRO4X.2)
const BEGINNER_ITEMS: SignalItem[] = [

    {
        key: 'pro4xx_Buy',
        guideTarget: 'PRO4X',
        label: 'Pro4x.2 Bullish',
        description: 'Trend Following. High probability alignment. Monitors institutional market flow.',
        icon: 'trending-up-outline',
        color: '#4ADE80'
    },
    {
        key: 'pro4xx_Sell',
        guideTarget: 'PRO4X',
        label: 'Pro4x.2 Bearish',
        description: 'Trend Following. High probability alignment. Monitors institutional market flow.',
        icon: 'trending-down-outline',
        color: '#FF5252'
    },
];

// 2. INTERMEDIATE (PRO4X & HORUS)
const INTERMEDIATE_ITEMS: SignalItem[] = [
    {
        key: 'pro4x_GetReady',
        guideTarget: 'PRO4X',
        label: 'PRO4X – Set up Forming',
        description: 'Key price levels have been reached.\nDepending on the broader context, this setup highlights a potential short-term reaction zone.\nThis setup serves as a pre-analytical notification, indicating that market conditions are aligning for a potential reaction zone.',
        icon: 'pulse-outline', // Amber
        color: '#FFC107'
    },
    {
        key: 'pro4x_Buy',
        guideTarget: 'PRO4X',
        label: 'PRO4X – Bullish Setup',
        description: 'This setup indicates that technical bullish conditions have been met based on the PRO4X model.\nAnalytical parameters are aligned around a key level alignment, highlighting a potential directional market bias.',
        icon: 'trending-up-outline',
        color: '#4ADE80'
    },
    {
        key: 'pro4x_Sell',
        guideTarget: 'PRO4X',
        label: 'PRO4X – Bearish Setup',
        description: 'This setup indicates that technical bearish conditions have been met based on the PRO4X model.\nAnalytical parameters are aligned around a key level alignment, highlighting a potential directional market bias.',
        icon: 'trending-down-outline',
        color: '#FF5252'
    },


];

// 3. ADVANCED (HIGH-VELOCITY & SHADOW)
const ADVANCED_ITEMS: SignalItem[] = [
    {
        key: 'shadow_Buy',
        guideTarget: 'SHADOW_MODE',
        label: 'Shadow BULLISH',
        description: 'Liquidity Sweep Detection. High volatility setup.',
        icon: 'moon-outline',
        color: '#9CA3AF'
    },
    {
        key: 'shadow_Sell',
        guideTarget: 'SHADOW_MODE',
        label: 'Shadow BEARISH',
        description: 'Liquidity Sweep Detection. High volatility setup.',
        icon: 'moon-outline',
        color: '#9CA3AF'
    },
    {
        key: 'horus_Buy',
        guideTarget: 'HORUS',
        label: 'Horus Bullish',
        description: 'Reversal Analysis tool. Monitors potential bottoms/tops through high-density technical parameters.',
        icon: 'eye-outline', // Changed to outline
        color: '#4ADE80'
    },
    {
        key: 'horus_Sell',
        guideTarget: 'HORUS',
        label: 'Horus Bearish',
        description: 'Reversal Analysis tool. Monitors potential bottoms/tops through high-density technical parameters.',
        icon: 'eye-outline', // Changed to outline
        color: '#FF5252'
    },
    {
        key: 'horus_Adv_Buy',
        guideTarget: 'HORUS_ADV',
        label: 'Horus ADV Bullish',
        description: 'Setup Precision (Bullish). Based on high-density technical alignment.',
        icon: 'flash',
        color: '#00FF9D'
    },
    {
        key: 'horus_Adv_Sell',
        guideTarget: 'HORUS_ADV',
        label: 'Horus ADV Bearish',
        description: 'Setup Precision (Bearish). Based on high-density technical alignment.',
        icon: 'flash',
        color: '#FF5252'
    },
    {
        key: 'scalp_OverSold',
        guideTarget: 'HIGH VELOCITY DATA',
        label: 'Horus OVS',
        description: 'Fast reaction technical zone (Bullish). Typical range 10-15 points.',
        icon: 'flash-outline',
        color: '#00FF9D'
    },
    {
        key: 'scalp_OverBought',
        guideTarget: 'HIGH VELOCITY DATA',
        label: 'Horus OVB',
        description: 'Fast reaction technical zone (Bearish). Typical range 10-15 points.',
        icon: 'flash-outline',
        color: '#FF5252'
    }
];

// 4. CONTEXT INFO
const CONTEXT_ITEMS: SignalItem[] = [
    {
        key: 'scalp_TakeProfitPump',
        guideTarget: 'HIGH VELOCITY DATA',
        label: 'Re-integration Bullish',
        description: 'Price extended from MA 50. Statistical probability of mean reversion.',
        icon: 'arrow-up-circle-outline',
        color: '#FFD700'
    },
    {
        key: 'scalp_TakeProfitPush',
        guideTarget: 'HIGH VELOCITY DATA',
        label: 'Re-integration Bearish',
        description: 'Price extended from MA 50. Statistical probability of mean reversion.',
        icon: 'arrow-down-circle-outline',
        color: '#FFD700'
    },
    {
        key: 'h1_SyncroBullish',
        guideTarget: 'Syncro Long (H1) — SPX / ES / NQ',
        label: 'Syncro Bullish (H1)',
        description: 'Context Setup. Major trend alignment. High probability institutional flow.',
        icon: 'caret-up-outline',
        color: '#4ADE80'
    },
    {
        key: 'h1_SyncroBearish',
        guideTarget: 'Syncro Short (H1) — SPX / ES / NQ',
        label: 'Syncro Bearish (H1)',
        description: 'Context Setup. Major trend alignment. High probability institutional flow.',
        icon: 'caret-down-outline',
        color: '#EF4444'
    },

    {
        key: 'vol_High',
        guideTarget: undefined,
        label: 'Context: HOT',
        description: (
            <View>
                <Text style={{ color: '#F59E0B', fontSize: 11, fontWeight: 'bold', marginBottom: 4 }}>HIGH VOLATILITY (ATR M1 ≈ 18–20 pts):</Text>
                <Text style={{ color: '#ccc', fontSize: 12 }}>“Active Volatility: Increased probability of price sweeps. The technical context suggestion monitoring stabilization after 1–3 M1 candles as a common technical baseline.”</Text>
            </View>
        ),
        icon: 'flame-outline',
        color: '#F59E0B'
    },
    {
        key: 'vol_Extreme',
        guideTarget: undefined,
        label: 'Context: EXTREME',
        description: (
            <View>
                <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: 'bold', marginBottom: 4 }}>EXTREME (ATR M1 ≈ 20–23 pts):</Text>
                <Text style={{ color: '#ccc', fontSize: 12, marginBottom: 8 }}>“Fast Market Conditions: Frequent overshoots detected. Technical context suggests monitoring 3–5 M1 candles or a clear sweep-and-reclaim structure for data alignment.”</Text>
                <Text style={{ color: '#aaa', fontSize: 11, fontStyle: 'italic', marginTop: 4 }}>Analysis Note: Monitoring 2 to 3 waves on the M1 timeframe is a primary requirement for technical validation if extreme or panic conditions are present.</Text>
            </View>
        ),
        icon: 'warning-outline',
        color: '#EF4444'
    },
    {
        key: 'vol_Panic',
        guideTarget: undefined,
        label: 'Context: PANIC',
        description: (
            <View>
                <Text style={{ color: '#8B5CF6', fontSize: 11, fontWeight: 'bold', marginBottom: 4 }}>PANIC (ATR M1 ≥ 23 pts):</Text>
                <Text style={{ color: '#ccc', fontSize: 12 }}>“Extreme Volatility: Significant overshoot risk. High-density analysis suggests observing 5–8 M1 candles or a strong price reclaim; otherwise, trend continuation is statistically common.”</Text>
                <Text style={{ color: '#aaa', fontSize: 11, fontStyle: 'italic', marginTop: 4 }}>Analysis Note: Monitoring 2 to 3 waves on the M1 timeframe is a primary requirement for technical validation if extreme or panic conditions are present.</Text>
            </View>
        ),
        icon: 'nuclear-outline', // Or alert-circle-outline if unavailable
        color: '#8B5CF6'
    },
    {
        key: 'vol_Regime',
        guideTarget: undefined,
        label: 'Regime: TREND / RANGE',
        description: (
            <View>
                <Text style={{ color: '#ccc', fontSize: 12, marginBottom: 4 }}><Text style={{ color: '#10B981', fontWeight: 'bold' }}>TREND:</Text> Momentum / Directional behavior.</Text>
                <Text style={{ color: '#ccc', fontSize: 12 }}><Text style={{ color: '#A855F7', fontWeight: 'bold' }}>RANGE:</Text> Mean-reversion / Back-and-forth behavior.</Text>
            </View>
        ),
        icon: 'compass-outline',
        color: '#A855F7'
    },
];

const StatusBadge = ({ label }: { label: string }) => (
    <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>{label}</Text>
    </View>
);

const SectionTitle = ({ title }: { title: string }) => (
    <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>{title}</Text>
        <LinearGradient
            colors={['#333', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 1, flex: 1, marginLeft: 15 }}
        />
    </View>
);

// Add component imports if needed (ensure TouchableOpacity, View, Text are imported)


const SignalCard = React.memo(({ item, value, onToggle, index }: { item: SignalItem, value: boolean, onToggle: () => void, index: number }) => {
    const router = useRouter(); // Use router
    // ... animation logic ...
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (value) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 1500,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.ease)
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.ease)
                    })
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [value]);

    const opacity = value ? 1 : 0.5;
    const scale = value ? pulseAnim : 1;

    // Render description safely
    const renderDescription = () => {
        if (typeof item.description === 'string') {
            return <Text style={[styles.cardDescription, !value && { color: '#666' }]} numberOfLines={undefined}>{item.description}</Text>;
        }
        return <View style={{ marginTop: 2, opacity: value ? 0.9 : 0.5 }}>{item.description}</View>;
    };

    return (
        <View style={{ marginBottom: 15 }}>
            <TouchableOpacity activeOpacity={0.9} onPress={onToggle}>
                <GlassCard
                    intensity={20}
                    borderColor="#FFFFFF"
                    borderWidth={0.1}
                    borderRadius={16}
                    disableGradient={true}
                    style={{ minHeight: 180, height: undefined, padding: 0, overflow: 'hidden' }}
                    contentStyle={{ padding: 0 }}
                >

                    {/* ... Gradients ... */}
                    <LinearGradient
                        colors={['#1A1A1A', '#000000']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={[StyleSheet.absoluteFill, { zIndex: -2 }]}
                    />
                    <LinearGradient
                        colors={['rgba(255,255,255,0.15)', 'rgba(0,0,0,0)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 0.4 }}
                        style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
                    />

                    <View style={styles.cardContent}>
                        <View style={[styles.cardIconRow, { marginBottom: 12 }]}>
                            <View style={[
                                styles.iconBox,
                                value ? {
                                    borderColor: '#333333', // Visible rim to define the black "hole"
                                    backgroundColor: '#000000', // Pure Black for depth
                                } : {
                                    backgroundColor: '#050505',
                                    borderColor: '#333',
                                }
                            ]}>
                                <Animated.View style={[{ alignItems: 'center', justifyContent: 'center', opacity, transform: [{ scale }] }]}>
                                    <Ionicons name={item.icon} size={20} color={value ? (item.color || "#FFF") : "#444"} style={{ opacity: value ? 0.6 : 1 }} />
                                </Animated.View>
                            </View>

                            <Switch
                                trackColor={{ false: "#111", true: "#333" }}
                                thumbColor={value ? "#E0E0E0" : "#000000"} // Active: Light Gray, Inactive: Black
                                ios_backgroundColor="#111"
                                onValueChange={onToggle}
                                value={value}
                                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                            />
                        </View>

                        <View style={styles.cardTextRow}>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                                    <Text style={[styles.cardLabel, value ? { color: 'white' } : { color: '#666' }]}>{item.label}</Text>
                                    {item.badge && <StatusBadge label={item.badge} />}
                                </View>
                                {renderDescription()}
                            </View>
                        </View>

                        {/* BOTTOM MASTER GUIDE BUTTON */}
                        {item.guideTarget && (
                            <View style={{ marginTop: 15, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={styles.tapIndicator}
                                    onPress={() => router.push({ pathname: '/guide-manual-v3', params: { target: item.guideTarget } })}
                                >
                                    <Ionicons name="book-outline" size={12} color="#D4AF37" />
                                    <Text style={styles.tapText}>MASTER GUIDE</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </GlassCard>
            </TouchableOpacity>
        </View>
    );
});

export default function SettingsScreen() {
    const router = useRouter();
    const { isPro } = useAuth();
    const [pushToken, setPushToken] = useState<string | undefined>('');
    const [selectedImage, setSelectedImage] = useState<any>(null); // For Zoom Modal

    // Load settings on mount
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setPushToken(token));

        getSettings().then(settings => {
            if (settings.signals) {
                setSignals(prev => ({ ...prev, ...settings.signals }));
                // Sync initial settings if token is already known or when it becomes known
                if (pushToken) {
                    sendSettingsToBackend(pushToken, settings.signals, isPro);
                }
            }
        });
    }, [pushToken]); // Re-run when pushToken is acquired to sync initial state

    const [signals, setSignals] = useState<Record<SignalKey, boolean>>({
        // PRO4XX.2
        pro4xx_Buy: true, pro4xx_Sell: true,
        pro4xx_GetReady_Buy: true, pro4xx_GetReady_Sell: true,
        pro4xx_GetReady: true,

        pro4x_GetReady: true, pro4x_Buy: true, pro4x_Sell: true,
        horus_GetReady: true, horus_Buy: true, horus_Sell: true,
        horus_Adv_Buy: true, horus_Adv_Sell: true,

        // Shadow (New Section)
        shadow_Buy: true,
        shadow_Sell: true,

        // HIGH VELOCITY
        scalp_OverSold: true, scalp_OverBought: true,
        scalp_TakeProfitPump: true, scalp_TakeProfitPush: true,
        scalp_SyncroResBuy: true, scalp_SyncroResSell: true,

        h1_SyncroBullish: true, h1_SyncroBearish: true,
        m1_SyncroBullish: true, m1_SyncroBearish: true,
        vol_Low: true, vol_High: true, vol_Extreme: true, vol_Panic: true, vol_Regime: true,
        info_SupportBuy: true, info_SupportSell: true,
    });

    const toggleAll = useCallback(async (value: boolean) => {
        setSignals(prev => {
            const newState = { ...prev };
            (Object.keys(newState) as SignalKey[]).forEach(key => {
                newState[key] = value;
            });
            saveSettings({ signals: newState });
            if (pushToken) {
                sendSettingsToBackend(pushToken, newState);
            }
            return newState;
        });
    }, [pushToken]);

    const toggleSignal = useCallback(async (key: SignalKey) => {
        setSignals(prev => {
            const newState = { ...prev, [key]: !prev[key] };
            saveSettings({ signals: newState });
            if (pushToken) {
                sendSettingsToBackend(pushToken, newState);
            }
            return newState;
        });
    }, [pushToken]);

    const activeCount = Object.values(signals).filter(Boolean).length;
    const totalCount = Object.keys(signals).length;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Teaser Overlay if NOT Pro */}
            {!isPro && <PremiumTeaserOverlay message="SETTINGS LOCKED" />}

            {/* Holographic Background */}
            <HolographicGradient speed={6000} />

            <FlatList
                contentContainerStyle={styles.scrollContent}
                data={[]}
                renderItem={null}
                ListHeaderComponent={() => (
                    <View style={{ paddingBottom: 100 }}>
                        <View style={styles.header}>
                            <View>
                                <Text style={[styles.headerTitle, { fontSize: 24, marginBottom: 2, fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif' }]}>SETTING PARAMETERS</Text>
                                <Text style={styles.headerTitle}>PRO4X & HORUS SYSTEM</Text>
                                <Text style={styles.headerSubtitle}>{activeCount} / {totalCount} Active Filters</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={{
                                    width: 40, height: 40,
                                    alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 20
                                }}
                            >
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View pointerEvents={isPro ? 'auto' : 'none'}>
                            {/* STRATEGY CONTRADICTION WARNING (BLUE BUBBLE) */}
                            <View style={{
                                marginBottom: 20,
                                padding: 12,
                                backgroundColor: 'rgba(59, 130, 246, 0.15)', // Lighter Blue
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: 'rgba(59, 130, 246, 0.3)',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <Ionicons name="bulb-outline" size={20} color="#60A5FA" style={{ marginRight: 10 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: '#60A5FA', fontSize: 11, fontWeight: '600', letterSpacing: 0.5 }}>
                                        STRATEGY TIP: Enabling all setups is not required. Users can select the strategies that fit their analytical profile. Be aware that different strategies may show contradictory momentum readings at the same time. For example, PRO4X.2 is a Trending system, while Shadow Mode may identify a potential counter-trend reversal simultaneously.
                                    </Text>
                                    <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 11, fontWeight: '500', marginTop: 8 }}>
                                        Market inversion operate around 11/12 am US (17h/18h EU).
                                    </Text>
                                </View>
                            </View>

                            {/* Master Switch & Guide */}
                            <View style={{ flexDirection: 'row', marginHorizontal: -5, marginBottom: 20 }}>
                                <View style={{ flex: 1, padding: 5 }}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => toggleAll(activeCount < totalCount)}
                                    >
                                        <GlassCard
                                            intensity={activeCount === totalCount ? 25 : 15}
                                            glowColor={activeCount === totalCount ? 'rgba(255, 255, 255, 0.3)' : undefined}
                                            borderColor="#FFFFFF"
                                            borderWidth={0.1}
                                            borderRadius={16}
                                            disableGradient={true}
                                            style={{ height: 60, padding: 0, justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            <LinearGradient
                                                colors={['rgba(255,255,255,0.1)', 'rgba(0,0,0,0)']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 0, y: 1 }}
                                                style={StyleSheet.absoluteFill}
                                                pointerEvents="none"
                                            />
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                <Ionicons name="power" size={20} color={activeCount === totalCount ? '#FFFFFF' : '#666'} />
                                                <Text style={{
                                                    color: activeCount === totalCount ? '#FFFFFF' : '#888',
                                                    fontWeight: 'bold',
                                                    fontSize: 12,
                                                    letterSpacing: 1
                                                }}>
                                                    {activeCount === totalCount ? "RESET SYSTEM" : "ENABLE ALL"}
                                                </Text>
                                            </View>
                                        </GlassCard>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, padding: 5 }}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => router.push('/guide-manual-v3')}
                                    >
                                        <GlassCard
                                            intensity={15}
                                            borderColor="#FFFFFF"
                                            borderWidth={0.1}
                                            borderRadius={16}
                                            disableGradient={true}
                                            style={{ height: 60, padding: 0, justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            <LinearGradient
                                                colors={['rgba(255,255,255,0.1)', 'rgba(0,0,0,0)']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 0, y: 1 }}
                                                style={StyleSheet.absoluteFill}
                                                pointerEvents="none"
                                            />
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                <Ionicons name="book-outline" size={20} color="#FFFFFF" />
                                                <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 }}>SETUP GUIDE</Text>
                                            </View>
                                        </GlassCard>
                                    </TouchableOpacity>
                                </View>
                            </View>



                            {/* MARKET OPEN WARNING */}
                            <View style={{
                                marginBottom: 20,
                                padding: 12,
                                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 165, 0, 0.3)',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <Ionicons name="warning-outline" size={20} color="#FFA500" style={{ marginRight: 10 }} />
                                <Text style={{ color: '#FFA500', fontSize: 11, flex: 1, fontWeight: '600', letterSpacing: 0.5 }}>
                                    NOTICE: Market opens at 9:30 AM. Setups are optimized for active market hours.
                                </Text>
                            </View>

                            {/* SECTION 1: BEGINNER */}
                            <SectionTitle title="BEGINNER (TRAVEL LIGHT)" />
                            <Text style={{ color: '#888', fontSize: 11, marginBottom: 15, paddingHorizontal: 5 }}>
                                This configuration focuses on PRO4X.2 using a 'travel light' approach. Limiting the number of active setups is recommended to reduce notification noise. This mode emphasizes trend-following market structure and broader directional context. Price reactions are typically observed around key institutional levels, with move magnitudes commonly ranging from approximately 20 to 200 points, depending on volatility and market conditions. A low-stress approach is maintained. Risk Management Note: Many market participants define a predefined risk threshold, often around 50 points, to help limit exposure during short-term volatility. Reference Levels: 12 / 64 / 91 are key reference levels often associated with historical price volatility areas.
                            </Text>
                            <View style={styles.gridContainer}>
                                {BEGINNER_ITEMS.map((item, index) => (
                                    <View key={item.key} style={styles.gridItem}>
                                        <SignalCard
                                            item={item}
                                            value={signals[item.key]}
                                            onToggle={() => toggleSignal(item.key)}
                                            index={index}
                                        />
                                    </View>
                                ))}
                            </View>

                            {/* SECTION 2: INTERMEDIATE */}
                            <SectionTitle title="INTERMEDIATE (Setup Analysis)" />
                            <Text style={{ color: '#888', fontSize: 11, marginBottom: 15, paddingHorizontal: 5 }}>
                                This configuration utilizes the Magnet Map logic. Features pre-setups and notifications triggered when PRO4X analytical parameters are met. To maintain focus, silencing secondary setups is often preferred (keeping PRO4X.2 active). Identification of key institutional price levels is prioritized. Invalidation logic: ~30 pts below the setup reference. Note: 12/64/91 are the primary technical reference numbers.
                            </Text>
                            <View style={styles.gridContainer}>
                                {INTERMEDIATE_ITEMS.map((item, index) => (
                                    <View key={item.key} style={styles.gridItem}>
                                        <SignalCard
                                            item={item}
                                            value={signals[item.key]}
                                            onToggle={() => toggleSignal(item.key)}
                                            index={index + 10}
                                        />
                                    </View>
                                ))}
                            </View>

                            {/* SECTION 3: ADVANCED */}
                            <SectionTitle title="ADVANCED (HIGH PRECISION VOLATILITY ANALYSIS)" />
                            <Text style={{ color: '#888', fontSize: 11, marginBottom: 15, paddingHorizontal: 5 }}>
                                Mapping the liquidity. For advanced analysis. Counter-trend & high-density technical moves.
                                <Text style={{ color: '#F59E0B', fontWeight: 'bold' }}>{"\n\n"}⚠️ CONTEXT CROSS-REFERENCE: Shadow & Horus readings should be analyzed alongside Context Alerts (Section 4) for optimal technical precision.</Text>
                                {"\n"}Designed to assist with TP & SL planning (near entries). Requires fast analysis. Strong trend protocol: involves trend monitoring or waiting for key institutional reversal numbers.
                            </Text>
                            <View style={styles.gridContainer}>
                                {ADVANCED_ITEMS.map((item, index) => (
                                    <View key={item.key} style={styles.gridItem}>
                                        <SignalCard
                                            item={item}
                                            value={signals[item.key]}
                                            onToggle={() => toggleSignal(item.key)}
                                            index={index + 20}
                                        />
                                    </View>
                                ))}
                            </View>

                            {/* SECTION 4: CONTEXT INFO */}
                            <SectionTitle title="CONTEXT INFO" />
                            <Text style={{ color: '#888', fontSize: 11, marginBottom: 15, paddingHorizontal: 5 }}>
                                Global Market Direction & Support/Resistance context.
                            </Text>
                            <View style={styles.gridContainer}>
                                {CONTEXT_ITEMS.map((item, index) => (
                                    <View key={item.key} style={styles.gridItem}>
                                        <SignalCard
                                            item={item}
                                            value={signals[item.key]}
                                            onToggle={() => toggleSignal(item.key)}
                                            index={index + 30}
                                        />
                                    </View>
                                ))}
                            </View>

                            {/* SECTION 5: CHART CONFIGURATION */}
                            <SectionTitle title="CHART CONFIGURATION" />
                            <Text style={{ color: '#888', fontSize: 11, marginBottom: 15, paddingHorizontal: 5 }}>
                                How to set up your analysis platform for optimal chart reading.
                            </Text>

                            <GlassCard
                                intensity={15}
                                borderColor="rgba(255, 255, 255, 0.2)"
                                borderWidth={0.5}
                                borderRadius={16}
                                disableGradient={true}
                                style={{ marginBottom: 30, padding: 15 }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                                    <View style={{
                                        width: 36, height: 36, borderRadius: 10,
                                        backgroundColor: 'rgba(30, 41, 59, 0.4)',
                                        justifyContent: 'center', alignItems: 'center',
                                        marginRight: 12
                                    }}>
                                        <Ionicons name="stats-chart" size={20} color="#94A3B8" />
                                    </View>
                                    <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>Chart Setup</Text>
                                </View>

                                {/* SWIPABLE GALLERY */}
                                <View style={{ marginBottom: 25 }}>
                                    <FlatList
                                        data={[
                                            { id: '1', source: require('../assets/images/chart_overview.png'), title: 'Global Overview', type: 'wide' },
                                            { id: '9', source: require('../assets/images/chart_es_m15.png'), title: 'ES M15 Setup', type: 'wide' },
                                            { id: '10', source: require('../assets/images/chart_sp500_h1.png'), title: 'SP500 H1 Context', type: 'wide' },
                                            { id: '11', source: require('../assets/images/chart_us100_h1.png'), title: 'US100 H1 Context', type: 'wide' },
                                            { id: '2', source: require('../assets/images/vpvr_inputs.png'), title: 'VPVR Inputs', type: 'ui' },
                                            { id: '3', source: require('../assets/images/vpvr_style.png'), title: 'VPVR Style', type: 'ui' },
                                            { id: '4', source: require('../assets/images/ma_inputs.png'), title: 'MA Inputs', type: 'ui' },
                                            { id: '5', source: require('../assets/images/ma_style.png'), title: 'MA Style', type: 'ui' },
                                            { id: '6', source: require('../assets/images/rsi_inputs.png'), title: 'RSI Inputs', type: 'ui' },
                                            { id: '7', source: require('../assets/images/rsi_style.png'), title: 'RSI Style', type: 'ui' },
                                            { id: '8', source: require('../assets/images/atr_inputs.png'), title: 'ATR Settings', type: 'ui' },
                                        ]}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                activeOpacity={0.9}
                                                onPress={() => setSelectedImage(item)}
                                                style={{ width: width - 80, marginRight: 12 }}
                                            >
                                                <View style={{
                                                    backgroundColor: '#050505',
                                                    borderRadius: 16,
                                                    overflow: 'hidden',
                                                    borderWidth: 1,
                                                    borderColor: 'rgba(96, 165, 250, 0.2)',
                                                    elevation: 8,
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 6 },
                                                    shadowOpacity: 0.4,
                                                    shadowRadius: 8
                                                }}>
                                                    <Image
                                                        source={item.source}
                                                        style={{
                                                            width: '100%',
                                                            height: 240,
                                                        }}
                                                        resizeMode={item.type === 'ui' ? "contain" : "cover"}
                                                    />
                                                    <LinearGradient
                                                        colors={['transparent', 'rgba(0,0,0,0.9)']}
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            height: 50,
                                                            justifyContent: 'center',
                                                            paddingHorizontal: 15
                                                        }}
                                                    >
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Ionicons name="scan-outline" size={12} color="#60A5FA" style={{ marginRight: 6 }} />
                                                            <Text style={{ color: '#FFF', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5, textTransform: 'uppercase' }}>{item.title}</Text>
                                                        </View>
                                                    </LinearGradient>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15, gap: 8 }}>
                                        <View style={{ width: 15, height: 1, backgroundColor: 'rgba(212, 175, 55, 0.5)', borderRadius: 1 }} />
                                        <Text style={{ color: '#D4AF37', fontSize: 10, fontWeight: '600', letterSpacing: 1.5 }}>TAP TO ZOOM · SWIPE GALLERY</Text>
                                        <View style={{ width: 15, height: 1, backgroundColor: 'rgba(212, 175, 55, 0.5)', borderRadius: 1 }} />
                                    </View>
                                </View>

                                {/* ZOOM MODAL */}
                                <Modal
                                    visible={!!selectedImage}
                                    transparent={true}
                                    animationType="fade"
                                    onRequestClose={() => setSelectedImage(null)}
                                >
                                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            style={StyleSheet.absoluteFill}
                                            activeOpacity={1}
                                            onPress={() => setSelectedImage(null)}
                                        />
                                        {selectedImage && (
                                            <View style={{ width: '100%', height: '80%', padding: 10 }}>
                                                <Image
                                                    source={selectedImage.source}
                                                    style={{ width: '100%', height: '100%' }}
                                                    resizeMode="contain"
                                                />
                                                <View style={{ position: 'absolute', top: 20, right: 20 }}>
                                                    <TouchableOpacity
                                                        onPress={() => setSelectedImage(null)}
                                                        style={{
                                                            width: 44, height: 44,
                                                            borderRadius: 22,
                                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                                            alignItems: 'center', justifyContent: 'center'
                                                        }}
                                                    >
                                                        <Ionicons name="close" size={28} color="#FFF" />
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' }}>
                                                    <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>{selectedImage.title}</Text>
                                                    <Text style={{ color: '#888', fontSize: 12, marginTop: 4 }}>Tap anywhere to close</Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </Modal>

                            </GlassCard>

                            <GlassCard
                                intensity={15}
                                borderColor="rgba(255, 255, 255, 0.2)"
                                borderWidth={0.5}
                                borderRadius={16}
                                disableGradient={true}
                                style={{ marginBottom: 30, padding: 15 }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                                    <View style={{ width: 4, height: 16, backgroundColor: '#D4AF37', borderRadius: 2, marginRight: 8 }} />
                                    <Text style={{ color: '#D4AF37', fontSize: 13, fontWeight: '700', letterSpacing: 1 }}>SETTINGS VALUES</Text>
                                </View>

                                <View style={{ gap: 14 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#475569', marginTop: 7, marginRight: 12 }} />
                                        <Text style={{ color: '#E0E0E0', fontSize: 13, flex: 1, lineHeight: 20 }}>
                                            <Text style={{ fontWeight: 'bold', color: '#FFF' }}>Execution:</Text> <Text style={{ color: '#FFF', fontWeight: '400' }}>1000T</Text> or <Text style={{ color: '#FFF', fontWeight: '400' }}>M1</Text> (Timeframe).
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#475569', marginTop: 7, marginRight: 12 }} />
                                        <Text style={{ color: '#E0E0E0', fontSize: 13, flex: 1, lineHeight: 20 }}>
                                            <Text style={{ fontWeight: 'bold', color: '#FFF' }}>Volume Profile (VPVR):</Text> Row Layout: <Text style={{ color: '#FFF', fontWeight: '400' }}>Number of Rows</Text>. Row Size: <Text style={{ color: '#FFF', fontWeight: '400' }}>40</Text>. Volume: <Text style={{ color: '#FFF', fontWeight: '400' }}>Delta</Text>. VA Volume: <Text style={{ color: '#FFF', fontWeight: '400' }}>70</Text>. Style: Right, 37%.
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#475569', marginTop: 7, marginRight: 12 }} />
                                        <Text style={{ color: '#E0E0E0', fontSize: 13, flex: 1, lineHeight: 20 }}>
                                            <Text style={{ fontWeight: 'bold', color: '#FFF' }}>Moving Average (MA):</Text> Length: <Text style={{ color: '#FFF', fontWeight: '400' }}>200</Text>. Source: <Text style={{ color: '#FFF', fontWeight: '400' }}>Close</Text>. Method: <Text style={{ color: '#FFF', fontWeight: '400' }}>SMA</Text>.
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#475569', marginTop: 7, marginRight: 12 }} />
                                        <Text style={{ color: '#E0E0E0', fontSize: 13, flex: 1, lineHeight: 20 }}>
                                            <Text style={{ fontWeight: 'bold', color: '#FFF' }}>RSI Indicator:</Text> Length: <Text style={{ color: '#FFF', fontWeight: '400' }}>7</Text>. Upper Limit: <Text style={{ color: '#FFF', fontWeight: '400' }}>80</Text>. Lower Limit: <Text style={{ color: '#FFF', fontWeight: '400' }}>20</Text>.
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#475569', marginTop: 7, marginRight: 12 }} />
                                        <Text style={{ color: '#E0E0E0', fontSize: 13, flex: 1, lineHeight: 20 }}>
                                            <Text style={{ fontWeight: 'bold', color: '#FFF' }}>Timeframe & ATR:</Text> Use <Text style={{ color: '#FFF', fontWeight: '400' }}>M1</Text> for entry and <Text style={{ color: '#FFF', fontWeight: '400' }}>H1</Text> for context. ATR Period: <Text style={{ color: '#FFF', fontWeight: '400' }}>14</Text>.
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#475569', marginTop: 7, marginRight: 12 }} />
                                        <Text style={{ color: '#E0E0E0', fontSize: 13, flex: 1, lineHeight: 20 }}>
                                            <Text style={{ fontWeight: 'bold', color: '#FFF' }}>Pivots:</Text> Monitor <Text style={{ color: '#FFF', fontWeight: '400' }}>H4</Text>, <Text style={{ color: '#FFF', fontWeight: '400' }}>Daily</Text>, and <Text style={{ color: '#FFF', fontWeight: '400' }}>Weekly</Text> levels.
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#475569', marginTop: 7, marginRight: 12 }} />
                                        <Text style={{ color: '#E0E0E0', fontSize: 13, flex: 1, lineHeight: 20 }}>
                                            <Text style={{ fontWeight: 'bold', color: '#FFF' }}>Charts:</Text> Open <Text style={{ color: '#FFF', fontWeight: '400' }}>ES Futures</Text> (H1), <Text style={{ color: '#FFF', fontWeight: '400' }}>SPX Cash</Text> (M15/M5), and <Text style={{ color: '#FFF', fontWeight: '400' }}>NQ Cash</Text> (H1).
                                        </Text>
                                    </View>
                                </View>
                            </GlassCard>

                            <View style={{
                                marginTop: 15,
                                padding: 16,
                                borderRadius: 14,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.08)',
                                borderLeftWidth: 2,
                                borderLeftColor: '#333',
                                overflow: 'hidden'
                            }}>
                                <LinearGradient
                                    colors={['#1A1A1A', '#000000']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    style={[StyleSheet.absoluteFill, { zIndex: -2 }]}
                                />
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.15)', 'rgba(0,0,0,0)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 0.4 }}
                                    style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                                        <Ionicons name="school" size={14} color="#FFF" />
                                    </View>
                                    <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600', letterSpacing: 1 }}>STRATEGY METHODOLOGY</Text>
                                </View>
                                <Text style={{ color: '#E0E0E0', fontSize: 12, lineHeight: 19 }}>
                                    The <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Click&Trader methodology</Text> is built on technical correlations between the <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Cash (SPX)</Text>, <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Futures (ES)</Text>, and <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Nasdaq</Text>. The hierarchy follows a strict order on the <Text style={{ color: '#FFF', fontWeight: 'bold' }}>H1 timeframe</Text>: <Text style={{ color: '#FFF', fontWeight: 'bold' }}>SPX (The Boss) {'>'} ES {'>'} NQ</Text>. If the "Boss" reacts at a magnet level, the others often follow.
                                </Text>
                                <Text style={{ color: '#E0E0E0', fontSize: 12, lineHeight: 19, marginTop: 10 }}>
                                    The <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Institutional Map</Text> levels (<Text style={{ color: '#FFF', fontWeight: 'bold' }}>12, 23, 38, 64, 91</Text>) function across markets. While levels correspond, a price offset may exist (e.g., '.12' on Futures might align with '.91' on Cash). Alignment between these high-probability layers provides the strongest context for analysis.
                                </Text>
                            </View>

                            <View style={{
                                marginTop: 15,
                                padding: 16,
                                borderRadius: 14,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.08)',
                                borderLeftWidth: 2,
                                borderLeftColor: '#333',
                                overflow: 'hidden'
                            }}>
                                <LinearGradient
                                    colors={['#1A1A1A', '#000000']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    style={[StyleSheet.absoluteFill, { zIndex: -2 }]}
                                />
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.15)', 'rgba(0,0,0,0)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 0.4 }}
                                    style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                                        <Ionicons name="bulb" size={14} color="#FFF" />
                                    </View>
                                    <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600', letterSpacing: 1 }}>METHODOLOGY CONCEPT</Text>
                                </View>
                                <Text style={{ color: '#E0E0E0', fontSize: 12, lineHeight: 19 }}>
                                    The strategy emphasizes <Text style={{ fontWeight: 'bold', color: '#FFF' }}>technical patience</Text> during strong trends. It prioritizes observing market stabilization (typically <Text style={{ color: '#FFF', fontWeight: 'bold' }}>3 M1 waves</Text>) and identifying clear structural extremes. Institutional algorithms typically stabilize <Text style={{ color: '#FFF', fontWeight: 'bold' }}>1 hour</Text> after the US Open. Monitoring the <Text style={{ color: '#94A3B8', fontWeight: 'bold' }}>ATR</Text> is vital as it provides higher probability context for technical analysis.
                                </Text>
                            </View>



                            {/* ECONOMIC MONITOR WARNING (ORANGE BUBBLE) */}
                            <View style={{
                                marginTop: 25,
                                padding: 12,
                                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                                borderRadius: 14,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 165, 0, 0.3)',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <Ionicons name="calendar-outline" size={20} color="#FFA500" style={{ marginRight: 10 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: '#FFA500', fontSize: 11, fontWeight: '600', letterSpacing: 0.5 }}>
                                        NOTICE: Monitor the Economic Calendar for high-impact events (FOMC, CPI, Tariffs, etc.). These events cause abnormal volatility.
                                    </Text>
                                    <Text style={{ color: 'rgba(255, 165, 0, 0.8)', fontSize: 11, fontWeight: '500', marginTop: 8 }}>
                                        Context: ~1.5 days/week are directional (~1.5% range). Normal days range 0.50%-0.60%. Once a quarter, moves {'>'}3% occur, with rare extreme days hitting 5%.
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={{
                                    marginTop: 25,
                                    padding: 16,
                                    paddingVertical: 12, // Slightly reduced vertical padding
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    borderLeftWidth: 2,
                                    borderLeftColor: '#444', // Slightly lighter accent
                                    overflow: 'hidden',
                                    alignItems: 'center',
                                    width: '85%', // Reduced width
                                    alignSelf: 'center' // Centered
                                }}
                                activeOpacity={0.8}
                                onPress={() => router.push('/guide-manual-v3')}
                            >
                                <LinearGradient
                                    colors={['#252525', '#101010']} // Lighter black/gray (less dense)
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    style={[StyleSheet.absoluteFill, { zIndex: -2 }]}
                                />
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.1)', 'rgba(0,0,0,0)']} // Subtle highlight
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 0.4 }}
                                    style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
                                />
                                <Text style={{ color: '#E0E0E0', fontSize: 12, fontWeight: 'bold', letterSpacing: 0.5 }}>ACCESS MASTERCLASS</Text>
                            </TouchableOpacity>


                            <Text style={styles.footerText}>Server Connected: {pushToken ? 'Yes' : 'No'}</Text>
                        </View>
                    </View >
                )
                }
            />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    headerTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    headerSubtitle: {
        color: '#666',
        fontSize: 10,
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '600',
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 25,
        paddingHorizontal: 5,
    },
    sectionHeader: {
        color: '#FFFFFF',
        fontSize: 12,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -5,
    },
    gridItem: {
        width: '50%', // 2 columns
        paddingHorizontal: 5,
    },
    cardContent: {
        padding: 15,
        flex: 1,
        justifyContent: 'space-between',
    },
    cardIconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    iconBox: {
        width: 36, // Reduced from 44
        height: 36, // Reduced from 44
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    cardTextRow: {
        marginTop: 2,
    },
    cardLabel: {
        color: '#FFF',
        fontSize: 16, // Matched Guide
        fontWeight: 'bold', // Matched Guide
        marginBottom: 4,
    },
    cardDescription: {
        color: '#E0E0E0', // Lighter for better readability
        fontSize: 12,
        lineHeight: 18,
    },
    badgeContainer: {
        backgroundColor: '#D4AF37',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginLeft: 8,
    },
    badgeText: {
        color: '#000',
        fontSize: 8,
        fontWeight: 'bold',
    },
    tapIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    tapText: {
        color: '#D4AF37',
        fontSize: 9,
        fontWeight: 'bold',
        marginLeft: 6,
        letterSpacing: 1,
    },
    footerText: {
        textAlign: 'center',
        color: '#333',
        marginTop: 30,
        fontSize: 12,
    }
});
