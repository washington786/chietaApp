import React from 'react'
import { RButton } from '@/components/common'
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';
import colors from '@/config/colors';
import appFonts from '@/config/fonts';
import { moderateScale, scale } from '@/utils/responsive';

interface props {
    onPress: () => void;
    title: string;
    description: string;
    buttonTitle: string;
}

export function SuccessWrapper({ onPress, buttonTitle, description, title }: props) {
    return (
        <View style={styles.screen}>
            {/* Concentric ring icon badge */}
            <Animated.View entering={ZoomIn.delay(100).duration(500).springify()} style={styles.iconSection}>
                <View style={styles.ringOuter}>
                    <View style={styles.ringMid}>
                        <View style={styles.ringInner}>
                            <MaterialCommunityIcons
                                name="check-circle"
                                size={moderateScale(52)}
                                color={colors.green[600]}
                            />
                        </View>
                    </View>
                </View>
            </Animated.View>

            {/* Status pill */}
            <Animated.View entering={FadeIn.delay(350).duration(400)} style={styles.pill}>
                <View style={styles.pillDot} />
                <Text style={styles.pillText}>Completed Successfully</Text>
            </Animated.View>

            {/* Title + separator + description */}
            <Animated.View entering={FadeInUp.delay(250).duration(500)} style={styles.textSection}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.separator} />
                <Text style={styles.description}>{description}</Text>
            </Animated.View>

            {/* CTA Button */}
            <Animated.View entering={FadeInUp.delay(450).duration(500)} style={styles.buttonWrap}>
                <RButton title={buttonTitle} onPressButton={onPress} />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(28),
    },
    // ── Icon rings ───────────────────────────────────────────────────────────
    iconSection: {
        marginBottom: scale(20),
    },
    ringOuter: {
        width: scale(120),
        height: scale(120),
        borderRadius: scale(60),
        backgroundColor: colors.green[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    ringMid: {
        width: scale(96),
        height: scale(96),
        borderRadius: scale(48),
        backgroundColor: colors.green[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    ringInner: {
        width: scale(72),
        height: scale(72),
        borderRadius: scale(36),
        backgroundColor: colors.green[200],
        alignItems: 'center',
        justifyContent: 'center',
    },
    // ── Status pill ──────────────────────────────────────────────────────────
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        backgroundColor: colors.green[50],
        borderWidth: 1,
        borderColor: colors.green[200],
        borderRadius: scale(99),
        paddingHorizontal: scale(14),
        paddingVertical: scale(5),
        marginBottom: scale(22),
    },
    pillDot: {
        width: scale(7),
        height: scale(7),
        borderRadius: scale(4),
        backgroundColor: colors.green[500],
    },
    pillText: {
        color: colors.green[700],
        fontFamily: `${appFonts.semiBold}`,
        fontSize: moderateScale(11),
        letterSpacing: 0.4,
        textTransform: 'uppercase',
    },
    // ── Text section ─────────────────────────────────────────────────────────
    textSection: {
        alignItems: 'center',
        marginBottom: scale(32),
        paddingHorizontal: scale(8),
    },
    title: {
        fontFamily: `${appFonts.bold}`,
        fontSize: moderateScale(26),
        color: colors.slate[900],
        textAlign: 'center',
        letterSpacing: 0.2,
        marginBottom: scale(14),
    },
    separator: {
        width: scale(40),
        height: 3,
        borderRadius: 99,
        backgroundColor: colors.green[300],
        marginBottom: scale(14),
    },
    description: {
        fontFamily: `${appFonts.regular}`,
        fontSize: moderateScale(14),
        color: colors.slate[500],
        textAlign: 'center',
        lineHeight: moderateScale(22),
    },
    // ── Button ───────────────────────────────────────────────────────────────
    buttonWrap: {
        width: '100%',
        paddingHorizontal: scale(8),
    },
});