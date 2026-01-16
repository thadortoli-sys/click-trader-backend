import React, { useEffect, useRef } from 'react';
import { StyleSheet, StyleProp, ViewStyle, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Create Native Animated Linear Gradient
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface AnimatedGradientProps {
    colors: [string, string, ...string[]];
    style?: StyleProp<ViewStyle>;
    speed?: number; // Duration in ms, default 3000
    children?: React.ReactNode;
}

export function AnimatedGradient({
    colors,
    style,
    speed = 3000,
    children
}: AnimatedGradientProps) {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: 1,
                    duration: speed,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false // transform scale/opacity works with native driver usually, but safely use false for components if needed? 
                    // Wait, createAnimatedComponent(LinearGradient) supports native driver? 
                    // Usually yes on standard props. Let's try native: false to be ultra-safe against crashes.
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: speed,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false
                })
            ])
        ).start();
    }, [speed]);

    // Interpolate for effects
    const opacity = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.95]
    });

    const scale = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.02]
    });

    return (
        <AnimatedLinearGradient
            colors={colors}
            style={[StyleSheet.absoluteFill, { opacity, transform: [{ scale }] }, style]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {children}
        </AnimatedLinearGradient>
    );
}
