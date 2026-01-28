import React, { useEffect, useRef } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform, Animated, ScrollView, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { ProfitTicker } from './ProfitTicker';
import * as Haptics from 'expo-haptics';
import VideoPlayer from './VideoPlayer';

import { ThemedButton } from './ThemedButton';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

interface SignalDetailModalProps {
    visible: boolean;
    onClose: () => void;
    onArchive?: () => void;
    signal: {
        title: string;
        body?: string;
        data?: any;
        time?: string;
        pair?: string;
        type?: string;
        strategyLabel?: string;
        isDemoPnL?: boolean;
    } | null;
}

// --- ASSETS MAPPING ---
// Pre-require all educational images to ensure they load instantly
const STRATEGY_IMAGES: Record<string, any> = {
    // SCALP
    'scalp_OverSold': require('../assets/images/education/horus_ovs.png'),
    'scalp_OverBought': require('../assets/images/education/horus_ovb.png'),
    'scalp_TakeProfitPump': require('../assets/images/education/tp_pump.png'),
    'scalp_TakeProfitPush': require('../assets/images/education/tp_push.png'),
    'TP PUMP': require('../assets/images/education/tp_pump.png'),
    'TP PUSH': require('../assets/images/education/tp_push.png'),

    // PRO4X
    'pro4x_Buy': require('../assets/images/education/pro4x_buy.png'),
    'pro4x_Sell': require('../assets/images/education/pro4x_sell.png'),
    'pro4x_GetReady': require('../assets/images/education/get_ready.png'),

    // LOCKED STATE IMAGE
    'LOCKED': require('../assets/images/education/institutional_abstract.png'), // Placeholder for locked state

    // HORUS
    'horus_Buy': require('../assets/images/education/pro4x_buy.png'), // Fallback to Pro4x style for now or use specific if available
    'horus_Sell': require('../assets/images/education/pro4x_sell.png'),
    'horus_GetReady': require('../assets/images/education/get_ready.png'),

    // SHADOW
    'shadow_Mode': require('../assets/images/education/shadow_mode_nq.png'),
    'shadow_Buy': require('../assets/images/education/shadow_mode_nq.png'),
    'shadow_Sell': require('../assets/images/education/shadow_mode_nq.png'),

    // TREND / SYNCRO (New)
    'm1_SyncroBullish': require('../assets/images/education/pro4x_buy.png'),
    'm1_SyncroBearish': require('../assets/images/education/pro4x_sell.png'),
    'h1_SyncroBullish': require('../assets/images/education/institutional_abstract.png'),
    'h1_SyncroBearish': require('../assets/images/education/institutional_abstract.png'),
    'scalp_SyncroResBuy': require('../assets/images/education/pro4x_buy.png'),
    'scalp_SyncroResSell': require('../assets/images/education/pro4x_sell.png'),
};

// --- EDUCATIONAL CONTENT MAPPING ---
const STRATEGY_CONTENT: Record<string, string> = {
    // HORUS OVS/OVB
    'horus_OVS': "TOP TIER ANALYTICAL DETECTION\n\nInstitutional Rejection Zones & Volatility Scaling\n\nContext\nThis section represents the most advanced analytical response in the system. It identifies high-density technical rejection zones based on the statistical concentration of institutional liquidity.\n\nTechnical Characteristics\n\n• Technical Target: Historical data indicates typical technical reactions of 10-15 points on the NQ Index.\n\n• Structural Invalidation: A clean candle close beyond the rejection point of origin indicates an invalidation of the technical setup.\n\nVolatility-Based Validation (ATR M1)\n\nThe efficiency of the rejection zone is contingent upon the current volatility regime. The system adjusts monitoring requirements based on the ATR M1:\n\n• HOT Regime (ATR ≈ 18–20 pts): Increased probability of price sweeps. A stabilization of 1–3 M1 candles is the common technical baseline to confirm the zone.\n\n• EXTREME Regime (ATR ≈ 20–23 pts): Frequent overshoots detected. The analysis suggests monitoring 3–5 M1 candles or a clear \"sweep-and-reclaim\" structure to validate data alignment.\n\n• PANIC Regime (ATR ≥ 23 pts): Significant overshoot risk. An extended observation of 5–8 M1 candles or a violent price reclaim is required to rule out the risk of trend continuation.\n\nAnalytical Discipline\n\n• Candle Stability: Final technical validation of the rejection is systematically contingent upon the M1 candle close.\n\n• Precision Metric: The statistical edge of the alignment decreases if price deviates by more than 5 points from the calculated coordinate before the analysis is confirmed.\n\nPRO TIP: VOLATILITY PROTOCOL\n\nIn PANIC or EXTREME conditions, monitoring 2 to 3 waves on the M1 timeframe is a primary structural requirement for technical validation.\n\nTECHNICAL NOTE: Mastery of the correlation between rejection zones and the volatility regime (ATR) is the key to institutional precision. The absence of volatility mechanically reduces the relevance of the detection.",
    'horus_OVB': "TOP TIER ANALYTICAL DETECTION\n\nInstitutional Rejection Zones & Volatility Scaling\n\nContext\nThis section represents the most advanced analytical response in the system. It identifies high-density technical rejection zones based on the statistical concentration of institutional liquidity.\n\nTechnical Characteristics\n\n• Technical Target: Historical data indicates typical technical reactions of 10-15 points on the NQ Index.\n\n• Structural Invalidation: A clean candle close beyond the rejection point of origin indicates an invalidation of the technical setup.\n\nVolatility-Based Validation (ATR M1)\n\nThe efficiency of the rejection zone is contingent upon the current volatility regime. The system adjusts monitoring requirements based on the ATR M1:\n\n• HOT Regime (ATR ≈ 18–20 pts): Increased probability of price sweeps. A stabilization of 1–3 M1 candles is the common technical baseline to confirm the zone.\n\n• EXTREME Regime (ATR ≈ 20–23 pts): Frequent overshoots detected. The analysis suggests monitoring 3–5 M1 candles or a clear \"sweep-and-reclaim\" structure to validate data alignment.\n\n• PANIC Regime (ATR ≥ 23 pts): Significant overshoot risk. An extended observation of 5–8 M1 candles or a violent price reclaim is required to rule out the risk of trend continuation.\n\nAnalytical Discipline\n\n• Candle Stability: Final technical validation of the rejection is systematically contingent upon the M1 candle close.\n\n• Precision Metric: The statistical edge of the alignment decreases if price deviates by more than 5 points from the calculated coordinate before the analysis is confirmed.\n\nPRO TIP: VOLATILITY PROTOCOL\n\nIn PANIC or EXTREME conditions, monitoring 2 to 3 waves on the M1 timeframe is a primary structural requirement for technical validation.\n\nTECHNICAL NOTE: Mastery of the correlation between rejection zones and the volatility regime (ATR) is the key to institutional precision. The absence of volatility mechanically reduces the relevance of the detection.",

    // HORUS ADV
    'horus_Adv_Buy': "HIGH-DENSITY REACTION DETECTED\n\nInstitutional Liquidity Zone Analysis\n\nContext\nTechnical friction has been identified at specific institutional liquidity zones. This represents a high-density area where price movement often encounters structural resistance or support.\n\nFramework & ATR Context\n\n• Volatility Filter: All data must be interpreted alongside current ATR levels for precise technical calibration.\n\n• Institutional Map: Primary analytical focus is maintained on the 12, 23, 38, 64, and 91 technical reference layers.\n\n• Behavior: The system monitors for high-velocity liquidity taps and immediate structural recoil zones.\n\nTechnical Note\nMonitoring M1 stabilization waves is a primary requirement for data alignment and technical validation.\n\nDiscipline\nRigorous risk management and exposure control remain the sole responsibility of the analytical profile.\n\nPRO TIP: ANALYTICAL FACT\nHigh-density zones are characterized by rapid absorption of liquidity. Technical validation is strongest when price rejects the coordinate with high velocity on the M1 timeframe.\n\nTECHNICAL NOTE: Detection of technical friction suggests a potential pause or reversal in current momentum. Analysis is anchored by the convergence of magnet levels and volatility metrics.",
    'horus_Adv_Sell': "HIGH-DENSITY REACTION DETECTED\n\nInstitutional Liquidity Zone Analysis\n\nContext\nTechnical friction has been identified at specific institutional liquidity zones. This represents a high-density area where price movement often encounters structural resistance or support.\n\nFramework & ATR Context\n\n• Volatility Filter: All data must be interpreted alongside current ATR levels for precise technical calibration.\n\n• Institutional Map: Primary analytical focus is maintained on the 12, 23, 38, 64, and 91 technical reference layers.\n\n• Behavior: The system monitors for high-velocity liquidity taps and immediate structural recoil zones.\n\nTechnical Note\nMonitoring M1 stabilization waves is a requirement for data alignment and technical validation.\n\nDiscipline\nRigorous risk management and exposure control remain the sole responsibility of the analytical profile.\n\nPRO TIP: ANALYTICAL FACT\nHigh-density zones are characterized by rapid absorption of liquidity. Technical validation is strongest when price rejects the coordinate with high velocity on the M1 timeframe.\n\nTECHNICAL NOTE: Detection of technical friction suggests a potential pause or reversal in current momentum. Analysis is anchored by the convergence of magnet levels and volatility metrics.",
    'horus_Buy': "TOP TIER ANALYTICAL DETECTION\n\nHorus — Bullish Momentum Alignment\n\nThis represents a high-velocity bullish structural configuration identified by Horus.\n\n• Technical Convergence: All required algorithmic conditions are currently aligned for a bullish thesis.\n\n• ATR Dynamics: Due to volatility and ATR dynamics, market extensions are frequent before directional stabilization.\n\n• Data Frequency: High-velocity phases often trigger multiple bullish notifications in a concentrated zone.\n\n• Structural Study: Precise observation of the level alignment shown in the notification is necessary for technical validation.\n\n• Timing Momentum: Price stabilization is the primary analytical metric for this configuration.\n\n• Statistics: On average, 8 confirmed technical points of interest are identified per session.\n\nTECHNICAL NOTE: Optimal performance is observed on Key levels (12/23/38/64/91) supported by Volume Confirmation (Market Volume Delta). High timeframe context is essential.\n\nAnalytical discipline and patience are fundamental components of the Horus system. Notifications indicate high-probability technical interest zones and do not constitute financial guarantees.",
    'horus_Sell': "TOP TIER ANALYTICAL DETECTION\n\nHorus — Bearish Momentum Alignment\n\nThis represents a high-velocity bearish structural configuration identified by Horus.\n\n• Technical Convergence: All required algorithmic conditions are currently aligned for a bearish thesis.\n\n• ATR Dynamics: Due to volatility and ATR dynamics, market extensions are frequent before directional stabilization.\n\n• Data Frequency: High-velocity phases often trigger multiple bearish notifications in a concentrated zone.\n\n• Structural Study: Precise observation of the level alignment shown in the notification is necessary for technical validation.\n\n• Timing Momentum: Price stabilization is the primary analytical metric for this configuration.\n\n• Statistics: On average, 8 confirmed technical points of interest are identified per session.\n\nTECHNICAL NOTE: Optimal performance is observed on Key levels (12/23/38/64/91) supported by Volume Confirmation (Market Volume Delta). High timeframe context is essential.\n\nAnalytical discipline and patience are fundamental components of the Horus system. Notifications indicate high-probability technical interest zones and do not constitute financial guarantees.",

    // PRO4X.2 & CLASSIC (Unified Rich Content)
    'pro4x_Buy': "Bullish Structural Alignment\n\nInstitutional Context & Execution Logic\n\nContext\nA confirmed bullish structural configuration is identified when all internal algorithmic conditions converge at a calculated key level.\n\nMarket Behavior\nDepending on the prevailing market volatility, a liquidity hunt extension (stop hunt) often occurs before a true technical reversal is observed. This institutional mechanism seeks to engage remaining seller liquidity before structural rotation.\n\nTrend Protocol\nIn high-velocity H1 directional markets, technical focus is often shifted toward OVS/OVB parameters. For PRO4X and PRO4X.2 reversal logic, technical alignment is typically observed around the H1 candle extremes (High/Low).\n\nExecution Dynamics\nImmediate price reaction is not a standard requirement for this configuration. The analytical protocol prioritizes the observation of price stabilization and structural acceptance at the identified level.\n\nTechnical Note\nTechnical validation is contingent upon price alignment with the 12 / 23 / 38 / 64 / 91 magnet levels in conjunction with H1/H4 structural support.\n\nPRO TIP: ANALYTICAL FACT\nIn institutional environments, price discovery often involves multiple tests of a level. Structural stability followed by a shift in momentum is the primary technical indicator.\n\nTECHNICAL NOTE: This configuration represents a high-probability zone for technical rebalancing. Capital preservation remains the primary focus during high-volatility extensions.",
    'pro4x_Sell': "Bearish Structural Alignment\n\nInstitutional Context & Execution Logic\n\nContext\nA confirmed bearish structural configuration is identified when multiple internal algorithmic conditions converge at a calculated key level.\n\nMarket Behavior\nDepending on the prevailing market volatility, a liquidity hunt extension (stop hunt) frequently occurs before a technical reversal is observed. This institutional behavior is designed to engage remaining buyer liquidity before structural rotation.\n\nTrend Protocol\nIn high-velocity H1 directional markets, technical focus is often shifted toward OVS/OVB parameters. For PRO4X and PRO4X.2 reversal logic, technical alignment is typically observed around the H1 candle extremes (High/Low).\n\nExecution Dynamics\nImmediate price reaction is not a standard requirement for this configuration. The analytical protocol prioritizes the observation of price stabilization and structural rejection at the identified level.\n\nTechnical Note\nTechnical validation is contingent upon price alignment with the 12 / 23 / 38 / 64 / 91 magnet levels in conjunction with H1/H4 structural resistance.\n\nPRO TIP: ANALYTICAL FACT\nIn institutional environments, price rarely reverses in a single candle. Structural acceptance of the level followed by a shift in momentum is the primary technical indicator.\n\nTECHNICAL NOTE: This configuration represents a high-probability zone for technical rebalancing. Capital preservation remains the primary focus during high-volatility extensions.",
    'pro4xx_Buy': "Bullish Structural Alignment\n\nInstitutional Context & Execution Logic\n\nContext\nA confirmed bullish structural configuration is identified when all internal algorithmic conditions converge at a calculated key level.\n\nMarket Behavior\nDepending on the prevailing market volatility, a liquidity hunt extension (stop hunt) often occurs before a true technical reversal is observed. This institutional mechanism seeks to engage remaining seller liquidity before structural rotation.\n\nTrend Protocol\nIn high-velocity H1 directional markets, technical focus is often shifted toward OVS/OVB parameters. For PRO4X and PRO4X.2 reversal logic, technical alignment is typically observed around the H1 candle extremes (High/Low).\n\nExecution Dynamics\nImmediate price reaction is not a standard requirement for this configuration. The analytical protocol prioritizes the observation of price stabilization and structural acceptance at the identified level.\n\nTechnical Note\nTechnical validation is contingent upon price alignment with the 12 / 23 / 38 / 64 / 91 magnet levels in conjunction with H1/H4 structural support.\n\nPRO TIP: ANALYTICAL FACT\nIn institutional environments, price discovery often involves multiple tests of a level. Structural stability followed by a shift in momentum is the primary technical indicator.\n\nTECHNICAL NOTE: This configuration represents a high-probability zone for technical rebalancing. Capital preservation remains the primary focus during high-volatility extensions.",
    'pro4xx_Sell': "Bearish Structural Alignment\n\nInstitutional Context & Execution Logic\n\nContext\nA confirmed bearish structural configuration is identified when multiple internal algorithmic conditions converge at a calculated key level.\n\nMarket Behavior\nDepending on the prevailing market volatility, a liquidity hunt extension (stop hunt) frequently occurs before a technical reversal is observed. This institutional behavior is designed to engage remaining buyer liquidity before structural rotation.\n\nTrend Protocol\nIn high-velocity H1 directional markets, technical focus is often shifted toward OVS/OVB parameters. For PRO4X and PRO4X.2 reversal logic, technical alignment is typically observed around the H1 candle extremes (High/Low).\n\nExecution Dynamics\nImmediate price reaction is not a standard requirement for this configuration. The analytical protocol prioritizes the observation of price stabilization and structural rejection at the identified level.\n\nTechnical Note\nTechnical validation is contingent upon price alignment with the 12 / 23 / 38 / 64 / 91 magnet levels in conjunction with H1/H4 structural resistance.\n\nPRO TIP: ANALYTICAL FACT\nIn institutional environments, price rarely reverses in a single candle. Structural acceptance of the level followed by a shift in momentum is the primary technical indicator.\n\nTECHNICAL NOTE: This configuration represents a high-probability zone for technical rebalancing. Capital preservation remains the primary focus during high-volatility extensions.",

    // SHADOW
    'shadow_Buy': "TOP TIER ANALYTICAL DETECTION\n\nInstitutional Rejection Zones & Volatility Scaling\n\nContext\nThis section represents the most advanced analytical response in the system. It identifies high-density technical rejection zones based on the statistical concentration of institutional liquidity.\n\nTechnical Characteristics\n\n• Technical Target: Historical data indicates typical technical reactions of 10-15 points on the NQ Index.\n\n• Structural Invalidation: A clean candle close beyond the rejection point of origin indicates an invalidation of the technical setup.\n\nVolatility-Based Validation (ATR M1)\n\nThe efficiency of the rejection zone is contingent upon the current volatility regime. The system adjusts monitoring requirements based on the ATR M1:\n\n• HOT Regime (ATR ≈ 18–20 pts): Increased probability of price sweeps. A stabilization of 1–3 M1 candles is the common technical baseline to confirm the zone.\n\n• EXTREME Regime (ATR ≈ 20–23 pts): Frequent overshoots detected. The analysis suggests monitoring 3–5 M1 candles or a clear \"sweep-and-reclaim\" structure to validate data alignment.\n\n• PANIC Regime (ATR ≥ 23 pts): Significant overshoot risk. An extended observation of 5–8 M1 candles or a violent price reclaim is required to rule out the risk of trend continuation.\n\nAnalytical Discipline\n\n• Candle Stability: Final technical validation of the rejection is systematically contingent upon the M1 candle close.\n\n• Precision Metric: The statistical edge of the alignment decreases if price deviates by more than 5 points from the calculated coordinate before the analysis is confirmed.\n\nPRO TIP: VOLATILITY PROTOCOL\n\nIn PANIC or EXTREME conditions, monitoring 2 to 3 waves on the M1 timeframe is a primary structural requirement for technical validation.\n\nTECHNICAL NOTE: Mastery of the correlation between rejection zones and the volatility regime (ATR) is the key to institutional precision. The absence of volatility mechanically reduces the relevance of the detection.",
    'shadow_Sell': "TOP TIER ANALYTICAL DETECTION\\n\\nInstitutional Rejection Zones & Volatility Scaling\\n\\nContext\\nThis section represents the most advanced analytical response in the system. It identifies high-density technical rejection zones based on the statistical concentration of institutional liquidity.\\n\\nTechnical Characteristics\\n\\n• Technical Target: Historical data indicates typical technical reactions of 10-15 points on the NQ Index.\\n\\n• Structural Invalidation: A clean candle close beyond the rejection point of origin indicates an invalidation of the technical setup.\\n\\nVolatility-Based Validation (ATR M1)\\n\\nThe efficiency of the rejection zone is contingent upon the current volatility regime. The system adjusts monitoring requirements based on the ATR M1:\\n\\n• HOT Regime (ATR ≈ 18–20 pts): Increased probability of price sweeps. A stabilization of 1–3 M1 candles is the common technical baseline to confirm the zone.\\n\\n• EXTREME Regime (ATR ≈ 20–23 pts): Frequent overshoots detected. The analysis suggests monitoring 3–5 M1 candles or a clear \\\"sweep-and-reclaim\\\" structure to validate data alignment.\\n\\n• PANIC Regime (ATR ≥ 23 pts): Significant overshoot risk. An extended observation of 5–8 M1 candles or a violent price reclaim is required to rule out the risk of trend continuation.\\n\\nAnalytical Discipline\\n\\n• Candle Stability: Final technical validation of the rejection is systematically contingent upon the M1 candle close.\\n\\n• Precision Metric: The statistical edge of the alignment decreases if price deviates by more than 5 points from the calculated coordinate before the analysis is confirmed.\\n\\nPRO TIP: VOLATILITY PROTOCOL\\n\\nIn PANIC or EXTREME conditions, monitoring 2 to 3 waves on the M1 timeframe is a primary structural requirement for technical validation.\\n\\nTECHNICAL NOTE: Mastery of the correlation between rejection zones and the volatility regime (ATR) is the key to institutional precision. The absence of volatility mechanically reduces the relevance of the detection.",

    // SYNCRO H1
    'h1_SyncroBullish': "Syncro Bullish (H1) — SPX / ES / NQ\\n\\nTechnical convergence of the H1 bullish bias across SPX, ES, and NQ.\\n\\n• Trend Alignment: This data indicates a synchronized structural strength across the three major indices on the H1 timeframe.\\n\\n• Structural Space: This configuration is typically associated with longer-duration price cycles, provided that the market structure remains clear of immediate H4 resistance.\\n\\n• Hierarchical Logic: The Higher Timeframe (H1/H4) provides the primary directional context over lower timeframes. A structural trend reversal is technically confirmed when the price crosses the 200 EMA.\\n\\nTECHNICAL NOTE: Analytical observation: Data validation often follows a retest of the calculated execution price or a new structural alignment. A 15-minute observation period after the market open is standard for data stability.",
    'h1_SyncroBearish': "Syncro Bearish (H1) — SPX / ES / NQ\\n\\nTechnical convergence of the H1 bearish bias across SPX, ES, and NQ.\\n\\n• Trend Alignment: This data indicates a synchronized structural weakness across the three major indices on the H1 timeframe.\\n\\n• Structural Space: This configuration is typically associated with longer-duration price cycles, provided that the market structure remains clear of immediate H4 support.\\n\\n• Hierarchical Logic: The Higher Timeframe (H1/H4) provides the primary directional context over lower timeframes. A structural trend reversal is technically confirmed when the price crosses the 200 EMA.\\n\\nTECHNICAL NOTE: Analytical observation: Data validation often follows a retest of the calculated execution price or a new structural alignment. A 15-minute observation period after the market open is standard for data stability.",
    'shadow': "TOP TIER ANALYTICAL DETECTION\n\nInstitutional Rejection Zones & Volatility Scaling\n\nContext\nThis section represents the most advanced analytical response in the system. It identifies high-density technical rejection zones based on the statistical concentration of institutional liquidity.\n\nTechnical Characteristics\n\n• Technical Target: Historical data indicates typical technical reactions of 10-15 points on the NQ Index.\n\n• Structural Invalidation: A clean candle close beyond the rejection point of origin indicates an invalidation of the technical setup.\n\nVolatility-Based Validation (ATR M1)\n\nThe efficiency of the rejection zone is contingent upon the current volatility regime. The system adjusts monitoring requirements based on the ATR M1:\n\n• HOT Regime (ATR ≈ 18–20 pts): Increased probability of price sweeps. A stabilization of 1–3 M1 candles is the common technical baseline to confirm the zone.\n\n• EXTREME Regime (ATR ≈ 20–23 pts): Frequent overshoots detected. The analysis suggests monitoring 3–5 M1 candles or a clear \"sweep-and-reclaim\" structure to validate data alignment.\n\n• PANIC Regime (ATR ≥ 23 pts): Significant overshoot risk. An extended observation of 5–8 M1 candles or a violent price reclaim is required to rule out the risk of trend continuation.\n\nAnalytical Discipline\n\n• Candle Stability: Final technical validation of the rejection is systematically contingent upon the M1 candle close.\n\n• Precision Metric: The statistical edge of the alignment decreases if price deviates by more than 5 points from the calculated coordinate before the analysis is confirmed.\n\nPRO TIP: VOLATILITY PROTOCOL\n\nIn PANIC or EXTREME conditions, monitoring 2 to 3 waves on the M1 timeframe is a primary structural requirement for technical validation.\n\nTECHNICAL NOTE: Mastery of the correlation between rejection zones and the volatility regime (ATR) is the key to institutional precision. The absence of volatility mechanically reduces the relevance of the detection.",

    // VOLATILITY
    'vol_Panic': "Extreme Market Volatility Warning\n\nCurrent data indicates critical price velocity with a very high probability of significant overshoots.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is currently ≥ 23 pts.\n• Observation Note: In these conditions, price moves can frequently overshoot technical layers. High-density analysis suggests observing 5–8 M1 candles or a strong price reclaim for data alignment.\n• Market Structure: Trend continuation is statistically common during panic phases. Exercise extreme caution as price reactions may be delayed.\n\nSystem Behavior\nThis signal identifies \"Black Swan\" or high-impact news environments. It is designed to prioritize data stabilization over immediate reaction.\n\nDiscipline\nCapital preservation is the primary focus. All trading decisions and risk management remain the sole responsibility of the user.",
    'vol_Extreme': "Extreme Market Conditions Detected\n\nCurrent data indicates a significant increase in price velocity and overshoot risk.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is currently between 20–23 pts.\n• Observation Note: Fast market conditions often result in frequent overshoots. Technical context suggests monitoring for 3–5 M1 candles or a clear sweep-and-reclaim structure for data alignment.\n• Validation Requirement: Monitoring 2 to 3 waves on the M1 timeframe is a primary requirement for technical validation under these conditions.\n\nSystem Behavior\nThis signal serves as a technical warning for high-density price movements. Statistical trend continuation is common during these phases.\n\nDiscipline\nRigorous risk management and capital protection are the sole responsibility of the user.",
    'vol_High': "Active Market Volatility\n\nCurrent data indicates a sustained increase in price velocity and a higher risk of price sweeps.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is currently between 18–20 pts.\n• Observation Note: The technical context suggests monitoring for stabilization after 1–3 M1 candles as a common technical baseline.\n• Market Structure: Continuation or sweep-and-reclaim structures are frequently identified at this volatility level.\n\nSystem Behavior\nThis signal serves as a technical monitoring tool for active trend phases. It is designed to assist in identifying potential volatility shifts.\n\nDiscipline\nAdapt your analysis to current volatility. Risk management remains the sole responsibility of the user.",

    // REINTEGRATION
    'scalp_TakeProfitPump': "Bullish Re-integration\n\nBEHAVIOR EXECUTION\n\nA Bullish Re-integration is identified when price rallies with high velocity significantly above the 50-period moving average.\n\nTechnical Perspective:\n\n• This movement represents a temporary structural extension within an existing trend rather than long-term euphoria.\n\nMarket Dynamics during extension:\n\n• Late participant entry often leads to decreased technical efficiency.\n\n• As price stretches beyond standard deviations, mean reversion becomes statistically likely.\n\nAnalytical Indicators:\n\n• ATR expansion indicating increased volatility.\n\n• Volume spikes suggesting excess market participation.\n\n• Vertical candle formations.\n\nSystem Logic & Usage\n\nThe logic is based on a structural principle: extreme distance from the mean creates a technical rebalancing opportunity.\n\n• Structural Exit: This configuration identifies a technical zone for securing value.\n\n• Trend Correlation: It identifies a potential zone for structural re-alignment following a pullback.\n\n• Re-integration observation: It defines parameters for a technical return toward the MA50.\n\nIMPORTANT RULE\n\nRe-integration reliability is linked to an intact primary trend and volume confirmation of excess participation. The absence of volatility reduces the statistical edge of this configuration.\n\nKEY TAKEAWAY:\n\nThese notifications are not trend reversal calls; they are structural distance alerts. They focus on position management and structural integrity rather than price prediction.\n\nTECHNICAL NOTE: These configurations are designed for capital preservation and rigorous exposure management.",
    'scalp_TakeProfitPush': "Bearish Re-integration\n\nBEHAVIOR EXECUTION\n\nA Bearish Re-integration is identified when price drops with high velocity significantly below the 50-period moving average.\n\nTechnical Perspective:\n\n• This movement represents a temporary structural extension within an existing trend rather than long-term panic.\n\nMarket Dynamics during extension:\n\n• Late participant entry often leads to decreased technical efficiency.\n\n• As price stretches beyond standard deviations, mean reversion becomes statistically likely.\n\nAnalytical Indicators:\n\n• ATR expansion indicating increased volatility.\n\n• Volume spikes suggesting excess market participation.\n\n• Vertical candle formations.\n\nSystem Logic & Usage\n\nThe logic is based on a structural principle: extreme distance from the mean creates a technical rebalancing opportunity.\n\n• Structural Exit: This configuration identifies a technical zone for securing value.\n\n• Trend Correlation: It identifies a potential zone for structural re-alignment following a relief rally.\n\n• Re-integration observation: It defines parameters for a technical return toward the MA50.\n\nIMPORTANT RULE\n\nRe-integration reliability is linked to an intact primary trend and volume confirmation of excess participation. The absence of volatility reduces the statistical edge of this configuration.\n\nKEY TAKEAWAY:\n\nThese notifications are not trend reversal calls; they are structural distance alerts. They focus on position management and structural integrity rather than price prediction.\n\nTECHNICAL NOTE: These configurations are designed for capital preservation and rigorous exposure management.",
    'TP PUMP': "Bullish Re-integration\n\nBEHAVIOR EXECUTION\n\nA Bullish Re-integration is identified when price rallies with high velocity significantly above the 50-period moving average.\n\nTechnical Perspective:\n\n• This movement represents a temporary structural extension within an existing trend rather than long-term euphoria.\n\nMarket Dynamics during extension:\n\n• Late participant entry often leads to decreased technical efficiency.\n\n• As price stretches beyond standard deviations, mean reversion becomes statistically likely.\n\nAnalytical Indicators:\n\n• ATR expansion indicating increased volatility.\n\n• Volume spikes suggesting excess market participation.\n\n• Vertical candle formations.\n\nSystem Logic & Usage\n\nThe logic is based on a structural principle: extreme distance from the mean creates a technical rebalancing opportunity.\n\n• Structural Exit: This configuration identifies a technical zone for securing value.\n\n• Trend Correlation: It identifies a potential zone for structural re-alignment following a pullback.\n\n• Re-integration observation: It defines parameters for a technical return toward the MA50.\n\nIMPORTANT RULE\n\nRe-integration reliability is linked to an intact primary trend and volume confirmation of excess participation. The absence of volatility reduces the statistical edge of this configuration.\n\nKEY TAKEAWAY:\n\nThese notifications are not trend reversal calls; they are structural distance alerts. They focus on position management and structural integrity rather than price prediction.\n\nTECHNICAL NOTE: These configurations are designed for capital preservation and rigorous exposure management.",
    'TP PUSH': "Bearish Re-integration\n\nBEHAVIOR EXECUTION\n\nA Bearish Re-integration is identified when price drops with high velocity significantly below the 50-period moving average.\n\nTechnical Perspective:\n\n• This movement represents a temporary structural extension within an existing trend rather than long-term panic.\n\nMarket Dynamics during extension:\n\n• Late participant entry often leads to decreased technical efficiency.\n\n• As price stretches beyond standard deviations, mean reversion becomes statistically likely.\n\nAnalytical Indicators:\n\n• ATR expansion indicating increased volatility.\n\n• Volume spikes suggesting excess market participation.\n\n• Vertical candle formations.\n\nSystem Logic & Usage\n\nThe logic is based on a structural principle: extreme distance from the mean creates a technical rebalancing opportunity.\n\n• Structural Exit: This configuration identifies a technical zone for securing value.\n\n• Trend Correlation: It identifies a potential zone for structural re-alignment following a relief rally.\n\n• Re-integration observation: It defines parameters for a technical return toward the MA50.\n\nIMPORTANT RULE\n\nRe-integration reliability is linked to an intact primary trend and volume confirmation of excess participation. The absence of volatility reduces the statistical edge of this configuration.\n\nKEY TAKEAWAY:\n\nThese notifications are not trend reversal calls; they are structural distance alerts. They focus on position management and structural integrity rather than price prediction.\n\nTECHNICAL NOTE: These configurations are designed for capital preservation and rigorous exposure management.",

    // MARKET REGIMES
    'vol_Regime_Trend': "Directional Momentum Alignment\n\nCurrent data indicates a sustained directional flow with structural stability.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is currently in a Normal/Standard range (< 18 pts).\n• Observation Note: Price action shows clear higher highs or lower lows. The technical context suggests monitoring for pullbacks to institutional Magnet Levels for trend continuation.\n• Market Structure: High probability of directional follow-through. Technical validation is primarily based on M1 wave alignment.\n\nSystem Behavior\nThis signal identifies phases where momentum outweighs mean-reversion. It is designed to assist in monitoring trend health.\n\nDiscipline\nAvoid counter-trend bias during active regimes. Risk management remains the sole responsibility of the user.",
    'vol_Regime_Range': "Mean-Reversion Context Identified\n\nCurrent data indicates a lack of directional momentum, with price oscillating between defined technical boundaries.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is in a Stable/Low range (< 18 pts).\n• Observation Note: Price action shows back-and-forth behavior within a horizontal corridor. Technical context suggests monitoring for rejections at the extremes of the range.\n• Market Structure: High density of \"Magnet Level\" interactions. The model prioritizes identification of exhaustion points over breakout attempts.\n\nSystem Behavior\nThis signal identifies rotational market phases. It is designed to assist in monitoring price stabilization within fixed limits.\n\nDiscipline\nAnticipate rotational behavior; avoid chasing moves at the range boundaries. All decisions are the sole responsibility of the user.",
    'Trend': "Directional Momentum Alignment\n\nCurrent data indicates a sustained directional flow with structural stability.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is currently in a Normal/Standard range (< 18 pts).\n• Observation Note: Price action shows clear higher highs or lower lows. The technical context suggests monitoring for pullbacks to institutional Magnet Levels for trend continuation.\n• Market Structure: High probability of directional follow-through. Technical validation is primarily based on M1 wave alignment.\n\nSystem Behavior\nThis signal identifies phases where momentum outweighs mean-reversion. It is designed to assist in monitoring trend health.\n\nDiscipline\nAvoid counter-trend bias during active regimes. Risk management remains the sole responsibility of the user.",
    'Range': "Mean-Reversion Context Identified\n\nCurrent data indicates a lack of directional momentum, with price oscillating between defined technical boundaries.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is in a Stable/Low range (< 18 pts).\n• Observation Note: Price action shows back-and-forth behavior within a horizontal corridor. Technical context suggests monitoring for rejections at the extremes of the range.\n• Market Structure: High density of \"Magnet Level\" interactions. The model prioritizes identification of exhaustion points over breakout attempts.\n\nSystem Behavior\nThis signal identifies rotational market phases. It is designed to assist in monitoring price stabilization within fixed limits.\n\nDiscipline\nAnticipate rotational behavior; avoid chasing moves at the range boundaries. All decisions are the sole responsibility of the user.",
    'REGIME RANGE': "Mean-Reversion Context Identified\n\nCurrent data indicates a lack of directional momentum, with price oscillating between defined technical boundaries.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is in a Stable/Low range (< 18 pts).\n• Observation Note: Price action shows back-and-forth behavior within a horizontal corridor. Technical context suggests monitoring for rejections at the extremes of the range.\n• Market Structure: High density of \"Magnet Level\" interactions. The model prioritizes identification of exhaustion points over breakout attempts.\n\nSystem Behavior\nThis signal identifies rotational market phases. It is designed to assist in monitoring price stabilization within fixed limits.\n\nDiscipline\nAnticipate rotational behavior; avoid chasing moves at the range boundaries. All decisions are the sole responsibility of the user.",
    'REGIME TREND': "Directional Momentum Alignment\n\nCurrent data indicates a sustained directional flow with structural stability.\n\nATR & Technical Context\n• Volatility Threshold: ATR M1 is currently in a Normal/Standard range (< 18 pts).\n• Observation Note: Price action shows clear higher highs or lower lows. The technical context suggests monitoring for pullbacks to institutional Magnet Levels for trend continuation.\n• Market Structure: High probability of directional follow-through. Technical validation is primarily based on M1 wave alignment.\n\nSystem Behavior\nThis signal identifies phases where momentum outweighs mean-reversion. It is designed to assist in monitoring trend health.\n\nDiscipline\nAvoid counter-trend bias during active regimes. Risk management remains the sole responsibility of the user.",

    // GET READY
    'pro4x_GetReady': "Structural Zone Identified\n\nThe market has reached a high-density technical coordinate. Analytical parameters suggest a potential shift in liquidity.\n\nTechnical Context & ATR\n\n• Status: This is a pre-analytical notification (GR). It identifies institutional magnet levels before data validation occurs.\n\n• Volatility Filter: The current reaction must be interpreted through the ATR (Hot/Extreme/Panic) to define the required stabilization period.\n\n• Institutional Map: Monitoring focus is now on the 12, 23, 38, 64, or 91 reference layers.\n\nObservation Phase\n\nAwaiting technical reclaim or rejection at the magnet level. This is a monitoring phase, not a directional validation.\n\nPRO TIP: View \"Pro4x Set up Forming\" as a volatility compass. It eliminates noise by focusing your attention on the only numbers that historically influence institutional flow.",
};


export const SignalDetailModal = ({ visible, onClose, onArchive, signal }: SignalDetailModalProps) => {
    const { isPro } = useAuth();
    // Animation Values
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    // Pulse animation for the icon glow
    const pulseAnim = useRef(new Animated.Value(0.2)).current;

    useEffect(() => {
        if (visible) {
            // Haptics
            if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }

            // Entrance Animation
            scaleAnim.setValue(0.85); // Start slightly smaller
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 60,
                useNativeDriver: true,
            }).start();

            // Glow Loop
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 0.6, duration: 1000, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 0.1, duration: 1000, useNativeDriver: true })
                ])
            ).start();

        } else {
            scaleAnim.setValue(0.9);
        }
    }, [visible]);

    const normalizeKey = (k: string) => k.toLowerCase().replace(/_/g, ' ').trim();

    if (!visible || !signal) return null;

    // Extract Data
    // CLEAN STRATEGY & RENAMING
    let strategy = String(signal.data?.strategy || signal.strategyLabel || signal.title || 'System Analysis')
        .replace(/Signal/gi, '')
        .replace(/^[:\s]+/, '')
        .trim();

    // REMAP DISPLAY NAME FOR REINTEGRATION
    if (strategy.toUpperCase() === 'TP PUMP' || strategy.includes('Bullish Reintegration')) {
        strategy = 'Bullish Reintegration';
    } else if (strategy.toUpperCase() === 'TP PUSH' || strategy.includes('Bearish Reintegration')) {
        strategy = 'Bearish Reintegration';
    }

    console.log('[SignalDetailModal] Raw Strategy:', signal.data?.strategy || signal.strategyLabel);
    console.log('[SignalDetailModal] Display Strategy:', strategy);

    const ticker = String(signal.data?.ticker || signal.data?.pair || signal.pair || 'UNKNOWN');
    let type = String(signal.data?.signal || signal.type || 'DETECTION').toUpperCase();

    // Sanitization for Long Backend Messages
    const typeLower = type.toLowerCase();
    const strategyUpper = strategy.toUpperCase();

    if (strategyUpper.includes('PUMP') || typeLower.includes('sell position')) {
        type = 'PARTIAL TP / BULLISH';
    } else if (strategyUpper.includes('PUSH') || typeLower.includes('buy position')) {
        type = 'PARTIAL REACTION / BEARISH';
    } else if (type.length > 15) {
        if (typeLower.includes('short')) type = 'REACTION BEARISH';
        else if (typeLower.includes('long')) type = 'REACTION BULLISH';
        else type = 'DETECTION';
    }

    // Theme Colors
    const isBuy = type === 'BUY' || strategy.includes('Buy') || strategy.includes('Bullish') || strategy.includes('Pump');
    const isSell = type === 'SELL' || strategy.includes('Sell') || strategy.includes('Bearish') || strategy.includes('Push');

    let accentColor = '#D4AF37';
    if (isBuy) accentColor = '#4ADE80';
    if (isSell) accentColor = '#EF4444';
    if (strategy.includes('GetReady') || strategy.includes('Forming')) accentColor = '#FFD700'; // Force Gold for Get Ready / Forming

    // IMAGE SELECTION LOGIC
    let illustration = null;
    const strategyNorm = normalizeKey(strategy);

    // 1. Try direct match first
    if (STRATEGY_IMAGES[strategy]) {
        illustration = STRATEGY_IMAGES[strategy];
    } else {
        // Find best match in images
        const imgMatch = Object.keys(STRATEGY_IMAGES).find(k => normalizeKey(k) === strategyNorm || strategyNorm.includes(normalizeKey(k)));
        if (imgMatch) illustration = STRATEGY_IMAGES[imgMatch];
    }

    if (!illustration) {
        if (isBuy) illustration = STRATEGY_IMAGES['pro4x_Buy'];
        else if (isSell) illustration = STRATEGY_IMAGES['pro4x_Sell'];
        else {
            if (strategyUpper.includes('OVERSOLD') || strategyUpper.includes('OVERBOUGHT') || strategyUpper.includes('OVS') || strategyUpper.includes('OVB')) {
                if (strategyUpper.includes('OVERSOLD') || strategyUpper.includes('OVS')) illustration = STRATEGY_IMAGES['scalp_OverSold'];
                else illustration = STRATEGY_IMAGES['scalp_OverBought'];
            }
            else if (strategyUpper.includes('PUMP')) illustration = STRATEGY_IMAGES['scalp_TakeProfitPump'];
            else if (strategyUpper.includes('PUSH')) illustration = STRATEGY_IMAGES['scalp_TakeProfitPush'];
            else if (strategyUpper.includes('REINTEGRATION') && (strategyUpper.includes('BULL') || isBuy)) illustration = STRATEGY_IMAGES['scalp_TakeProfitPump'];
            else if (strategyUpper.includes('REINTEGRATION') && (strategyUpper.includes('BEAR') || isSell)) illustration = STRATEGY_IMAGES['scalp_TakeProfitPush'];
            else if (strategyUpper.includes('SHADOW')) illustration = STRATEGY_IMAGES['shadow_Mode'];
            else if (strategyUpper.includes('GET READY') || strategyUpper.includes('READY')) illustration = STRATEGY_IMAGES['pro4x_GetReady'];
            // Generic Buy/Sell fallbacks
            else if (isBuy) illustration = STRATEGY_IMAGES['pro4x_Buy'];
            else if (isSell) illustration = STRATEGY_IMAGES['pro4x_Sell'];
        }
    }

    const price = !isPro ? 'LOCKED' : (signal.data?.price !== undefined ? String(signal.data.price) : '---');
    const tp = signal.data?.tp;
    const sl = signal.data?.sl;
    const hasRefLevels = tp && sl && tp !== 'OPEN' && sl !== 'OPEN';
    const isDemoPnL = signal.isDemoPnL;

    // MESSAGE ENRICHMENT LOGIC
    let finalBody = signal.data?.message || signal.body;

    const sLower = strategy.toLowerCase();
    const shouldForceEnrich = sLower.includes('pro4x') || sLower.includes('pro4.2') || sLower.includes('horus') || sLower.includes('shadow') || sLower.includes('pump') || sLower.includes('push') || sLower.includes('reintegration') || sLower.includes('re-integration');

    console.log('[SignalDetailModal] Enrichment - sLower:', sLower);
    console.log('[SignalDetailModal] Enrichment - Should Force:', shouldForceEnrich);
    console.log('[SignalDetailModal] Enrichment - Original Body:', finalBody);

    // If message is short or missing, OR if it's a key strategy we want to override with Masterclass content
    if (!finalBody || finalBody.length < 100 || shouldForceEnrich) {
        let contentKey = strategy;
        const bUpper = (signal.data?.message || signal.body || '').toUpperCase();

        // 1. PRIORITIZE REGIME DETECTION
        if (sLower.includes('regime') || sLower.includes('vol_regime')) {
            if (sLower.includes('trend') || bUpper.includes('DIRECTIONAL') || bUpper.includes('MOMENTUM') || (bUpper.includes('TREND') && !bUpper.includes('RANGE'))) {
                contentKey = 'vol_Regime_Trend';
            } else if (sLower.includes('range') || bUpper.includes('REVERSION') || bUpper.includes('MEAN') || bUpper.includes('HORIZONTAL') || bUpper.includes('RANGE')) {
                contentKey = 'vol_Regime_Range';
            }
        }

        // 2. TRY DIRECT OR FUZZY MATCH
        if (STRATEGY_CONTENT[contentKey]) {
            finalBody = STRATEGY_CONTENT[contentKey];
        } else {
            // IMPROVED FUZZY MATCH

            // Check for HORUS variants (Generic/System fallback)
            // Fixes empty pop-ups for "Horus Bullish" / "Horus Bearish"
            // EXCLUDE OVS/OVB/ADV to preserve their specific content
            if (sLower.includes('horus') && !sLower.includes('ovs') && !sLower.includes('ovb') && !sLower.includes('adv')) {
                if (bUpper.includes('BEARISH') || sLower.includes('sell') || sLower.includes('bearish')) finalBody = STRATEGY_CONTENT['horus_Sell'];
                else if (bUpper.includes('BULLISH') || sLower.includes('buy') || sLower.includes('bullish')) finalBody = STRATEGY_CONTENT['horus_Buy'];
            }

            // Check for specific Pro4x variants first to ensure we catch Pro4x.2
            else if (sLower.includes('pro4x') || sLower.includes('pro4.2')) {
                if (bUpper.includes('BEARISH') || sLower.includes('sell') || sLower.includes('bearish')) finalBody = STRATEGY_CONTENT['pro4x_Sell'];
                else if (bUpper.includes('BULLISH') || sLower.includes('buy') || sLower.includes('bullish')) finalBody = STRATEGY_CONTENT['pro4x_Buy'];
            }
            // Check for REINTEGRATION / PUMP / PUSH
            else if (sLower.includes('pump') || sLower.includes('bullish re-integration') || (sLower.includes('reintegration') && (sLower.includes('bull') || bUpper.includes('BULL')))) {
                finalBody = STRATEGY_CONTENT['scalp_TakeProfitPump'];
            }
            else if (sLower.includes('push') || sLower.includes('bearish re-integration') || (sLower.includes('reintegration') && (sLower.includes('bear') || bUpper.includes('BEAR')))) {
                finalBody = STRATEGY_CONTENT['scalp_TakeProfitPush'];
            }
            // Check for SYNCRO H1
            else if (sLower.includes('syncro') && (sLower.includes('h1') || sLower.includes('trend'))) {
                if (bUpper.includes('BULLISH') || sLower.includes('buy') || sLower.includes('bullish')) finalBody = STRATEGY_CONTENT['h1_SyncroBullish'];
                else if (bUpper.includes('BEARISH') || sLower.includes('sell') || sLower.includes('bearish')) finalBody = STRATEGY_CONTENT['h1_SyncroBearish'];
            }
            // Fallback to generic fuzzy
            else {
                const sNorm = normalizeKey(strategy);
                const match = Object.keys(STRATEGY_CONTENT).find(k => {
                    const kNorm = normalizeKey(k);
                    return sNorm.includes(kNorm) || kNorm.includes(sNorm);
                });
                if (match) finalBody = STRATEGY_CONTENT[match];
            }
        }
    }

    // SANITIZE FINAL BODY: Replace "Entry Price" or "entry" in generic cases
    if (finalBody) {
        finalBody = finalBody.replace(/entry price/gi, 'level alignment')
            .replace(/signal price/gi, 'level alignment')
            .replace(/execution price/gi, 'level alignment');
    }

    // --- NON-PRO MASKING ---
    if (!isPro) {
        finalBody = "Institutional Analysis - Tap to Unlock";
        // Override price/data in the render section below, or separate variables
    }


    // Icon selection logic (STRICT ARROWS)
    let iconName: keyof typeof Ionicons.glyphMap = "pulse";

    if (strategy.includes('GetReady') || strategy.includes('Setup Forming') || strategy.includes('Forming')) {
        iconName = "pulse";
    } else {
        // DEFAULT TO ARROWS FOR EVERYTHING ELSE
        if (isBuy) iconName = "trending-up-outline";
        else if (isSell) iconName = "trending-down-outline";
        else iconName = "pulse"; // True fallback only
    }


    // Structured Body Renderer
    const renderStructuredBody = (text: string | null | undefined) => {
        if (!text) return null;

        const sections = text.split('\n');
        const knownHeaders = [
            "How to use this detection",
            "Execution",
            "Discipline rules",
            "Reminder",
            "Legal",
            "Context",
            "Market Context Checks",
            "Risk Discipline",
            "Technical Note",
            "Framework & ATR Context",
            "ATR & Technical Context",
            "Market Structure",
            "System Behavior",
            "Discipline",
            "Directional Momentum Alignment",
            "Mean-Reversion Context Identified",
            "TOP TIER ANALYTICAL DETECTION",
            "Horus — Bullish Momentum Alignment",
            "Horus — Bearish Momentum Alignment",
            "Technical Convergence",
            "ATR Dynamics",
            "Data Frequency",
            "Structural Study",
            "Timing Momentum",
            "Statistics"
        ];

        return (
            <View style={{ padding: 15 }}>
                {sections.map((line, index) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <View key={index} style={{ height: 10 }} />; // Spacing for empty lines

                    // Check if line is a Header
                    const isHeader = knownHeaders.some(h => trimmed.includes(h));

                    if (isHeader) {
                        return (
                            <Text key={index} style={[styles.bodyText, { fontStyle: 'italic', marginTop: 10 }]}>
                                {trimmed}
                            </Text>
                        );
                    }

                    // Standard Text
                    return (
                        <Text key={index} style={styles.bodyText}>
                            {trimmed}
                        </Text>
                    );
                })}
            </View>
        );
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Backdrop */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onClose}
                    style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.95)' }]}
                />

                {/* ANIMATED CARD */}
                <Animated.View
                    style={[
                        styles.contentWrapper,
                        {
                            transform: [{ scale: scaleAnim }],
                            marginTop: 40,
                            shadowColor: strategy.includes('GetReady') ? '#FFD700' : accentColor,
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.35,
                            shadowRadius: 24,
                            elevation: 15
                        }
                    ]}
                >
                    <GlassCard
                        intensity={0}
                        borderColor="rgba(255,255,255,0.1)"
                        borderWidth={1}
                        borderRadius={32}
                        disableGradient={true}
                        style={{ overflow: 'hidden', flex: 1, maxHeight: height * 0.8, backgroundColor: '#050505' }}
                        contentStyle={{ padding: 0 }}
                    >
                        {/* DEEP GLOSS LAYERS */}
                        <LinearGradient
                            colors={['rgba(255,255,255,0.03)', 'transparent']}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 0.2 }}
                            style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
                            pointerEvents="none"
                        />
                        <LinearGradient
                            colors={['#121212', '#000000']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={[StyleSheet.absoluteFill, { zIndex: -2 }]}
                            pointerEvents="none"
                        />

                        {/* SCROLLABLE CONTENT - Flex 1 to take available space */}
                        <View style={{ flex: 1 }}>
                            <ScrollView
                                bounces={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                showsVerticalScrollIndicator={false}
                            >
                                {/* 1. HEADER */}
                                <View style={styles.header}>
                                    <Animated.View style={[
                                        styles.iconCircle,
                                        {
                                            borderColor: accentColor,
                                            opacity: pulseAnim.interpolate({ inputRange: [0.1, 0.6], outputRange: [0.8, 1] }),
                                            borderRadius: 50,
                                            width: 60, height: 60,
                                            shadowColor: accentColor, shadowOpacity: 0.5, shadowRadius: 20
                                        }
                                    ]}>
                                        <Ionicons
                                            name={iconName}
                                            size={36}
                                            color={accentColor}
                                        />
                                    </Animated.View>
                                    <Text style={[styles.strategy, { color: '#FFFFFF', marginTop: 10 }]}>
                                        {(signal.data?.title || signal.title || strategy.replace('Entry', '').replace('_', ' ').trim())
                                            .replace(/Buy/g, 'Bullish').replace(/Sell/g, 'Bearish')
                                            .replace(/BUY/g, 'BULLISH').replace(/SELL/g, 'BEARISH')
                                            .replace(/Signal/gi, '').replace(/Alert/gi, '').trim()}
                                    </Text>
                                    <Text style={styles.ticker}>{ticker}</Text>
                                </View>

                                {/* 2.5 ILLUSTRATION - VISUAL MASTER CLASS */}
                                {illustration && (
                                    <View style={{
                                        marginHorizontal: 15,
                                        marginBottom: 15,
                                        borderRadius: 12,
                                        overflow: 'hidden',
                                        borderWidth: 1,
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.5, // Fixed number
                                        shadowRadius: 8,
                                        elevation: 5
                                    }}>
                                        <Image
                                            source={illustration}
                                            style={{
                                                width: '100%',
                                                height: 180, // Fixed height for consistency
                                                resizeMode: 'cover',
                                                opacity: 0.9
                                            }}
                                        />
                                        {/* Optional Overlay to integrate it better */}
                                        <LinearGradient
                                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                                            style={StyleSheet.absoluteFill}
                                            start={{ x: 0.5, y: 0.5 }}
                                            end={{ x: 0.5, y: 1 }}
                                        />
                                        <View style={{ position: 'absolute', bottom: 10, left: 10 }}>
                                            <Text style={{
                                                color: 'rgba(255,255,255,0.8)',
                                                fontSize: 10,
                                                fontWeight: '600',
                                                letterSpacing: 1.5,
                                                textTransform: 'uppercase',
                                                textShadowColor: 'rgba(0,0,0,0.8)',
                                                textShadowRadius: 4
                                            }}>
                                                Visual Master Class
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                {/* 2. DATA GRID */}
                                <View style={styles.grid}>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>LEVEL ALIGNMENT</Text>
                                        <Text style={styles.value}>{price}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>TIME / TF</Text>
                                        <Text style={styles.value}>{signal.time || 'NOW'} • {signal.data?.timeframe || 'M1'}</Text>
                                    </View>
                                    {hasRefLevels && (
                                        <View style={styles.row}>
                                            <Text style={styles.label}>REF LEVELS</Text>
                                            <Text style={styles.value}>{tp} / {sl}</Text>
                                        </View>
                                    )}
                                </View>

                                {/* 3. SYSTEM NOTE (OVS / OVB HIGHLIGHT) */}
                                {(strategyUpper.includes('OVERSOLD') || strategyUpper.includes('OVERBOUGHT') || strategyUpper.includes('OVS') || strategyUpper.includes('OVB') || strategyUpper.includes('SHADOW')) && (
                                    <View style={{
                                        marginHorizontal: 15,
                                        marginBottom: 15,
                                        padding: 15,
                                        borderRadius: 16,
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        borderWidth: 1,
                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                    }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                            <Text style={{
                                                color: '#FFFFFF',
                                                fontSize: 10,
                                                fontWeight: 'bold',
                                                letterSpacing: 1.5,
                                                opacity: 0.9
                                            }}>TOP TIER DETECTION</Text>
                                        </View>
                                        <Text style={{
                                            color: '#FFF',
                                            fontSize: 12,
                                            lineHeight: 18,
                                            fontWeight: '400'
                                        }}>
                                            This section identifies high-density technical rejection zones based on the statistical concentration of institutional liquidity.
                                        </Text>
                                    </View>
                                )}

                                {/* 4. BODY with STRUCTURED RENDERING */}
                                {renderStructuredBody(finalBody)}


                                {/* 5. VIDEO ATTACHMENT */}
                                {signal.data?.videoUrl && (
                                    <View style={styles.videoContainer}>
                                        <Text style={styles.sectionHeader}>LIVE DATA FEED</Text>
                                        <VideoPlayer
                                            source={signal.data.videoUrl}
                                            resizeMode="cover"
                                            shouldPlay
                                            isLooping
                                            useNativeControls
                                            style={styles.video}
                                        />
                                    </View>
                                )}

                            </ScrollView>
                        </View>

                        {/* 4. FOOTER - Pinned to bottom */}
                        <View style={styles.footer}>
                            {onArchive ? (
                                <TouchableOpacity
                                    onPressIn={() => {
                                        // Use onPressIn for instant reaction
                                        if (onArchive) onArchive();
                                        onClose();
                                    }}
                                    activeOpacity={0.6}
                                    style={styles.actionButton}
                                >
                                    <View style={[styles.buttonBase, { borderColor: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.1)' }]}>
                                        <Text style={[styles.actionText, { color: '#D4AF37' }]}>ARCHIVE & CLOSE</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={styles.actionButton}>
                                    <View style={[styles.buttonBase, { borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                                        <Text style={[styles.actionText, { color: '#fff' }]}>CLOSE</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>

                    </GlassCard>
                </Animated.View >
            </View >
        </Modal >
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    contentWrapper: {
        width: '100%',
        maxWidth: 340,
        maxHeight: '85%',
        flex: 1, // Ensure wrapper can flex
    },
    header: {
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: '#000',
    },
    ticker: {
        fontSize: 14,
        fontWeight: '400',
        color: '#888',
        letterSpacing: 1,
        marginTop: 4,
    },
    strategy: {
        fontSize: 20,
        fontWeight: '300',
        color: 'white',
        letterSpacing: 2,
        // textTransform: 'uppercase', // REMOVED
        textAlign: 'center',
    },
    grid: {
        padding: 15,
        gap: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        color: '#555',
        fontSize: 10,
        letterSpacing: 1.5,
        fontWeight: '400', // Removed Bold
    },
    value: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: 0.5,
        fontVariant: ['tabular-nums'],
    },
    bodyContainer: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        marginHorizontal: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    sectionHeader: {
        fontSize: 11,
        fontWeight: '400', // Removed Bold
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    bodyText: {
        color: '#FFFFFF',
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'left',
        fontWeight: '300', // THIN CONTENT
        marginBottom: 2,
    },
    footer: {
        padding: 15,
        // paddingTop: 10, 
        backgroundColor: 'transparent'
    },
    actionButton: {
        width: '100%',
    },
    buttonBase: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    actionText: {
        fontSize: 12,
        letterSpacing: 2,
        fontWeight: '600',
    },
    videoContainer: {
        marginHorizontal: 15,
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    video: {
        width: '100%',
        height: 200, // Fixed height or aspect ratio? 200 is safe.
        backgroundColor: '#000',
    }
});
