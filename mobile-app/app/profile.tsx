import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '../components/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedButton } from '../components/ThemedButton';

import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, signOut, isPro, setSimulatedPro } = useAuth();

    const DopamineCard = ({ children, style }: { children: React.ReactNode, style?: any }) => (
        <View style={[{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
        }, style]}>
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
            {children}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Background */}
            <LinearGradient
                colors={['#1F1F1F', '#000000']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.8 }}
                style={StyleSheet.absoluteFill}
            />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Close Button */}
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.closeButton}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
                <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        {/* Premium Holographic Avatar */}
                        <LinearGradient
                            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                            style={styles.avatarOuterRing}
                        >
                            <View style={styles.avatarInner}>
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.05)', 'transparent']}
                                    style={StyleSheet.absoluteFill}
                                    start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.6 }}
                                />
                                <Ionicons name="person" size={44} color="#E0E0E0" style={{ opacity: 0.9 }} />
                            </View>
                        </LinearGradient>
                        <View style={styles.onlineBadge} />
                    </View>
                    <Text style={styles.userName}>{user?.email?.split('@')[0] || 'Guest Trader'}</Text>
                    <Text style={styles.userSince}>{user?.email || 'Sign in to access features'}</Text>
                </View>

                {/* Subscription Status Card */}
                <View>
                    <Text style={styles.sectionLabel}>SUBSCRIPTION</Text>
                    <DopamineCard style={[styles.card, { padding: 0 }]}>
                        <View style={styles.subRow}>
                            <View>
                                <Text style={styles.planName}>{isPro ? 'PRO4X & HORUS ACCESS' : 'FREE VERSION'}</Text>
                                <Text style={styles.planStatus}>
                                    {isPro ? 'Active • Perpetual License' : 'Limited features • Upgrade to Pro'}
                                </Text>
                            </View>
                            <View style={[styles.badge, !isPro && { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: '#333' }]}>
                                <Text style={[styles.badgeText, !isPro && { color: '#888' }]}>{isPro ? 'PRO' : 'FREE'}</Text>
                            </View>
                        </View>
                    </DopamineCard>
                </View>

                {/* Account Settings */}
                <View>
                    <Text style={styles.sectionLabel}>APP SETTINGS</Text>
                    <DopamineCard style={styles.card}>
                        <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/settings')}>
                            <View style={styles.iconBox}><Ionicons name="notifications-outline" size={20} color="#E0E0E0" /></View>
                            <Text style={styles.actionText}>Notification Preferences</Text>
                            <Ionicons name="chevron-forward" size={16} color="#444" />
                        </TouchableOpacity>
                    </DopamineCard>
                </View>

                {/* Support */}
                <View>
                    <Text style={styles.sectionLabel}>SUPPORT</Text>
                    <DopamineCard style={styles.card}>
                        <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/guide-manual-v3')}>
                            <View style={styles.iconBox}><Ionicons name="book-outline" size={20} color="#E0E0E0" /></View>
                            <Text style={styles.actionText}>Alerts Guide</Text>
                            <Ionicons name="chevron-forward" size={16} color="#444" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/qa')}>
                            <View style={styles.iconBox}><Ionicons name="help-circle-outline" size={20} color="#E0E0E0" /></View>
                            <Text style={styles.actionText}>Q&A System</Text>
                            <Ionicons name="chevron-forward" size={16} color="#444" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/about')}>
                            <View style={styles.iconBox}><Ionicons name="planet-outline" size={20} color="#E0E0E0" /></View>
                            <Text style={styles.actionText}>Origin</Text>
                            <Ionicons name="chevron-forward" size={16} color="#444" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.actionRow}>
                            <View style={styles.iconBox}><Ionicons name="chatbubble-ellipses-outline" size={20} color="#E0E0E0" /></View>
                            <Text style={styles.actionText}>Contact Support</Text>
                            <Ionicons name="chevron-forward" size={16} color="#444" />
                        </TouchableOpacity>
                    </DopamineCard>
                </View>

                {/* Legal */}
                <View>
                    <Text style={styles.sectionLabel}>LEGAL</Text>
                    <DopamineCard style={styles.card}>
                        <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/privacy')}>
                            <View style={styles.iconBox}><Ionicons name="shield-checkmark-outline" size={20} color="#E0E0E0" /></View>
                            <Text style={styles.actionText}>Privacy Policy</Text>
                            <Ionicons name="chevron-forward" size={16} color="#444" />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/terms')}>
                            <View style={styles.iconBox}><Ionicons name="document-text-outline" size={20} color="#E0E0E0" /></View>
                            <Text style={styles.actionText}>Terms of Service</Text>
                            <Ionicons name="chevron-forward" size={16} color="#444" />
                        </TouchableOpacity>
                    </DopamineCard>
                </View>

                {/* Developer Mode (Simulate Pro) */}
                <View style={{ marginTop: 10 }}>
                    <Text style={[styles.sectionLabel, { color: '#D4AF37' }]}>DEVELOPER TOOLS</Text>
                    <DopamineCard style={[styles.card, { borderColor: 'rgba(212, 175, 55, 0.3)', borderWidth: 0.5 }]}>
                        <TouchableOpacity
                            style={styles.actionRow}
                            onPress={() => setSimulatedPro(!isPro)}
                        >
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(212, 175, 55, 0.1)', borderColor: 'rgba(212, 175, 55, 0.2)' }]}>
                                <Ionicons name="flask-outline" size={20} color="#D4AF37" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.actionText, { color: '#D4AF37' }]}>Simulate PRO Status</Text>
                                <Text style={{ color: '#888', fontSize: 10 }}>Enable all features for testing</Text>
                            </View>
                            <View style={{
                                width: 20, height: 20,
                                borderRadius: 10,
                                backgroundColor: isPro ? '#4ADE80' : 'rgba(255,255,255,0.05)',
                                borderWidth: 1,
                                borderColor: isPro ? '#4ADE80' : '#333',
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                {isPro && <Ionicons name="checkmark" size={12} color="#000" />}
                            </View>
                        </TouchableOpacity>
                    </DopamineCard>
                </View>

                {/* Logout */}
                <View style={{ marginTop: 20 }}>
                    <ThemedButton
                        title="LOG OUT"
                        onPress={async () => {
                            await signOut();
                            router.replace('/login');
                        }}
                        style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', height: 50 }}
                        textStyle={{ color: '#FF4444', fontSize: 13, letterSpacing: 1 }}
                    />

                    <TouchableOpacity
                        style={{ marginTop: 15, alignItems: 'center' }}
                        onPress={() => alert('Delete Account Requested')}
                    >
                        <Text style={{ color: '#666', fontSize: 12, textDecorationLine: 'underline' }}>Delete My Account</Text>
                    </TouchableOpacity>
                    <Text style={styles.versionText}>Click&Trader v1.0.2</Text>
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
        paddingBottom: 50,
        paddingTop: 60,
    },
    closeButton: {
        position: 'absolute',
        top: 60, // Safe Area
        right: 25,
        zIndex: 50,
    },
    header: {
        alignItems: 'center',
        marginBottom: 35,
        marginTop: 10,
    },
    avatarContainer: {
        marginBottom: 15,
    },
    avatarOuterRing: {
        width: 100, height: 100, borderRadius: 50,
        padding: 1.5, // Thin gradient border
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#FFF', shadowOpacity: 0.05, shadowRadius: 15, // Subtle Glow
    },
    avatarInner: {
        flex: 1, width: '100%', borderRadius: 50,
        backgroundColor: '#000', // Deep black inner
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
    },
    onlineBadge: {
        position: 'absolute', bottom: 5, right: 5,
        width: 14, height: 14, borderRadius: 7,
        backgroundColor: '#4ADE80',
        borderWidth: 2, borderColor: '#000',
    },
    userName: {
        fontSize: 22, fontWeight: '700', color: '#fff',
        marginBottom: 4, letterSpacing: 0.5,
    },
    userSince: {
        fontSize: 12, color: '#666', letterSpacing: 0.5,
    },
    sectionLabel: {
        color: '#666', fontSize: 11, fontWeight: '700',
        marginBottom: 12, marginLeft: 4, letterSpacing: 1,
    },
    card: {
        marginBottom: 25,
    },
    subRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 20,
    },
    planName: {
        color: '#FFFFFF', fontSize: 16, fontWeight: '700',
        marginBottom: 4, letterSpacing: 0.5,
    },
    planStatus: {
        color: '#888', fontSize: 12,
    },
    badge: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        paddingHorizontal: 8, paddingVertical: 4,
        borderRadius: 6, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    badgeText: {
        color: '#D4AF37', fontSize: 11, fontWeight: '700',
    },
    actionRow: {
        flexDirection: 'row', alignItems: 'center',
        padding: 18,
    },
    iconBox: {
        width: 32, height: 32, borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
        marginRight: 15,
    },
    actionText: {
        flex: 1, color: '#DDD', fontSize: 14, fontWeight: '500', letterSpacing: 0.3,
    },
    divider: {
        height: 1, backgroundColor: 'rgba(255,255,255,0.05)',
        marginLeft: 65,
    },
    versionText: {
        textAlign: 'center', color: '#333', fontSize: 10, marginTop: 25,
        textTransform: 'uppercase', letterSpacing: 1,
    },
});
