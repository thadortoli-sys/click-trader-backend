import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Dimensions, Image, Alert } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
// Reanimated Removed
// import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence } from 'react-native-reanimated';
import { ThemedInput } from '../components/ThemedInput';
import { ThemedButton } from '../components/ThemedButton';
import { GlassCard } from '../components/GlassCard';
import { HolographicGradient } from '../components/HolographicGradient';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../utils/supabase';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin, statusCodes } from '../utils/googleSignin';

// Configure Google Sign-In (Get Web Client ID from Google Cloud Console)
GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/userinfo.email'],
    webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com', // TODO: REPLACE THIS
});

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const [pendingVerification, setPendingVerification] = React.useState(false);

    // --- SUPABASE OTP LOGIC ---
    const handleSendMagicCode = async () => {
        if (!email.includes('@')) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;

            setPendingVerification(true);
            Alert.alert('Code Sent', `We sent a magic code to ${email}. Check your inbox!`);
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (otp.length < 6) return;
        setLoading(true);

        try {
            const { error: verifyError, data } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'email',
            });

            if (verifyError) throw verifyError;

            // Session updates automatically via AuthContext
            router.replace('/');
        } catch (error: any) {
            Alert.alert('Verification Failed', error.message || 'Invalid code');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            // Check for idToken in data (v11+) or top level (older)
            const response = await GoogleSignin.signIn();
            const idToken = (response as any).data?.idToken || (response as any).idToken;

            if (idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: idToken, // Use extracted token
                });
                if (error) throw error;
                // Session updates automatically via AuthContext
            } else {
                throw new Error('No ID token present!');
            }
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                Alert.alert('Error', 'Google Play Services not available');
            } else {
                Alert.alert('Google Login Error', error.message);
            }
        }
    };

    const handleAppleLogin = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            if (credential.identityToken) {
                const { error } = await supabase.auth.signInWithIdToken({
                    provider: 'apple',
                    token: credential.identityToken,
                });
                if (error) throw error;
                // Session updates automatically
            } else {
                throw new Error('No Identity Token.');
            }
        } catch (e: any) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
                // handle that the user canceled the sign-in flow
            } else {
                Alert.alert('Apple Login Error', e.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <HolographicGradient />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.contentWrapper}>

                        {/* Logo & Headline */}
                        <View style={styles.header}>
                            <Image
                                source={require('../assets/images/logo-ct.png')}
                                style={{ width: 80, height: 80, resizeMode: 'contain', marginBottom: 15 }}
                            />
                            <Text style={styles.title}>Click&Trader</Text>
                            <Text style={styles.subtitle}>Institutional Grade Access</Text>
                        </View>

                        {/* 1. TRUST ANCHORS (Apple/Google) */}
                        {!pendingVerification && (
                            <>
                                <View style={styles.socialContainer}>
                                    <GlassCard
                                        intensity={20}
                                        style={styles.socialButtonGlass}
                                        onPress={handleGoogleLogin}
                                    >
                                        <View style={styles.socialButtonContent}>
                                            <AntDesign name="google" size={20} color="white" />
                                            <Text style={styles.socialButtonText}>Google</Text>
                                        </View>
                                    </GlassCard>

                                    {Platform.OS === 'ios' && (
                                        <GlassCard
                                            intensity={20}
                                            style={styles.socialButtonGlass}
                                            onPress={handleAppleLogin}
                                        >
                                            <View style={styles.socialButtonContent}>
                                                <FontAwesome name="apple" size={20} color="white" />
                                                <Text style={styles.socialButtonText}>Apple</Text>
                                            </View>
                                        </GlassCard>
                                    )}
                                </View>

                                <View style={styles.dividerContainer}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>OR SECURE EMAIL</Text>
                                    <View style={styles.dividerLine} />
                                </View>
                            </>
                        )}

                        {/* 2. AUTH FORM (Switch between Email & OTP) */}
                        <GlassCard intensity={30} style={styles.formGlass} borderRadius={24}>
                            {!pendingVerification ? (
                                // STATE A: EMAIL INPUT
                                <>
                                    <ThemedInput
                                        iconName="mail-outline"
                                        placeholder="professional@email.com"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                    <ThemedButton
                                        title={loading ? "SENDING CODE..." : "SEND MAGIC CODE"}
                                        onPress={handleSendMagicCode}
                                        style={{ marginTop: 20 }}
                                        icon="flash"
                                    />
                                    <Text style={styles.secureNote}>
                                        <AntDesign name="lock" /> Bank-grade security. No password required.
                                    </Text>
                                </>
                            ) : (
                                // STATE B: OTP INPUT
                                <>
                                    <Text style={styles.otpHeader}>Enter Security Code</Text>
                                    <Text style={styles.otpSubHeader}>
                                        Sent to <Text style={{ color: 'white', fontWeight: 'bold' }}>{email}</Text>{"\n"}
                                        <Text style={{ fontSize: 12, color: '#FFD700' }}>⚠ Search for the 6-digit code. Ignore the link.</Text>
                                    </Text>

                                    <ThemedInput
                                        iconName="shield-checkmark-outline"
                                        placeholder="123 456"
                                        keyboardType="number-pad"
                                        value={otp}
                                        onChangeText={setOtp}
                                        autoFocus={true}
                                        maxLength={6}
                                        textAlign="center"
                                        textInputStyle={{ fontSize: 24, letterSpacing: 8, fontWeight: 'bold' }}
                                    />

                                    <ThemedButton
                                        title={loading ? "VERIFYING..." : "UNLOCK ACCESS"}
                                        onPress={handleVerifyCode}
                                        style={{ marginTop: 20 }}
                                    />

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 20 }}>
                                        <TouchableOpacity onPress={handleSendMagicCode}>
                                            <Text style={{ color: '#888', fontSize: 13, textDecorationLine: 'underline' }}>Resend Code</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setPendingVerification(false)}>
                                            <Text style={{ color: '#888', fontSize: 13, textDecorationLine: 'underline' }}>Change Email</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </GlassCard>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        justifyContent: 'center',
        padding: 20,
        paddingTop: 60,
    },
    contentWrapper: {
        maxWidth: 400,
        width: '100%',
        alignSelf: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 30,
    },
    socialButtonGlass: {
        flex: 1,
        padding: 0,
    },
    socialButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 14,
    },
    socialButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#333',
    },
    dividerText: {
        color: '#666',
        paddingHorizontal: 16,
        fontSize: 12,
        fontWeight: 'bold',
    },
    formGlass: {
        marginBottom: 30,
        padding: 20,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: 8,
    },
    forgotPasswordText: {
        color: '#D4AF37',
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#888',
        fontSize: 14,
    },
    footerLink: {
        color: '#D4AF37',
        fontSize: 14,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 1,
        marginBottom: 5,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif',
    },
    subtitle: {
        fontSize: 14,
        color: '#ccc',
        fontStyle: 'italic',
        textAlign: 'center',
        opacity: 0.9,
        maxWidth: 250,
    },
    secureNote: {
        color: '#888',
        fontSize: 12,
        marginTop: 15,
        textAlign: 'center',
    },
    otpHeader: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    otpSubHeader: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
});
