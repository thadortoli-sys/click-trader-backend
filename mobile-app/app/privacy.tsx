import React from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';

export default function PrivacyScreen() {
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

    const Section = ({ title, children, index }: { title: string, children: React.ReactNode, index: number }) => (
        <View>
            <DopamineCard style={{ marginBottom: 20, padding: 20 }}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#FFF" />
                    <Text style={styles.sectionTitle}>{title}</Text>
                </View>
                <Text style={styles.sectionContent}>{children}</Text>
            </DopamineCard>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#080808', '#000000']}
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
                <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <Text style={styles.header}>Privacy Policy</Text>
                    <Text style={styles.lastUpdated}>Last Updated: January 2026</Text>
                </View>

                <Section title="1. Information We Collect" index={0}>
                    <Text style={styles.bold}>Account Information:{'\n'}</Text>
                    • Email address (for authentication){'\n'}
                    • Display name (optional){'\n'}
                    • Password (encrypted){'\n\n'}

                    <Text style={styles.bold}>Technical Data:{'\n'}</Text>
                    • Device token (for push notifications){'\n'}
                    • Device type and OS version{'\n'}
                    • App version{'\n'}
                    • Setup preferences (which alerts you enable){'\n\n'}

                    <Text style={styles.bold}>Usage Data:{'\n'}</Text>
                    • App interaction analytics{'\n'}
                    • Crash reports (anonymized){'\n'}
                    • Feature usage statistics{'\n\n'}

                    ⚠️ We do NOT collect:{'\n'}
                    • Trading account credentials{'\n'}
                    • Financial or payment information (handled by Apple/Google){'\n'}
                    • Trading history or positions
                </Section>

                <Section title="2. How We Use Your Data" index={1}>
                    • Deliver setup notifications in real-time{'\n'}
                    • Provide customer support{'\n'}
                    • Improve app performance and features{'\n'}
                    • Prevent fraud and abuse{'\n'}
                    • Comply with legal obligations{'\n\n'}

                    We will NEVER:{'\n'}
                    • Sell your personal data{'\n'}
                    • Share it with advertisers{'\n'}
                    • Use it for unrelated marketing
                </Section>

                <Section title="3. Data Storage & Security" index={2}>
                    <Text style={styles.bold}>Storage:{'\n'}</Text>
                    • Data stored on secure cloud servers (EU region){'\n'}
                    • Encrypted in transit (TLS 1.3){'\n'}
                    • Passwords hashed with industry-standard algorithms{'\n\n'}

                    <Text style={styles.bold}>Retention:{'\n'}</Text>
                    • Account data: Until you delete your account{'\n'}
                    • Analytics: Anonymized after 90 days{'\n'}
                    • Backups: 30-day retention period
                </Section>

                <Section title="4. Third-Party Services" index={3}>
                    We use the following services:{'\n\n'}

                    • <Text style={styles.bold}>Expo Push Notifications</Text>: Delivery of setups{'\n'}
                    • <Text style={styles.bold}>Apple/Google Payment</Text>: Subscription billing{'\n'}
                    • <Text style={styles.bold}>Analytics</Text>: Crash reporting and usage stats{'\n\n'}

                    Each has its own privacy policy. We require all partners to comply with GDPR and data protection standards.
                </Section>

                <Section title="5. Your Rights (GDPR)" index={4}>
                    You have the right to:{'\n\n'}

                    ✅ <Text style={styles.bold}>Access</Text>: Request a copy of your data{'\n'}
                    ✅ <Text style={styles.bold}>Correction</Text>: Update inaccurate information{'\n'}
                    ✅ <Text style={styles.bold}>Deletion</Text>: Request account and data removal{'\n'}
                    ✅ <Text style={styles.bold}>Portability</Text>: Export your data{'\n'}
                    ✅ <Text style={styles.bold}>Objection</Text>: Opt-out of certain processing{'\n\n'}

                    To exercise these rights, email: privacy@clicktrader.com
                </Section>

                <Section title="6. Children's Privacy" index={5}>
                    Click&Trader is NOT intended for users under 18.{'\n\n'}

                    We do not knowingly collect data from minors. If you believe a child has provided information, contact us immediately for deletion.
                </Section>

                <Section title="7. Cookies & Tracking" index={6}>
                    We use minimal tracking:{'\n\n'}

                    • <Text style={styles.bold}>Essential</Text>: Authentication session tokens{'\n'}
                    • <Text style={styles.bold}>Analytics</Text>: Anonymized usage patterns{'\n\n'}

                    No advertising trackers or cross-site cookies are used.
                </Section>

                <Section title="8. International Transfers" index={7}>
                    Data is primarily stored in EU data centers.{'\n\n'}

                    If transferred outside the EU, we ensure adequate protections (Standard Contractual Clauses, Privacy Shield equivalents).
                </Section>

                <Section title="9. Data Breach Notification" index={8}>
                    In the unlikely event of a data breach:{'\n\n'}

                    • You will be notified within 72 hours{'\n'}
                    • We will describe the nature and impact{'\n'}
                    • Authorities will be notified per GDPR requirements{'\n'}
                    • We will take immediate remedial action
                </Section>

                <Section title="10. Changes to This Policy" index={9}>
                    We may update this policy to reflect:{'\n'}
                    • New features or services{'\n'}
                    • Legal requirements{'\n'}
                    • Security improvements{'\n\n'}

                    Material changes will be notified via email 30 days in advance.
                </Section>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Your privacy is important to us. We are committed to transparency and protecting your data.
                    </Text>
                    <Text style={styles.contact}>
                        Privacy Questions: privacy@clicktrader.com
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
        paddingBottom: 60,
        paddingTop: 60,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 50,
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
        letterSpacing: 1,
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    },
    lastUpdated: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 10,
        letterSpacing: 0.5,
    },
    sectionContent: {
        fontSize: 14,
        color: '#CCC',
        lineHeight: 22,
    },
    bold: {
        fontWeight: 'bold',
        color: 'white',
    },
    footer: {
        marginTop: 30,
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
        fontStyle: 'italic',
    },
    contact: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '600',
    },
});
