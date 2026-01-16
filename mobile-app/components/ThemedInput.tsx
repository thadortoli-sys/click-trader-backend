import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TextInputProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

interface ThemedInputProps extends Omit<TextInputProps, 'style'> {
    iconName: string;
    iconFamily?: 'Ionicons' | 'FontAwesome';
    style?: StyleProp<ViewStyle>;
    textInputStyle?: StyleProp<TextStyle>;
}

export function ThemedInput({ iconName, iconFamily = 'Ionicons', style, textInputStyle, ...props }: ThemedInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const IconComponent = iconFamily === 'FontAwesome' ? FontAwesome : Ionicons;

    return (
        <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused, style]}>
            <IconComponent
                name={iconName as any}
                size={20}
                color={isFocused ? "#FFF" : "#666"}
                style={styles.inputIcon}
            />
            <TextInput
                style={[styles.inputField, textInputStyle]}
                placeholderTextColor="#666"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 12,
        marginBottom: 15,
        paddingHorizontal: 15,
        height: 55,
    },
    inputContainerFocused: {
        borderColor: '#FFF',
        backgroundColor: '#151515',
    },
    inputIcon: {
        marginRight: 10,
    },
    inputField: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        height: '100%',
    },
});
