import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, Platform, StyleProp, TextStyle, View, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// Reanimated Removed
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

// Standard Animated Touchable
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ThemedButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'blue';
    textStyle?: StyleProp<TextStyle>;
    icon?: keyof typeof Ionicons.glyphMap;
}

export function ThemedButton({ title, variant = 'primary', style, onPress, textStyle, icon, ...props }: ThemedButtonProps) {
    // Native Animated Values
    const scale = useRef(new Animated.Value(1)).current;
    const glowOpacity = useRef(new Animated.Value(0)).current;

    const getColors = (): readonly [string, string, ...string[]] => {
        if (variant === 'blue') return ['#4c669f', '#3b5998'];
        if (variant === 'secondary') return ['#333', '#111'];
        return ['#1a1a1a', '#000'];
    };

    const handlePressIn = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        Animated.parallel([
            Animated.spring(scale, {
                toValue: 0.95,
                useNativeDriver: true,
                speed: 20
            }),
            Animated.timing(glowOpacity, {
                toValue: 0.6,
                duration: 150,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
                speed: 20
            }),
            Animated.timing(glowOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handlePress = (e: any) => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.(e);
    };

    return (
        <AnimatedTouchable
            activeOpacity={0.9}
            style={[{ transform: [{ scale }] }, style]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            {...props}
        >
            {/* Glow effect */}
            <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

            {/* Main gradient */}
            <LinearGradient
                colors={getColors()}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {icon && <Ionicons name={icon} size={20} color="white" />}
                    <Text style={[styles.text, textStyle]}>{title}</Text>
                </View>
            </LinearGradient>
        </AnimatedTouchable>
    );
}

const styles = StyleSheet.create({
    gradient: {
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        overflow: 'hidden',
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    glow: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 16,
        backgroundColor: 'white',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
});
