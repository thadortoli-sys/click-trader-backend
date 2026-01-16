import React from 'react';
import { StyleSheet, View, ViewStyle, Platform, StyleProp, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassCardProps extends TouchableOpacityProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: number; // 0-100, default 20
    tint?: 'light' | 'dark' | 'default';
    borderColor?: string;
    glowColor?: string;
    backgroundColor?: string; // Custom background color
    rainbowBorder?: boolean;
    contentStyle?: StyleProp<ViewStyle>;
    disableGradient?: boolean;
    borderWidth?: number;
    borderRadius?: number;
}

export function GlassCard({
    children,
    style,
    intensity = 20,
    tint = 'dark',
    borderColor = 'rgba(255, 255, 255, 0.1)',
    glowColor,
    backgroundColor = 'rgba(0, 0, 0, 0.2)',
    rainbowBorder,
    contentStyle,
    disableGradient = false,
    borderWidth = 1,
    borderRadius = 20,
    onPress,
    ...props
}: GlassCardProps) {
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container style={[styles.container, style, { borderRadius }]} onPress={onPress} activeOpacity={0.8} {...props}>
            {/* Blur Background */}
            {Platform.OS !== 'web' ? (
                <BlurView
                    intensity={intensity}
                    tint={tint}
                    style={StyleSheet.absoluteFill}
                />
            ) : (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]} />
            )}

            {/* Dark overlay for extra darkness if backgroundColor is set */}
            {backgroundColor !== 'rgba(0, 0, 0, 0.2)' && (
                <View style={[StyleSheet.absoluteFill, { backgroundColor }]} />
            )}

            {/* Gradient Overlay for depth */}
            {!disableGradient && (
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
            )}

            {/* Border */}
            <View style={[styles.border, { borderColor, borderWidth, borderRadius }]} />

            {/* Glow effect */}
            {glowColor && (
                <View style={[styles.glow, {
                    shadowColor: glowColor,
                    borderColor: glowColor,
                    borderWidth,
                    opacity: 0.5,
                    borderRadius
                }]} />
            )}

            {/* Content */}
            <View style={[styles.content, contentStyle]}>
                {children}
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    border: {
        ...StyleSheet.absoluteFillObject,
        pointerEvents: 'none',
    },
    glow: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.2,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 30,
        elevation: 20,
    },
    content: {
        padding: 20,
        flex: 1,
    },
});
