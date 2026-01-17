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
        label: 'Pro4x.2 Buy',
        description: 'Trend Following. Targets moves from 20 up to 150 points. "Blindclick" style approach.',
        icon: 'trending-up-outline',
        color: '#4ADE80'
    },
    {
        key: 'pro4xx_Sell',
        guideTarget: 'PRO4X',
        label: 'Pro4x.2 Sell',
        description: 'Trend Following. Targets moves from 20 up to 150 points. "Blindclick" style approach.',
        icon: 'trending-down-outline',
        color: '#FF5252'
    },
];

// 2. INTERMEDIATE (PRO4X & HORUS)
const INTERMEDIATE_ITEMS: SignalItem[] = [
    {
        key: 'pro4x_GetReady',
        guideTarget: 'Get Ready (GR)',
        label: 'Get Ready',
        description: <Text style={{ color: '#ccc', fontSize: 12 }}>Key price levels reached. Depending on context, this offers a scalping opportunity, but primarily acts as a <Text style={{ fontWeight: 'bold', color: '#FFF' }}>pre-signal.</Text></Text>,
        icon: 'pulse-outline',
        color: '#FFD700'
    },
    {
        key: 'pro4x_Buy',
        guideTarget: 'PRO4X',
        label: 'Pro4x Buy',
        description: 'This is the confirmed long entry signal. All required conditions are aligned at a key level, indicating a high-probability buying opportunity.',
        icon: 'trending-up-outline',
        color: '#4ADE80'
    },
    {
        key: 'pro4x_Sell',
        guideTarget: 'PRO4X',
        label: 'Pro4x Sell',
        description: 'This is the confirmed short entry signal. All required conditions are aligned at a key level, indicating a high-probability selling opportunity.',
        icon: 'trending-down-outline',
        color: '#FF5252'
    },

];

// 3. ADVANCED (SCALPING & SHADOW)
const ADVANCED_ITEMS: SignalItem[] = [
    {
        key: 'horus_Buy',
        guideTarget: 'Horus — Buy Entry',
        label: 'Horus Buy',
        description: 'Precision Scalping. Validated entry for advanced traders.',
        icon: 'trending-up-outline',
        color: '#4ADE80'
    },
    {
        key: 'horus_Sell',
        guideTarget: 'Horus — Sell Entry',
        label: 'Horus Sell',
        description: 'Precision Scalping. Validated entry for advanced traders.',
        icon: 'trending-down-outline',
        color: '#EF4444'
    },
    {
        key: 'shadow_Buy',
        guideTarget: 'Shadow Mode',
        label: 'Shadow BUY',
        description: (
            <View>
                <Text style={{ color: '#ccc', fontSize: 12, marginBottom: 6 }}>Institutional Sweep. <Text style={{ color: '#9061C2', fontWeight: 'bold' }}>Review Magnet Map.</Text></Text>
                <Text style={{ color: '#888', fontSize: 10, fontStyle: 'italic', lineHeight: 14 }}>
                    ATR &lt; 10: 1 M1 candle of stabilization is often sufficient.{"\n"}
                    ATR 10–20: Wait for 2 M1 candles + clear rejection.{"\n"}
                    ATR &gt; 20: Wait 3–5 M1 candles or sweep-and-reclaim.
                </Text>
            </View>
        ),
        icon: 'moon',
        color: '#A855F7'
    },
    {
        key: 'shadow_Sell',
        guideTarget: 'Shadow Mode',
        label: 'Shadow SELL',
        description: (
            <View>
                <Text style={{ color: '#ccc', fontSize: 12, marginBottom: 6 }}>Institutional Sweep. <Text style={{ color: '#9061C2', fontWeight: 'bold' }}>Review Magnet Map.</Text></Text>
                <Text style={{ color: '#888', fontSize: 10, fontStyle: 'italic', lineHeight: 14 }}>
                    ATR &lt; 10: 1 M1 candle of stabilization is often sufficient.{"\n"}
                    ATR 10–20: Wait for 2 M1 candles + clear rejection.{"\n"}
                    ATR &gt; 20: Wait 3–5 M1 candles or sweep-and-reclaim.
                </Text>
            </View>
        ),
        icon: 'moon',
        color: '#A855F7'
    },
    {
        key: 'scalp_OverSold',
        guideTarget: 'HORUS OVS',
        label: 'Horus OVS',
        description: (
            <View>
                <Text style={{ color: '#ccc', fontSize: 12, marginBottom: 6 }}>Extreme Statistical Anomaly. Counter-trend alert.</Text>
                <Text style={{ color: '#888', fontSize: 10, fontStyle: 'italic', lineHeight: 14 }}>
                    ATR &lt; 10: 1 M1 candle of stabilization typically enough.{"\n"}
                    ATR 10–20: Need 2 M1 candles + clear rejection.{"\n"}
                    ATR &gt; 20: Wait 3–5 M1 candles/sweep-reclaim or it may slide.
                </Text>
            </View>
        ),
        icon: 'arrow-down-circle-outline',
        color: '#4ADE80'
    },
    {
        key: 'scalp_OverBought',
        guideTarget: 'HORUS OVB',
        label: 'Horus OVB',
        description: (
            <View>
                <Text style={{ color: '#ccc', fontSize: 12, marginBottom: 6 }}>Extreme Statistical Anomaly. Counter-trend alert.</Text>
                <Text style={{ color: '#888', fontSize: 10, fontStyle: 'italic', lineHeight: 14 }}>
                    ATR &lt; 10: 1 M1 candle of stabilization typically enough.{"\n"}
                    ATR 10–20: Need 2 M1 candles + clear rejection.{"\n"}
                    ATR &gt; 20: Wait 3–5 M1 candles/sweep-reclaim or it may slide.
                </Text>
            </View>
        ),
        icon: 'arrow-up-circle-outline',
        color: '#EF4444'
    },
    {
        key: 'horus_Adv_Buy',
        guideTarget: 'Horus ADV',
        label: 'Horus ADV Buy',
        description: (
            <View>
                <Text style={{ color: '#ccc', fontSize: 12, marginBottom: 6 }}><Text style={{ color: '#4ADE80', fontWeight: 'bold', opacity: 0.8 }}>Expert.</Text> High precision entry.</Text>
                <Text style={{ color: '#888', fontSize: 10, fontStyle: 'italic', lineHeight: 14 }}>
                    ATR &lt; 10: 1 M1 candle of stabilization is sufficient.{"\n"}
                    ATR 10–20: Wait 2 M1 candles + rejection.{"\n"}
                    ATR &gt; 20: 3–5 M1 candles or sweep-reclaim required.
                </Text>
            </View>
        ),
        icon: 'flash',
        color: '#00FF9D'
    },
    {
        key: 'horus_Adv_Sell',
        guideTarget: 'Horus ADV',
        label: 'Horus ADV Sell',
        description: (
            <View>
                <Text style={{ color: '#ccc', fontSize: 12, marginBottom: 6 }}><Text style={{ color: '#F87171', fontWeight: 'bold', opacity: 0.8 }}>Expert.</Text> High precision entry.</Text>
                <Text style={{ color: '#888', fontSize: 10, fontStyle: 'italic', lineHeight: 14 }}>
                    ATR &lt; 10: 1 M1 candle of stabilization is sufficient.{"\n"}
                    ATR 10–20: Wait 2 M1 candles + rejection.{"\n"}
                    ATR &gt; 20: 3–5 M1 candles or sweep-reclaim required.
                </Text>
            </View>
        ),
        icon: 'flash',
        color: '#FF5252'
    },
    {
        key: 'scalp_TakeProfitPump',
        guideTarget: 'Scalp | TP Pump',
        label: 'TP Pump',
        description: 'Aggressive buying exhausted. Profit taking zone.',
        icon: 'arrow-up-circle-outline',
        color: '#FFD700'
    },
    {
        key: 'scalp_TakeProfitPush',
        guideTarget: 'Scalp | TP Push',
        label: 'TP Push',
        description: 'Aggressive selling exhausted. Profit taking zone.',
        icon: 'arrow-down-circle-outline',
        color: '#FFD700'
    },
];

// 4. CONTEXT INFO
const CONTEXT_ITEMS: SignalItem[] = [
    {
        key: 'h1_SyncroBullish',
        guideTarget: 'Syncro Buy (H1) — SPX / ES / NQ',
        label: 'Syncro Buy (H1)',
        description: 'Context Alert. Major trend alignment. Safest institutional flow.',
        icon: 'caret-up-outline',
        color: '#4ADE80'
    },
    {
        key: 'h1_SyncroBearish',
        guideTarget: 'Syncro Sell (H1) — SPX / ES / NQ',
        label: 'Syncro Sell (H1)',
        description: 'Context Alert. Major trend alignment. Safest institutional flow.',
        icon: 'caret-down-outline',
        color: '#EF4444'
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
                    sendSettingsToBackend(pushToken, settings.signals);
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

        // Scalp
        scalp_OverSold: true, scalp_OverBought: true,
        scalp_TakeProfitPump: true, scalp_TakeProfitPush: true,
        scalp_SyncroResBuy: true, scalp_SyncroResSell: true,

        h1_SyncroBullish: true, h1_SyncroBearish: true,
        m1_SyncroBullish: true, m1_SyncroBearish: true,
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
                                <Text style={[styles.headerTitle, { fontSize: 24, marginBottom: 2, fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif' }]}>SETTING ALERTS</Text>
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

                        {/* STRATEGY CONTRADICTION WARNING (BLUE BUBBLE) */}
                        <View style={{
                            marginBottom: 20,
                            padding: 12,
                            backgroundColor: 'rgba(59, 130, 246, 0.15)', // Lighter Blue (Tailwind Blue-500 equivalent base)
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: 'rgba(59, 130, 246, 0.3)',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Ionicons name="bulb-outline" size={20} color="#60A5FA" style={{ marginRight: 10 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: '#60A5FA', fontSize: 11, fontWeight: '600', letterSpacing: 0.5 }}>
                                    STRATEGY TIP: You do not need to enable all alerts. Choose the strategies that fit your style. Be aware that different strategies may have contradictory momentum signals at the same time. For example, PRO4X.2 is a Trending system, while Shadow Mode may signal a counter-trend reversal simultaneously.
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
                                            <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 }}>ALERTS GUIDE</Text>
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
                                NOTICE: Market opens at 9:30 AM. Alerts are optimized for active market hours.
                            </Text>
                        </View>

                        {/* SECTION 1: BEGINNER */}
                        <SectionTitle title="BEGINNER (TRAVEL LIGHT)" />
                        <Text style={{ color: '#888', fontSize: 11, marginBottom: 15, paddingHorizontal: 5 }}>
                            Focus on PRO4X.2. Travel Light. Disable other alerts to avoid pollution. Trend Following. Targets moves from 20 up to 150-200 points. System invalidation: ~30 pts below the alert point. Low stress. Not all alerts must be taken: watch context and filter for high probability setups. Wait for a reclaim for a more precise entry depending on the structure. Note: 12/64/91 are the most powerful reversal numbers.
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
                        <SectionTitle title="INTERMEDIATE (INSTITUTIONAL READING)" />
                        <Text style={{ color: '#888', fontSize: 11, marginBottom: 15, paddingHorizontal: 5 }}>
                            Requires knowledge of the Magnet Map. Pre-signals + Validated Entries. Disable other alerts to avoid pollution (but keep PRO4X.2 enabled). Focus on finding the most relevant institutional level before interacting. System invalidation: ~30 pts below the alert point. Note: 12/64/91 are the most powerful reversal numbers.
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
                        <SectionTitle title="ADVANCED (SCALPING MODE)" />
                        <Text style={{ color: '#888', fontSize: 11, marginBottom: 15, paddingHorizontal: 5 }}>
                            Mapping the liquidity. Expert only. Counter-trend & high-precision moves. Designed for automatic TP & SL (close to entry). Requires fast reaction. Strong trend protocol: avoidance, trend scalping, or waiting for key institutional reversal number.
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
                            How to set up your analysis platform for optimal signal reading.
                        </Text>

                        <GlassCard
                            intensity={15}
                            borderColor="rgba(255, 255, 255, 0.2)"
                            borderWidth={1}
                            borderRadius={16}
                            disableGradient={true}
                            style={{ marginBottom: 30, padding: 15 }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                                <View style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                    justifyContent: 'center', alignItems: 'center',
                                    marginRight: 12
                                }}>
                                    <Ionicons name="stats-chart" size={20} color="#60A5FA" />
                                </View>
                                <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>Chart Setup</Text>
                            </View>

                            {/* SWIPABLE GALLERY */}
                            <View style={{ marginBottom: 20 }}>
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
                                                borderRadius: 12,
                                                overflow: 'hidden',
                                                borderWidth: 1,
                                                borderColor: 'rgba(255,255,255,0.08)',
                                                elevation: 5,
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 4 },
                                                shadowOpacity: 0.3,
                                                shadowRadius: 5
                                            }}>
                                                <Image
                                                    source={item.source}
                                                    style={{
                                                        width: '100%',
                                                        height: 220,
                                                    }}
                                                    resizeMode={item.type === 'ui' ? "contain" : "cover"}
                                                />
                                                <LinearGradient
                                                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: 40,
                                                        justifyContent: 'center',
                                                        paddingHorizontal: 12
                                                    }}
                                                >
                                                    <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5, textTransform: 'uppercase' }}>{item.title}</Text>
                                                </LinearGradient>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12, gap: 6 }}>
                                    <View style={{ width: 10, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                                    <Text style={{ color: '#555', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 }}>TAP TO ZOOM · SWIPE FOR ALL</Text>
                                    <View style={{ width: 10, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
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

                            <View style={{ gap: 12 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#60A5FA', marginTop: 7, marginRight: 10 }} />
                                    <Text style={{ color: '#E0E0E0', fontSize: 13, flex: 1, lineHeight: 18 }}>
                                        <Text style={{ fontWeight: 'bold', color: '#FFF' }}>Volume Profile (VPVR):</Text> Row Layout: <Text style={{ color: '#60A5FA' }}>Number of Rows</Text>. Row Size: <Text style={{ color: '#60A5FA' }}>40</Text>. Volume: <Text style={{ color: '#60A5FA' }}>Delta</Text>. VA Volume: <Text style={{ color: '#60A5FA' }}>70</Text>. Style: Right, 37%.
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#60A5FA', marginTop: 7, marginRight: 10 }} />
                                    <Text style={{ color: '#E0E0E0', fontSize: 13, flex: 1, lineHeight: 18 }}>
                                        <Text style={{ fontWeight: 'bold', color: '#FFF' }}>Moving Average (MA):</Text> Length: <Text style={{ color: '#60A5FA' }}>200</Text>. Source: <Text style={{ color: '#60A5FA' }}>Close</Text>. Method: <Text style={{ color: '#60A5FA' }}>SMA</Text>.
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#60A5FA', marginTop: 7, marginRight: 10 }} />
                                    <Text style={{ color: '#E0E0E0', fontSize: 13, flex: 1, lineHeight: 18 }}>
                                        <Text style={{ fontWeight: 'bold', color: '#FFF' }}>RSI Indicator:</Text> Length: <Text style={{ color: '#60A5FA' }}>7</Text>. Upper Limit: <Text style={{ color: '#60A5FA' }}>80</Text>. Lower Limit: <Text style={{ color: '#60A5FA' }}>20</Text>.
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#60A5FA', marginTop: 7, marginRight: 10 }} />
                                    <Text style={{ color: '#E0E0E0', fontSize: 13, flex: 1, lineHeight: 18 }}>
                                        <Text style={{ fontWeight: 'bold', color: '#FFF' }}>Timeframe & ATR:</Text> Use <Text style={{ color: '#60A5FA' }}>M1</Text> for entry execution and <Text style={{ color: '#60A5FA' }}>H1</Text> for institutional context. ATR Period: <Text style={{ color: '#60A5FA' }}>14</Text>.
                                    </Text>
                                </View>
                            </View>

                            <View style={{
                                marginTop: 20,
                                padding: 12,
                                backgroundColor: 'rgba(245, 158, 11, 0.05)',
                                borderRadius: 10,
                                borderLeftWidth: 3,
                                borderLeftColor: '#F59E0B'
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <Ionicons name="school-outline" size={16} color="#F59E0B" style={{ marginRight: 8 }} />
                                    <Text style={{ color: '#F59E0B', fontSize: 12, fontWeight: 'bold', letterSpacing: 0.5 }}>STRATEGY METHODOLOGY</Text>
                                </View>
                                <Text style={{ color: '#94A3B8', fontSize: 12, lineHeight: 18 }}>
                                    The <Text style={{ color: '#FFF' }}>Click&Trader methodology</Text> is built on observing technical correlations between the <Text style={{ color: '#FFF' }}>Cash (SPX)</Text>, <Text style={{ color: '#FFF' }}>Futures (ES)</Text>, and <Text style={{ color: '#FFF' }}>Nasdaq</Text>. This educational setup highlights major structural levels on the <Text style={{ color: '#FFF' }}>H1 timeframe</Text>. The <Text style={{ color: '#FFF' }}>Institutional Map</Text> levels (<Text style={{ color: '#FFF' }}>12, 23, 38, 64, 91</Text>) function across both Cash and Futures markets. Note that while the levels correspond, a price offset may exist between markets (e.g., a level '12' on Futures might align with a level '91' on Cash). Historically, the strategy suggests that alignment between high-probability layers provides the strongest context for analysis.
                                </Text>
                            </View>

                            <View style={{
                                marginTop: 12,
                                padding: 12,
                                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                                borderRadius: 10,
                                borderLeftWidth: 3,
                                borderLeftColor: '#10B981'
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                    <Ionicons name="bulb-outline" size={16} color="#10B981" style={{ marginRight: 8 }} />
                                    <Text style={{ color: '#10B981', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 }}>METHODOLOGY CONCEPT</Text>
                                </View>
                                <Text style={{ color: '#E0E0E0', fontSize: 12, lineHeight: 18 }}>
                                    The strategy emphasizes <Text style={{ fontWeight: 'bold' }}>technical patience</Text> during strong trends. It prioritizes observing market stabilization and identifying clear structural extremes. Monitoring the <Text style={{ color: '#10B981', fontWeight: 'bold' }}>ATR</Text> is an integral part of the methodology to understand if current volatility aligns with the historical models of the Institutional Map.
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={{
                                    marginTop: 20,
                                    paddingVertical: 10,
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.1)'
                                }}
                                onPress={() => router.push('/guide-manual-v3')}
                            >
                                <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600' }}>VIEW FULL TUTORIAL</Text>
                            </TouchableOpacity>
                        </GlassCard>

                        <Text style={styles.footerText}>Server Connected: {pushToken ? 'Yes' : 'No'}</Text>
                    </View>
                )}
            />
        </View>
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
