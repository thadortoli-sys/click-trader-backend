import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, SafeAreaView, Dimensions, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomerInfo } from 'react-native-purchases';
import { Stack, useRouter } from 'expo-router';
// import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemedButton } from '../components/ThemedButton';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { HolographicGradient } from '../components/HolographicGradient';
import { LinearGradient } from 'expo-linear-gradient';
import { getOfferings, purchasePackage, restorePurchases, ENTITLEMENT_ID } from '../utils/purchases';

const { width } = Dimensions.get('window');

export default function PremiumScreen() {
    const router = useRouter();
    const { setSimulatedPro } = useAuth();
    const [offering, setOffering] = React.useState<any>(null); // Store the actual Package (e.g. Monthly)
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const loadOfferings = async () => {
            const currentOffering = await getOfferings();
            if (currentOffering && currentOffering.availablePackages.length > 0) {
                setOffering(currentOffering.availablePackages[0]); // Default to first (usually Monthly)
            }
        };
        loadOfferings();
    }, []);

    const handleRestore = async () => {
        setLoading(true);
        try {
            const info = await restorePurchases();
            if (info?.entitlements.active[ENTITLEMENT_ID]) {
                Alert.alert('Success', 'Your purchases have been restored.');
                router.replace('/');
            } else {
                Alert.alert('No Subscription Found', 'We could not find an active subscription to restore.');
            }
        } catch (e: any) {
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async () => {
        // If no offering loaded yet, we can't buy. 
        if (!offering) {
            Alert.alert(
                'Configuration Required',
                'RevenueCat could not fetch any offers from the Store.\n\nThis usually means:\n1. Your Emulator doesn\'t have the Google Play Store.\n2. You haven\'t created Products in RevenueCat dashboard.\n3. You haven\'t synced them with Apple/Google Connect.'
            );
            return;
        }

        setLoading(true);
        try {
            const info = await purchasePackage(offering) as CustomerInfo;
            if (info?.entitlements.active[ENTITLEMENT_ID]) {
                // Success!
                setSimulatedPro(true); // Force update context for immediate unlock
                router.replace('/confirmation?plan=premium');
            }
        } catch (e: any) {
            // User cancelled or error, already handled in utils but we stop loading here
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Pure Black Background */}
            <View style={StyleSheet.absoluteFill} />

            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.contentWrapper}>

                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>

                        {/* Header */}
                        <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                            {/* Logo Left */}
                            <Image
                                source={require('../assets/images/logo-ct.png')}
                                style={{ width: 65, height: 65, resizeMode: 'contain' }}
                            />

                            {/* Text Column */}
                            <View style={{ marginLeft: 12 }}>
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

                        {/* Storytelling Slogan Card */}
                        <GlassCard
                            intensity={20}
                            style={{ marginBottom: 30, padding: 30 }}
                            borderColor="#FFFFFF"
                            disableGradient={true}
                            borderWidth={0.1}
                            borderRadius={40} // Increased from 32
                        >
                            {/* Gloss Effect */}
                            <LinearGradient
                                colors={['rgba(255,255,255,0.1)', 'rgba(0,0,0,0)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 0.4 }}
                                style={StyleSheet.absoluteFill}
                            />
                            <LinearGradient
                                colors={['#080808', '#000000']} // Darker start
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
                            />

                            <Text style={styles.sloganText}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>$2.50 a day.</Text>{'\n'}
                                The price of a coffee.{'\n\n'}

                                On a trading floor,{'\n'}
                                clarity isn’t taught in books.{'\n'}
                                It’s passed on.{'\n\n'}

                                From one desk to another.{'\n'}
                                From one trader to another.{'\n\n'}

                                Not promises.{'\n'}
                                A reading of the market.{'\n\n'}
                                <Text style={{ color: '#D4AF37', fontStyle: 'italic' }}>
                                    Institutional pith instruction{'\n'}
                                    (oral from mouth to ear){'\n'}
                                    from mentor to disciple.{'\n\n'}
                                    Passed on.
                                </Text>
                            </Text>
                        </GlassCard>

                        {/* Offer / Pricing */}
                        <GlassCard
                            intensity={30}
                            borderColor="#FFFFFF"
                            glowColor="#FFFFFF"
                            disableGradient={true}
                            borderWidth={0.1}
                            borderRadius={30} // Rounder for Offer Card
                            style={styles.offerCard}
                        >
                            {/* Gloss Effect */}
                            <LinearGradient
                                colors={['rgba(255,255,255,0.1)', 'rgba(0,0,0,0)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 0.4 }}
                                style={StyleSheet.absoluteFill}
                            />
                            <LinearGradient
                                colors={['#080808', '#000000']} // Darker start
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
                            />

                            <View style={styles.badgeContainer}>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>7 DAYS FREE TRIAL</Text>
                                </View>
                            </View>

                            <Text style={styles.priceLarge}>
                                {offering ? offering.product.priceString : '$44.95'}
                            </Text>
                            <Text style={styles.periodText}>/ month</Text>

                            <View style={styles.divider} />

                            <View style={styles.featuresList}>
                                <Text style={styles.featureItem}>• Unlimited Session Alerts (Pro4x & Horus)</Text>
                                <Text style={styles.featureItem}>• Institutional Grade Setup</Text>
                                <Text style={styles.featureItem}>• Shadow of Liquidity</Text>
                                <Text style={styles.featureItem}>• Real-Time Execution</Text>
                                <Text style={styles.featureItem}>• Nasdaq future (suitable CFD)</Text>
                                <Text style={styles.featureItem}>• High velocity modes</Text>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={handlePurchase}
                                disabled={loading}
                                style={{ width: '100%', marginTop: 25 }}
                            >
                                <LinearGradient
                                    key="premium-button-v2" // Force re-render
                                    colors={['#1a1a1a', '#000000']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    style={{
                                        width: '100%',
                                        height: 60,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 30,
                                        borderWidth: 0.5,
                                        borderColor: 'rgba(255,255,255,0.15)',
                                        paddingHorizontal: 40, // EXPLICIT MARGIN
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                                        {loading ? (
                                            <ActivityIndicator color="#FFFFFF" />
                                        ) : (
                                            <>
                                                <Ionicons name="flash" size={14} color="#FFFFFF" style={{ opacity: 0.8 }} />
                                                <Text style={{
                                                    color: '#FFFFFF',
                                                    fontWeight: '400',
                                                    fontSize: 11,
                                                    letterSpacing: 2,
                                                    textTransform: 'uppercase'
                                                }}>
                                                    START 7-DAY TRIAL
                                                </Text>
                                            </>
                                        )}
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                            <Text style={styles.cancelText}>Cancel anytime. No commitment.</Text>
                        </GlassCard>


                        <View style={{ alignItems: 'center', marginTop: 20, gap: 10 }}>
                            <TouchableOpacity onPress={handleRestore}>
                                <Text style={{ color: '#888', fontSize: 12, textDecorationLine: 'underline' }}>Restore Purchases</Text>
                            </TouchableOpacity>

                            <View style={styles.footerLinks}>
                                <TouchableOpacity onPress={() => router.push('/terms')}>
                                    <Text style={styles.footerLinkText}>Terms of Service</Text>
                                </TouchableOpacity>
                                <Text style={styles.footerDot}>•</Text>
                                <TouchableOpacity onPress={() => router.push('/privacy')}>
                                    <Text style={styles.footerLinkText}>Privacy Policy</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 10, // Reduced from 40
        paddingBottom: 40,
    },
    contentWrapper: {
        maxWidth: 400,
        width: '100%',
        alignSelf: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 10,
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30, // Reduced from 40
        marginTop: 20, // Reduced from 40
    },
    appTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 1,
        marginBottom: -4,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    },
    appSubtitle: {
        fontSize: 14,
        color: '#E0E0E0',
        fontStyle: 'italic',
        marginBottom: 25,
        textAlign: 'center',
        opacity: 0.9,
    },
    sloganText: {
        fontSize: 16,
        color: '#ccc',
        lineHeight: 26,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-light',
        fontWeight: '300',
    },
    offerCard: {
        padding: 25,
        alignItems: 'center',
        borderRadius: 24,
    },
    badgeContainer: {
        position: 'absolute',
        top: -12,
        alignSelf: 'center',
    },
    badge: {
        backgroundColor: '#D4AF37',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
    },
    priceLarge: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
    },
    periodText: {
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 20,
    },
    featuresList: {
        alignItems: 'flex-start',
        borderLeftWidth: 2,
        borderLeftColor: 'rgba(212, 175, 55, 0.3)',
        paddingLeft: 15,
        marginBottom: 10,
    },
    featureItem: {
        color: '#ddd',
        fontSize: 14,
        marginBottom: 8,
        lineHeight: 20,
    },
    cancelText: {
        color: '#666',
        fontSize: 12,
        marginTop: 15,
    },
    footerLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerLinkText: {
        color: '#888',
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    footerDot: {
        color: '#888',
        fontSize: 12,
        marginHorizontal: 10,
    },
});
