import { Platform, TextStyle } from 'react-native';

/**
 * Typography System for Click&Trader
 * Consistent font styles across the application
 */

const fontFamily = Platform.OS === 'ios' ? 'Avenir Next' : 'sans-serif';

// Display Styles (Large Impact Text)
export const display1: TextStyle = {
    fontFamily,
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 1,
    lineHeight: 44,
};

export const display2: TextStyle = {
    fontFamily,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    lineHeight: 40,
};

// Headings
export const h1: TextStyle = {
    fontFamily,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    lineHeight: 36,
};

export const h2: TextStyle = {
    fontFamily,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
    lineHeight: 32,
};

export const h3: TextStyle = {
    fontFamily,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 28,
};

export const h4: TextStyle = {
    fontFamily,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 26,
};

export const h5: TextStyle = {
    fontFamily,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    lineHeight: 24,
};

export const h6: TextStyle = {
    fontFamily,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    lineHeight: 20,
};

// Body Text
export const body1: TextStyle = {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.3,
    lineHeight: 24,
};

export const body2: TextStyle = {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.25,
    lineHeight: 22,
};

export const body3: TextStyle = {
    fontFamily,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.25,
    lineHeight: 20,
};

// Labels & UI Text
export const label1: TextStyle = {
    fontFamily,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 24,
};

export const label2: TextStyle = {
    fontFamily,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 20,
};

export const label3: TextStyle = {
    fontFamily,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 18,
};

// Button Text
export const button1: TextStyle = {
    fontFamily,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    lineHeight: 22,
};

export const button2: TextStyle = {
    fontFamily,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    lineHeight: 20,
};

// Caption & Small Text
export const caption1: TextStyle = {
    fontFamily,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.4,
    lineHeight: 18,
};

export const caption2: TextStyle = {
    fontFamily,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    lineHeight: 16,
};

export const caption3: TextStyle = {
    fontFamily,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 14,
};

// Overline (Uppercase Labels)
export const overline1: TextStyle = {
    fontFamily,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    lineHeight: 20,
    textTransform: 'uppercase',
};

export const overline2: TextStyle = {
    fontFamily,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    lineHeight: 16,
    textTransform: 'uppercase',
};

export const overline3: TextStyle = {
    fontFamily,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    lineHeight: 14,
    textTransform: 'uppercase',
};

// Price/Number Display
export const price1: TextStyle = {
    fontFamily,
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 0,
    lineHeight: 56,
};

export const price2: TextStyle = {
    fontFamily,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 0,
    lineHeight: 40,
};

// Export all as a single object for convenience
export const Typography = {
    display1,
    display2,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    body1,
    body2,
    body3,
    label1,
    label2,
    label3,
    button1,
    button2,
    caption1,
    caption2,
    caption3,
    overline1,
    overline2,
    overline3,
    price1,
    price2,
};
