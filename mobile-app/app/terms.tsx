import React from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';

export default function TermsScreen() {
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
                    <Ionicons name="document-text-outline" size={20} color="#FFF" />
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
                    <Text style={styles.header}>Terms of Service</Text>
                    <Text style={styles.lastUpdated}>Last Updated: January 2026</Text>
                </View>

                <Section title="1. Nature of Service" index={0}>
                    Click&Trader is an EDUCATIONAL TOOL that provides technical analysis notifications. We send alerts when specific mathematical conditions are detected in market data.{'\n\n'}
                    ⚠️ WE DO NOT:{'\n'}
                    • Provide investment advice or recommendations{'\n'}
                    • Execute trades on your behalf{'\n'}
                    • Manage funds or act as a financial advisor{'\n'}
                    • Guarantee any financial outcomes{'\n\n'}
                    You are SOLELY responsible for all trading decisions and outcomes.
                </Section>

                <Section title="2. Educational Purpose" index={1}>
                    Our setups are educational notifications showing when pre-defined technical setups occur. These are based on mathematical calculations and algorithmic analysis—NOT predictions or recommendations.{'\n\n'}
                    Users must conduct their own research and risk assessment before making any trading decision.
                </Section>

                <Section title="3. Risk Disclosure" index={2}>
                    TRADING INVOLVES SUBSTANTIAL RISK OF LOSS. Past performance does NOT guarantee future results.{'\n\n'}
                    • You can lose more than your initial investment{'\n'}
                    • Leveraged products carry additional risk{'\n'}
                    • Market conditions can change rapidly{'\n'}
                    • No setup or strategy is foolproof{'\n\n'}
                    Only trade with capital you can afford to lose.
                </Section>

                <Section title="4. Subscription & Payment" index={3}>
                    • 7-day free trial, then €49.90/month{'\n'}
                    • Auto-renewal unless cancelled 24h before period end{'\n'}
                    • Managed through Apple App Store or Google Play{'\n'}
                    • Refunds per store policies only{'\n'}
                    • We reserve the right to modify pricing with 30 days notice
                </Section>

                <Section title="5. Acceptable Use" index={4}>
                    You agree NOT to:{'\n'}
                    • Reverse engineer or copy our algorithms{'\n'}
                    • Share your account credentials{'\n'}
                    • Resell or redistribute our technical setups{'\n'}
                    • Use the service for illegal activities{'\n'}
                    • Attempt to bypass payment systems
                </Section>

                <Section title="6. Limitation of Liability" index={5}>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW:{'\n\n'}
                    Click&Trader and its operators are NOT LIABLE for:{'\n'}
                    • Trading losses or missed opportunities{'\n'}
                    • Notification delays or technical errors{'\n'}
                    • Service interruptions{'\n'}
                    • Third-party platform issues{'\n\n'}
                    Our total liability is limited to the amount you paid in the last 12 months.
                </Section>

                <Section title="7. No Financial Advice" index={6}>
                    We are NOT registered as:{'\n'}
                    • Investment advisors{'\n'}
                    • Financial planners{'\n'}
                    • Broker-dealers{'\n'}
                    • Commodity trading advisors{'\n\n'}
                    Consult a licensed professional for personalized financial advice.
                </Section>

                <Section title="8. Termination" index={7}>
                    We may suspend or terminate access if you:{'\n'}
                    • Violate these terms{'\n'}
                    • Engage in fraudulent activity{'\n'}
                    • Fail to pay subscription fees{'\n\n'}
                    You may cancel anytime through your app store subscription settings.
                </Section>

                <Section title="9. Governing Law & EULA" index={8}>
                    These terms are governed by French law.{'\n\n'}
                    By using this app, you also agree to the Standard Apple Terms of Use (EULA): https://www.apple.com/legal/internet-services/itunes/dev/stdeula/{'\n\n'}
                    Any disputes will be resolved in French courts.
                </Section>

                <Section title="10. Changes to Terms" index={9}>
                    We may update these terms. Material changes will be notified via email or in-app notification. Continued use after changes constitutes acceptance.
                </Section>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By using Click&Trader, you acknowledge you have read, understood, and agree to these Terms of Service.
                    </Text>
                    <Text style={styles.contact}>
                        Questions? Contact: support@clicktrader.com
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
