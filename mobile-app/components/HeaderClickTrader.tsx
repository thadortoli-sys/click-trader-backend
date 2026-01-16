import React from "react";
import { View, Text, StyleSheet, Platform, Image } from "react-native";

export default function HeaderClickTrader() {
    return (
        <View style={styles.wrap}>
            {/* 1. The Logo (PNG Image for exact C&T look) */}
            <Image
                source={require("../assets/images/ct-flat.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            {/* 2. The Text (Native Code for sharpness) */}
            <View style={styles.textBlock}>
                <Text style={styles.title}>Click&Trader</Text>
                <Text style={styles.tagline}>
                    Your trading companion in the palm of your hand
                </Text>
            </View>
        </View>
    );
}

const LOGO_H = 50; // Slightly smaller to fit nicely

const styles = StyleSheet.create({
    wrap: {
        backgroundColor: "#000",
        paddingHorizontal: 15, // Reduced padding to fit wide text if needed
        paddingTop: 14,
        paddingBottom: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", // Center the whole block
        gap: 12,
    },

    logo: {
        height: LOGO_H,
        width: LOGO_H * 1.8, // Aspect ratio for C&T (~2:1)
    },

    textBlock: {
        justifyContent: "center",
    },

    title: {
        color: "#FFF",
        fontSize: 26, // Adjusted to fit line
        fontWeight: "800",
        letterSpacing: 0.2,
        lineHeight: 30,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    },

    tagline: {
        marginTop: 2,
        color: "rgba(255,255,255,0.6)",
        fontSize: 10,
        fontStyle: "italic",
        lineHeight: 12,
    },
});
