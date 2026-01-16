import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ThemedCardProps extends ViewProps {
    variant?: 'rainbow' | 'midnight';
    children: React.ReactNode;
}

const RAINBOW_COLORS = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];
const MIDNIGHT_COLORS = ['#4c669f', '#3b5998', '#192f6a', '#000000', '#4B0082'];

export const ThemedCard = React.memo(({ variant = 'rainbow', children, style, ...props }: ThemedCardProps) => {
    const colors = variant === 'midnight' ? MIDNIGHT_COLORS : RAINBOW_COLORS;

    return (
        <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradientBorder, style]}
            {...props as any}
        >
            <View style={styles.innerContent}>
                {children}
            </View>
        </LinearGradient>
    );
});

const styles = StyleSheet.create({
    gradientBorder: {
        borderRadius: 26,
        padding: 1.5,
        width: '100%',
    },
    innerContent: {
        borderRadius: 25, // gradient border radius - padding (approx)
        backgroundColor: '#0a0a0a',
        padding: 20,
        overflow: 'hidden',
    },
});
