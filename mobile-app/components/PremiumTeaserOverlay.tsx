import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

interface PremiumTeaserOverlayProps {
    message?: string;
}

export function PremiumTeaserOverlay({ message = "PREMIUM ACCESS ONLY" }: PremiumTeaserOverlayProps) {
    const router = useRouter();

    return (
        <View style={styles.container} pointerEvents="box-none">
            {/* Backdrop Blur / Darken */}
            <View style={styles.backdrop} pointerEvents="none" />

            <View style={styles.content} pointerEvents="box-none">
                <View style={styles.iconCircle}>
                    <Ionicons name="lock-closed" size={32} color="#D4AF37" />
                </View>

                <Text style={styles.title}>{message}</Text>

                <Text style={styles.subtitle}>
                    Unlock this feature with a Pro subscription.{'\n'}
                    Institutional grade tools at your fingertips.{'\n'}
                    <Text style={{ fontStyle: 'italic', color: '#888' }}>(Scroll to preview content)</Text>
                </Text>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push('/premium')}
                    style={styles.buttonContainer}
                >
                    <LinearGradient
                        colors={['#1a1a1a', '#000000']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.button}
                    >
                        <Ionicons name="flash" size={16} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.buttonText}>UNLOCK NOW</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100, // Top of everything
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        // Content behind visible but disabled.
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    content: {
        alignItems: 'center',
        padding: 30,
        width: '100%',
    },
    iconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        color: '#CCCCCC',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 30,
        maxWidth: 260,
    },
    buttonContainer: {
        width: 200,
        shadowColor: "#D4AF37",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    button: {
        height: 50,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    }
});
