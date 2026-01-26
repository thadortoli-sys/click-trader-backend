// Force Refresh v3
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity, Dimensions, Animated, Easing, Modal, Image, ActionSheetIOS } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import { HolographicGradient } from '../components/HolographicGradient';
import VideoPlayer from '../components/VideoPlayer';
import { useAuth } from '../context/AuthContext';
import { PremiumTeaserOverlay } from '../components/PremiumTeaserOverlay';

const { width, height } = Dimensions.get('window');

// --- DATA SECTIONS ---
// HMR Force Update: 2650

interface SignalGuideItem {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    description: string;
    action: string;
    education?: {
        theoryImage: any;
        realCapture?: any; // Placeholder for user tradingview screenshots
        explanation: string | { buy: string; sell: string } | Array<{ title: string; subtitle?: string; content: string; proTip?: string }>;
        proTip: string | { buy: string; sell: string } | null; // Null if using array sections
        videoUrl?: any;
        videoModules?: { buy: any; sell: any };
        videoTabLabels?: { buy: string; sell: string };
        videoAspectRatio?: number;
        videoCaption?: string;
        videoSpeed?: number;
    };
}

interface VisualEducationItem {
    title: string;
    subtitle: string;
    image: any;
    explanation: string | { buy: string; sell: string } | Array<{ title: string; subtitle?: string; content: string; proTip?: string }>;
    proTip: string | { buy: string; sell: string } | null;
    realCapture?: any; // To support the toggle in the gallery too
    videoUrl?: string;
    videoModules?: { buy: any; sell: any };
    videoTabLabels?: { buy: string; sell: string };
    videoAspectRatio?: number;
    videoCaption?: string;
    videoSpeed?: number;
}

const SECTION_0_DISCIPLINE: SignalGuideItem[] = [
    {
        title: 'EXIT PROTOCOLS',
        icon: 'shield-checkmark-outline',
        color: '#FF4444',
        description: 'the system does not provide exit data.\n\n• Management: All position management remains at the full discretion of the analytical profile.\n\n• Risk Parameters: Professional technical analysis involves pre-defined invalidation points for every configuration.\n\n• Structural Shifts: Securing positions is a standard technical practice when market structure shifts.\n\n• Trend Following: Trailing stops are technical tools used to follow institutional flow during extended cycles.',
        action: 'Strict Adherence to Rules Required.',
    },
];

const SECTION_1_PRO4X: SignalGuideItem[] = [
    {
        title: 'Pro4x Set up Forming',
        icon: 'pulse-outline',
        color: '#FFD700',
        description: 'The key price levels have been reached.\n\nDepending on the context, this area identifies a high-density reaction zone. It primarily serves as a pre-analytical notification.\n\nIt warns that a potential technical alignment is forming and that a Validation alert may follow — or not.\n\nN.B. You can expect an average of 8 Get Ready notifications per US session.\n\nObservation: Wait for the system to confirm the reaction at the level.',
        action: 'Strict Adherence to Rules Required.',
        education: {
            theoryImage: require('../assets/images/education/get_ready.png'),
            realCapture: require('../assets/images/wtc_7_premium.png'),
            explanation: [
                {
                    title: 'Analytical Behavior',
                    content: 'The Pro4x Set up Forming status is triggered when the PRO4X model identifies that price is approaching a High-Probability Magnet Level. It serves as a technical countdown for market participants.'
                },
                {
                    title: 'What it identifies:',
                    content: '• Liquidity Reach: Price has entered a zone where institutional algorithms typically stabilize.\n\n• Structural Alignment: Momentum and pressure are converging toward a technical extreme.\n\n• Pre-Analysis: This phase alerts the user to prepare for a potential technical validation.'
                },
                {
                    title: 'The "Golden Rules"',
                    content: '• Observation First: Pro4x Set up Forming alert is an informational tool. It defines where the market is heading, not what action to take.\n\n• ATR Correlation: The timeframe for stabilization (M1 waves) is dictated by the current volatility environment.\n\n• Role of the System: The system maps the coordinates (12/23/38/64/91); the user observes the technical reclaim of the level.',
                    proTip: 'View "Pro4x Set up Forming" as a volatility compass. It eliminates noise by focusing your attention on the only numbers that historically influence institutional flow.'
                }
            ],
            proTip: null
        }
    },
    {
        title: 'Bullish Structural Alignment',
        icon: 'trending-up-outline',
        color: '#4ADE80',
        description: 'Detected by Pro4x & Pro4x.2 System\n\n• This represents a confirmed bullish structural configuration.\n\n• All required conditions converge at a key level, indicating a high-probability technical setup.\n\n• Depending on ATR volatility, the market may present a liquidity hunt extension (stop hunt) before a potential reversal.\n\n• During these sequences, the appearance of multiple notifications in the same area is frequent.\n\n• Careful study of the level alignment displayed in the notification is required.\n\n• The configuration is technically validated after a price pullback and a retest of the exact level.\n\n• Immediate reaction is not required upon data delivery; observation of price stabilization is prioritized.\n\nSTATISTICS & PERFORMANCE\n\n• Statistically, between 5 and 7 technical convergence points are identified per US session.\n\n• Important: The absence of notifications indicates that market conditions do not meet the strict structural parameters. This is standard system behavior.\n\nTECHNICAL NOTE: Price alignment with a 12/23/38/64/91 magnet level and a minimum H4 structural support is necessary for analysis. High timeframe context remains the priority.\n\nAnalytical discipline and patience are fundamental components of the system. Notifications indicate high-probability data zones and do not constitute financial guarantees.',
        action: 'Strict Adherence to Rules Required.',
        education: {
            theoryImage: require('../assets/images/education/pro4x_buy.png'),
            realCapture: require('../assets/images/wtc_2_premium.png'),
            explanation: 'LIVE EXECUTION — PRO4X INSTITUTIONAL BULLISH\n\nThis Bullish signal is not a random alert.\nIt already displays the best statistically calculated level alignment.\n\nThe PRO4X system is designed to:\n\nAnalyze liquidity\nRead market structure\nEvaluate execution probability\n\nAnd pre-compute the most likely institutional level alignment.\n\nWhat you see in the alert is not a suggestion —\nit is the highest-probability number at that moment.\n\nThis Bullish signal is not a fixed price signal.\nIt defines a liquidity zone, not a number.\n\nWhen a Get Ready prints — for example at 25538 —\nthe institutional execution will almost never occur exactly at that price.\n\nIt will occur on one of the execution numbers:\n\n12 / 38 / 64 / 91.\n\nYour job is to identify which one.\n\nHow institutions choose the number\n\nInstitutions do not guess.\nThey let liquidity decide.\n\nAfter a GR at 25538, price may rotate to:\n25564\n25591\nor sweep to 25512\n\nEach number corresponds to a different market intention.\n\nScenario 1 — Strong and persistent H1 trend\n\nIf the H1 trend is strong and has been active for a while:\nInstitutions do not need a deep stop-hunt\nLiquidity is already present\nPrice often reacts early\n\nIn this case, prioritize the 64\nExecution happens higher, without going to 91 or 12.\n\nThis is continuation-style accumulation.\n\nScenario 2 — Late trend or exhaustion on H1\n\nIf the H1 trend is overextended or losing momentum:\nInstitutions need more liquidity\nA stop-hunt is likely\n\nPrice may push to 91\nor even sweep down to 12\nbefore the real reversal starts.\n\nThis is where weak hands are forced out.\n\nScenario 3 — Curve-based execution\n\nIf price is already well positioned on the curve:\nNo imbalance\nNo emotional pressure\nVolume is balanced (VRVP)\n\nExecution can occur directly on the curve,\nmost often around 38 or 64,\nwithout any extreme move.\n\nClean. Controlled. Institutional.\n\nWhat to check before level alignment\n\nBefore choosing the number, you must read:\nH1 trend strength\nCurve position\nVRVP structure (where liquidity is thick)\nPrice behavior near each level\n\nThe number is not random.\nIt is selected by context.',
            proTip: '**KEY RULE**\n\nAvoid acting just because a signal appears.\nFocus on where institutions are likely to act.\n\nIf you don’t understand the numbers,\nyou are guessing.\n\nIf you do,\nyou are utilizing the execution model.',
            videoModules: {
                buy: require('../assets/videos/pro4x_buy.mp4'),
                sell: require('../assets/videos/pro4x_ex2.mp4')
            },
            videoTabLabels: { buy: 'EXAMPLE 1', sell: 'EXAMPLE 2' },
            videoAspectRatio: 1.33, // 4:3 Ratio (Narrower)
            videoCaption: 'PRO4X EXECUTION'
        }
    },
    {
        title: 'Bearish Structural Alignment',
        icon: 'trending-down-outline',
        color: '#EF4444',
        description: 'Detected by Pro4x & Pro4x.2 System\n\n• This represents a confirmed bearish structural configuration.\n\n• All required conditions converge at a key level, indicating a high-probability technical setup.\n\n• Depending on ATR volatility, the market may present a liquidity hunt extension (stop hunt) before a potential reversal.\n\n• During these sequences, the appearance of multiple notifications in the same area is frequent.\n\n• Careful study of the level alignment displayed in the notification is required.\n\n• The configuration is technically validated after a price pullback and a retest of the exact level.\n\n• Immediate reaction is not required upon data delivery; observation of price stabilization is prioritized.\n\nSTATISTICS & PERFORMANCE\n\n• Statistically, between 5 and 7 technical convergence points are identified per US session.\n\n• Important: The absence of notifications indicates that market conditions do not meet the strict structural parameters. This is standard system behavior.\n\nTECHNICAL NOTE: Price alignment with a 12/23/38/64/91 magnet level and a minimum H4 structural resistance is necessary for the analysis. High timeframe context remains the priority.\n\nAnalytical discipline and patience are fundamental components of the system. Notifications indicate high-probability data zones and do not constitute financial guarantees.',
        action: 'Strict Adherence to Rules Required.',
        education: {
            theoryImage: require('../assets/images/education/pro4x_sell.png'),
            realCapture: require('../assets/images/wtc_3_premium.png'),
            explanation: 'LIVE EXECUTION — PRO4X INSTITUTIONAL BEARISH\n\nThis Bearish signal is not a random alert.\nIt already displays the best statistically calculated level alignment.\n\nThe PRO4X system is designed to:\n\nAnalyze buyer liquidity\nRead market structure\nEvaluate execution probability\nPre-compute the most likely institutional level alignment\n\nWhat you see in the alert is not a suggestion —\nit is the highest-probability bearish number at that moment.\n\nThis Bearish signal is not a fixed price\n\nIt defines a liquidity zone, not a single number.\n\nWhen a Get Ready prints — for example at 25538 —\nthe institutional execution will almost never occur exactly at that price.\n\nExecution will occur on one of the institutional numbers:\n\n12 / 38 / 64 / 91\n\nYour job is to identify which one will be respected.\n\nHow institutions choose the bearish number (NQ logic)\n\nInstitutions do not guess.\nThey let buyer liquidity build, then execute into it.\n\nAfter a GR at 25538, price may rotate to:\n25564\n25591\nor spike to 25512 before rejection\n\nEach number reflects a different distribution intent.\n\nScenario 1 — Strong and persistent H1 uptrend (Nasdaq typical)\n\nOn the NQ, strong H1 trends are often violent and extended.\n\nIf the H1 uptrend is clean and still strong:\nInstitutions do not need a deep breakout\nLate buyers are already aggressive\nDistribution starts early\n\nIn this case, prioritize the 64\nBearish level alignment happens below the extreme,\noften without reaching 91.\n\nThis is early distribution into strength.\n\nScenario 2 — Overextended H1 trend / euphoric phase\n\nIf the H1 trend is:\nOverextended\nVertical\nFueled by FOMO (very common on NQ)\n\nInstitutions need maximum buyer liquidity\n\nPrice often pushes to 91\nor briefly spikes before rejection.\n\nThis is the classic Nasdaq stop-hunt above highs\nbefore a sharp sell-off.\n\nScenario 3 — Curve-based level alignment\n\nIf price is already:\nHigh on the curve\nMomentum is slowing\nVRVP shows heavy volume above\n\nExecution can occur directly on the curve,\nmost often around 38 or 64,\nwithout any final spike.\n\nClean. Silent. Institutional.\n\nWhat to validate before level alignment\n\nBefore executing the Bearish signal, confirm:\nH1 trend strength or exhaustion\nCurve position\nVRVP liquidity above price\nPrice behavior at each number\n\nThe number is never random.\nIt is selected by context and liquidity.',
            proTip: '**KEY RULE**\n\nAvoid acting just because a signal appears.\nFocus on where institutions distribute risk.\n\nIf you don’t understand the numbers,\nyou are reacting.\n\nIf you do,\nyou are executing the PRO4X institutional model.',
            videoUrl: require('../assets/videos/pro4x_sell.mov'),
            videoAspectRatio: 1.6,
            videoCaption: 'PRO4X EXECUTION'
        }
    },
];

const SECTION_2_HORUS: SignalGuideItem[] = [

    {
        title: 'Horus — Bullish Momentum Alignment',
        icon: 'trending-up-outline',
        color: '#4ADE80',
        description: 'This represents a high-velocity bullish structural configuration identified by Horus.\n\n• Technical Convergence: All required algorithmic conditions are currently aligned for a bullish thesis.\n\n• ATR Dynamics: Due to volatility and ATR dynamics, market extensions (stop hunts) are frequent before a directional stabilization\n\n• Data Frequency: High-velocity phases often trigger multiple bullish notifications in a concentrated zone.\n\n• Structural Study: Precise observation of the level alignment shown in the notification is necessary for technical validation\n\n• Timing Momentum: Immediate reaction is not a requirement of the system; price stabilization is the primary analytical metric.\n\n• Statistics: On average, 8 confirmed technical points of interest are identified per session.\n\nTECHNICAL NOTE: Optimal performance is observed on Key levels (12/23/38/64/91) supported by Volume Confirmation (Market Volume Delta). High timeframe context is essential\n\nAnalytical discipline and patience are fundamental components of the Horus system. Notifications indicate high-probability technical interest zones and do not constitute financial guarantees.',
        action: 'Strict Adherence to Rules Required.',
    },
    {
        title: 'Horus — Bearish Momentum Alignment',
        icon: 'trending-down-outline',
        color: '#EF4444',
        description: 'This represents a high-velocity bearish structural configuration identified by Horus.\n\n• Technical Convergence: All required algorithmic conditions are currently aligned for a bearish thesis.\n\n• ATR Dynamics: Due to volatility and ATR dynamics, market extensions (stop hunts) are frequent before a directional stabilization\n\n• Data Frequency: High-velocity phases often trigger multiple bearish notifications in a concentrated zone.\n\n• Structural Study: Precise observation of the level alignment shown in the notification is necessary for technical validation\n\n• Timing Momentum: Immediate reaction is not a requirement of the system; price stabilization is the primary analytical metric.\n\n• Statistics: On average, 8 confirmed technical points of interest are identified per session.\n\nTECHNICAL NOTE: Optimal performance is observed on Key levels (12/23/38/64/91) supported by Volume Confirmation (Market Volume Delta). High timeframe context is essential\n\nAnalytical discipline and patience are fundamental components of the Horus system. Notifications indicate high-probability technical interest zones and do not constitute financial guarantees.',
        action: 'Strict Adherence to Rules Required.',
    },
];

const SECTION_3_SCALPING: SignalGuideItem[] = [
    {
        title: 'Shadow Mode',
        icon: 'moon-outline',
        color: '#A855F7',
        description: 'Shadow Mode is engineered for high-velocity institutional liquidity analysis.\n\n• Institutional Mapping: This configuration focuses on identified institutional liquidity sweeps.\n\n• Liquidity Dynamics: The system tracks phases where large-scale market participants interact with stop-loss clusters and liquidity pools for price reversals.\n\n• Philosophy: This is not trend chasing; it is the technical observation of institutional footprints.\n\n• System Strength: These notifications represent the highest structural conviction within the Horus environment.\n\nTECHNICAL NOTE: Often effective during institutional liquidity sweeps. The system identifies precision technical configurations. Expect short-duration price reactions.',
        action: 'Strict Adherence to Rules Required.',
        education: {
            theoryImage: require('../assets/images/education/shadow_mode_nq.png'),
            realCapture: require('../assets/images/wtc_6_premium.png'),
            explanation: {
                buy: 'SHADOW BULLISH — LIQUIDITY SWEEP (Demand Sweep)\n\nBEHAVIOR EXECUTION\n\n**Note: In highly volatile markets, reactions are immediate. In slower conditions, allow the market to breathe and wait for price to reach an institutional key number before execution.**\n\nA Shadow Bullish Signal is triggered when price is pushed below a key support to sweep sell-side liquidity (stops + panic exits).\nThis drop is not weakness — it’s a liquidity grab.\n\nInstitutions need volume to accumulate.\nThe fastest way to get it is to force everyone to exit at the same time.\n\nWhy it works\nThe sweep triggers stop-loss cascades → instant liquidity\nInstitutions absorb that liquidity at a discount\nOnce selling pressure is exhausted, price snaps back fast\n\nThe Magnet Map (how to read the market)\n\nThe levels 12 / 23 / 38 / 64 / 91 are not signals.\nThey form a price map.\n\nPrice moves from one magnet to another,\njust like navigating between known coordinates.\n\nInstitutions do not trade randomly.\nThey execute along this map, where liquidity is known to exist.\n\nConfluence (when the map becomes powerful)\n\nA Shadow Bullish Signal becomes high probability when:\n\nPrice reaches a magnet on the map\n(12 / 23 / 38 / 64 / 91)\nOn execution timeframes\n1000 Ticks / M1\nWith multi-market alignment:\nMNQ / NQ reacting on its magnet\nES reacting on its corresponding magnet\nSPX (cash) holding or rejecting its own magnet\nRSI is extreme or diverging\nPrice reclaims the magnet after the sweep (wick + acceptance)\n\nWhen cash and futures react together on their respective magnets,\nyou are not guessing —\nyou are reading the map correctly.\n\nThis is where:\nThe sweep stops being random\nThe wick becomes meaningful\nThe reversal becomes institutional\n\nThis is not a “dip buy”.\nIt’s a trap where the crowd exits at the bottom — and institutions accumulate.',
                sell: 'SHADOW BEARISH — LIQUIDITY SWEEP (Supply Sweep)\n\nBEHAVIOR EXECUTION\n\nA Shadow Bearish Signal is triggered when price is pushed above a key resistance to sweep bullish liquidity (breakout signals + stops).\nThis spike is not strength — it’s a liquidity harvest.\n\nInstitutions need volume to distribute.\nThe fastest way to get it is to force everyone to enter at the top.\n\nWhy it works\nThe breakout triggers FOMO + stop orders → instant liquidity\nInstitutions distribute into that buying pressure\nOnce buying is exhausted, price rejects and drops quickly\n\nThe Magnet Map (how to read the market)\n\nThe same map applies.\n\nPrice is pushed from one magnet to the next,\nuntil enough liquidity is collected.\n\nBreakouts and reversals both occur\non this map, not between random prices.\n\nConfluence (when the map aligns)\n\nA Shadow Bearish Signal becomes high probability when:\n\nPrice reaches a magnet on the map\n(12 / 23 / 38 / 64 / 91)\nOn 1000 Ticks / M1\nWith multi-market alignment:\nMNQ / NQ rejecting its magnet\nES failing on its corresponding magnet\nSPX (cash) stalling or rejecting the same structure\nRSI is extreme or diverging \nPrice fails to hold above the magnet after the sweep\n\nWhen cash and futures reject together on the same map level,\nthe move is no longer noise —\nit’s distribution.\n\nThis is not a “breakout”.\nIt’s a liquidity trap where the crowd enters the top — and institutions distribute into it.'
            },
            proTip: {
                buy: 'Wait for the reclaim of the swept magnet.\n\nThe best Shadow Bullish Signals are fast, violent, and clean.',
                sell: 'Avoid fading the first spike.\nFocus on the failure at the magnet.\n\nThat’s the real signal.'
            },
            videoModules: {
                buy: require('../assets/videos/shadow_buy.mp4'),
                sell: require('../assets/videos/shadow_sell.mp4')
            },
            videoCaption: 'SHADOW MODE EXECUTION',
            videoAspectRatio: 1.33, // 4:3 Ratio (Narrower)
            videoSpeed: 1.0
        }
    },
    {
        title: 'HORUS OVS',
        icon: 'flash',
        color: '#4ADE80',
        description: 'High-velocity configuration for advanced analytical profiles.\n\n• Statistical Anomaly: This identifies extreme statistical deviations where price history shows a high probability of technical reaction.\n\n• Confluence: Convergence with SHADOW parameters significantly increases the technical weight of the observation.\n\n• Execution Context: Due to the velocity of OVS phases, price reactions are typically immediate upon reaching the identified threshold.\n\nTECHNICAL NOTE: High probability of immediate technical reaction. Educational: Oversold market conditions can persist. Verification of structural confirmation is a standard analytical practice.',
        action: 'Strict Adherence to Rules Required.',
        education: {
            theoryImage: require('../assets/images/education/horus_ovs.png'),
            realCapture: require('../assets/images/wtc_4_premium.png'),
            explanation: 'BEHAVIOR EXECUTION — OVERSOLD (OVS)\n\n**The most efficient scalping alert.**\nExcellent Risk/Reward profile.\n\nNote: It is even better if the alert triggers **offset** from the standard levels (12/23/38/64/91).\nIt means the market is overextended beyond the structure.\n\nThe market is extremely oversold.\nPrice has fallen too far, too fast.\n*Note: Multiple OVS alerts may sound in sequence during the final drop.*\n\nAt this stage:\n\nSelling pressure becomes inefficient\nLate sellers are acting out of fear\nInstitutions are accumulating, not selling\n\nThis is where algorithms stop pushing price lower\nand start absorbing liquidity.\n\nLook for:\n\nA vertical capitulation candle\nFollowed by a fast and aggressive rebound\n\nThe reversal often comes suddenly,\nonce selling pressure is exhausted.',
            proTip: 'The rebound is often faster than the drop itself.\n\n**Fast exits are recommended (20-25 points range).** Hesitation usually reduces the edge.',
            videoModules: {
                buy: require('../assets/videos/horus_ovs.mp4'),
                sell: require('../assets/videos/horus_ovs3.mp4')
            },
            videoTabLabels: { buy: 'EXAMPLE 1', sell: 'EXAMPLE 2' },
            videoAspectRatio: 1.33, // 4:3 Ratio (Narrower)
            videoCaption: 'HORUS EXECUTION'
        }
    },
    {
        title: 'HORUS OVB',
        icon: 'flash',
        color: '#EF4444',
        description: 'High-velocity configuration for advanced analytical profiles.\n\n• Statistical Anomaly: This identifies extreme statistical deviations where price history shows a high probability of technical reaction.\n\n• Confluence: Convergence with SHADOW parameters significantly increases the technical weight of the observation.\n\n• Execution Context: Due to the velocity of OVB phases, price reactions are typically immediate upon reaching the identified threshold.\n\nTECHNICAL NOTE: High probability of immediate technical reaction. Educational: Overbought market conditions can persist. Verification of structural confirmation is a standard analytical practice.',
        action: 'Strict Adherence to Rules Required.',
        education: {
            theoryImage: require('../assets/images/education/horus_ovb.png'),
            realCapture: require('../assets/images/wtc_5_premium.png'),
            explanation: 'BEHAVIOR EXECUTION — OVERBOUGHT (OVB)\n\n**The most efficient scalping alert.**\nExcellent Risk/Reward profile.\n\nNote: It is even better if the alert triggers **offset** from the standard levels (12/23/38/64/91).\nIt means the market is overextended beyond the structure.\n\nThe market is extremely overbought.\nPrice has moved too far, too fast.\n*Note: Multiple OVB alerts may sound in sequence during the final pump.*\n\nAt this stage:\n\nBuying pressure is no longer efficient\nLate buyers are executing emotionally\nInstitutions are distributing, not accumulating\n\nThis is where algorithms stop pushing price\nand start letting liquidity unwind.\n\nLook for:\n\nA vertical exhaustion candle\nFollowed by a sharp and rapid rejection\n\nThe reversal usually occurs without warning\nonce buying power is depleted.\n\n**Note: No video for this card. The execution behavior is the same as for Bullish.**',
            proTip: 'The snap-back is often faster and more violent than the move up.\n\n**Fast exits are recommended (20-25 points range).** Hesitation is costly here.'
        }
    },
    {
        title: 'BULLISH RE-INTEGRATION',
        icon: 'arrow-up-circle-outline',
        color: '#4ADE80',
        description: 'Detected by Horus System\n\n• Market Impulse: This identifies a sudden high-velocity vertical move up away from equilibrium.\n\n• Mean Reversion: When the price extends significantly beyond the 50 MA, a technical squeeze back toward equilibrium is frequently observed.\n\n• Contextual Analysis: If the H1 timeframe is Bearish, this configuration represents a temporary momentum extension.\n\nTECHNICAL NOTE: Bearish structural positions often face statistical risk in this specific zone. If H1 is Bullish (Price > EMA 200) and ATR is high, this technical data indicates a Momentum configuration.',
        action: 'Strict Adherence to Rules Required.',
        education: {
            theoryImage: require('../assets/images/education/tp_pump.png'),
            realCapture: require('../assets/images/education/tp_pump.png'), // Duplicate to avoid "Coming Soon" overlay
            explanation: [
                {
                    title: 'TP PUMP — VERTICAL MOVE (UP)',
                    subtitle: 'Exit Force: Up',
                    content: 'BEHAVIOR EXECUTION\n\nA TP Pump occurs when price rallies too fast and too far above the 50-period moving average.\n\nThis is not euphoria.\nIt is a temporary extension inside an existing trend.\n\nWhen price stretches too far:\nLate buyers enter\nEfficiency drops\nMean reversion becomes likely\n\nEspecially when:\nATR expands\nVolume spikes\nCandles turn vertical\n\nHow to use TP Pump\nIf you are bearish → this is a Take Profit / exit signal\nIf you are bullish → this can be a reload opportunity after the pullback\nIf you are flat → it can be used for a scalp back toward the MA50\n\nThe logic is simple:\nExtreme distance from the mean creates opportunity.\n\nImportant rule\n\nTP Pump is reliable when:\nThe trend is still intact\nVolume confirms excess participation\nATR shows expansion\n\nNo volatility = no edge.',
                    proTip: 'When price accelerates vertically,\ndon’t chase it — let it come back.'
                },
                {
                    title: 'KEY TAKEAWAY',
                    subtitle: 'For both TP Pump & TP Push',
                    content: 'TP Pump / TP Push are not trend calls.\nThey are distance alerts.\n\nThey tell you:\nWhen to secure profits\nWhen to reload\nWhen a short-term scalp is possible\n\nThey are about position management,\nnot prediction.',
                    proTip: 'These signals are about protecting capital, not gambling.'
                }
            ],
            proTip: null
        }
    },
    {
        title: 'BEARISH RE-INTEGRATION',
        icon: 'arrow-down-circle-outline',
        color: '#EF4444',
        description: 'Detected by Horus System\n\n• Market Impulse: This identifies a sudden high-velocity vertical move down away from equilibrium.\n\n• Mean Reversion: When the price collapses significantly below the 50 MA, a technical pull-back toward equilibrium is frequently observed.\n\n• Contextual Analysis: If the H1 timeframe is Bullish, this configuration represents a temporary momentum extension.\n\nTECHNICAL NOTE: Bullish structural positions often face statistical risk in this specific zone. If H1 is Bearish (Price < EMA 200) and ATR is high, this technical data indicates a Momentum configuration.',
        action: 'Strict Adherence to Rules Required.',
        education: {
            theoryImage: require('../assets/images/education/tp_push.png'),
            realCapture: require('../assets/images/education/tp_push.png'), // Duplicate to avoid "Coming Soon" overlay
            explanation: [
                {
                    title: 'TP PUSH — VERTICAL MOVE (DOWN)',
                    subtitle: 'Exit Force: Down',
                    content: 'BEHAVIOR EXECUTION\n\nA TP Push occurs when price drops too fast and too far from the 50-period moving average.\n\nThis move is not a trend change by default.\nIt is a pullback inside the trend.\n\nPrice must rebalance and return toward its mean.\n\nThis behavior appears when:\nATR is elevated (volatility expansion)\nVolume increases sharply\nThe move becomes vertical, not progressive\n\nAt this point, continuation loses efficiency\nand mean reversion dominates.\n\nHow to use TP Push\nIf you are bullish → this is a Take Profit / protection signal\nIf you are bearish → this can be a reload opportunity after the pullback\nIf you are not in position → it can be used for a quick scalp toward the MA50\n\nThe key idea:\nPrice is too far from balance and must come back.\n\nImportant rule\n\nTP Push works best when:\nVolume confirms the move\nATR is expanded\nThe market is still structurally trending\n\nWithout volatility, there is no pullback.',
                    proTip: 'A vertical move away from the MA50 is rarely sustainable.\nPrice almost always comes back to rebalance first.'
                },
                {
                    title: 'KEY TAKEAWAY',
                    subtitle: 'For both TP Pump & TP Push',
                    content: 'TP Pump / TP Push are not trend calls.\nThey are distance alerts.\n\nThey tell you:\nWhen to secure profits\nWhen to reload\nWhen a short-term scalp is possible\n\nThey are about position management,\nnot prediction.',
                    proTip: 'These signals are about protecting capital, not gambling.'
                }
            ],
            proTip: null
        }
    },
    {
        title: 'HORUS ADV. BULLISH',
        icon: 'flash-outline',
        color: '#4ADE80',
        description: 'Expert Structural Alignment. Advanced high-precision data configuration.\n\n• Triple-Market Synchronization: This identifies a simultaneous technical alignment across SPX, ES, and NQ.\n\n• Structural Coherence: The data indicates strong structural coherence on a Support level, often leading to a high-velocity technical reaction.\n\n• Institutional Flow: This configuration tracks the convergence of institutional building the map pressure across major indices.\n\nTECHNICAL NOTE: High-Volatility Setup. Educational: Confluence on a specific magnet level increases the probability of a technical price reaction.',
        action: 'Strict Adherence to Rules Required.',
    },
    {
        title: 'HORUS ADV. BEARISH',
        icon: 'flash-outline',
        color: '#EF4444',
        description: 'Expert Structural Alignment. Advanced high-precision data configuration.\n\n• Triple-Market Synchronization: This identifies a simultaneous technical alignment across SPX, ES, and NQ.\n\n• Structural Coherence: The data indicates strong structural coherence on a Resistance level, often leading to a high-velocity technical reaction.\n\n• Institutional Flow: This configuration tracks the convergence of institutional building the map pressure across major indices.\n\nTECHNICAL NOTE: High-Volatility Setup. Educational: Confluence on a specific magnet level increases the probability of a technical price reaction.',
        action: 'Strict Adherence to Rules Required.',
    },
];

const SECTION_4_H1: SignalGuideItem[] = [
    {
        title: 'Syncro Bullish (H1) — SPX / ES / NQ',
        icon: 'caret-up-outline',
        color: '#4ADE80',
        description: 'Technical convergence of the H1 bullish bias across SPX, ES, and NQ.\n\n• Trend Alignment: This data indicates a synchronized structural strength across the three major indices on the H1 timeframe.\n\n• Structural Space: This configuration is typically associated with longer-duration price cycles, provided that the market structure remains clear of immediate H4 resistance.\n\n• Hierarchical Logic: The Higher Timeframe (H1/H4) provides the primary directional context over lower timeframes. A structural trend reversal is technically confirmed when the price crosses the 200 EMA.\n\nTECHNICAL NOTE: Analytical observation: Data validation often follows a retest of the calculated execution price or a new structural alignment. A 15-minute observation period after the market open is standard for data stability.',
        action: 'Strict Adherence to Rules Required.',
    },
    {
        title: 'Syncro Bearish (H1) — SPX / ES / NQ',
        icon: 'caret-down-outline',
        color: '#EF4444',
        description: 'Technical convergence of the H1 bearish bias across SPX, ES, and NQ.\n\n• Trend Alignment: This data indicates a synchronized structural weakness across the three major indices on the H1 timeframe.\n\n• Structural Space: This configuration is typically associated with longer-duration price cycles, provided that the market structure remains clear of immediate H4 support.\n\n• Hierarchical Logic: The Higher Timeframe (H1/H4) provides the primary directional context over lower timeframes. A structural trend reversal is technically confirmed when the price crosses the 200 EMA.\n\nTECHNICAL NOTE: Analytical observation: Data validation often follows a retest of the calculated execution price or a new structural alignment. A 15-minute observation period after the market open is standard for data stability.',
        action: 'Strict Adherence to Rules Required.',
    },
];


const SECTION_ETHOS: SignalGuideItem[] = [
    {
        title: 'Developer\'s Ethos: From Traders to Traders',
        icon: 'heart-circle-outline',
        color: '#A855F7',
        description: 'This system is not just code. Behind Click&Trader, are real traders.\n\nA message about the philosophy, the code, and the mindset.',
        action: 'Read this when you need clarity or to reconnect with the methodology.',
        education: {
            theoryImage: require('../assets/images/education/atom_zeus_shadow_v2.png'),
            realCapture: require('../assets/images/education/atom_zeus_shadow_v2.png'),
            explanation: [
                {
                    title: 'From traders to traders',
                    content: 'This system is not just code.\nBehind Click&Trader, there are real traders.\nSome have been on both sides of the screen.\n\nThey know the pressure, the doubt, the excitement.\n\nThis system is built to support you, not to replace you.\nYou are not alone in this process.\n\nWe genuinely wish you clarity, consistency, and long-term success.',
                },
                {
                    title: 'Like Real Steel — you control, the system assists',
                    content: 'Think of Click&Trader like ATOM in Real Steel.\n\nThe system mirrors institutional behavior,\nbut you are still the one executing.\n\nThe app calculates.\nYou decide.\n\nIt’s a two-person game:\nThe system provides precise, stable calculations\nYou provide judgment, patience, and discipline\n\nThis is how professionals trade.',
                },
                {
                    title: 'A Word About Trading Hours (Europe vs US)',
                    content: 'If you are trading from Europe, don’t think your day is over at 15:31.\n\nSome of the best institutional setups happen after the US lunch break.\n\nWhy?\nUS traders start their day in the morning (your afternoon)\nAround 12:00 US time, they go to lunch\n→ that’s 18:30–19:00 in Europe\nEuropean markets are closed\n\nWhen US traders come back from lunch,\nthey take full control of the market until the close\n\nThis is why 19h–20h (Europe) is often extremely powerful.',
                },
                {
                    title: 'The Magnet Map (Core of the System)',
                    content: 'Price moves like on a map, not randomly.\n\nThe key numbers:\n12 / 23 / 38 / 64 / 91\n\nThese levels act as institutional magnets.\nInstitutions rotate from one number to another.\n\nThe goal is to identify which one is the next institutional target.\n\nWhen:\nMNQ / NQ\nES\nSPX (the boss)\nare aligned on their respective magnet levels,\nconfluence becomes extremely powerful.\n\nRemember:\nSPX reacts first\nES follows\nNQ/MNQ reacts last\n\nIf the boss moves — the rest will follow.',
                },
                {
                    title: 'Capital Preservation — Very Important',
                    content: 'Your safety comes first.\n\nRisk management is key:\nThe logic favors small position sizing for:\nGet Ready (GR)\nBullish / Bearish Signals\n\nWhy?\nIf a stop hunt happens, room is preserved\nRe-execution is possible at a better magnet level\nAnalysis remains calm and precise\n\nAlways seek: 12 / 23 / 38 / 64 / 91\n\nH1 Sync Bullish / Bearish are context info and can change a few minutes after in the opposite direction.\n\nLet it breathe.\nHold it as long as the reversal makes sense.\n\nImportant:\nThe system signals stabilize generally 1 hour after the US market open for this kind of H1 sync\nMany alerts fire due to volume/volatility\nAfter that window, the signal quality stabilizes\n\nHigh probability institutional setup.\n\nAt the market open:\nSystem calculation requires at least 1 minute\nVolume and volatility can trigger many alerts at once\nAt the US open, volatility-driven alerts may occur.\n\nNote: The open is often volatility-driven rather than structural.\nInstitutional algorithms typically stabilize after the initial storm.',
                },
                {
                    title: 'Strong Trend Days — Adjust Your Behavior',
                    content: 'When the market is strongly trending:\n\nInstitutional models avoid chasing Bullish/Bearish reversals\nThey prefer pullbacks via:\nOversold in an uptrend\nOverbought in a downtrend\n\nSometimes, in strong trends,\nprice will skip the first number.\n\nExample:\nA Bearish Signal at .90\nPrice pushes to the next .90 below\nThen reacts\n\nPatience puts odds on your side.\n\nWaves :\nIf H1 is very directional:\nWait for 3 M1 waves before acting on a signal\nLet the market show its intention.',
                },
                {
                    title: 'Technical Insight (Important)',
                    content: 'The system gives you a level alignment\ncalculated from multiple  parameters.\n\nIt is not AI-based.\nIt will never be AI-based.\n\nBefore executing:\nThe price structure must visually match\nBe patient\nGive the trade a chance to develop\n\nTrade light.\nPosition management is critical.\n“Voyagez léger en position.”',
                },
                {
                    title: 'Best Practices',
                    content: 'On your chart (app or desktop):\nContinuously plot system key levels\nEvery 100 points\nKeep H4 pivots visible\n\nYou are trading the Nasdaq Futures — the wild one.\n\nHierarchy matters:\nSPX (the boss)\nES\nUS Cash 100\nNQ / MNQ\n\nIf the boss reacts at a level,\nthe rest will follow — often after.',
                },
                {
                    title: 'Why some M1 signals should NOT be taken',
                    content: 'When an H1 candle is a full body, it acts like a directional wall.\nThe momentum is too strong for M1 reversal signals to work properly.\n\nEven if an M1 signal appears in the app,\nit should NOT be taken while the H1 candle is still full and aggressive.\n\nKey rule to understand:\n• H1 always dominates M1\n• M1 signals against a strong H1 candle have low probability\n• Institutional levels alone are not enough when H1 momentum is active\n\nWhat to do instead:\nWhen the H1 candle has already made a large move:\n1. Observe where it is heading\n2. Estimate where it is likely to stop\n3. Determine whether the next move is:\n• a pause\n• a continuation\n• or a transition into the next H1 candle\n\nIn practice, a full body H1 candle will always react near a key institutional number\n(64 / 91 / 12)\n\nOnly at that moment,\nM1 reversal signals become valid again.\n\nWhen markets are normal:\nIn normal market conditions,\nM1 signals work as expected, including reversal signals.\n\nWhen H1 candles show balanced structure\n(wicks, pauses, rotation, no full body pressure),\nM1 reversals are valid and tradable.\n\nKey distinction:\n• Normal market → M1 signals (trend & reversal) work well\n• Strong full body H1 candle → M1 reversals lose reliability\n\nThe system still displays signals,\nbut context must be respected.\n\nRule to remember:\n• Trade M1 reversals when H1 is balanced\n• Avoid M1 reversals when H1 is full body and impulsive\n\nSimple takeaway:\nM1 reversals are designed to work\nunless higher timeframe momentum is actively dominating',
                },
                {
                    title: 'Final Words',
                    content: 'Click&Trader is built as\n"your trading companion in the palm of your hand".\n\nTo:\nReduce noise\nSimplify decisions\nHelp you trade with confidence and consistency\n\nThe app calculates precisely.\nBut it cannot think for you.\n\nThis is a 2-way partnership.\n\nWith all my deep intention to be beneficial to you,\nI wish you discipline, patience, and success.\n\nWelcome to Click&Trader\nRibong&Milam',
                }
            ],
            proTip: null
        }
    },
];

const SECTION_5_MASTERCLASS: SignalGuideItem[] = [
    {
        title: 'THE MOMENTUM TRAP',
        icon: 'warning-outline',
        color: '#EF4444',
        description: '(Technical Warning)\n\n• Momentum vs. Levels: A data point firing on a Key Level does not imply an immediate price halt. Momentum can temporarily override structural levels.\n\n• Candle Velocity: Price arrival with a FULL BODY H1 Candle (high velocity) without wicks indicates that Momentum currently exceeds the Level\'s strength.\n\n• Applicability: This technical observation applies to Pro4x and HORUS configurations exclusively.\n\nTECHNICAL NOTE: Fading a FULL BODY H1 CANDLE presents a high statistical risk. The technical logic relies on M1 stabilization and rejection confirmation before validating the level.',
        action: 'Strict Adherence to Rules Required.',
        education: {
            theoryImage: require('../assets/images/education/momentum_trap.png'),
            realCapture: require('../assets/images/wtc_8_premium.png'),
            explanation: [
                {
                    title: 'THE MOMENTUM TRAP',
                    subtitle: 'When Direction Is Too Strong',
                    content: 'BEHAVIOR EXECUTION\n\nA Momentum Trap occurs when price moves too fast, too clean, and without rejection.\n\nYou will see:\nLarge full-bodied candles\nNo wicks, no hesitation\nPrice cuts through levels instead of reacting\n\nThis is high-velocity momentum.\n\nIn this state:\nLiquidity is not being absorbed\nInstitutions are not executing reversals\nMagnet levels are ignored\n\nTrying to fade this move is not contrarian —\nit is being run over.\n\nWhy this is a trap\n\nWhen momentum is extreme:\nBreaks are real, not fake\nReversals do not form\nWaiting for a reaction is mandatory\n\nEntering here feels logical\nbecause the level “should hold”.\n\nIt doesn’t.\n\nThis is where most traders lose by:\nFighting the move\nCalling a top or bottom\nForcing a setup that isn’t there\n\nHow to recognize it\nA candle closes fully beyond the level\nThe next candle continues immediately\nNo wick, no reclaim\nPrice ignores the magnet map\n\nThis means:\nDo nothing.\n\nWhat to do instead\n\nWait for:\nA pause\nA wick\nA loss of momentum\n\nOnly after pressure slows down\ncan a real setup exist.',
                    proTip: 'If the candle looks like a wall, it is best to observe.\nLet the market breathe first.'
                },
                {
                    title: 'FAKE MOMENTUM',
                    subtitle: 'When Strength Is an Illusion',
                    content: 'BEHAVIOR EXECUTION\n\nFake Momentum appears when price looks aggressive,\nbut has no real follow-through.\n\nYou may see:\nFast candles with long wicks\nPushes that stall immediately\nPrice reaching a level and failing to continue\n\nIt feels like strength.\nIt isn’t.\n\nThis is manufactured momentum —\ndesigned to trigger executions, not to continue.\n\nWhy it fools traders\n\nFake momentum plays on urgency:\n“If I don’t execute now, I’ll miss the move”\n“This looks strong, it has to go”\n\nBut in reality:\nLiquidity is being created, not consumed\nInstitutions are not committed\nThe move exists only to attract participation\n\nHow to recognize it\nThe candle cannot hold beyond the level\nWicks appear immediately\nThe next candle fails to extend\nPrice oscillates around the magnet, not away from it\n\nThis tells you:\nNo control. No commitment.\n\nWhat it usually leads to\n\nFake momentum often precedes:\nA liquidity sweep\nA sharp rejection\nOr a move in the opposite direction\n\nIt is not continuation.\nIt is preparation.\n\nWhat to do\n\nDo not chase.\nDo not anticipate.\n\nWait for:\nA reclaim (for reversal)\nOr a clean break with acceptance (for continuation)',
                    proTip: 'If momentum needs to convince you, it’s probably fake.\nReal momentum doesn’t ask — it moves.'
                },
                {
                    title: 'REAL MOMENTUM',
                    subtitle: 'When the Move Is Real',
                    content: 'BEHAVIOR EXECUTION\n\nReal Momentum is not loud.\nIt is efficient.\n\nPrice moves with intent,\nnot with noise.\n\nYou will see:\nClean candles\nSmall or no wicks\nConsistent follow-through after the level\n\nThis is not a reaction.\nIt is acceptance.\n\nWhy it works\n\nReal momentum appears when:\nLiquidity has already been cleared\nOpposite pressure is exhausted\nInstitutions no longer need traps or sweeps\n\nAt this point:\nPrice does not hesitate\nLevels are respected through acceptance\nThe magnet map is traveled, not fought\n\nHow to recognize it\nA candle closes beyond the magnet\nThe next candle continues in the same direction\nNo immediate rejection\nPullbacks are shallow and controlled\n\nThis means:\nControl has shifted.\n\nWhat it is NOT\nNot a spike\nNot FOMO\nNot a sweep\n\nThere is no urgency.\nJust progress.\n\nHow to trade it\n\nDo not fade it.\nDo not force reversals.\n\nWait for:\nA pullback to the next magnet\nOr continuation with structure\n\nTrade with it, not against it.',
                    proTip: 'If momentum feels calm and inevitable,\nit’s probably real'
                }
            ],
            proTip: null
        }
    },
    {
        title: 'EXECUTION ALPHA: THE ARCHIMEDES EFFECT',
        icon: 'git-network-outline',
        color: '#A855F7',
        description: 'Institutions frequently drive price beyond structural logic to engage stop-loss liquidity before a technical reversal.\n\n• Technical Extension: If a "Setup Forming" notification fires at .38 during a vertical trend, observation of the reaction at .64 or .91 provides further technical context.\n\n• Volume Management: Reduced position sizing is a standard technical practice during these market extensions.\n\n• Mean Reversion Logic: Higher extensions often correlate with stronger technical snap-backs toward equilibrium.\n\nTECHNICAL NOTE: The higher magnet level often represents the primary structural objective during liquidity hunts.',
        action: 'Strict Adherence to Rules Required.',
        education: {
            theoryImage: require('../assets/images/education/shadow_mode_nq.png'),
            realCapture: require('../assets/images/education/shadow_mode_nq.png'), // Duplicate to avoid "Coming Soon" overlay
            explanation: 'BEHAVIOR EXECUTION\n\nThe Archimedes Effect is an extension of the Shadow move.\n\nAfter an initial reaction, institutions often push price slightly further than expected\nto fully clear the last remaining liquidity.\n\nThis extra push is not random.\n\nIt is deliberate pressure designed to force:\nThe last weak buyers out of longs\nOr the last weak sellers out of shorts\n\nOnly after that final displacement does the real move start.\n\nHow it works\n\nThink of it as over-displacement.\n\nPrice:\nBreaks a level\nReacts\nThen gets pushed one step further on the magnet map\n\nThis final push:\nCleans remaining stops\nRemoves hesitation\nResets positioning\n\nOnly then can price reverse cleanly or continue efficiently.\n\nThe Magnet Map logic\n\nThe Archimedes Effect almost always happens between magnets:\n\nA reaction at .38 often extends to .64\nA reaction at .64 may push to .91\nA shallow sweep may deepen toward .12\n\nPrice is simply moving to the next magnet\nto complete the liquidity cycle.\n\nHow to use it\n\nIf you entered early → protect or reduce size\nIf you missed the first reaction → wait for the next magnet\nIf you see strong volume + ATR → expect extension, not immediate reversal\n\nThe best trades often occur after the Archimedes push,\nnot on the first touch.\n\nWhat it is NOT\n\nNot a failed setup\nNot a mistake\nNot market noise\n\nIt is forced completion.\n\nKey takeaway\n\nShadow creates the trap.\nArchimedes finishes the job.\n\nIf you don’t expect it, you panic.\nIf you understand it, you wait',
            proTip: 'If a Bullish signal fires at .38, keep an eye on .64.\n\nVery often, the real bounce happens there —\nafter the last traders are pushed out.'
        }
    },
    {
        title: 'USING "SETUP FORMING" DATA',
        icon: 'flash-outline',
        color: '#FFD700',
        description: 'When a "Setup Forming" notification is identified:\n\n• Key Magnet Alignment: If the data aligns directly with a key magnet number (12/23/38/64/91) and the price curve shows sharp exhaustion/spiking, the technical confluence is high.\n\n• Technical Opportunity: In these specific conditions, the "Setup Forming" data represents a validated technical configuration.\n\nTECHNICAL NOTE: The setup is technically reinforced if a Bullish or Bearish structural alignment confirms the configuration shortly afterward',
        action: 'Strict Adherence to Rules Required.',
    },
    {
        title: 'CAPITAL PRESERVATION PROTOCOLS',
        icon: 'shield-checkmark-outline',
        color: '#4ADE80',
        description: 'Setup Forming / Bullish / Bearish Data:\n\n• Positioning Logic: The system is engineered for light initial technical positioning (e.g., 1 unit).\n\n• Market Extensions: This modular approach allows for structural flexibility if a final institutional stop-hunt occurs.\n\n• Execution Alignment: Re-evaluation of the entry coordinate is standard if market dynamics shift.\n\n• Structural Anchoring: Analytical decisions are consistently anchored around calculated key magnet levels (12/23/38/64/91).\n\nTECHNICAL NOTE: Adherence to strict risk management protocols is a fundamental component of the system.',
        action: 'Strict Adherence to Rules Required.',
    },
    {
        title: 'HIGH VELOCITY DATA MANAGEMENT',
        icon: 'stopwatch-outline',
        color: '#FFA500',
        description: 'Horus & Shadow Data:\n\n• Sizing Standards: Technical profiles typically utilize adjusted sizing for these specific configurations as part of standard practice.\n\n• Reaction Velocity: These represent high-speed liquidity reactions rather than extended price cycles.\n\n• Institutional Context: These data points are highly effective when synchronized with identified institutional stop-hunts.\n\nTECHNICAL NOTE: The expected reaction duration for these configurations is typically short, with a historical technical range of approximately 20–25 points',
        action: 'Strict Adherence to Rules Required.',
    },

    {
        title: 'FINAL ANALYTICAL PRINCIPLE',
        icon: 'diamond-outline',
        color: '#A855F7',
        description: 'Detected by Horus System\n\n• Observation Framework: A notification is a technical prompt for observation, not a financial obligation.\n\n• Data Synthesis: The system serves as a tool to monitor institutional liquidity, magnet levels (12/23/38/64/91), and technical price behavior.\n\n• Institutional Alignment: is designed to reward analytical patience, precision, and structural discipline—mirroring standard institutional operational standards.\n\nTECHNICAL NOTE: Professional analysis prioritizes strategic positioning over emotional reaction. Mastery of the environment is the primary objective.',
        action: 'Strict Adherence to Rules Required.',
    }
];

const SECTION_6_VISUALS: VisualEducationItem[] = [
    {
        title: 'INSTITUTIONAL KEY LEVELS',
        subtitle: '12 / 23 / 38 / 64 / 91',
        image: require('../assets/images/education/institutional_reworked.png'),
        realCapture: require('../assets/images/education/institutional_reworked.png'),
        videoCaption: 'As you can see on this graph, all the key numbers 12/23/38/64/91 repeat indefinitely. They act as precise magnets for price action, creating a predictable map for liquidation and reversal.',
        explanation: 'INSTITUTIONAL KEY LEVELS — Why they work ? The System, The Logic, The Application\n\n12 / 23 / 38 / 64 / 91 — The Architecture of Wealth Transfer of the institutions\n\nI. THE INTELLIGENT MARKET ILLUSION\n\nThe market is not a living organism that "thinks."\nIt is an arena of algorithmic predation.\n\nThe fundamental truth:\n\nThese levels do not work because traders observe them.\nThey work because institutions know traders observe them.\n\nIt\'s a perfect feedback loop:\n\n1. Retail traders identify "logical" levels\n2. They place their stops, limits, entries there\n3. Institutional algorithms map this liquidity concentration\n4. Algorithms execute against that liquidity\n5. Price behaves "as expected," validating the belief\n6. The cycle repeats\n\nYou are not trading an asset.\nYou are trading against the predictable behavior of other participants.\n\nII. THE REAL TOOL: EXTRACTION ENGINE\n\nMarkets are liquidity extraction systems disguised as price discovery mechanisms.\n\nThe three predatory mechanisms:\n\n1. Liquidity Harvesting\n   · Every obvious level is a liquidity pool\n   · Institutional orders are reactive, not predictive\n   · They wait for retail to commit first\n   · Then they take the other side\n\n2. Behavioral Triangulation\n   · Algorithms track where stops cluster\n   · They calculate the minimum move needed to trigger maximum pain\n   · Execution is mechanical, emotionless, statistical\n\n3. Narrative Exploitation\n   · Every "breakout," "reversal," or "pattern" has a narrative\n   · Institutions use these narratives as bait\n   · The real move happens after the narrative breaks\n\nIII. INSTITUTIONAL MECHANICS: THE ALGORITHMIC REALITY SINCE INTERNET\n\nThe Execution Trinity:\n\n1. Liquidity Mapping Algorithms\n\n· Scan order book density\n· Identify stop-loss concentrations\n· Calculate optimal execution paths\n· No discretion, only statistics\n\n2. Reaction Probability Models\n\n· Historical data on how price reacts at specific levels\n· Probability matrices for each key percentage\n· Pre-programmed responses to anticipated behavior\n\n3. Stacked Order Architecture\n\n· Orders are layered, not placed\n· Each layer serves a different purpose:\n  · Liquidity absorption (12/91 zones)\n  · Inducement triggers (23/76 zones)\n  · Core execution (38/64 zones)\n\nThe Non-Discretionary Principle:\n\nInstitutions don\'t "decide" in real-time.\nThey deploy pre-coded response protocols.\nHuman discretion is the retail trader\'s weakness.\nAlgorithmic consistency is the institution\'s weapon.\n\nIV. DECONSTRUCTING THE KEY LEVELS\n\n12% & 91% — THE LIQUIDITY SWEEP ZONES\n\nPrimary Function: Stop-hunting and panic generation\n\nMechanics:\n\n· Price is pushed to these extremes with minimal effort\n· Maximum stops are clustered here (retail places stops beyond "obvious" levels)\n· The sweep creates immediate liquidity for institutional entry\n· Often coincides with news events or volatility spikes\n\nThe Psychological Play:\n\n· At .12: "It can\'t go lower" → stops break → panic selling\n· At .91: "Breakout confirmed" → FOMO buying → trap set\n· Both create the fuel for the reversal\n\n23% & 76% — THE INDUCEMENT ZONES\n\nPrimary Function: False confidence building\n\nMechanics:\n\n· Price reacts "technically" at these levels\n· Retail enters believing in the validity of the level\n· Institutions provide just enough movement to confirm the bias\n· Then reverse against the accumulated positions\n\nThe Trap Characteristics:\n\n· Clean bounces/rejections initially\n· Volume appears supportive\n· Multiple time frame alignment seems to confirm\n· Then fails with no warning\n\n38% & 64% — THE BUSINESS ZONES\n\nPrimary Function: Institutional accumulation/distribution\n\nMechanics:\n\n· Where institutions execute their core orders\n· After retail has been positioned wrong (via 23/76 or 12/91 moves)\n· Minimal slippage, maximum size absorption\n· Often the "invisible" part of the move\n\nWhy These Levels Work:\n\n· They\'re mathematically significant (Fibonacci convergence)\n· But more importantly: retail ignores them\n· Retail is either already in (at worse prices) or has stopped out\n· This creates clean execution for large orders\n\nVI. THE CLICK&TRADER EDGE: INSTITUTIONAL TRANSLATION\n\nClick&Trader doesn\'t provide "signals."\nIt provides execution maps.\n\nWhat It Decodes:\n\n1. Liquidity Heatmaps\n   · Where stops are likely clustered\n   · Where inducement will occur\n   · Where business will be done\n\n2. Phase Recognition\n   · Identifies which phase the market is in\n   · Shows whether you\'re early, on time, or late\n   · Warns when you\'re becoming the liquidity\n\n3. Probability Matrices\n   · Not "this will happen"\n   · But "if this happens, institutions will likely..."\n   · Based on actual algorithmic behavior patterns\n\nThe Translation Layer:\n\nRetail sees: "Price is approaching resistance"\nClick&Trader shows: "Liquidity cluster at 0.76, stop concentration beyond 0.91, probable sweep before reversal to 0.64"\n\nVII. WHY IT FEELS "TOO SIMPLE"\n\nThe Complexity Industry:\n\n· Thousands of indicators exist for one reason: to confuse\n· Every new pattern, oscillator, or system adds noise\n· The more complex, the more backtestable, the more marketable\n· But complexity doesn\'t improve edge—it obscures it\n\nThe Universal Truth:\n\nMarket mechanics haven\'t changed in decades.\nHuman psychology hasn\'t evolved.\nAlgorithmic exploitation has only become more efficient.\nThe simplest patterns repeat because human behavior repeats.\n\nThe Click&Trader Difference:\n\n· Removes the noise\n· Shows the mechanics\n· Focuses on what institutions actually do\n· Not what analysts say they "should" do\n\nVIII. THE HUNTER\'S ANALYTICAL MINDSET\n\nPrinciple 1: Institutional Timing\n\n• Institutions typically do not initiate the primary move.\n\n• Retail commitment usually precedes institutional action.\n\n• Market edge is statistically linked to analytical patience rather than prediction.\n\nPrinciple 2: Price Origin Analysis\n\n• Technical focus remains on the structural reason for price reaching a level.\n\n• Observation exceeds the simple fact that price is at a level.\n\n• Identifying the "why" assists in determining institutional control.\n\nPrinciple 3: Identifying Retail Imbalance\n\n• Institutional liquidity frequently originates from retail positioning errors.\n\n• The analytical objective is to identify these imbalances before price stabilization.\n\n• Data synthesis prioritizes the institutional side of the technical configuration.\n\nPrinciple 4: Reactive Analysis Protocol\n\n• The initial market move is frequently a liquidity trap.\n\n• The technical reaction represents the primary institutional objective.\n\n• Data validation typically follows the full positioning of retail participants.\n\n• Strategic alignment is found on the counter- retail side of the flow.\n\nIX. IMPLEMENTATION PROTOCOL\n\nStep 1: Map the Liquidity\n\n• Identification of all prominent technical levels.\n\n• Mapping where retail entries / stops would cluster.\n\n• Note the 12 / 23 / 38 / 64 / 91 levels from recent swings.\n\nStep 2: Identify the Phase\n\n• Is price at an inducement zone ? (23 / 76).\n\n• Has a sweep just occurred ? (12 / 91).\n\n• Is the price in a business zone ? (38 / 64).\n\n• Observation of retail reaction at each point.\n\nStep 3: Wait for Confirmation\n\n· Don\'t anticipate\n· Watch how price behaves at each level\n· Look for the institutional response\n· Enter when they enter, not before\n\nStep 4: Manage as the Hunter\n\n· Your stop: where retail would enter\n· Your target: where retail would stop out\n· Your size: what you can hold without emotion\n· Your exit: when the next phase begins\n\nX. THE FINAL REALIZATION\n\nYou have two choices:\n\n1. Be the Liquidity\n   · Trade based on hope, analysis, prediction\n   · Enter early, exit late\n   · Place stops at obvious levels\n   · Follow the narratives\n   · Participate in the extraction\n\n2. Be the Hunter\n   · Trade based on mechanical response\n   · Enter after others are wrong\n   · Place stops where others take profit\n   · Follow the liquidity flow\n   · Participate in the extraction—from the other side\n\nClick&Trader exists for one reason:\n\nTo give you the same map the algorithms use.\nNot to make you smarter than the market.\nBut to make you invisible to its mechanics.\n\nThe market doesn\'t care about your analysis.\nIt cares about your placement.\nPlace yourself on the hunting side.\nEverything else is noise.',
        proTip: 'Never place your TP exactly on the number. Front-run it by 2 points (ex: Exit at .62 instead of .64).',
        videoUrl: require('../assets/videos/institutional_levels.mov'),
        videoAspectRatio: 1.6 // Match Pro4x Sell (16:10) for edge-to-edge
    },
    {
        title: 'PRO4X | Institutional Bullish',
        subtitle: 'Validation at Support Level',
        image: require('../assets/images/education/pro4x_buy.png'),
        realCapture: require('../assets/images/wtc_2_premium.png'),
        explanation: 'LIVE EXECUTION — PRO4X INSTITUTIONAL BULLISH\n\nThis Bullish signal is not a random alert.\nIt already displays the best statistically calculated level alignment.\n\nThe PRO4X system is designed to:\n\nAnalyze liquidity\nRead market structure\nEvaluate execution probability\n\nAnd pre-compute the most likely institutional level alignment.\n\nWhat you see in the alert is not a suggestion —\nit is the highest-probability number at that moment.\n\nThis Bullish signal is not a fixed price signal.\nIt defines a liquidity zone, not a number.\n\nWhen a Get Ready prints — for example at 25538 —\nthe institutional execution will almost never occur exactly at that price.\n\nIt will occur on one of the execution numbers:\n\n12 / 38 / 64 / 91.\n\nYour job is to identify which one.\n\nHow institutions choose the number\n\nInstitutions do not guess.\nThey let liquidity decide.\n\nAfter a GR at 25538, price may rotate to:\n25564\n25591\nor sweep to 25512\n\nEach number corresponds to a different market intention.\n\nScenario 1 — Strong and persistent H1 trend\n\nIf the H1 trend is strong and has been active for a while:\nInstitutions do not need a deep stop-hunt\nLiquidity is already present\nPrice often reacts early\n\nIn this case, prioritize the 64\nExecution happens higher, without going to 91 or 12.\n\nThis is continuation-style accumulation.\n\nScenario 2 — Late trend or exhaustion on H1\n\nIf the H1 trend is overextended or losing momentum:\nInstitutions need more liquidity\nA stop-hunt is likely\n\nPrice may push to 91\nor even sweep down to 12\nbefore the real reversal starts.\n\nThis is where weak hands are forced out.\n\nScenario 3 — Curve-based execution\n\nIf price is already well positioned on the curve:\nNo imbalance\nNo emotional pressure\nVolume is balanced (VRVP)\n\nExecution can occur directly on the curve,\nmost often around 38 or 64,\nwithout any extreme move.\n\nClean. Controlled. Institutional.\n\nWhat to check before level alignment\n\nBefore choosing the number, you must read:\nH1 trend strength\nCurve position\nVRVP structure (where liquidity is thick)\nPrice behavior near each level\n\nThe number is not random.\nIt is selected by context.',
        proTip: '**KEY RULE**\n\nAvoid acting just because a signal appears.\nFocus on where institutions are likely to act.\n\nIf you don’t understand the numbers,\nyou are guessing.\n\nIf you do,\nyou are utilizing the execution model.',
        videoModules: {
            buy: require('../assets/videos/pro4x_buy.mp4'),
            sell: require('../assets/videos/pro4x_ex2.mp4')
        },
        videoTabLabels: { buy: 'EXAMPLE 1', sell: 'EXAMPLE 2' },
        videoAspectRatio: 1.33, // 4:3 Ratio (Narrower)
        videoCaption: 'PRO4X EXECUTION'
    },
    {
        title: 'PRO4X | Institutional Bearish',
        subtitle: 'Precision at Resistance',
        image: require('../assets/images/education/pro4x_sell.png'),
        realCapture: require('../assets/images/wtc_3_premium.png'),
        explanation: 'LIVE EXECUTION — PRO4X INSTITUTIONAL BEARISH\n\nThis Bearish signal is not a random alert.\nIt already displays the best statistically calculated level alignment.\n\nThe PRO4X system is designed to:\n\nAnalyze buyer liquidity\nRead market structure\nEvaluate execution probability\nPre-compute the most likely institutional level alignment\n\nWhat you see in the alert is not a suggestion —\nit is the highest-probability bearish number at that moment.\n\nThis Bearish signal is not a fixed price\n\nIt defines a liquidity zone, not a single number.\n\nWhen a Get Ready prints — for example at 25538 —\nthe institutional execution will almost never occur exactly at that price.\n\nExecution will occur on one of the institutional numbers:\n\n12 / 38 / 64 / 91\n\nYour job is to identify which one will be respected.\n\nHow institutions choose the bearish number (NQ logic)\n\nInstitutions do not guess.\nThey let buyer liquidity build, then execute into it.\n\nAfter a GR at 25538, price may rotate to:\n25564\n25591\nor spike to 25512 before rejection\n\nEach number reflects a different distribution intent.\n\nScenario 1 — Strong and persistent H1 uptrend (Nasdaq typical)\n\nOn the NQ, strong H1 trends are often violent and extended.\n\nIf the H1 uptrend is clean and still strong:\nInstitutions do not need a deep breakout\nLate buyers are already aggressive\nDistribution starts early\n\nIn this case, prioritize the 64\nBearish level alignment happens below the extreme,\noften without reaching 91.\n\nThis is early distribution into strength.\n\nScenario 2 — Overextended H1 trend / euphoric phase\n\nIf the H1 trend is:\nOverextended\nVertical\nFueled by FOMO (very common on NQ)\n\nInstitutions need maximum buyer liquidity\n\nPrice often pushes to 91\nor briefly spikes before rejection.\n\nThis is the classic Nasdaq stop-hunt above highs\nbefore a sharp sell-off.\n\nScenario 3 — Curve-based level alignment\n\nIf price is already:\nHigh on the curve\nMomentum is slowing\nVRVP shows heavy volume above\n\nExecution can occur directly on the curve,\nmost often around 38 or 64,\nwithout any final spike.\n\nClean. Silent. Institutional.\n\nWhat to validate before level alignment\n\nBefore executing the Bearish signal, confirm:\nH1 trend strength or exhaustion\nCurve position\nVRVP liquidity above price\nPrice behavior at each number\n\nThe number is never random.\nIt is selected by context and liquidity.',
        proTip: '**KEY RULE**\n\nAvoid acting just because a signal appears.\nFocus on where institutions distribute risk.\n\nIf you don’t understand the numbers,\nyou are reacting.\n\nIf you do,\nyou are executing the PRO4X institutional model.',
        videoUrl: require('../assets/videos/pro4x_sell.mov'),
        videoAspectRatio: 1.6,
        videoCaption: 'PRO4X EXECUTION'
    },
    {
        title: 'HORUS | OVS Reversal',
        subtitle: 'The wildest alert for expert scalpers',
        image: require('../assets/images/education/horus_ovs.png'),
        realCapture: require('../assets/images/wtc_4_premium.png'),
        explanation: 'BEHAVIOR EXECUTION — OVERSOLD (OVS)\n\n**The most efficient scalping alert.**\nExcellent Risk/Reward profile.\n\nNote: In highly volatile markets, reactions are immediate. In slower conditions, allow the market to breathe and wait for price to reach an institutional key number before execution.\n\nNote: It is even better if the alert triggers **offset** from the standard levels (12/23/38/64/91).\nIt means the market is overextended beyond the structure.\n\nThe market is extremely oversold.\nPrice has fallen too far, too fast.\n*Note: Multiple OVS alerts may sound in sequence during the final drop.*\n\nAt this stage:\n\nSelling pressure becomes inefficient\nLate sellers are acting out of fear\nInstitutions are accumulating, not selling\n\nThis is where algorithms stop pushing price lower\nand start absorbing liquidity.\n\nLook for:\n\nA vertical capitulation candle\nFollowed by a fast and aggressive rebound\n\nThe reversal often comes suddenly,\nonce selling pressure is exhausted.',
        proTip: 'The rebound is often faster than the drop itself.\n\n**Take profit quickly (20-25 points MAX).** Hesitation usually gives them back.',
        videoModules: {
            buy: require('../assets/videos/horus_ovs.mp4'),
            sell: require('../assets/videos/horus_ovs3.mp4')
        },
        videoTabLabels: { buy: 'EXAMPLE 1', sell: 'EXAMPLE 2' },
        videoAspectRatio: 1.33, // 4:3 Ratio (Narrower)
        videoCaption: 'HORUS EXECUTION'
    },
    {
        title: 'HORUS | OVB Reversal',
        subtitle: 'The wildest alert for expert scalpers',
        image: require('../assets/images/education/horus_ovb.png'),
        realCapture: require('../assets/images/wtc_5_premium.png'),
        explanation: 'BEHAVIOR EXECUTION — OVERBOUGHT (OVB)\n\n**The most efficient scalping alert.**\nExcellent Risk/Reward profile.\n\nNote: In highly volatile markets, reactions are immediate. In slower conditions, allow the market to breathe and wait for price to reach an institutional key number before execution.\n\nNote: It is even better if the alert triggers **offset** from the standard levels (12/23/38/64/91).\nIt means the market is overextended beyond the structure.\n\nThe market is extremely overbought.\nPrice has moved too far, too fast.\n*Note: Multiple OVB alerts may sound in sequence during the final pump.*\n\nAt this stage:\n\nBuying pressure is no longer efficient\nLate buyers are entering emotionally\nInstitutions are distributing, not accumulating\n\nThis is where algorithms stop pushing price\nand start letting liquidity unwind.\n\nLook for:\n\nA vertical exhaustion candle\nFollowed by a sharp and rapid rejection\n\nThe reversal usually occurs without warning\nonce buying power is depleted.\n\n**Note: No video for this card. The execution behavior is the same as for Buy.**',
        proTip: 'The snap-back is often faster and more violent than the move up.\n\n**Take profit quickly (20-25 points MAX).** Hesitation is costly here.'
    },
    {
        title: 'SHADOW | Liquidity Sweep',
        subtitle: 'Most powerful alerts in the app',
        image: require('../assets/images/education/shadow_mode_nq.png'),
        realCapture: require('../assets/images/wtc_6_premium.png'),
        explanation: {
            buy: 'SHADOW BULLISH — LIQUIDITY SWEEP (Demand Sweep)\n\nBEHAVIOR EXECUTION\n\n**Note: In highly volatile markets, reactions are immediate. In slower conditions, allow the market to breathe and wait for price to reach an institutional key number before execution.**\n\nA Shadow Bullish Signal is triggered when price is pushed below a key support to sweep seller liquidity (stops + panic exits).\nThis drop is not weakness — it’s a liquidity grab.\n\nInstitutions need volume to execute.\nThe fastest way to get it is to force everyone to capitulate at the same time.\n\nWhy it works\nThe sweep triggers stop-loss cascades → instant liquidity\nInstitutions absorb that liquidity at a discount\nOnce selling is exhausted, price snaps back fast\n\nThe Magnet Map (how to read the market)\n\nThe levels 12 / 23 / 38 / 64 / 91 are not signals.\nThey form a price map.\n\nPrice moves from one magnet to another,\njust like navigating between known coordinates.\n\nInstitutions do not trade randomly.\nThey execute along this map, where liquidity is known to exist.\n\nConfluence (when the map becomes powerful)\n\nA Shadow Bullish Signal becomes high probability when:\n\nPrice reaches a magnet on the map\n(12 / 23 / 38 / 64 / 91)\nOn execution timeframes\n1000 Ticks / M1\nWith multi-market alignment:\nMNQ / NQ reacting on its magnet\nES reacting on its corresponding magnet\nSPX (cash) holding or rejecting its own magnet\nRSI is extreme or diverging\nPrice reclaims the magnet after the sweep (wick + acceptance)\n\nWhen cash and futures react together on their respective magnets,\nyou are not guessing —\nyou are reading the map correctly.\n\nThis is where:\nThe sweep stops being random\nThe wick becomes meaningful\nThe reversal becomes institutional\n\nThis is not a “dip buy”.\nIt’s a trap where the crowd sells the bottom — and institutions capture it.',
            sell: 'SHADOW BEARISH — LIQUIDITY SWEEP (Supply Sweep)\n\nBEHAVIOR EXECUTION\n\n**Note: In highly volatile markets, reactions are immediate. In slower conditions, allow the market to breathe and wait for price to reach an institutional key number before execution.**\n\nA Shadow Bearish Signal is triggered when price is pushed above a key resistance to sweep buyer liquidity (breakout entries + stops).\nThis spike is not strength — it’s a liquidity harvest.\n\nInstitutions need volume to distribute.\nThe fastest way to get it is to force everyone to enter at the top.\n\nWhy it works\nThe breakout triggers FOMO + stop orders → instant liquidity\nInstitutions distribute into that buying pressure\nOnce buying is exhausted, price rejects and drops quickly\n\nThe Magnet Map (how to read the market)\n\nThe same map applies.\n\nPrice is pushed from one magnet to the next,\nuntil enough liquidity is collected.\n\nBreakouts and reversals both occur\non this map, not between random prices.\n\nConfluence (when the map aligns)\n\nA Shadow Bearish Signal becomes high probability when:\n\nPrice reaches a magnet on the map\n(12 / 23 / 38 / 64 / 91)\nOn 1000 Ticks / M1\nWith multi-market alignment:\nMNQ / NQ rejecting its magnet\nES failing on its corresponding magnet\nSPX (cash) stalling or rejecting the same structure\nRSI is extreme or diverging \nPrice fails to hold above the magnet after the sweep\n\nWhen cash and futures reject together on the same map level,\nthe move is no longer noise —\nit’s distribution.\n\nThis is not a “breakout”.\nIt’s a liquidity trap where the crowd enters the top — and institutions execute into it.'
        },
        proTip: {
            buy: 'Wait for the reclaim of the swept magnet.\n\nThe best Shadow Bullish signals are fast, violent, and clean.',
            sell: 'Do not short the first spike.\nShort the failure on the magnet.\n\nThat’s the real signal.'
        },
        videoModules: {
            buy: require('../assets/videos/shadow_buy.mp4'),
            sell: require('../assets/videos/shadow_sell.mp4')
        },
        videoCaption: 'SHADOW MODE EXECUTION',
        videoAspectRatio: 1.33, // 4:3 Ratio (Narrower)
        videoSpeed: 1.0
    },
    {
        title: 'GET READY — APPROACHING',
        subtitle: 'Institutional Pre-Signal',
        image: require('../assets/images/education/get_ready.png'),
        realCapture: require('../assets/images/wtc_7_premium.png'),
        explanation: 'Liquidity conditions are now favorable for an institutional move\n\nBEHAVIOR EXECUTION\n\nA Get Ready (GR) appears when all internal conditions are met\nand price is approaching a high-probability magnet level.\n\nThis is a pre-signal.\nNot an entry by default.\n\nIt means:\nThe market has reached extreme conditions\nLiquidity, momentum, and pressure are now aligned\nThe market is ready for an institutional execution\n\nThe setup is armed. Execution is next.\n\nWhat happens after Get Ready\n\nAfter a GR, PRO4X is responsible for delivering the entry.\n\nThe system calculates and displays:\nThe best execution price\nOn the magnet map\n12 / 23 / 38 / 64 / 91\n\nThe entry will occur only if and when price reaches the optimal level\nidentified by PRO4X.\n\nImportant nuance\n\nDepending on the market context:\nA GR can already offer an opportunity\nOr price may need to travel to the next magnet to collect more liquidity\n\nGR tells you:\nWhere the market is heading\nWhich numbers matter\nThat an entry is likely soon\n\nPRO4X tells you:\nWhen\nWhere\nAt which exact number\n\nKey rule\n\nDo not enter because GR appears.\nEnter when PRO4X confirms the execution level.\n\nGR prepares the move.\nPRO4X executes it.',
        proTip: 'Think of Get Ready as a countdown.\n\nWhen the number is reached, PRO4X does the rest.'
    },
    {
        title: 'THE MOMENTUM TRAP',
        subtitle: 'When Direction Is Too Strong',
        image: require('../assets/images/education/momentum_trap.png'),
        realCapture: require('../assets/images/wtc_8_premium.png'),
        explanation: [
            {
                title: 'THE MOMENTUM TRAP',
                subtitle: 'When Direction Is Too Strong',
                content: 'BEHAVIOR EXECUTION\n\nA Momentum Trap occurs when price moves too fast, too clean, and without rejection.\n\nYou will see:\nLarge full-bodied candles\nNo wicks, no hesitation\nPrice cuts through levels instead of reacting\n\nThis is high-velocity momentum.\n\nIn this state:\nLiquidity is not being absorbed\nInstitutions are not executing reversals\nMagnet levels are ignored\n\nTrying to fade this move is not contrarian —\nit is being run over.\n\nWhy this is a trap\n\nWhen momentum is extreme:\nBreaks are real, not fake\nReversals do not form\nWaiting for a reaction is mandatory\n\nEntering here feels logical\nbecause the level “should hold”.\n\nIt doesn’t.\n\nThis is where most traders lose by:\nFighting the move\nCalling a top or bottom\nForcing a setup that isn’t there\n\nHow to recognize it\nA candle closes fully beyond the level\nThe next candle continues immediately\nNo wick, no reclaim\nPrice ignores the magnet map\n\nThis means:\nDo nothing.\n\nWhat to do instead\n\nWait for:\nA pause\nA wick\nA loss of momentum\n\nOnly after pressure slows down\ncan a real setup exist.',
                proTip: 'If the candle looks like a wall, do NOT trade it.\nWait for the market to breathe first.'
            },
            {
                title: 'FAKE MOMENTUM',
                subtitle: 'When Strength Is an Illusion',
                content: 'BEHAVIOR EXECUTION\n\nFake Momentum appears when price looks aggressive,\nbut has no real follow-through.\n\nYou may see:\nFast candles with long wicks\nPushes that stall immediately\nPrice reaching a level and failing to continue\n\nIt feels like strength.\nIt isn’t.\n\nThis is manufactured momentum —\ndesigned to trigger entries, not to continue.\n\nWhy it fools traders\n\nFake momentum plays on urgency:\n“If I don’t enter now, I’ll miss the move”\n“This looks strong, it has to go”\n\nBut in reality:\nLiquidity is being created, not consumed\nInstitutions are not committed\nThe move exists only to attract participation\n\nHow to recognize it\nThe candle cannot hold beyond the level\nWicks appear immediately\nThe next candle fails to extend\nPrice oscillates around the magnet, not away from it\n\nThis tells you:\nNo control. No commitment.\n\nWhat it usually leads to\n\nFake momentum often precedes:\nA liquidity sweep\nA sharp rejection\nOr a move in the opposite direction\n\nIt is not continuation.\nIt is preparation.\n\nWhat to do\n\nDo not chase.\nDo not anticipate.\n\nWait for:\nA reclaim (for reversal)\nOr a clean break with acceptance (for continuation)',
                proTip: 'If momentum needs to convince you, it’s probably fake.\nReal momentum doesn’t ask — it moves.'
            },
            {
                title: 'REAL MOMENTUM',
                subtitle: 'When the Move Is Real',
                content: 'BEHAVIOR EXECUTION\n\nReal Momentum is not loud.\nIt is efficient.\n\nPrice moves with intent,\nnot with noise.\n\nYou will see:\nClean candles\nSmall or no wicks\nConsistent follow-through after the level\n\nThis is not a reaction.\nIt is acceptance.\n\nWhy it works\n\nReal momentum appears when:\nLiquidity has already been cleared\nOpposite pressure is exhausted\nInstitutions no longer need traps or sweeps\n\nAt this point:\nPrice does not hesitate\nLevels are respected through acceptance\nThe magnet map is traveled, not fought\n\nHow to recognize it\nA candle closes beyond the magnet\nThe next candle continues in the same direction\nNo immediate rejection\nPullbacks are shallow and controlled\n\nThis means:\nControl has shifted.\n\nWhat it is NOT\nNot a spike\nNot FOMO\nNot a sweep\n\nThere is no urgency.\nJust progress.\n\nHow to trade it\n\nDo not fade it.\nDo not force reversals.\n\nWait for:\nA pullback to the next magnet\nOr continuation with structure\n\nTrade with it, not against it.',
                proTip: 'If momentum feels calm and inevitable,\nit’s probably real'
            }
        ],
        proTip: null // Using null as proTip is defined per section
    },
    {
        title: 'TP PUMP — VERTICAL MOVE (UP)',
        subtitle: 'Exit Force: Up',
        image: require('../assets/images/education/tp_pump.png'),
        realCapture: require('../assets/images/education/tp_pump.png'), // Duplicate to avoid "Coming Soon" overlay
        explanation: [
            {
                title: 'TP PUMP — VERTICAL MOVE (UP)',
                subtitle: 'Exit Force: Up',
                content: 'BEHAVIOR EXECUTION\n\nA TP Pump occurs when price rallies too fast and too far above the 50-period moving average.\n\nThis is not euphoria.\nIt is a temporary extension inside an existing trend.\n\nWhen price stretches too far:\nLate buyers enter\nEfficiency drops\nMean reversion becomes likely\n\nEspecially when:\nATR expands\nVolume spikes\nCandles turn vertical\n\nHow to use TP Pump\nIf you are short → this is a Take Profit / exit signal\nIf you are long → this can be a reload opportunity after the pullback\nIf you are flat → it can be used for a scalp back toward the MA50\n\nThe logic is simple:\nExtreme distance from the mean creates opportunity.\n\nImportant rule\n\nTP Pump is reliable when:\nThe trend is still intact\nVolume confirms excess participation\nATR shows expansion\n\nNo volatility = no edge.',
                proTip: 'When price accelerates vertically,\ndon’t chase it — let it come back.'
            },
            {
                title: 'KEY TAKEAWAY',
                subtitle: 'For both TP Pump & TP Push',
                content: 'TP Pump / TP Push are not trend calls.\nThey are distance alerts.\n\nThey tell you:\nWhen to secure profits\nWhen to reload\nWhen a short-term scalp is possible\n\nThey are about position management,\nnot prediction.',
                proTip: 'These signals are about protecting capital, not gambling.'
            }
        ],
        proTip: null
    },
    {
        title: 'TP PUSH — VERTICAL MOVE (DOWN)',
        subtitle: 'Exit Force: Down',
        image: require('../assets/images/education/tp_push.png'),
        realCapture: require('../assets/images/education/tp_push.png'), // Duplicate to avoid "Coming Soon" overlay
        explanation: [
            {
                title: 'TP PUSH — VERTICAL MOVE (DOWN)',
                subtitle: 'Exit Force: Down',
                content: 'BEHAVIOR EXECUTION\n\nA TP Push occurs when price drops too fast and too far from the 50-period moving average.\n\nThis move is not a trend change by default.\nIt is a pullback inside the trend.\n\nPrice must rebalance and return toward its mean.\n\nThis behavior appears when:\nATR is elevated (volatility expansion)\nVolume increases sharply\nThe move becomes vertical, not progressive\n\nAt this point, continuation loses efficiency\nand mean reversion dominates.\n\nHow to use TP Push\nIf you are long → this is a Take Profit / protection signal\nIf you are short → this can be a reload opportunity after the pullback\nIf you are not in position → it can be used for a quick scalp toward the MA50\n\nThe key idea:\nPrice is too far from balance and must come back.\n\nImportant rule\n\nTP Push works best when:\nVolume confirms the move\nATR is expanded\nThe market is still structurally trending\n\nWithout volatility, there is no pullback.',
                proTip: 'A vertical move away from the MA50 is rarely sustainable.\nPrice almost always comes back to rebalance first.'
            },
            {
                title: 'KEY TAKEAWAY',
                subtitle: 'For both TP Pump & TP Push',
                content: 'TP Pump / TP Push are not trend calls.\nThey are distance alerts.\n\nThey tell you:\nWhen to secure profits\nWhen to reload\nWhen a short-term scalp is possible\n\nThey are about position management,\nnot prediction.',
                proTip: 'These signals are about protecting capital, not gambling.'
            }
        ],
        proTip: null
    }
];


// --- COMPONENTS ---


// --- REUSABLE MASTERCLASS MODAL ---


const MasterclassEducationModal = ({
    visible,
    onClose,
    title,
    theoryImage,
    realCapture,
    explanation,
    proTip,
    videoUrl,
    videoModules,
    videoTabLabels,
    videoAspectRatio, // Added destructuring
    videoCaption,
    videoSpeed,
    subtitle // Added subtitle support
}: {
    visible: boolean;
    onClose: () => void;
    title: string;
    theoryImage: any;
    realCapture?: any;
    explanation: string | { buy: string; sell: string } | Array<{ title: string; subtitle?: string; content: string; proTip?: string }>;
    proTip: string | { buy: string; sell: string } | null;
    videoUrl?: any;
    videoModules?: { buy: any; sell: any };
    videoTabLabels?: { buy: string; sell: string };
    videoAspectRatio?: number; // Added prop for custom aspect ratio
    videoCaption?: string;
    videoSpeed?: number;
    subtitle?: string; // Added subtitle prop
}) => {
    const [viewMode, setViewMode] = useState<'theory' | 'real' | 'video'>('real');
    const [videoTab, setVideoTab] = useState<'buy' | 'sell'>('sell');
    const [fullScreenImage, setFullScreenImage] = useState<any>(null);

    // Reset to 'real' mode every time the modal opens
    useEffect(() => {
        if (visible) {
            setViewMode('real');
            setFullScreenImage(null);
            setVideoTab('sell');
        }
    }, [visible]);

    // List of headers to highlight in yellow
    const HEADERS_TO_HIGHLIGHT = [
        "BEHAVIOR EXECUTION",
        "What happens after Get Ready",
        "Important nuance",
        "Key rule",
        "Why this is a trap",
        "How to recognize it",
        "What to do instead",
        "Why it fools traders",
        "Why it fools traders",
        "What it usually leads to",
        "How it works",
        "The Magnet Map logic",
        "How to use it",
        "What it is NOT",
        "Key takeaway",
        "Like Real Steel — you control, the system assists",
        "A Word About Trading Hours (Europe vs US)",
        "The Magnet Map (Core of the System)",
        "Capital Preservation — Very Important",
        "Strong Trend Days — Adjust Your Behavior",
        "Coder’s Advice (Important)",
        "Best Practices",
        "Final Words",
        "From traders to traders",
        "What to do",
        "Why it works",
        "What it is NOT",
        "How to trade it",
        "How to use TP Push",
        "How to use TP Pump",
        "Important rule",
        "The Magnet Map (how to read the market)",
        "Confluence (when the map becomes powerful)",
        "Confluence (when the map aligns)",
        "FAKE MOMENTUM",
        "REAL MOMENTUM",
        "Key takeaway"
    ];

    // Helper to render explanation with colored title and headers
    const renderRichText = (text: string) => {
        const lines = text.split('\n');
        return (
            <Text style={styles.modalExplanationText}>
                {lines.map((line, index) => {
                    const trimmedLine = line.trim();
                    // First line is always a title (Yellow)
                    if (index === 0 && trimmedLine.length > 0) {
                        return <Text key={index} style={{ color: '#D4AF37', fontWeight: 'bold' }}>{line}{'\n'}</Text>;
                    }

                    // Check if line is a header
                    const isHeader = HEADERS_TO_HIGHLIGHT.some(header =>
                        trimmedLine === header || trimmedLine.startsWith(header + " ")
                    );

                    if (isHeader) {
                        return <Text key={index} style={{ color: '#D4AF37', fontWeight: 'bold', lineHeight: 28 }}>{'\n'}{line}{'\n'}</Text>;
                    }

                    return <Text key={index}>{line}{'\n'}</Text>;
                })}
            </Text>
        );
    };

    const currentImage = viewMode === 'theory' ? theoryImage : (realCapture || theoryImage);
    const hasVideo = videoUrl || videoModules;
    const activeVideoSource = videoModules ? videoModules[videoTab] : videoUrl;

    // Resolve dynamic text based on tab
    const activeExplanation = (typeof explanation === 'object' && explanation !== null)
        ? (explanation as any)[videoTab]
        : explanation;

    const activeProTip = (typeof proTip === 'object' && proTip !== null)
        ? (proTip as any)[videoTab]
        : proTip;


    return (
        <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalBackdrop}>
                {/* NORMAL MASTERCLASS VIEW */}
                {!fullScreenImage && (
                    <View style={styles.educationModalContent}>
                        <View style={styles.modalHeader}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <Text style={styles.modalHeaderTitle} numberOfLines={2}>{title}</Text>
                                {subtitle ? (
                                    <Text style={{ color: '#ccc', fontSize: 12, marginTop: 2 }} numberOfLines={2}>
                                        {subtitle}
                                    </Text>
                                ) : (
                                    <Text style={{ color: '#D4AF37', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 }}>MASTERCLASS SYSTEM</Text>
                                )}
                            </View>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close-circle" size={30} color="white" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={[
                                styles.imageContainer,
                                {
                                    marginTop: viewMode === 'video' ? 25 : -20, // Clear air at top
                                    marginBottom: viewMode === 'video' ? 0 : 40
                                }
                            ]}>
                                <View style={StyleSheet.absoluteFill}>
                                    <LinearGradient
                                        colors={['#1a1a1a', '#050505']}
                                        style={StyleSheet.absoluteFill}
                                    />
                                    {/* Subtle grid pattern simulated with borders or just a clean gradient for now */}
                                    <View style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.05)'
                                    }} />
                                    <View style={{
                                        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.05)'
                                    }} />
                                </View>

                                {viewMode === 'video' && activeVideoSource ? (
                                    <View style={[styles.imageWrapper, {
                                        height: videoAspectRatio ? undefined : height * 0.85, // Use aspect ratio if available, else fixed height
                                        aspectRatio: videoAspectRatio, // Apply aspect ratio
                                        backgroundColor: '#000',
                                        justifyContent: 'flex-start' // Ensure top alignment
                                    }]}>
                                        <VideoPlayer
                                            key={videoTab}
                                            source={activeVideoSource}
                                            shouldPlay
                                            isLooping
                                            isMuted={true}
                                            useNativeControls
                                            playbackSpeed={videoSpeed || 1.0}
                                            resizeMode="contain" // Force contain to NEVER crop content
                                            style={{ width: '100%', height: '100%', borderRadius: 16 }}
                                        />
                                    </View>
                                ) : null}

                                {viewMode === 'video' && activeVideoSource && (
                                    <View style={{
                                        marginTop: 10, // Standard safe spacing
                                        marginHorizontal: 15,
                                        padding: 5,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        borderRadius: 8,
                                        borderLeftWidth: 3,
                                        borderLeftColor: '#D4AF37'
                                    }}>
                                        <Text style={{ color: '#ccc', fontSize: 12, fontStyle: 'italic', fontWeight: 'bold' }}>
                                            "{videoModules ? (videoTabLabels ? videoTabLabels[videoTab] : (videoTab === 'buy' ? 'SHADOW BUY EXECUTION' : 'SHADOW SELL EXECUTION')) : videoCaption}"
                                        </Text>
                                    </View>
                                )}

                                {/* Video Tabs (Only visible in video mode) */}
                                {viewMode === 'video' && videoModules && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 10, gap: 10 }}>
                                        <TouchableOpacity
                                            onPress={() => setVideoTab('buy')}
                                            style={[styles.masterclassBadge, { backgroundColor: videoTab === 'buy' ? '#4ADE80' : 'rgba(255,255,255,0.1)', borderColor: videoTab === 'buy' ? '#4ADE80' : 'transparent' }]}
                                        >
                                            <Ionicons name={videoTabLabels ? "videocam" : "caret-up"} color={videoTab === 'buy' ? '#000' : '#888'} size={12} />
                                            <Text style={[styles.masterclassBadgeText, { color: videoTab === 'buy' ? '#000' : '#888', marginLeft: 5 }]}>
                                                {videoTabLabels ? videoTabLabels.buy : 'BULLISH SCENARIO'}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setVideoTab('sell')}
                                            style={[styles.masterclassBadge, { backgroundColor: videoTab === 'sell' ? (videoTabLabels ? '#4ADE80' : '#EF4444') : 'rgba(255,255,255,0.1)', borderColor: videoTab === 'sell' ? (videoTabLabels ? '#4ADE80' : '#EF4444') : 'transparent' }]}
                                        >
                                            <Ionicons name={videoTabLabels ? "videocam" : "caret-down"} color={videoTab === 'sell' ? '#FFF' : '#888'} size={12} />
                                            <Text style={[styles.masterclassBadgeText, { color: videoTab === 'sell' ? '#FFF' : '#888', marginLeft: 5 }]}>
                                                {videoTabLabels ? videoTabLabels.sell : 'BEARISH SCENARIO'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {viewMode !== 'video' ? (
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => setFullScreenImage(currentImage)}
                                        style={styles.imageWrapper}
                                    >
                                        <View style={[StyleSheet.absoluteFill, { padding: 4 }]}>
                                            <Image
                                                source={currentImage}
                                                style={[styles.educationFullImage, {
                                                    width: '100%',
                                                    height: '100%',
                                                    borderRadius: 8,
                                                }]}
                                                resizeMode="cover"
                                                fadeDuration={0}
                                            />
                                        </View>
                                        <View style={styles.zoomHintOverlay}>
                                            <Ionicons name="expand-outline" size={24} color="white" />
                                            <Text style={styles.zoomHintText}>TAP TO ENLARGE</Text>
                                        </View>

                                        {viewMode === 'real' && (
                                            <View style={styles.realLabelBadge}>
                                                <Ionicons name="shield-checkmark" size={12} color="#4ADE80" />
                                                <Text style={styles.realLabelText}>OFFICIAL CAPTURE</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ) : null}

                                {viewMode === 'real' && !realCapture && (
                                    <View style={styles.placeholderOverlay}>
                                        <Ionicons name="camera-outline" size={40} color="rgba(255,255,255,0.3)" />
                                        <Text style={styles.placeholderText}>TRADINGVIEW CAPTURE COMING SOON</Text>
                                    </View>
                                )}
                            </View>



                            {/* BOTTOM SPACING */}
                            {/* VIEW MODE TABS */}
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15, paddingHorizontal: 20, gap: 10 }}>
                                <TouchableOpacity
                                    onPress={() => setViewMode('real')}
                                    style={[styles.tabButton, viewMode === 'real' && styles.tabButtonActive]}
                                >
                                    <Text style={[styles.tabButtonText, viewMode === 'real' && { color: '#000' }]}>BEHAVIOR</Text>
                                </TouchableOpacity>

                                {hasVideo && (
                                    <TouchableOpacity
                                        onPress={() => setViewMode('video')}
                                        style={[styles.tabButton, viewMode === 'video' && styles.tabButtonActive, { borderColor: '#D4AF37' }]}
                                    >
                                        <Ionicons name="play" size={12} color={viewMode === 'video' ? '#000' : '#D4AF37'} style={{ marginRight: 5 }} />
                                        <Text style={[styles.tabButtonText, { color: viewMode === 'video' ? '#000' : '#D4AF37' }]}>VIDEO</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={{ padding: 20 }}>
                                <View style={styles.explanationHeader}>
                                    <View style={[styles.explanationIndicator, {
                                        backgroundColor: viewMode === 'theory' ? '#A855F7' : (viewMode === 'video' ? '#D4AF37' : '#4ADE80')
                                    }]} />
                                    <Text style={styles.modalExplanationTitle}>
                                        {viewMode === 'theory' ? 'CONCEPTUAL ANALYSIS' : (viewMode === 'video' ? 'LIVE EXECUTION' : 'BEHAVIOR EXECUTION')}
                                    </Text>
                                </View>
                                {Array.isArray(explanation) ? (
                                    explanation.map((section, index) => (
                                        <View key={index} style={{ marginBottom: 10 }}>
                                            <Text style={styles.modalExplanationText}>
                                                <Text style={{ color: '#FFFFFF', fontWeight: 'normal', fontSize: 13, letterSpacing: 1 }}>{section.title.toUpperCase()}</Text>
                                                {'\n'}
                                                {section.subtitle && (
                                                    <Text style={{ color: '#ccc', fontStyle: 'italic', fontSize: 12 }}>{section.subtitle}{'\n\n'}</Text>
                                                )}
                                                {/* renderRichText already handles text wrapping, but we need to extract line 0 logic if title inside content is redundant?
                                                    Actually section.content starts with BEHAVIOR EXECUTION usually.
                                                    Let's use renderRichText for content. */}
                                            </Text>
                                            {renderRichText(section.content)}

                                            {section.proTip && (
                                                <View style={styles.proTipContainer}>
                                                    <View style={styles.proTipGlitch} />
                                                    <Text style={styles.proTipText}>
                                                        <Text style={{ fontWeight: 'bold', color: '#D4AF37' }}>PRO TIP:</Text> {section.proTip}
                                                    </Text>
                                                </View>
                                            )}

                                            {index < explanation.length - 1 && (
                                                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                                                    <LinearGradient
                                                        colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
                                                        start={{ x: 0, y: 0.5 }}
                                                        end={{ x: 1, y: 0.5 }}
                                                        style={{ height: 1, width: '60%' }}
                                                    />
                                                </View>
                                            )}
                                        </View>
                                    ))
                                ) : typeof explanation === 'object' && explanation !== null ? (
                                    <>
                                        {renderRichText((explanation as any).buy)}
                                        <View style={styles.proTipContainer}>
                                            <View style={styles.proTipGlitch} />
                                            <Text style={styles.proTipText}>
                                                <Text style={{ fontWeight: 'bold', color: '#D4AF37' }}>PRO TIP:</Text> {typeof proTip === 'object' ? (proTip as any).buy : proTip}
                                            </Text>
                                        </View>

                                        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 20 }} />

                                        {renderRichText((explanation as any).sell)}
                                        <View style={styles.proTipContainer}>
                                            <View style={styles.proTipGlitch} />
                                            <Text style={styles.proTipText}>
                                                <Text style={{ fontWeight: 'bold', color: '#D4AF37' }}>PRO TIP:</Text> {typeof proTip === 'object' ? (proTip as any).sell : proTip}
                                            </Text>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        {renderRichText(explanation as string)}
                                        {proTip && (
                                            <View style={styles.proTipContainer}>
                                                <View style={styles.proTipGlitch} />
                                                <Text style={styles.proTipText}>
                                                    <Text style={{ fontWeight: 'bold', color: '#D4AF37' }}>PRO TIP:</Text> {proTip as string}
                                                </Text>
                                            </View>
                                        )}
                                    </>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                )
                }

                {/* FULLSCREEN ZOOMABLE VIEW */}
                {
                    fullScreenImage && (
                        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', zIndex: 1000 }]}>
                            <TouchableOpacity
                                style={styles.fullscreenClose}
                                onPress={() => setFullScreenImage(null)}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={32} color="white" />
                            </TouchableOpacity>

                            <ScrollView
                                maximumZoomScale={3}
                                minimumZoomScale={1}
                                zoomScale={1}
                                centerContent={true}
                                contentContainerStyle={{ width: width, height: height * 0.8, justifyContent: 'center', alignItems: 'center' }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                            >
                                <Image
                                    source={fullScreenImage}
                                    style={{
                                        width: width,
                                        height: width,
                                    }}
                                    resizeMode="contain"
                                    fadeDuration={0}
                                    key="fullscreen-image"
                                />
                            </ScrollView>

                            <View style={styles.fullscreenFooter}>
                                <Text style={styles.fullscreenTitle}>{title.toUpperCase()}</Text>
                                <Text style={styles.fullscreenSubtitle}>
                                    {Platform.OS === 'ios' ? 'PINCH TO ZOOM • ' : ''}OFFICIAL SYSTEM GRAPH
                                </Text>
                            </View>
                        </View>
                    )
                }
            </View >
        </Modal >
    );
};

// Modify SignalCard to accept forceOpen

const GuideSignalCard = ({ item, forceOpen }: { item: SignalGuideItem, forceOpen?: boolean }) => {
    const [modalVisible, setModalVisible] = useState(false);

    // Auto-open if forced
    useEffect(() => {
        if (forceOpen && item.education) {
            // Small delay to ensure transition completes
            setTimeout(() => setModalVisible(true), 500);
        }
    }, [forceOpen]);

    return (
        <>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => item.education && setModalVisible(true)}
                disabled={!item.education}
            >
                <GlassCard
                    style={styles.card}
                    intensity={20}
                    borderColor="#FFFFFF"
                    borderWidth={0.1}
                    borderRadius={16}
                    disableGradient={true}
                >
                    <LinearGradient
                        colors={['rgba(255,255,255,0.15)', 'rgba(0,0,0,0)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 0.4 }}
                        style={StyleSheet.absoluteFill}
                        pointerEvents="none"
                    />
                    <LinearGradient
                        colors={['#1A1A1A', '#000000']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
                        pointerEvents="none"
                    />
                    <View style={{ padding: 15 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={[styles.iconBox, { borderColor: item.color }]}>
                                <Ionicons name={item.icon} size={24} color={item.color} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 15 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    {/* Badge Removed as requested */}
                                </View>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </View>

                        {/* Modified Bottom Section: Stacked Layout with Fingerprint Button */}
                        <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' }}>
                            <Text style={[styles.actionText, { marginBottom: item.education ? 10 : 0 }]}>
                                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>ACTION:</Text> {item.action}
                            </Text>

                            {item.education && (
                                <View style={{ marginTop: 15, alignSelf: 'flex-start' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                                        <Ionicons name="finger-print" size={16} color="#D4AF37" style={{ marginRight: 8 }} />
                                        <Text style={{ color: '#D4AF37', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 }}>CLICK TO ACCESS MASTERCLASS</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </GlassCard>
            </TouchableOpacity>

            {item.education && (
                <MasterclassEducationModal
                    key={modalVisible ? 'open' : 'closed'}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    title={item.title}
                    theoryImage={item.education.theoryImage}
                    realCapture={item.education.realCapture}
                    explanation={item.education.explanation}
                    proTip={item.education.proTip}
                    videoUrl={item.education.videoUrl}
                    videoModules={item.education.videoModules}
                    videoTabLabels={item.education.videoTabLabels}
                    videoCaption={item.education.videoCaption}
                    videoAspectRatio={item.education.videoAspectRatio}
                    videoSpeed={item.education.videoSpeed}
                />
            )}
        </>
    );
};

const VisualSignalCard = ({ item, index }: { item: VisualEducationItem, index: number }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <GlassCard
                style={[styles.visualCard, { marginLeft: index === 0 ? 0 : 15 }]}
                intensity={30}
                borderRadius={24}
                disableGradient={true}
            >
                <TouchableOpacity activeOpacity={0.9} onPress={() => setModalVisible(true)}>
                    <Image source={item.image} style={styles.visualImage} resizeMode="cover" />
                    <View style={styles.visualOverlay}>
                        <Ionicons name="expand-outline" size={20} color="white" />
                        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold', marginLeft: 5 }}>MASTERCLASS</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setModalVisible(true)}
                    style={{ padding: 15 }}
                >
                    <Text style={styles.visualTitle}>{item.title}</Text>
                    <Text style={styles.visualSubtitle}>{item.subtitle}</Text>
                    <Text style={styles.visualExplanation} numberOfLines={3}>
                        {Array.isArray(item.explanation)
                            ? item.explanation[0].content
                            : (typeof item.explanation === 'string' ? item.explanation : item.explanation.buy)}
                    </Text>

                    {/* Redundant button removed as per request */}
                </TouchableOpacity>
            </GlassCard>

            <MasterclassEducationModal
                key={modalVisible ? 'open' : 'closed'}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                title={item.title}
                subtitle={item.subtitle} // Pass subtitle
                theoryImage={item.image}
                realCapture={item.realCapture}
                explanation={item.explanation}
                proTip={item.proTip}
                videoUrl={item.videoUrl}
                videoModules={item.videoModules}
                videoTabLabels={item.videoTabLabels}
                videoCaption={item.videoCaption}
                videoAspectRatio={item.videoAspectRatio}
                videoSpeed={item.videoSpeed}
            />
        </>
    );
};

const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>{title}</Text>
        <LinearGradient
            colors={['#333', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 1, flex: 1, marginLeft: 15 }}
        />
    </View>
);

const TabButton = ({ title, isActive, onPress }: any) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{ flex: 1, alignItems: 'center', paddingVertical: 15, borderBottomWidth: 2, borderBottomColor: isActive ? '#FFF' : 'transparent' }}
    >
        <Text style={{ color: isActive ? '#FFF' : '#666', fontWeight: isActive ? 'bold' : '500', fontSize: 12, letterSpacing: 1, textAlign: 'center' }}>{title}</Text>
    </TouchableOpacity>
);

export default function GuideManualScreen() {
    const router = useRouter();

    const { target } = useLocalSearchParams();
    const { isPro } = useAuth();

    return (
        <View style={styles.container}>
            <HolographicGradient />
            <Stack.Screen options={{ headerShown: false }} />
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingTop: Platform.OS === 'ios' ? 20 : 10,
                paddingBottom: 10,
                backgroundColor: 'black'
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <Ionicons name="chevron-down" size={26} color="white" />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>SYSTEM GUIDE</Text>
                <View style={{ width: 34 }} />
            </View>

            {/* TABS HEADER - NAVIGATION MODE */}
            <View style={[styles.tabContainer, { paddingTop: 15 }]}>
                <TabButton
                    title="ALERTS BEHAVIOR & MASTERCLASS"
                    isActive={true}
                    onPress={() => { }} // Already here
                />
                <TabButton
                    title="TRADING TIPS"
                    isActive={false}
                    onPress={() => router.push('/guide')}
                />
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <SectionHeader title="VISUAL MASTERCLASS" />

                {/* Horizontal Scroll must remain active for scrolling, so we block the inner content instead */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20, marginBottom: 30 }}>
                    <View style={{ flexDirection: 'row' }} pointerEvents={isPro ? 'auto' : 'none'}>
                        {SECTION_6_VISUALS.map((item, index) => <VisualSignalCard key={'visual-' + index} item={item} index={index} />)}
                    </View>
                </ScrollView>

                <View pointerEvents={isPro ? 'auto' : 'none'}>
                    <SectionHeader title="PHILOSOPHY" />
                    {SECTION_ETHOS.map((item, index) => <GuideSignalCard key={'ethos-' + index} item={item} forceOpen={isPro && item.title === target} />)}

                    <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
                        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', width: '40%' }} />
                        <Text style={{ color: '#FFF', fontSize: 10, letterSpacing: 2, marginTop: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>Understanding the Alerts</Text>
                    </View>

                    <SectionHeader title="1. PRO4X" />
                    {SECTION_1_PRO4X.map((item, index) => <GuideSignalCard key={'pro4x-' + index} item={item} forceOpen={isPro && item.title === target} />)}

                    <SectionHeader title="2. HORUS" />
                    {SECTION_2_HORUS.map((item, index) => <GuideSignalCard key={'horus-' + index} item={item} forceOpen={isPro && item.title === target} />)}

                    <SectionHeader title="3. SCALPING" />
                    {SECTION_3_SCALPING.map((item, index) => <GuideSignalCard key={'scalp-' + index} item={item} forceOpen={isPro && item.title === target} />)}

                    <SectionHeader title="4. H1 TREND" />
                    {SECTION_4_H1.map((item, index) => <GuideSignalCard key={'h1-' + index} item={item} forceOpen={isPro && item.title === target} />)}

                    <SectionHeader title="IMPORTANT: EXIT DISCIPLINE" />
                    {SECTION_0_DISCIPLINE.map((item, index) => <GuideSignalCard key={'disc-' + index} item={item} forceOpen={isPro && item.title === target} />)}

                    <View style={{ alignItems: 'center', marginVertical: 30 }}>
                        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.2)', width: '60%' }} />
                        <Text style={{ color: '#666', fontSize: 10, letterSpacing: 2, marginTop: 10, fontWeight: 'bold' }}>MASTERCLASS : EXECUTION RULES</Text>
                    </View>

                    {SECTION_5_MASTERCLASS.map((item, index) => <GuideSignalCard key={'master-' + index} item={item} forceOpen={isPro && item.title === target} />)}

                    <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 50, opacity: 0.5 }}>
                        <Text style={{ color: '#666', fontSize: 10, letterSpacing: 1 }}>
                            © 2025-2026 Click&Trader App. All rights reserved.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Teaser Overlay if NOT Pro */}
            {!isPro && <PremiumTeaserOverlay message="MASTERCLASS LOCKED" />}
        </View >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', backgroundColor: '#000' },
    scrollContent: { padding: 20, paddingBottom: 50 },
    card: {
        marginBottom: 12,
        borderRadius: 16,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#050505',
        borderWidth: 1,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        color: '#ccc',
        fontSize: 12,
        lineHeight: 18,
        flexWrap: 'wrap',
        marginBottom: 4,
    },
    actionText: {
        color: '#aaa',
        fontSize: 12,
        fontStyle: 'italic',
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 25,
        paddingHorizontal: 5,
    },
    sectionHeader: {
        color: '#FFFFFF',
        fontSize: 12,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    visualCard: {
        width: width * 0.75,
        overflow: 'hidden',
        backgroundColor: '#0A0A0A',
    },
    visualImage: {
        width: '100%',
        height: 180,
    },
    visualOverlay: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 5,
        borderRadius: 8,
    },
    visualTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    visualSubtitle: {
        color: '#D4AF37',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 10,
    },
    visualExplanation: {
        color: '#BBB',
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 12,
    },
    proTipContainer: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#333',
        backgroundColor: 'rgba(0,0,0,0.5)',
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabButtonActive: {
        backgroundColor: '#FFF',
        borderColor: '#FFF',
    },
    tabButtonText: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: '#888',
    },
    proTipText: {
        color: '#DDD',
        fontSize: 11,
        fontStyle: 'italic',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: width,
        height: width * 1.5,
    },
    modalClose: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
    },
    educationModalContent: {
        width: '98%',
        height: '90%',
        backgroundColor: '#050505',
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    modalHeaderTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    viewModeToggle: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#111',
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 16,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    toggleBtnActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
    },
    toggleBtnText: {
        color: '#666',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    toggleBtnTextActive: {
        color: '#D4AF37',
    },
    educationFullImage: {
        width: '100%',
        height: 500,
        marginTop: 10,
    },
    placeholderOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 250,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 10,
    },
    placeholderText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    modalExplanationTitle: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 10,
    },
    modalExplanationText: {
        color: '#BBB',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 10,
    },
    masterclassBadge: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    masterclassBadgeText: {
        color: '#D4AF37',
        fontSize: 8,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    tapIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    tapText: {
        color: '#D4AF37',
        fontSize: 9,
        fontWeight: 'bold',
        marginLeft: 6,
        letterSpacing: 1,
    },
    galleryMasterclassBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 12,
        borderRadius: 12,
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    galleryMasterclassBtnText: {
        color: '#D4AF37',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    realLabelBadge: {
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#4ADE80',
        shadowColor: '#4ADE80',
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    realLabelText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 6,
        letterSpacing: 1,
    },
    imageContainer: {
        width: '100%',
        backgroundColor: '#111',
        overflow: 'hidden',
    },
    imageWrapper: {
        width: '100%',
        height: 450, // Reduced from 500
        justifyContent: 'center',
        alignItems: 'center',
    },
    zoomHintOverlay: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    zoomHintText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 8,
        letterSpacing: 1,
    },
    fullscreenClose: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 25,
    },
    fullscreenFooter: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    fullscreenTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 8,
    },
    fullscreenSubtitle: {
        color: '#D4AF37',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    explanationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    explanationIndicator: {
        width: 4,
        height: 16,
        borderRadius: 2,
        marginRight: 10,
    },
    proTipGlitch: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        backgroundColor: '#D4AF37',
        opacity: 0.3,
    },
});
