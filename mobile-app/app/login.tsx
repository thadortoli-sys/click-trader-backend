import React from 'react';
import { StyleSheet, Text, View, Platform, Dimensions, Image, Alert, TouchableOpacity } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
// import { GlassCard } from '../components/GlassCard'; // Unused now
import { HolographicGradient } from '../components/HolographicGradient';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../utils/supabase';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin, statusCodes } from '../utils/googleSignin';

// Configure Google Sign-In
GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/userinfo.email'],
    webClientId: '284893241094-mdh8lndp6vfn8bkif0p74dp67iupgiah.apps.googleusercontent.com',
});

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            // Check for idToken
            const response = await GoogleSignin.signIn();
            const idToken = (response as any).data?.idToken || (response as any).idToken;

            if (idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: idToken,
                });
                if (error) throw error;
                // Session updates automatically via AuthContext
            } else {
                throw new Error('No ID token present!');
            }
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // cancelled
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // in progress
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Error', 'Google Play Services not available');
            } else {
                Alert.alert('Google Login Error', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAppleLogin = async () => {
        try {
            setLoading(true);
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
                // canceled
            } else {
                Alert.alert('Apple Login Error', e.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <HolographicGradient />

            <View style={styles.contentWrapper}>

                {/* Logo & Headline */}
                <View style={styles.header}>
                    <Image
                        source={require('../assets/images/logo-ct.png')}
                        style={{ width: 100, height: 100, resizeMode: 'contain', marginBottom: 20 }}
                    />
                    <Text style={styles.title}>Click&Trader</Text>
                    <Text style={styles.subtitle}>Institutional Grade Access</Text>
                </View>

                {/* Social Login Buttons */}
                <View style={styles.authContainer}>
                    <TouchableOpacity
                        style={styles.socialButton}
                        activeOpacity={0.8}
                        onPress={handleGoogleLogin}
                    >
                        <LinearGradient
                            colors={['#333', '#000']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.socialButtonBorder} />
                        <View style={styles.socialButtonContent}>
                            <AntDesign name="google" size={24} color="white" />
                            <Text style={styles.socialButtonText}>Continue with Google</Text>
                        </View>
                    </TouchableOpacity>

                    {Platform.OS === 'ios' && (
                        <TouchableOpacity
                            style={[styles.socialButton, { marginTop: 16 }]}
                            activeOpacity={0.8}
                            onPress={handleAppleLogin}
                        >
                            <LinearGradient
                                colors={['#333', '#000']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={StyleSheet.absoluteFill}
                            />
                            <View style={styles.socialButtonBorder} />
                            <View style={styles.socialButtonContent}>
                                <FontAwesome name="apple" size={24} color="white" />
                                <Text style={styles.socialButtonText}>Continue with Apple</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Privacy Reassurance */}
                <View style={styles.trustFooter}>
                    <View style={styles.trustBadge}>
                        <AntDesign name="safety" size={16} color="#888" />
                        <Text style={styles.trustText}>Secure Authentication</Text>
                    </View>
                    <Text style={styles.trustDisclaimer}>
                        We do not accept personal email addresses for security reasons. Please use your verified Google or Apple account.
                    </Text>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
    },
    contentWrapper: {
        width: '100%',
        paddingHorizontal: 30,
        maxWidth: 400,
        alignSelf: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
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
    },
    authContainer: {
        width: '100%',
        marginBottom: 40,
    },
    socialButton: {
        borderRadius: 16,
        overflow: 'hidden',
        height: 60, // Explicit height
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    socialButtonBorder: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
    },
    socialButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
        height: '100%', // Fill the container
    },
    socialButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    trustFooter: {
        alignItems: 'center',
    },
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
        opacity: 0.8,
    },
    trustText: {
        color: '#888',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    trustDisclaimer: {
        color: '#666',
        fontSize: 11,
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 16,
    },
});
