import React, { ReactNode } from 'react';
import { Animated, KeyboardAvoidingView, Platform, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
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
        <View style={styles.screen}>
            {/* Purple gradient covers top portion of screen including behind status bar */}
            <LinearGradient
                colors={[colors.primary[950], colors.primary[900], colors.primary[800]]}
                style={styles.gradientBg}
            >
                {/* Soft glass blobs clipped to gradient area */}
                <View style={StyleSheet.absoluteFill} pointerEvents='none'>
                    <View style={[styles.blob, styles.blobTR]} />
                    <View style={[styles.blob, styles.blobBL]} />
                </View>
            </LinearGradient>

            <SafeArea>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kbAvoider}>
                    <Scroller contentContainerStyle={styles.scroller}>

                        {/* Transparent header — gradient shows through */}
                        <View style={styles.header}>
                            {showBackButton && (
                                <View style={styles.backRow}>
                                    <BackBtn />
                                </View>
                            )}
                            <View style={styles.logoBadge}>
                                <RLogo stylesLogo={{ width: logoSize, height: logoSize }} />
                            </View>
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
        paddingVertical: 14,
        paddingHorizontal: 4,
        minHeight: 52,
    },
    formWrapper: {
        gap: 0,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f5',
    },
    footerText: {
        color: '#6b7280',
        fontFamily: `${appFonts.medium}`,
        fontSize: 13,
    },
    footerLink: {
        color: colors.primary[700],
        fontFamily: `${appFonts.semiBold}`,
        fontSize: 13,
    },
    forgotText: {
        color: colors.primary[700],
        fontFamily: `${appFonts.medium}`,
        fontSize: 13,
    },
});

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    gradientBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '48%',
        overflow: 'hidden',
    },
    kbAvoider: { flex: 1 },
    scroller: { flexGrow: 1 },
    blob: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 200 },
    blobTR: { width: 280, height: 280, top: -90, right: -90 },
    blobBL: { width: 200, height: 200, top: 80, left: -80 },
    header: {
        paddingTop: 16,
        paddingBottom: 64,
        paddingHorizontal: 28,
        gap: 6,
    },
    backRow: {
        marginBottom: 4,
    },
    logoBadge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.22)',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.55)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4,
    },
    heading: {
        fontSize: 28,
        fontFamily: `${appFonts.bold}`,
        color: '#fff',
        lineHeight: 34,
    },
    subHeading: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.78)',
        lineHeight: 20,
        fontFamily: `${appFonts.medium}`,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 28,
        marginHorizontal: 16,
        marginTop: -36,
        marginBottom: 24,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
        gap: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 16,
        elevation: 10,
    },
});

export default AuthScreenLayout;
