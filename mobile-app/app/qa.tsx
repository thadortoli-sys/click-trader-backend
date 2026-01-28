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
                        answer="No. Click&Trader is an Institutional Analysis System. Standard tools often provide prescriptive advice. Our system identifies where institutions are conducting business by mapping structural liquidity and algorithmic triggers, facilitating market observation with institutional precision."
                    />
                    <QAItem
                        question="Why do you reference 'Algorithms' and 'Institutions'?"
                        answer="The market landscape is driven by institutional liquidity. These entities utilize advanced algorithms to target specific zones where high concentrations of retail orders are clustered. Our system detects when these algorithms are active—specifically during structural traps or trend expansions."
                    />
                </QASection>

                <QASection title="THE ALIGNMENTS EXPLAINED">
                    <QAItem
                        question="What is the distinction between Pro4x and Horus?"
                        answer={`Think of them as two distinct analytical modes:\n\n• Pro4x.2 (Trend): The "Macro Flow" system. Operating on the M1 timeframe, it identifies primary directional momentum. Observed structural amplitude: 20-200 points.\n\n• Horus (Volatility): The "Precision" system. It identifies exhaustion and potential technical reactions at specific coordinates. Observed structural amplitude: 10-15+ points depending on volatility magnitude and the specific magnet coordinate.`}
                    />
                    <QAItem
                        question="What is the 'Set up Forming' stage?"
                        answer="OBSERVATION ONLY. This stage indicates the system has detected preliminary positioning, but the alignment is not yet confirmed. Price often oscillates into structural levels to clear remaining liquidity before an expansion. Premature identification of the coordinate is a common technical error."
                    />
                    <QAItem
                        question="What is 'Shadow Mode'?"
                        answer={`Shadow Mode provides visibility on Liquidity Sweeps. It triggers when price action extends aggressively beyond normal statistical ranges.\n\nContext: These are high-volatility, counter-trend alignments.\nRequirement: High-density data observation. Operational complexity: Advanced.`}
                    />
                    <QAItem
                        question="What are 'Syncro' Alignments?"
                        answer={`Syncro validates the Higher Timeframe (H1) context.\n\nWhen a Pro4x alignment occurs simultaneously with an H1 Syncro Bullish, the statistical probability is enhanced due to timeframe confluence.\n\nOperating against the Syncro (e.g., Bearish positioning while Syncro is Bullish) indicates observation against the primary structural tide.`}
                    />
                </QASection>

                <QASection title="KEY LEVELS (COORDINTATES)">
                    <QAItem
                        question="What are the 12 / 23 / 38 / 64 / 91 levels?"
                        answer={`These are not random numbers; they represent Algorithmic Triggers based on historical volume distribution.\n\n• 11-12 & 88-91: Technical Rejection Zones. Where liquidity is often tested.\n• 23 & 76: Inducement Zones. Where structural traps are commonly identified.\n• 38 & 64: Fair Value Zones. Where high-density institutional volume is typically processed.\n\nNote: Analysis often focuses on reactions at these structural edges.`}
                    />
                    <QAItem
                        question="What if price moves through a level with high velocity?"
                        answer="That is a critical data point. If price ignores a coordinate with significant momentum, it indicates an Expansion rather than a reaction. The system then shifts focus to the next structural coordinate."
                    />
                </QASection>

                <QASection title="TECHNICAL BOUNDARIES & DISCIPLINE">
                    <QAItem
                        question="Where is the Technical Boundary (Invalidation)?"
                        answer={`An institutional technical boundary is never arbitrary.\n\n• For Reversal Alignments (Horus/Shadow): The boundary is identified beyond the liquidity sweep (e.g., beyond the 91 or 12 levels).\n\n• For Trend Alignments (Pro4x): The boundary is located at the structural pivot that validated the momentum.\n\nTechnical Principle: If price crosses the technical boundary, the institutional thesis is invalidated.`}
                    />
                    <QAItem
                        question="What are the frequency levels?"
                        answer={`Filtering is available in Settings based on institutional consistency objectives:\n\n• Level 1: Pro4x, Pro4x.2, and Horus Bullish/Bearish. Analyzed with Syncro H1 and ATR context.\n\n• Level 2 (High Frequency): Inclusion of Horus OVS/OVB and Shadow data. Utilizing Horus ADV context, ATR, and Syncro H1.\n\n• Level 3 (Pure High Frequency Data): Focus on Horus OVS/OVB, Shadow, and ATR.`}
                    />
                    <QAItem
                        question="What is the importance of 'One precision execution'?"
                        answer="Market noise can lead to over-analysis. One precision execution captures the core institutional move. The objective is refined identification of high-probability confluence, rather than high-frequency participation."
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
