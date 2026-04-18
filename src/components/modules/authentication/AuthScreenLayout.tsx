import React, { ReactNode } from 'react';
import { Animated, KeyboardAvoidingView, Platform, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/config/colors';
import appFonts from '@/config/fonts';
import { SafeArea, Scroller, RLogo } from '@/components/common';
import { BackBtn } from '@/components/modules/authentication';
import usePageEnterAnimation from '@/hooks/animations/usePageEnterAnimation';
import { moderateScale, scale, verticalScale } from '@/utils/responsive';

interface AuthScreenLayoutProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    footer?: ReactNode;
    showBackButton?: boolean;
    logoSize?: number;
    cardStyle?: StyleProp<ViewStyle>;
    isLogin?: boolean;
}

const AuthScreenLayout = ({
    title,
    subtitle,
    children,
    footer,
    showBackButton = true,
    logoSize = 40,
    cardStyle,
    isLogin = false

}: AuthScreenLayoutProps) => {
    const { animatedStyle } = usePageEnterAnimation();

    return (
        <View style={styles.screen}>
            {/* Diagonal bossanova gradient — covers upper portion of screen */}

            <LinearGradient
                colors={[colors.primary[950], colors.primary[800], colors.primary[700]]}
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 1.0, y: 1.0 }}
                style={styles.gradientBg}
            >
                <View style={StyleSheet.absoluteFill} pointerEvents='none'>

                    <View style={[styles.blob, styles.blobTR]} />
                    <View style={[styles.blob, styles.blobBL]} />
                    <View style={[styles.blob, styles.blobAccent]} />

                    <View style={styles.gradientArc} />
                </View>
            </LinearGradient>

            <SafeArea style={{ backgroundColor: 'transparent' }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                    style={styles.kbAvoider}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <Scroller contentContainerStyle={styles.scroller}>
                        {/* Header — gradient shows through */}
                        <View style={styles.header}>
                            {showBackButton && (
                                <View style={styles.backRow}>
                                    <BackBtn isLogin={isLogin} />
                                </View>
                            )}
                            {/* Double-ring logo badge */}
                            {/* <View style={styles.logoBadgeOuter}>
                                <View style={styles.logoBadge}>
                                    <RLogo stylesLogo={{ width: logoSize, height: logoSize }} />
                                </View>
                            </View> */}
                            {/* Gold accent pill */}
                            {/* <View style={styles.accentPill} /> */}
                            <View style={{ marginTop: scale(40) }} />
                            <Text style={styles.heading}>{title}</Text>
                            {subtitle && <Text style={styles.subHeading}>{subtitle}</Text>}
                        </View>

                        {/* Floating white form card */}
                        <Animated.View style={[styles.card, cardStyle, animatedStyle]}>
                            {children}
                            {footer}
                        </Animated.View>

                    </Scroller>
                </KeyboardAvoidingView>
            </SafeArea>
        </View>
    );
};

export const authScreenStyles = StyleSheet.create({
    inputField: {
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 0,
        backgroundColor: 'transparent',
        paddingVertical: verticalScale(13),
        paddingHorizontal: scale(4),
        minHeight: verticalScale(50),
    },
    formWrapper: {
        gap: 0,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: scale(6),
        paddingTop: scale(14),
        borderTopWidth: 1,
        borderTopColor: '#f0f0f5',
    },
    footerText: {
        color: '#6b7280',
        fontFamily: `${appFonts.medium}`,
        fontSize: moderateScale(13),
    },
    footerLink: {
        color: colors.primary[700],
        fontFamily: `${appFonts.semiBold}`,
        fontSize: moderateScale(13),
    },
    forgotText: {
        color: colors.primary[700],
        fontFamily: `${appFonts.medium}`,
        fontSize: moderateScale(13),
    },
});

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.primary[50],
    },
    gradientBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.primary[700],
        height: scale(400),
        overflow: 'hidden',
    },
    kbAvoider: { flex: 1 },
    scroller: { flexGrow: 1, paddingBottom: scale(90) },

    blob: {
        position: 'absolute',
        borderRadius: 999,
    },
    // Large aura, top-right, bossanova[400] glow
    blobTR: {
        width: scale(300),
        height: scale(300),
        top: -110,
        right: -110,
        backgroundColor: 'rgba(193,145,225,0.18)',
    },
    // Soft white haze, left
    blobBL: {
        width: scale(200),
        height: scale(200),
        top: 60,
        left: -90,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    // Warm putty/gold accent blob
    blobAccent: {
        width: scale(140),
        height: scale(140),
        top: 110,
        right: scale(20),
        backgroundColor: 'rgba(221,170,90,0.11)',
    },
    // Soft bottom arc — bleeds into the card overlap
    gradientArc: {
        position: 'absolute',
        bottom: -scale(40),
        left: -scale(30),
        right: -scale(30),
        height: scale(80),
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },

    header: {
        paddingTop: scale(14),
        paddingBottom: scale(62),
        paddingHorizontal: scale(24),
        gap: scale(6),
    },
    backRow: {
        marginBottom: scale(4),
    },

    // Outer ring of the logo badge
    logoBadgeOuter: {
        width: scale(86),
        height: scale(86),
        borderRadius: scale(43),
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: scale(14),
    },
    // Inner glass circle
    logoBadge: {
        width: scale(68),
        height: scale(68),
        borderRadius: scale(34),
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.50)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary[300],
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.45,
        shadowRadius: 14,
        elevation: 6,
    },

    // Gold accent pill above the heading
    accentPill: {
        width: scale(36),
        height: 3,
        borderRadius: 99,
        backgroundColor: colors.secondary[400],
        marginBottom: scale(6),
    },

    heading: {
        fontSize: moderateScale(30),
        fontFamily: `${appFonts.bold}`,
        color: '#fff',
        lineHeight: moderateScale(37),
        letterSpacing: 0.3,
    },
    subHeading: {
        fontSize: moderateScale(14),
        color: 'rgba(255,255,255,0.72)',
        lineHeight: moderateScale(21),
        fontFamily: `${appFonts.medium}`,
        letterSpacing: 0.1,
    },

    card: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        marginHorizontal: scale(12),
        marginTop: -scale(36),
        marginBottom: scale(24),
        paddingHorizontal: scale(22),
        paddingTop: scale(30),
        paddingBottom: scale(38),
        gap: scale(18),
        // Bossanova accent top border
        borderTopWidth: 3,
        borderTopColor: colors.secondary[300],
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        // Purple-tinted shadow
        shadowColor: colors.primary[950],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 20,
        elevation: 14,
    },
});

export default AuthScreenLayout;
