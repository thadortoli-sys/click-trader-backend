import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity, Dimensions, Alert, Image, Animated, Easing } from 'react-native';
import { Link, Tabs, useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { DeviceEventEmitter } from 'react-native';
import { getHistory, getSettings, syncHistoryWithBackend, clearHistory, isSignalEnabled, UserSettings } from '../../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { addNotificationReceivedListener, removeNotificationSubscription, triggerLocalTestNotification } from '../../utils/notifications';
import { formatTicker } from '../../utils/format';
// Reanimated REMOVED
import { SignalDetailModal } from '../../components/SignalDetailModal';
import { GlassCard } from '../../components/GlassCard';
import { HolographicGradient } from '../../components/HolographicGradient';
import { useAuth } from '../../context/AuthContext';
import { ProfitTicker } from '../../components/ProfitTicker';

const { width } = Dimensions.get('window');

const SectionTitle = ({ title, rightElement, afterLineElement }: { title: string, rightElement?: React.ReactNode, afterLineElement?: React.ReactNode }) => (
  <View style={styles.sectionHeaderContainer}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.sectionHeader}>{title}</Text>
      {rightElement}
    </View>
    <LinearGradient
      colors={['#333', 'transparent']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ height: 1, flex: 1, marginLeft: 15, marginRight: afterLineElement ? 15 : 0 }}
    />
    {afterLineElement}
  </View>
);

// --- System HUD Component ---
const SystemHUD = () => {
  const opacity = useRef(new Animated.Value(0.5)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 1500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(opacity, { toValue: 0.5, duration: 1500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) })
      ])
    ).start();
  }, []);

  return (
    <View style={styles.hudContainer}>
      <Animated.View style={[styles.hudIconContainer, { opacity }]}>
        <Ionicons name="radio-button-on" size={16} color="#4CAF50" />
      </Animated.View>
      <View style={styles.hudTextContainer}>
        <Text style={styles.hudLabel}>SYSTEM ONLINE v2.1</Text>
        <Text style={styles.hudValue}>24ms LATENCY</Text>
      </View>
    </View>
  );
};


// --- Signal Styles Configuration ---
// --- Signal Configuration (Single Source of Truth) ---
const SIGNAL_CONFIG: Record<string, { title: string, icon: keyof typeof Ionicons.glyphMap, color: string }> = {
  // 1. HORUS ADVANCED (Strict Keys)
  'horus_Adv_Buy': { title: 'HORUS ADV BULLISH', icon: 'trending-up-outline', color: '#00FF9D' },
  'horus_Adv_Sell': { title: 'HORUS ADV BEARISH', icon: 'trending-down-outline', color: '#FF5252' },

  // 2. HORUS OVS / OVB (Specific Reversal setups)
  'horus_OVS': { title: 'HORUS OVS', icon: 'trending-up-outline', color: '#00FF9D' },
  'horus_OVB': { title: 'HORUS OVB', icon: 'trending-down-outline', color: '#FF5252' },

  // 3. SCALP EXITS (Legacy Mapped to Reintegration)
  'scalp_TakeProfitPump': { title: 'REINTEGRATION BULLISH', icon: 'information-circle-outline', color: '#4ADE80' },
  'scalp_TakeProfitPush': { title: 'REINTEGRATION BEARISH', icon: 'information-circle-outline', color: '#FF5252' },

  // 3. VOLATILITY
  'vol_Panic': { title: 'MARKET PANIC', icon: 'nuclear-outline', color: '#8B5CF6' },
  'vol_Extreme': { title: 'EXTREME VOLATILITY', icon: 'warning-outline', color: '#EF4444' },
  'vol_High': { title: 'HIGH VOLATILITY', icon: 'flame-outline', color: '#F59E0B' },
  'vol_Low': { title: 'LOW VOLATILITY', icon: 'speedometer-outline', color: '#3B82F6' },
  'vol_Regime': { title: 'VOLATILITY REGIME', icon: 'compass-outline', color: '#A855F7' },

  // 4. PRO4X (Differentiating Classic and V2)
  'Pro4x.2': { title: 'PRO4X.2', icon: 'trending-up-outline', color: '#4ADE80' },
  'pro4xx': { title: 'PRO4X.2', icon: 'trending-up-outline', color: '#4ADE80' },
  'PRO4X': { title: 'PRO4X', icon: 'trending-up-outline', color: '#4ADE80' },
  'pro4x': { title: 'PRO4X', icon: 'trending-up-outline', color: '#4ADE80' },

  // 5. SHADOW & LEGACY HORUS
  'SHADOW MODE': { title: 'SHADOW MODE', icon: 'trending-up-outline', color: '#4ADE80' },
  'Shadow Buy': { title: 'SHADOW MODE', icon: 'trending-up-outline', color: '#4ADE80' },
  'Shadow Sell': { title: 'SHADOW MODE', icon: 'trending-down-outline', color: '#FF5252' },

  // REINTEGRATION (Previously TP PUMP/PUSH)
  'Reintegration': { title: 'REINTEGRATION', icon: 'information-circle-outline', color: '#FFFFFF' },
  'Reintegration Bullish': { title: 'REINTEGRATION BULLISH', icon: 'information-circle-outline', color: '#4ADE80' },
  'Reintegration Bearish': { title: 'REINTEGRATION BEARISH', icon: 'information-circle-outline', color: '#FF5252' },
  'TP PUMP': { title: 'REINTEGRATION BULLISH', icon: 'information-circle-outline', color: '#4ADE80' },
  'TP PUSH': { title: 'REINTEGRATION BEARISH', icon: 'information-circle-outline', color: '#FF5252' },

  // Settings Keys (horus_Buy) vs Strategy Keys (Horus Bullish) - Supporting Both
  'horus_Buy': { title: 'HORUS SYSTEM BULLISH', icon: 'trending-up-outline', color: '#4ADE80' },
  'horus_Sell': { title: 'HORUS SYSTEM BEARISH', icon: 'trending-down-outline', color: '#FF5252' },
  'Horus Bullish': { title: 'HORUS SYSTEM BULLISH', icon: 'trending-up-outline', color: '#4ADE80' },
  'Horus Bearish': { title: 'HORUS SYSTEM BEARISH', icon: 'trending-down-outline', color: '#FF5252' },
  'Horus System Bullish': { title: 'HORUS SYSTEM BULLISH', icon: 'trending-up-outline', color: '#4ADE80' },
  'Horus System Bearish': { title: 'HORUS SYSTEM BEARISH', icon: 'trending-down-outline', color: '#FF5252' },
  'HORUS SYSTEM BULLISH': { title: 'HORUS SYSTEM BULLISH', icon: 'trending-up-outline', color: '#4ADE80' },
  'HORUS SYSTEM BEARISH': { title: 'HORUS SYSTEM BEARISH', icon: 'trending-down-outline', color: '#FF5252' },

  // 6. SYNCRO
  'Syncro Bullish': { title: 'SYNCRO BULLISH', icon: 'information-circle-outline', color: '#4ADE80' },
  'Syncro Bearish': { title: 'SYNCRO BEARISH', icon: 'information-circle-outline', color: '#FF5252' },
  'h1_SyncroBullish': { title: 'SYNCRO BULLISH H1', icon: 'information-circle-outline', color: '#4ADE80' },
  'h1_SyncroBearish': { title: 'SYNCRO BEARISH H1', icon: 'information-circle-outline', color: '#FF5252' },

  // 7. GENERIC / FALLBACKS
  'GetReady': { title: 'PRO4X SET UP FORMING', icon: 'pulse-outline', color: '#FFC107' },

  // Case-Insensitive / Space-Friendly Overrides
  'HORUS OVS': { title: 'HORUS OVS', icon: 'trending-up-outline', color: '#00FF9D' },
  'HORUS OVB': { title: 'HORUS OVB', icon: 'trending-down-outline', color: '#FF5252' },
  'SHADOW BULLISH': { title: 'SHADOW MODE BULLISH', icon: 'trending-up-outline', color: '#4ADE80' },
  'SHADOW BEARISH': { title: 'SHADOW MODE BEARISH', icon: 'trending-down-outline', color: '#FF5252' },
};

// Fallback style
const DEFAULT_SIGNAL_STYLE = { icon: 'radio-outline' as const, color: '#AAAAAA', type: 'INFO' as const };


// --- Updated SignalFeedItem to support PnL ---
const SignalFeedItem = React.memo(({ pair, strategy, time, profit, message, signalType, isDemoPnL, index, icon, color, locked = false }: { pair: string, strategy: string, time: string, profit?: string, message?: string, signalType?: string, isDemoPnL?: boolean, index: number, icon?: string, color?: string, locked?: boolean }) => {
  const router = useRouter();
  // Style Logic
  // Style Logic
  // --- REFACTORED LOGIC: CONFIGURATION OVER GUESSWORK ---
  const s = strategy.trim();
  const sUpper = s.toUpperCase();

  // 1. Try EXACT Match (Case Insensitive)
  let config = SIGNAL_CONFIG[s];

  if (!config) {
    const exactKey = Object.keys(SIGNAL_CONFIG).find(k =>
      k.toUpperCase() === sUpper ||
      k.toUpperCase().replace(/_/g, ' ') === sUpper.replace(/_/g, ' ')
    );
    if (exactKey) config = SIGNAL_CONFIG[exactKey];
  }

  // 2. Try INCLUSION Match (Case Insensitive)
  if (!config) {
    const keys = Object.keys(SIGNAL_CONFIG);
    // Sort by length descending to match most specific first
    const sortedKeys = keys.sort((a, b) => b.length - a.length);
    const normalizedSUpper = sUpper.replace(/_/g, ' ');
    const matchedKey = sortedKeys.find(key => {
      const normalizedKey = key.toUpperCase().replace(/_/g, ' ');
      return normalizedSUpper.includes(normalizedKey) || normalizedKey.includes(normalizedSUpper);
    });
    if (matchedKey) config = SIGNAL_CONFIG[matchedKey];
  }

  // FORCE OVERRIDE: SETUP FORMING / READY
  // Must take precedence over generic strategy icons
  const combinedCheck = (s + ' ' + (message || '') + ' ' + (signalType || '')).toUpperCase();
  const isReintegration = combinedCheck.includes('REINTEGRATION') || combinedCheck.includes('PUMP') || combinedCheck.includes('PUSH');
  if (!isReintegration && (combinedCheck.includes('SETUP FORMING') || combinedCheck.includes('FORMING') || combinedCheck.includes('GETREADY') || combinedCheck.includes('PREPARE') || combinedCheck.includes('APPROACHING') || combinedCheck.includes('WATCH'))) {
    // Clone config to avoid mutating static object
    // FORCE the title to SETUP FORMING to avoid it being called "PRO4X"
    config = { ... (config || { title: s }), title: 'SETUP FORMING', icon: 'pulse-outline', color: '#FFC107' };
  }

  // 3. Fallback
  if (!config) {
    config = { title: 'SYSTEM ANALYSIS', icon: 'notifications-outline', color: '#FFFFFF' };
  }

  // 4. Directional Suffix (Append Bullish/Bearish only if needed)
  let displayTitle = config.title;
  // If config title is generic like "PRO4X", append direction from message/type if available
  // BUT avoid "MARKET PANIC BULLISH" -> Only for strategies that need it.
  const needsDirection = ['PRO4X', 'PRO4X.2', 'SHADOW MODE', 'HORUS SYSTEM', 'HIGH VELOCITY', 'SYNCRO', 'REINTEGRATION'].some(k => displayTitle.includes(k));

  if (needsDirection) {
    const combined = (message + ' ' + (signalType || '')).toUpperCase();
    if (!displayTitle.includes('BULLISH') && !displayTitle.includes('BEARISH')) {
      if (combined.includes('BUY') || combined.includes('BULL') || combined.includes('UP') || combined.includes('HAUSSIER')) {
        displayTitle += ' BULLISH';
        // Force green arrow UNLESS it's Reintegration or Syncro (keep info icon)
        if (!displayTitle.includes('REINTEGRATION') && !displayTitle.includes('SYNCRO')) {
          config = { ...config, icon: 'trending-up-outline', color: '#4ADE80' };
        } else {
          config = { ...config, color: '#4ADE80' };
        }
      } else if (combined.includes('SELL') || combined.includes('BEAR') || combined.includes('DOWN') || combined.includes('BAISSIER')) {
        displayTitle += ' BEARISH';
        // Force red arrow UNLESS it's Reintegration or Syncro (keep info icon)
        if (!displayTitle.includes('REINTEGRATION') && !displayTitle.includes('SYNCRO')) {
          config = { ...config, icon: 'trending-down-outline', color: '#FF5252' };
        } else {
          config = { ...config, color: '#FF5252' };
        }
      }
    }
  }

  // Volatility Regime Dynamic Title
  if (config.title === 'VOLATILITY REGIME') {
    const combined = (message + ' ' + (signalType || '')).toUpperCase();
    if (combined.includes('TREND')) {
      displayTitle = 'REGIME TREND';
    } else if (combined.includes('RANGE')) {
      displayTitle = 'REGIME RANGE';
    }
  }

  // Formatting
  const activeIconColor = locked ? '#D4AF37' : '#FFFFFF';
  const activeIconName = locked ? 'lock-closed' : config.icon;
  const displayPrice = locked ? 'LOCKED' : (profit ? profit.replace('Entry: ', '') : (message?.match(/\$?\d{5}/)?.[0] || '---'));

  // Animation Refs
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    // Delay animation slightly for staggered effect based on index (if provided)
    const delay = index * 100;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      })
    ]).start();
  }, [index]);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <GlassCard
        intensity={20}
        rainbowBorder={false}
        borderColor="#FFFFFF"
        borderWidth={0.1}
        borderRadius={16}
        style={{ marginBottom: 16, padding: 0 }}
        contentStyle={{ padding: 0 }}
        disableGradient={true}
      >
        {/* Gloss Effect Layers */}
        <LinearGradient
          colors={['rgba(255,255,255,0.08)', 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.4 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
          pointerEvents="none"
        />
        <LinearGradient
          colors={['#1A1A1A', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFill, { zIndex: -1, borderRadius: 16 }]}
          pointerEvents="none"
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
          {/* LEFT: Icon */}
          <View style={{ marginRight: 16, width: 32, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={activeIconName} size={28} color={activeIconColor} />
          </View>

          {/* MIDDLE: Main Content */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            {/* Row 1: STRATEGY TITLE (Monochrome) */}
            <View>
              <Text style={{
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: '300',
                letterSpacing: 2,
                marginBottom: 4,
                textShadowColor: 'rgba(255, 255, 255, 0.5)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8
              }}>
                {displayTitle} {/* TITLE ALWAYS VISIBLE */}
              </Text>
            </View>

            {/* Row 2: TICKER (Or Locked Message) */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              {locked ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="lock-closed" size={10} color="#D4AF37" style={{ marginRight: 4 }} />
                  <Text style={{ color: '#D4AF37', fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>TAP TO UNLOCK</Text>
                </View>
              ) : (
                <Text style={{ color: '#9CA3AF', fontSize: 10, fontWeight: '400', letterSpacing: 0.3 }}>
                  {pair.toUpperCase()}
                </Text>
              )}
            </View>
          </View>

          {/* RIGHT: Price/Indicator */}
          <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
            <Text style={{ color: '#9CA3AF', fontSize: 9, marginBottom: 4, fontWeight: '300' }}>
              {time || 'Just now'}
            </Text>
            <View>
              <Text style={{
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: '700',
                fontVariant: ['tabular-nums']
              }}>
                {(() => {
                  const s = strategy.toUpperCase();
                  const type = (signalType || '').toUpperCase();
                  // INCLUDE MESSAGE IN SEARCH
                  const combined = (s + ' ' + type + ' ' + (message || '')).toUpperCase();

                  // PREVENT TRIANGLES FOR SETUP FORMING
                  if (combined.includes('READY') || combined.includes('PREPARE') || combined.includes('FORMING')) return '';

                  // STRICT TRIANGLE LOGIC
                  if (combined.includes('BUY') || combined.includes('LONG') || combined.includes('BULL') || combined.includes('UP') || combined.includes('PUMP') || combined.includes('HAUSSIER')) return '▲ ';
                  if (combined.includes('SELL') || combined.includes('SHORT') || combined.includes('BEAR') || combined.includes('DOWN') || combined.includes('DUMP') || combined.includes('BAISSIER')) return '▼ ';
                  return '';
                })()}{displayPrice}
              </Text>
              {locked && (
                <View style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: '#000000',
                  zIndex: 20
                }} />
              )}
            </View>
          </View>
        </View>

        {/* Optional: PnL Ticker (Overlays Price if active) */}
        {isDemoPnL ? (
          <View style={{ position: 'absolute', right: 16, bottom: 14 }}>
            <ProfitTicker startValue={45} endValue={420} />
          </View>
        ) : null}
      </GlassCard>
    </Animated.View >
  );
});

// ... (RecentIntelligence Component)


// ... (Rest of component)


// --- Quick Action Component ---
// --- Quick Action Component ---
const QuickAction = ({ icon, route, label, locked = false }: { icon: any, route: string, label?: string, locked?: boolean }) => {
  const router = useRouter();
  const handlePress = () => {
    // Teaser Mode: Always allow navigation.
    // The destination page will handle the "locked" overlay.
    router.push(route as any);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={styles.actionCard}
    >
      {/* Container with Background & Border - Single Layer */}
      <LinearGradient
        colors={['#1A1A1A', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: 16,
            borderWidth: 0,
            borderColor: 'transparent'
          }
        ]}
      />

      {/* Subtle Top Gloss */}
      <LinearGradient
        colors={['rgba(255,255,255,0.05)', 'rgba(0,0,0,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
        style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
        pointerEvents="none"
      />

      {/* Content - Precision Balanced Layout */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 8 }}>
        <View style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name={icon} size={24} color="#FFFFFF" />
        </View>

        {label && (
          <Text style={{
            color: '#FFFFFF',
            fontSize: 8, // Reduced for a more precise match
            textAlign: 'center',
            marginTop: 4,
            lineHeight: 10,
            fontWeight: '300',
            letterSpacing: 0.6,
            textTransform: 'none'
          }}>
            {label}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// --- Scanning Candles Component ---
const ScanningCandles = () => {
  const h1 = useRef(new Animated.Value(4)).current;
  const h2 = useRef(new Animated.Value(4)).current;
  const h3 = useRef(new Animated.Value(4)).current;

  useEffect(() => {
    const runAnimation = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 12, duration: 750, useNativeDriver: false, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(anim, { toValue: 4, duration: 750, useNativeDriver: false, easing: Easing.inOut(Easing.ease) })
        ])
      ).start();
    };

    runAnimation(h1, 0);
    setTimeout(() => runAnimation(h2, 400), 400);
    setTimeout(() => runAnimation(h3, 800), 800);
  }, []);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', height: 32, marginBottom: 10, gap: 4 }}>
      <Animated.View style={[{ width: 6, backgroundColor: '#FFFFFF', borderRadius: 2, height: h1, opacity: 0.6 }]} />
      <Animated.View style={[{ width: 6, backgroundColor: '#FFFFFF', borderRadius: 2, height: h2, opacity: 0.8 }]} />
      <Animated.View style={[{ width: 6, backgroundColor: '#FFFFFF', borderRadius: 2, height: h3, opacity: 1 }]} />
    </View>
  );
};

// --- Live Badge Component ---
const LiveBadge = () => {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 1000, useNativeDriver: true })
      ])
    ).start();
  }, []);

  return (
    <View style={styles.headerBadge}>
      <Animated.View style={[styles.liveDot, { opacity }]} />
      <Text style={styles.liveText}>LIVE</Text>
    </View>
  );
};
// --- Recent Intelligence Component ---
const RecentIntelligence = () => {
  const router = useRouter();
  const { isPro } = useAuth();
  const [signals, setSignals] = React.useState<any[]>([]);
  const [selectedSignal, setSelectedSignal] = React.useState<any>(null);
  const [settings, setSettings] = React.useState<UserSettings | null>(null);
  const settingsRef = useRef<UserSettings | null>(null);

  // Update Ref when state changes
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // --- VIRAL DEMO MODE SEQUENCE ---
  const runDemoSequence = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setSignals([]);

    // 2. CONNECTING (1s)
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSignals(prev => [{
        id: 'demo-con-' + Date.now(),
        title: 'ESTABLISHING SECURE CONNECTION...',
        data: { strategy: 'System Info', ticker: 'CME GROUP' },
        time: '0ms',
        receivedAt: Date.now()
      }, ...prev]);
    }, 1000);

    // 3. SMART MONEY (2.5s)
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSignals(prev => [{
        id: 'demo-smart-' + Date.now(),
        title: 'INSTITUTIONAL LIQUIDITY DETECTED',
        data: { strategy: 'Volume Delta', ticker: 'NASDAQ' },
        time: '12ms',
        receivedAt: Date.now()
      }, ...prev]);
    }, 2500);

    // 4. SHADOW MODE (4s)
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setSignals(prev => [{
        id: 'demo-shadow-' + Date.now(),
        title: 'SHADOW MODE: ACTIVE',
        data: { strategy: 'Shadow Mode', ticker: 'SYSTEM' },
        time: 'NOW',
        receivedAt: Date.now()
      }, ...prev]);
    }, 4000);

    // 5. THE SIGNAL (6s)
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const entrySignal = {
        id: 'demo-entry-' + Date.now(),
        title: 'NQ - SHADOW SELL ENTRY CONFIRMED',
        data: { signal: 'SELL', price: '20891', strategy: 'Pro4x Sell', ticker: 'NQ' },
        time: 'NOW',
        receivedAt: Date.now(),
        isDemoPnL: false
      };
      setSignals(prev => [entrySignal, ...prev]);

      // 6. PnL EXPLOSION (8s)
      setTimeout(() => {
        setSignals(prev => prev.map(s =>
          s.id === entrySignal.id
            ? { ...s, isDemoPnL: true }
            : s
        ));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        // --- TAKEOVER: AUTO OPEN MODAL ---
        setTimeout(() => {
          setSelectedSignal({ ...entrySignal, isDemoPnL: true });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }, 500);

      }, 2000);

    }, 6000);
  };

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('DEMO_MODE_TRIGGER', runDemoSequence);
    return () => subscription.remove();
  }, []);

  // --- FILTER LOGIC (90 Seconds + SETTINGS) ---
  const filterRecentSignals = (allSignals: any[]) => {
    if (!allSignals || !Array.isArray(allSignals)) return [];

    // Safety check for settings (use Ref if called from interval/callback)
    const currentSettings = settingsRef.current;

    const now = Date.now();
    return allSignals.filter(s => {
      if (!s) return false;
      const t = s.timestamp || s.receivedAt || 0;

      // 1. FRESHNESS CHECK (1 Minute)
      const isFresh = (now - t) < 60000; // 1 minute in milliseconds
      if (!isFresh) return false;

      // 2. Filter by User Settings
      let isEnabled = true;
      if (currentSettings) {
        const strategy = s.strategy || (s.data as any)?.strategy;
        if (strategy) {
          isEnabled = isSignalEnabled(strategy, currentSettings);
        }
      }

      return isEnabled;
    });
  };

  // --- AUTO-CLEANUP INTERVAL REMOVED ---
  // Alerts now persist until manually archived by the user.

  const loadData = async () => {
    // 1. Load Settings First
    const newSettings = await getSettings();
    setSettings(newSettings);
    settingsRef.current = newSettings; // Update Ref immediately for sync usage

    // 2. Sync history
    await syncHistoryWithBackend();

    // 3. Load FULL history from disk
    const fullHistory = await getHistory();

    // 4. Filter with FRESH settings and time window (60s)
    const freshSignals = filterRecentSignals(fullHistory);
    setSignals(freshSignals);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();

      // For NEW live signals coming in:
      const sub1 = DeviceEventEmitter.addListener('HISTORY_UPDATED', () => {
        // Reload fresh data from storage to ensure we have the latest alert
        loadData();
      });

      // Listen for Settings Changes
      const sub2 = DeviceEventEmitter.addListener('SETTINGS_CHANGED', (newSettings) => {
        // Update settings and reload data to reflect changes
        setSettings(newSettings);
        // Important: update Ref immediately if possible, but loadData does it too
        settingsRef.current = newSettings;
        loadData();
      });

      const sub3 = DeviceEventEmitter.addListener('OPEN_SIGNAL_MODAL', setSelectedSignal);

      // Refresh every 5s to remove expired items
      const interval = setInterval(() => {
        loadData();
      }, 5000);

      return () => {
        sub1.remove();
        sub2.remove();
        sub3.remove();
        clearInterval(interval);
      };
    }, [])
  );

  return (
    <View style={styles.section}>
      <SectionTitle
        title="LATEST DETECTIONS"
        rightElement={<LiveBadge />}
        afterLineElement={
          <View style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.08)',
          }}>
            <Text style={{
              color: '#9CA3AF',
              fontSize: 8,
              fontWeight: '700',
              letterSpacing: 1,
            }}>FUTURES</Text>
          </View>
        }
      />

      {/* Styled History Link (Subtitle) */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => isPro ? router.push('/history') : router.push('/premium')}
        style={{
          marginTop: -5,
          marginBottom: 10,
          marginLeft: 4,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start'
        }}
      >
        <Text style={{
          color: '#FFFFFF',
          fontSize: 9,
          letterSpacing: 0.5,
          fontWeight: '300',
          textTransform: 'uppercase',
          opacity: 0.8
        }}>
          VIEW FULL HISTORY
        </Text>
        <Ionicons name="arrow-forward" size={9} color="#FFFFFF" style={{ marginLeft: 4, opacity: 0.8 }} />
      </TouchableOpacity>

      <View style={{ marginTop: 20, minHeight: 180, justifyContent: 'center' }}>
        {(signals.length === 0 && isPro) ? (
          <Animated.View style={{ alignItems: 'center', opacity: 0.9 }}>
            <ScanningCandles />
            <Text style={{ color: '#FFFFFF', fontSize: 12, letterSpacing: 2, fontWeight: '500' }}>PRO4X/HORUS</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 10, marginTop: 4, opacity: 0.7 }}>SCANNING FOR INSTITUTIONAL LIQUIDITY...</Text>
          </Animated.View>
        ) : (
          // IF SYSTEM HAS SIGNALS (OR IS NOT PRO, SHOW MOCKED/REAL SIGNALS AS LOCKED)
          <>
            {(signals.length > 0 ? signals : []).map((signal, index) => (
              <TouchableOpacity
                key={signal.id}
                activeOpacity={0.9}
                onPress={() => {
                  if (!isPro) {
                    router.push('/premium');
                    return;
                  }
                  setSelectedSignal(signal);
                }}
              >
                <SignalFeedItem
                  index={index}
                  pair={((signal.data as any)?.ticker && (signal.data as any)?.ticker !== 'UNKNOWN' && (signal.data as any)?.ticker !== 'System') ? (signal.data as any).ticker : (signal.title || 'SYSTEM')}
                  strategy={((signal.data as any)?.strategy && (signal.data as any)?.strategy !== 'Unknown') ? (signal.data as any).strategy : (signal.body?.includes('Pro4x') ? 'Pro4x' : 'SYSTEM_MSG')}
                  time={new Date((signal.timestamp || 0)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  message={(signal.data as any)?.message || signal.body}
                  signalType={(signal.data as any)?.signal || 'INFO'}
                  isDemoPnL={(signal as any).isDemoPnL}
                  profit={(signal.data as any)?.price ? `@ ${(signal.data as any).price}` : undefined}
                  icon={(signal.data as any)?.icon}
                  color={(signal.data as any)?.color}
                  locked={!isPro}
                />
              </TouchableOpacity>
            ))}
            {/* If no signals and !isPro, showing empty might be boring. Could show fake placeholders but avoiding deceiving. 
                Assuming signals array always has something in this demo/prod env. */}
          </>
        )}
      </View>

      {/* --- MODAL --- */}
      <SignalDetailModal
        visible={!!selectedSignal}
        signal={selectedSignal}
        onClose={() => setSelectedSignal(null)}
        onArchive={() => {
          if (selectedSignal) {
            setSignals(prev => prev.filter(s => s.id !== selectedSignal.id));
            setSelectedSignal(null);
          }
        }}
      />
    </View >
  );
};

export default function CommandCenterScreen() {
  const router = useRouter();
  const { isPro } = useAuth(); // Access Auth Context Here
  const [logoTaps, setLogoTaps] = React.useState(0);



  const handleLogoTap = () => {
    setLogoTaps(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        console.log("VIRAL MODE ACTIVATED");
        DeviceEventEmitter.emit('DEMO_MODE_TRIGGER');
        return 0;
      }
      // Reset after 1s if no more taps
      setTimeout(() => setLogoTaps(0), 1000);
      return newCount;
    });
  };

  return (
    <View style={styles.container}>
      <HolographicGradient speed={6000} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Animated.View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', paddingHorizontal: 0 }}>
            {/* Logo Left - TRIGGER */}
            <TouchableOpacity activeOpacity={1} onPress={handleLogoTap}>
              <Image
                source={require('../../assets/images/logo-ct.png')}
                style={{ width: 65, height: 65, resizeMode: 'contain' }}
              />
            </TouchableOpacity>

            {/* Text Column */}
            <View style={{ marginLeft: 12, flex: 1, justifyContent: 'center' }}>
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

          {/* Profile Icon - Absolute Right (Restored & Moved Up) */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 20,
              top: 0,
              width: 40, height: 40,
              alignItems: 'center', justifyContent: 'center'
            }}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <Text style={[styles.headerSubtitle, { textAlign: 'center', marginBottom: 15 }]}>COMMAND CENTER PRO4X & HORUS SYSTEM</Text>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.actionsGrid}>
            <QuickAction icon="card-outline" route="/premium" label={"MY\nSUBSCRIPTION"} locked={false} />
            <QuickAction icon="hardware-chip-outline" route="/settings" label={"SETTINGS DATA\nPro4x & Horus"} locked={false} />
            <QuickAction icon="stats-chart-outline" route="/guide-manual-v3" label={"INTERPRET\nDATA & MASTERCLASS"} locked={false} />
          </View>
        </View>

        <RecentIntelligence />

        <View style={{ marginTop: 80, marginBottom: 50, alignItems: 'center' }}>
          <Text style={{
            color: '#666',
            fontSize: 10,
            letterSpacing: 1,
            textTransform: 'uppercase',
            opacity: 0.5
          }}>
            Designed & Developed in New York City
          </Text>
        </View>

      </ScrollView>
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
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
    marginBottom: -4,
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
  },
  tagline: {
    fontSize: 14,
    color: '#E0E0E0',
    fontStyle: 'italic',
    marginBottom: 25,
    opacity: 0.9,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 10,
  },
  headerBadge: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  liveText: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusSection: {
    marginBottom: 30,
  },
  hudContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  hudIconContainer: {
    marginRight: 15,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  hudTextContainer: {
    justifyContent: 'center',
  },
  hudLabel: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 2,
  },
  hudValue: {
    color: '#666',
    fontSize: 10,
    letterSpacing: 1,
  },
  section: {
    marginBottom: 30,
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
  },
  signalItem: {
    marginBottom: 10,
    padding: 15,
    height: 70,
  },
  signalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
  },
  signalType: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  signalPair: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signalMeta: {
    alignItems: 'flex-end',
  },
  signalProfit: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  signalTime: {
    color: '#666',
    fontSize: 11,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 8, // Add padding to container to squeeze cards slightly
  },
  actionCard: {
    width: (width - 60) / 3,
    height: 100, // Balanced "Good" height
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  actionLabel: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
