import React, { ReactNode } from 'react';
import { Animated, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/config/colors';
import appFonts from '@/config/fonts';
import { SafeArea, Scroller, RLogo } from '@/components/common';
import { BackBtn } from '@/components/modules/authentication';
import usePageEnterAnimation from '@/hooks/animations/usePageEnterAnimation';

interface AuthScreenLayoutProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    footer?: ReactNode;
    showBackButton?: boolean;
    logoSize?: number;
    cardStyle?: StyleProp<ViewStyle>;
}

const AuthScreenLayout = ({
    title,
    subtitle,
    children,
    footer,
    showBackButton = true,
    logoSize = 40,
    cardStyle,
}: AuthScreenLayoutProps) => {
    const { animatedStyle } = usePageEnterAnimation();

    return (
        <LinearGradient colors={[`${colors.primary[900]}FF`, `${colors.primary[700]}F8`, `${colors.primary[600]}F0`]} style={styles.screen}>
            <View style={styles.gradientStack} pointerEvents='none'>
                <LinearGradient colors={['rgba(255,140,255,0.35)', 'rgba(106,80,255,0.0)']} style={[styles.gradientBlob, styles.blobTop]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                <LinearGradient colors={['rgba(87,195,255,0.45)', 'rgba(103,78,255,0.1)']} style={[styles.gradientBlob, styles.blobBottom]} start={{ x: 0.2, y: 1 }} end={{ x: 0.9, y: 0 }} />
                <LinearGradient colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.02)']} style={[styles.gradientRing, styles.ringLeft]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            </View>
            <SafeArea>
                <View style={styles.safeContent}>
                    {showBackButton && (
                        <View style={styles.backRow}>
                            <BackBtn />
                        </View>
                    )}
                    <Scroller style={styles.scrollerContent}>
                        <View style={styles.cardWrapper}>
                            <Animated.View style={[styles.animatedCard, animatedStyle]}>
                                <LinearGradient
                                    colors={['rgba(21,9,38,0.92)', 'rgba(46,20,86,0.78)', 'rgba(33,15,63,0.9)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={[styles.heroCard, cardStyle]}
                                >
                                    <LinearGradient colors={['rgba(255,255,255,1)', 'rgba(255,255,255,1)']} style={styles.logoBadge} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                                        <RLogo stylesLogo={{ width: logoSize, height: logoSize }} />
                                    </LinearGradient>
                                    <Text style={styles.heading}>{title}</Text>
                                    {subtitle && <Text style={styles.subHeading}>{subtitle}</Text>}
                                    {children}
                                    {footer}
                                </LinearGradient>
                            </Animated.View>
                        </View>
                    </Scroller>
                </View>
            </SafeArea>
        </LinearGradient>
    );
};

export const authScreenStyles = StyleSheet.create({
    inputField: {
        borderRadius: 18,
        borderColor: 'rgba(255,255,255,0.25)',
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingVertical: 14,
        paddingHorizontal: 16,
        color: '#fff',
    },
    formWrapper: {
        gap: 14,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginTop: 18,
    },
    footerText: {
        color: 'rgba(255,255,255,0.7)',
        fontFamily: `${appFonts.medium}`,
    },
    footerLink: {
        color: '#fff',
        fontFamily: `${appFonts.semiBold}`,
    },
    forgotText: {
        color: '#fff',
        fontFamily: `${appFonts.medium}`,
        fontSize: 13,
    },
});

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        position: 'relative',
    },
    safeContent: {
        flex: 1,
    },
    backRow: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
    },
    gradientStack: {
        ...StyleSheet.absoluteFillObject,
    },
    gradientBlob: {
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: 130,
        opacity: 0.8,
        transform: [{ rotate: '25deg' }],
    },
    blobTop: {
        top: -60,
        right: -40,
    },
    blobBottom: {
        bottom: -40,
        left: -30,
    },
    gradientRing: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        opacity: 0.8,
    },
    ringLeft: {
        top: 140,
        left: 20,
    },
    scrollerContent: {
        paddingHorizontal: 16,
        paddingBottom: 48,
        paddingTop: 8,
        justifyContent: 'center',
        minHeight: '100%',
    },
    cardWrapper: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    animatedCard: {
        width: '100%',
        maxWidth: 480,
    },
    heroCard: {
        borderRadius: 36,
        padding: 28,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
        shadowColor: '#0f050f',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.28,
        shadowRadius: 40,
        elevation: 12,
        overflow: 'hidden',
        width: '100%',
        maxWidth: 480,
        gap: 16,
    },
    logoBadge: {
        width: 85,
        height: 85,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    heading: {
        fontSize: 26,
        fontFamily: `${appFonts.bold}`,
        textAlign: 'center',
        color: '#fff',
    },
    subHeading: {
        fontSize: 14,
        textAlign: 'center',
        color: 'rgba(255,255,255,0.78)',
        lineHeight: 20,
        fontFamily: `${appFonts.medium}`,
        marginHorizontal: 12,
    },
});

export default AuthScreenLayout;
