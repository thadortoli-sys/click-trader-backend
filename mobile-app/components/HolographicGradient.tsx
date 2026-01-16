import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HolographicGradientProps {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    speed?: number;
}

export function HolographicGradient({
    style,
    children,
    speed
}: HolographicGradientProps) {
    return (
        <LinearGradient
            colors={['#1a1a1a', '#000', '#0a0a0a']}
            style={[StyleSheet.absoluteFill, style]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {children}
        </LinearGradient>
    );
}
