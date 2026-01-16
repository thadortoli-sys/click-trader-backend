/**
 * Rainbow & Holographic Color System
 * Subtle, premium rainbow effects for Click&Trader
 */

// Pastel Rainbow Colors (Very Subtle)
export const rainbow = {
    // Soft pastels
    rose: '#FFE5F1',
    coral: '#FFD4D4',
    peach: '#FFE4CC',
    cream: '#FFF9E6',
    mint: '#E6FFF0',
    sky: '#E6F4FF',
    lavender: '#F0E6FF',
    lilac: '#FFE6FA',

    // Darker but still soft
    roseDark: '#FF8FB8',
    coralDark: '#FF9A9A',
    peachDark: '#FFB380',
    creamDark: '#FFE699',
    mintDark: '#80FFB8',
    skyDark: '#80C8FF',
    lavenderDark: '#B380FF',
    lilacDark: '#FF80E5',
};

// Holographic/Iridescent Gradients
export const holographic = {
    // Subtle rainbow for borders
    border: [
        'rgba(255, 133, 184, 0.3)', // Rose
        'rgba(255, 179, 128, 0.3)', // Peach
        'rgba(255, 230, 153, 0.3)', // Cream
        'rgba(128, 255, 184, 0.3)', // Mint
        'rgba(128, 200, 255, 0.3)', // Sky
        'rgba(179, 128, 255, 0.3)', // Lavender
    ],

    // Very subtle background
    backgroundSubtle: [
        'rgba(255, 133, 184, 0.03)',
        'rgba(128, 200, 255, 0.03)',
        'rgba(179, 128, 255, 0.03)',
    ],

    // Medium intensity for active states
    backgroundMedium: [
        'rgba(255, 133, 184, 0.08)',
        'rgba(255, 179, 128, 0.08)',
        'rgba(128, 255, 184, 0.08)',
        'rgba(128, 200, 255, 0.08)',
        'rgba(179, 128, 255, 0.08)',
    ],

    // Shimmer effect
    shimmer: [
        'rgba(255, 255, 255, 0.0)',
        'rgba(255, 255, 255, 0.3)',
        'rgba(255, 255, 255, 0.0)',
    ],
};

// Premium card colors (Apple Card style)
export const premium = {
    // Titanium/Metal gradients with rainbow hints
    cardGradient: [
        '#1a1a1a',
        'rgba(255, 133, 184, 0.05)', // Hint of rose
        '#000000',
        'rgba(128, 200, 255, 0.05)', // Hint of blue
        '#0a0a0a',
    ],

    // Gold with rainbow tint
    goldHolographic: [
        '#D4AF37',
        'rgba(255, 179, 128, 0.4)', // Peachy gold
        '#FFD700',
        'rgba(255, 230, 153, 0.4)', // Creamy gold
    ],
};

// Signal-specific rainbow colors (subtle versions)
export const signalRainbow = {
    buy: {
        primary: 'rgba(128, 200, 255, 0.8)',    // Soft blue
        gradient: [
            'rgba(128, 200, 255, 0.2)',
            'rgba(128, 255, 184, 0.2)',         // Blue to mint
        ],
    },
    sell: {
        primary: 'rgba(255, 133, 184, 0.8)',    // Soft rose
        gradient: [
            'rgba(255, 133, 184, 0.2)',
            'rgba(255, 179, 128, 0.2)',         // Rose to peach
        ],
    },
    ready: {
        primary: 'rgba(128, 255, 184, 0.8)',    // Soft mint
        gradient: [
            'rgba(128, 255, 184, 0.2)',
            'rgba(255, 230, 153, 0.2)',         // Mint to cream
        ],
    },
    neutral: {
        primary: 'rgba(179, 128, 255, 0.8)',    // Soft lavender
        gradient: [
            'rgba(179, 128, 255, 0.2)',
            'rgba(255, 133, 184, 0.2)',         // Lavender to rose
        ],
    },
};

// Export all
export const RainbowColors = {
    rainbow,
    holographic,
    premium,
    signalRainbow,
};
