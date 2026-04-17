import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { moderateScale, scale, verticalScale } from '@/utils/responsive';
import { LinearGradient } from 'expo-linear-gradient'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import colors from '@/config/colors'

interface CrashFallbackProps {
    error: Error
    resetError: () => void
}

const CrashFallback: React.FC<CrashFallbackProps> = ({ error, resetError }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(28)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 420, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <LinearGradient
            colors={[colors.primary[950], colors.primary[900], colors.primary[800]]}
            style={styles.gradient}
        >
            {/* Decorative blobs */}
            <View style={[styles.blob, styles.blobTopRight]} />
            <View style={[styles.blob, styles.blobBottomLeft]} />

            <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                {/* Icon badge */}
                <View style={styles.iconBadge}>
                    <MaterialCommunityIcons name='alert-circle-outline' size={48} color={colors.primary[300]} />
                </View>

                <Text style={styles.title}>Something Went Wrong</Text>
                <Text style={styles.subtitle}>
                    We hit an unexpected error. Please be patient — this doesn't happen often. Tap the button below to restart your session.
                </Text>

                {/* Error detail pill */}
                <View style={styles.errorPill}>
                    <MaterialCommunityIcons name='information-outline' size={13} color='rgba(255,255,255,0.45)' />
                    <Text style={styles.errorText} numberOfLines={2}>{error.message}</Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={resetError} activeOpacity={0.82}>
                    <MaterialCommunityIcons name='refresh' size={17} color='#fff' />
                    <Text style={styles.buttonText}>Restart Session</Text>
                </TouchableOpacity>

                <Text style={styles.hint}>If this keeps happening, please contact support.</Text>
            </Animated.View>
        </LinearGradient>
    );
}

export default CrashFallback

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(24),
    },
    blob: {
        position: 'absolute',
        borderRadius: 999,
        opacity: 0.18,
    },
    blobTopRight: {
        width: scale(260),
        height: scale(260),
        backgroundColor: colors.primary[500],
        top: -verticalScale(60),
        right: -scale(80),
    },
    blobBottomLeft: {
        width: scale(200),
        height: scale(200),
        backgroundColor: colors.primary[600],
        bottom: verticalScale(40),
        left: -scale(60),
    },
    card: {
        width: '100%',
        maxWidth: scale(380),
        backgroundColor: 'rgba(21,9,38,0.85)',
        borderRadius: scale(28),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        padding: scale(28),
        alignItems: 'center',
        gap: scale(14),
    },
    iconBadge: {
        width: scale(88),
        height: scale(88),
        borderRadius: scale(44),
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(4),
    },
    title: {
        fontSize: moderateScale(22),
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    subtitle: {
        fontSize: moderateScale(14),
        color: 'rgba(255,255,255,0.62)',
        textAlign: 'center',
        lineHeight: moderateScale(21),
        paddingHorizontal: scale(4),
    },
    errorPill: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: scale(6),
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: scale(10),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(9),
        width: '100%',
    },
    errorText: {
        flex: 1,
        fontSize: moderateScale(11),
        color: 'rgba(255,255,255,0.40)',
        lineHeight: moderateScale(16),
        fontFamily: 'monospace',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
        backgroundColor: colors.primary[600],
        paddingHorizontal: scale(28),
        paddingVertical: verticalScale(14),
        borderRadius: scale(14),
        width: '100%',
        justifyContent: 'center',
        marginTop: verticalScale(4),
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: moderateScale(15),
        letterSpacing: 0.3,
    },
    hint: {
        fontSize: moderateScale(11),
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
        marginTop: verticalScale(2),
    },
})
