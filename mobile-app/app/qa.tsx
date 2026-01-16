import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function QAScreen() {
    const router = useRouter();

    const QASection = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );

    const QAItem = ({ question, answer }: { question: string, answer: string }) => (
        <View style={styles.item}>
            <Text style={styles.question}>{question}</Text>
            <Text style={styles.answer}>{answer}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={['#111', '#000']}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SYSTEM Q&A</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                
                <QASection title="PHILOSOPHY & BASICS">
                    <QAItem 
                        question="Is this a 'Signal Service'?"
                        answer="No. Click&Trader is an Institutional Execution System. 'Signals' tell you what to do. Our system tells you where the institutions are doing business. We map liquidity, stop hunts, and algorithmic triggers so you can trade with the market makers, not against them."
                    />
                    <QAItem 
                        question="Why do you talk about 'Algorithms' and 'Institutions'?"
                        answer="Retail traders move price by emotion (FOMO, panic). Institutions move price by liquidity. They use algorithms to target specific zones where retail orders are clustered. Our system detects when these algorithms are active—specifically when they are trapping traders (Stop Hunts) or initiating a trend (Expansion)."
                    />
                </QASection>

                <QASection title="THE ALERTS EXPLAINED">
                    <QAItem 
                        question="What is the difference between Pro4x and Horus?"
                        answer={`Think of them as two different gears:\n\n• Pro4x.2 (Trend): The "Travel Light" system. It follows the main flow. It targets larger moves (20-150 points). It's patient and slower.\n\n• Horus (Scalp): The "Sniper" system. It hunts for exhaustion and reversals. It targets quick precision strikes (10-15 points) at key levels.`}
                    />
                    <QAItem 
                        question="What does 'Get Ready' (GR) mean?"
                        answer="DO NOT ENTER. GR means 'Put your hands on the mouse, but wait.' The system detects early positioning, but the trap isn't closed yet. Price often pushes one last time into a Magnet Level to clear stops before reversing. Making the entry on GR is the #1 mistake of rookies."
                    />
                    <QAItem 
                        question="What is 'Shadow Mode'?"
                        answer={`Shadow Mode creates visibility on Liquidity Sweeps. It triggers when price aggressively hunts stops beyond the normal range.\n\nWarning: These are high-volatility, counter-trend setups.\nFor who: Experts only. If you are new, disable "Shadow" in your settings.`}
                    />
                    <QAItem 
                        question="What are the 'Syncro' alerts?"
                        answer={`Syncro checks the Higher Timeframe (H1) context.\n\nIf you get a Pro4x Buy AND an H1 Syncro Bullish, the probability is maximal because the trend is aligned on multiple timeframes.\n\nIf you trade against the Syncro (e.g., Shorting while Syncro is Bullish), you are scalping against the tide. Be quick or stay out.`}
                    />
                </QASection>

                <QASection title="KEY LEVELS (MAGNETS)">
                    <QAItem 
                        question="What are the 12 / 23 / 38 / 64 / 91 levels?"
                        answer={`These are not random Fibonacci numbers. They are Algorithmic Triggers.\n\n• 11-12% & 88-91%: The "Kill Zones". Where stops are hunted.\n• 23% & 76%: The "Inducement Zones". Where retail gets trapped.\n• 38% & 64%: The "Fair Value". Where real business volume happens.\n\nTip: We rarely enter "in the middle". We wait for price to react at these edges.`}
                    />
                    <QAItem 
                        question="What if price blows through a level?"
                        answer="That's information too. If price ignores a magnet level with high velocity, it's not a reversal—it's an Expansion. Wait for the next magnet. Never stand in front of a freight train."
                    />
                </QASection>

                <QASection title="RISK & DISCIPLINE">
                    <QAItem 
                        question="Where should I place my Stop Loss?"
                        answer={`An institutional stop is never random.\n\n• For a Reversal (Horus/Shadow): Your stop goes below the liquidity sweep (below the 91 or 12).\n\n• For a Trend (Pro4x): Your stop goes below the structure that validated the trend.\n\nGold Rule: If your stop is hit, the institutional thesis is invalid. Get out. Don't pray.`}
                    />
                    <QAItem 
                        question="I'm getting too many alerts. What should I do?"
                        answer={`Go to Settings.\n\n• Beginner? Turn OFF Shadow, Horus OVS/OVB, and Syncro. Keep only Pro4x.2 (Buy/Sell). Focus on 1-2 good trades a day.\n\n• Intermediate? Add Horus Buy/Sell for more frequency.\n\n• Advanced? Turn everything on, but filter with your eyes.`}
                    />
                    <QAItem 
                        question="Why do you say 'One clean trade is enough'?"
                        answer="Overtrading is the casino's edge. One precision execution captures the daily range. The rest is just noise and risk. The goal is not to trade more, it's to trade less but better."
                    />
                </QASection>

                <View style={{ height: 50 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    backButton: {
        padding: 5,
        marginRight: 15,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 40,
    },
    sectionTitle: {
        color: '#D4AF37', // Gold
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 20,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    item: {
        marginBottom: 25,
    },
    question: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
        lineHeight: 22,
    },
    answer: {
        color: '#AAA',
        fontSize: 14,
        lineHeight: 22,
    },
});
