import React from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';

interface ProfitTickerProps {
    startValue: number;
    endValue: number;
    style?: StyleProp<TextStyle>;
    duration?: number;
}

export const ProfitTicker = ({ startValue, endValue, style, duration = 2000 }: ProfitTickerProps) => {
    const [value, setValue] = React.useState(startValue);

    React.useEffect(() => {
        let current = startValue;
        const steps = 40;
        const stepValue = (endValue - startValue) / steps;
        const intervalTime = duration / steps;

        const timer = setInterval(() => {
            current += stepValue;
            if (current >= endValue) {
                current = endValue;
                clearInterval(timer);
            }
            setValue(Math.floor(current));
        }, intervalTime);

        return () => clearInterval(timer);
    }, [endValue]);

    return (
        <Text style={[{ color: '#4CAF50', fontWeight: 'bold', fontSize: 13, letterSpacing: 1 }, style]}>
            +${value}
        </Text>
    );
};
