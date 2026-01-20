import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl, Platform, DeviceEventEmitter } from 'react-native';
import { Stack, useFocusEffect, useRouter, useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getHistory, HistoryItem, clearHistory } from '../utils/storage';
import { formatTicker } from '../utils/format';
import { HolographicGradient } from '../components/HolographicGradient';
import { GlassCard } from '../components/GlassCard';
import { SignalDetailModal } from '../components/SignalDetailModal';
import { useAuth } from '../context/AuthContext';

// Shared Style Config (Duplicated from index.tsx for stability)
const SIGNAL_STYLES: Record<string, { icon: keyof typeof Ionicons.glyphMap, color: string, type: 'UP' | 'DOWN' | 'READY' | 'INFO' }> = {
    // 1. BUY SIGNALS
    'pro4x_Buy': { icon: 'trending-up-outline', color: '#4CAF50', type: 'UP' },
    'horus_Buy': { icon: 'trending-up-outline', color: '#4CAF50', type: 'UP' },
    'scalp_TakeProfitPump': { icon: 'arrow-up-circle-outline', color: '#FFD700', type: 'UP' },
    'scalp_OverSold': { icon: 'arrow-up-circle-outline', color: '#00FF9D', type: 'UP' },
    'scalp_SyncroResBuy': { icon: 'shield-checkmark-outline', color: '#4CAF50', type: 'UP' },
    'shadow_Buy': { icon: 'moon-outline', color: '#9CA3AF', type: 'UP' },
    'shadow_Sell': { icon: 'moon-outline', color: '#9CA3AF', type: 'DOWN' },
    'pro4x_GetReady': { icon: 'pulse-outline', color: '#FFC107', type: 'READY' },
    'horus_GetReady': { icon: 'pulse', color: '#FFC107', type: 'READY' },

    // 4. INFO (Trend / Syncro)
    'h1_SyncroBullish': { icon: 'stats-chart-outline', color: '#4CAF50', type: 'INFO' },
    'h1_SyncroBearish': { icon: 'stats-chart-outline', color: '#FF5252', type: 'INFO' },
    'm1_SyncroBullish': { icon: 'cellular-outline', color: '#4CAF50', type: 'INFO' },
    'm1_SyncroBearish': { icon: 'cellular-outline', color: '#FF5252', type: 'INFO' },

    // 5. INFO SUPPORT
    'info_SupportBuy': { icon: 'caret-up-circle-outline', color: '#4CAF50', type: 'UP' },
    'info_SupportSell': { icon: 'caret-down-circle-outline', color: '#FF5252', type: 'DOWN' },
};

const DEFAULT_SIGNAL_STYLE = { icon: 'radio-outline' as const, color: '#AAAAAA', type: 'INFO' as const };

export default function HistoryScreen() {
    const { isPro } = useAuth();
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedSignal, setSelectedSignal] = useState<any>(null);

    const loadHistory = useCallback(async () => {
        const items = await getHistory();
        setHistoryItems(items);
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadHistory();
        setRefreshing(false);
    }, [loadHistory]);

    useFocusEffect(
        useCallback(() => {
            loadHistory();

            // Listen for new items while focused
            const subscription = DeviceEventEmitter.addListener('HISTORY_UPDATED', () => {
                loadHistory();
            });

            return () => {
                subscription.remove();
            };
        }, [loadHistory])
    );

    const renderItem = useCallback(({ item, index }: { item: HistoryItem, index: number }) => {
        // Resolve Data
        const rawStrategy = (item.data as any)?.strategy || item.strategyLabel || '';
        const styleConfig = SIGNAL_STYLES[rawStrategy] || Object.values(SIGNAL_STYLES).find((_, i) => rawStrategy.includes(Object.keys(SIGNAL_STYLES)[i])) || DEFAULT_SIGNAL_STYLE;

        // GRAY HISTORY: Override all colors to Light Gray as requested
        const activeIconColor = '#CCCCCC'; // Light Gray
        const activeIconName = (item.data as any)?.icon || styleConfig.icon;

        // Clean Strategy Name
        const displayStrategy = String(rawStrategy || '').replace(/_/g, ' ').replace('pro4x', 'PRO4X').replace('scalp', 'SCALP').replace('horus', 'HORUS');

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    setSelectedSignal(item);
                }}
            >
                <GlassCard
                    intensity={10}
                    borderColor="rgba(255,255,255,0.05)"
                    borderWidth={0.5}
                    borderRadius={16}
                    style={{ marginBottom: 12, padding: 0 }}
                    contentStyle={{ padding: 0 }}
                    disableGradient={true}
                >
                    <LinearGradient
                        colors={['rgba(255,255,255,0.03)', 'rgba(0,0,0,0)']}
                        style={StyleSheet.absoluteFill}
                    />

                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14 }}>
                        {/* Icon */}
                        <View style={{ marginRight: 15, width: 32, alignItems: 'center' }}>
                            <Ionicons name={activeIconName} size={28} color={activeIconColor} />
                        </View>

                        {/* Content */}
                        <View style={{ flex: 1 }}>
                            {/* TOP: Strategy Title (Main) */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                <Text style={{
                                    color: '#FFFFFF',
                                    fontSize: 10,
                                    fontWeight: '300',
                                    letterSpacing: 2,
                                    textShadowColor: 'rgba(255, 255, 255, 0.4)',
                                    textShadowOffset: { width: 0, height: 0 },
                                    textShadowRadius: 6
                                }}>
                                    {(() => {
                                        const s = String(rawStrategy || '').toUpperCase();
                                        const type = (item.data as any)?.signal || '';
                                        const combined = (s + ' ' + type).toUpperCase();
                                        let prefix = '';
                                        if (combined.includes('BUY') || combined.includes('LONG') || combined.includes('BULL') || combined.includes('UP')) prefix = '▲ ';
                                        else if (combined.includes('SELL') || combined.includes('SHORT') || combined.includes('BEAR') || combined.includes('DOWN')) prefix = '▼ ';

                                        let text = s.replace(/_/g, ' ').replace('PRO4X', 'PRO4X').replace('SCALP', 'SCALP').replace('HORUS', 'HORUS');
                                        text = text.replace('OVERSOLD', 'OVS').replace('OVERBOUGHT', 'OVB');

                                        // Force Replacement
                                        text = text
                                            .replace('BUY', 'BULLISH')
                                            .replace('SELL', 'BEARISH')
                                            .replace('LONG', 'BULLISH')
                                            .replace('SHORT', 'BEARISH');

                                        if (!text.includes('BULLISH') && !text.includes('BEARISH')) {
                                            const t = String(type).toUpperCase();
                                            if (t.includes('BUY') || t.includes('LONG')) text += ' BULLISH';
                                            else if (t.includes('SELL') || t.includes('SHORT')) text += ' BEARISH';
                                        }
                                        return prefix + text;
                                    })()}
                                </Text>
                            </View>

                            {/* MIDDLE: Ticker & Time (Sub) */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#9CA3AF', fontSize: 9, fontWeight: '400', letterSpacing: 0.5 }}>
                                    {formatTicker(item.pair)}
                                </Text>
                                <Text style={{ color: '#333', fontSize: 9, marginHorizontal: 6 }}>|</Text>
                                <Text style={{ color: '#666', fontSize: 9, fontWeight: '300' }}>{item.time}</Text>
                            </View>

                            {/* BOTTOM: Body Text */}
                            <Text style={{ color: '#888', fontSize: 11, maxWidth: '98%', marginTop: 4 }} numberOfLines={2}>
                                {item.body || item.data?.message || `Entry: ${item.entry}`}
                            </Text>
                        </View>
                    </View>
                </GlassCard>
            </TouchableOpacity>
        );
    }, []);

    const router = useRouter();

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: () => (
                        <Text style={{
                            fontSize: 11,
                            fontWeight: '300',
                            letterSpacing: 2,
                            color: '#FFFFFF',
                            textTransform: 'uppercase'
                        }}>
                            SYSTEM ARCHIVE
                        </Text>
                    ),
                    headerTitleAlign: 'center',
                    headerLeft: () => null,
                    headerStyle: { backgroundColor: '#000' },
                    headerShadowVisible: false,
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{
                                marginRight: 15,
                                padding: 5,
                            }}
                        >
                            <Ionicons name="close" size={24} color="#FFFFFF" style={{ opacity: 0.8 }} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <HolographicGradient speed={8000} />

            <FlatList
                data={historyItems}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id || index.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 20,
                            borderWidth: 1,
                            borderColor: 'rgba(255, 255, 255, 0.05)'
                        }}>
                            <Ionicons name="folder-open-outline" size={32} color="#333" />
                        </View>
                        <Text style={styles.emptyText}>ARCHIVE EMPTY</Text>
                        <Text style={styles.emptySubText}>NO INSTITUTIONAL DATA LOGGED YET</Text>
                    </View>
                }
            />

            <SignalDetailModal
                visible={!!selectedSignal}
                signal={selectedSignal}
                onClose={() => setSelectedSignal(null)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '300',
        marginBottom: 8,
        letterSpacing: 3,
        opacity: 0.6
    },
    emptySubText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '200',
        letterSpacing: 1,
        opacity: 0.3
    }
});
