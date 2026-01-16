import React from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, Linking, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';

export default function AboutScreen() {
    const router = useRouter();

    const DopamineCard = ({ children, style }: { children: React.ReactNode, style?: any }) => (
        <GlassCard
            intensity={20}
            borderColor="#FFFFFF"
            borderWidth={0.1}
            borderRadius={40}
            disableGradient={true}
            style={style}
        >
            <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(0,0,0,0)']}
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

    const LinkButton = ({ icon, label, onPress }: any) => (
        <TouchableOpacity style={styles.linkButton} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.iconBox}>
                <Ionicons name={icon} size={18} color="#FFF" />
            </View>
            <Text style={styles.linkText}>{label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>
    );

    const handleEmail = () => Linking.openURL('mailto:support@clicktrader.com');
    const handleTerms = () => router.push('/terms');
    const handlePrivacy = () => router.push('/privacy');

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#080808', '#000000']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.8 }}
                style={StyleSheet.absoluteFill}
            />
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Image source={require('../assets/images/logo-ct.png')} style={{ width: 60, height: 60, marginBottom: 15 }} resizeMode="contain" />
                    <Text style={styles.appTitle}>Click&Trader</Text>
                    <Text style={styles.appSubtitle}>Your trading companion in the palm of your hand</Text>
                </View>

                {/* Origin Story */}
                <View>
                    <DopamineCard style={{ marginBottom: 30, padding: 30 }}>
                        <Text style={styles.manifestoTitle}>ORIGIN</Text>
                        <View style={styles.separatorSmall} />
                        <Text style={styles.manifestoText}>
                            Some algorithms exist.{'\n'}
                            Others are kept oral.{'\n\n'}
                            Within funds and banks, these structures live in silence — real, protected, and unreachable without transmission.{'\n\n'}
                            They are not inferred,{'\n'}
                            not reverse-engineered,{'\n'}
                            not found by chance.{'\n\n'}
                            They pass through experience, through practice, through real pith instructions carried from mouth to ear, from mentor to disciple.{'\n\n'}
                            From there, this system stands on the hunter’s side of the market,{'\n'}
                            moving with the rhythm of market makers and institutional hands —{'\n'}
                            while Click&Trader brings clarity{'\n'}
                            where others can only speculate.
                        </Text>
                    </DopamineCard>
                </View>



                {/* Legal */}
                <View>
                    <Text style={styles.sectionLabel}>LEGAL & SUPPORT</Text>
                    <DopamineCard style={{ marginBottom: 16 }}>
                        <LinkButton icon="document-text-outline" label="Terms of Service" onPress={handleTerms} />
                        <View style={styles.divider} />
                        <LinkButton icon="shield-checkmark-outline" label="Privacy Policy" onPress={handlePrivacy} />
                        <View style={styles.divider} />
                        <LinkButton icon="mail-outline" label="Contact Support" onPress={handleEmail} />
                    </DopamineCard>
                </View>

                <Text style={styles.footer}>© 2024 Click&Trader. All rights reserved.</Text>
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
        paddingBottom: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 40,
    },
    closeButton: {
        position: 'absolute',
        right: 0, top: -10,
        padding: 5,
    },
    appTitle: {
        fontSize: 32, fontWeight: '700', color: 'white', letterSpacing: 1, textAlign: 'center', marginBottom: 5,
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    },
    appSubtitle: {
        fontSize: 14, color: '#888', fontStyle: 'italic', textAlign: 'center', lineHeight: 20,
    },
    sectionLabel: {
        color: '#666', fontSize: 11, fontWeight: '700', marginBottom: 12, marginLeft: 4, letterSpacing: 1,
    },
    manifestoTitle: {
        color: 'white', fontSize: 16, fontWeight: '700', textAlign: 'center', letterSpacing: 3, marginBottom: 15,
    },
    manifestoText: {
        fontSize: 14, color: '#CCC', lineHeight: 24, textAlign: 'center', fontWeight: '400',
    },
    separatorSmall: {
        height: 1, width: 40, backgroundColor: '#FFF', alignSelf: 'center', marginBottom: 20, opacity: 0.2,
    },
    signatureName: {
        fontSize: 16, color: '#666', fontStyle: 'italic', textAlign: 'center', marginBottom: 4,
    },
    signatureRole: {
        fontSize: 12, color: '#666', textAlign: 'center', letterSpacing: 1, textTransform: 'uppercase',
    },
    linkButton: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20,
    },
    iconBox: {
        width: 32, height: 32, borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
        marginRight: 15,
    },
    linkText: {
        flex: 1, fontSize: 15, color: '#DDD', fontWeight: '500', letterSpacing: 0.3,
    },
    divider: {
        height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginLeft: 65,
    },
    footer: {
        textAlign: 'center', color: '#444', fontSize: 10, marginBottom: 20,
    },
});
