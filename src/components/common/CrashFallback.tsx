import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
        padding: 24,
    },
    blob: {
        position: 'absolute',
        borderRadius: 999,
        opacity: 0.18,
    },
    blobTopRight: {
        width: 260,
        height: 260,
        backgroundColor: colors.primary[500],
        top: -60,
        right: -80,
    },
    blobBottomLeft: {
        width: 200,
        height: 200,
        backgroundColor: colors.primary[600],
        bottom: 40,
        left: -60,
    },
    card: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: 'rgba(21,9,38,0.85)',
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        padding: 28,
        alignItems: 'center',
        gap: 14,
    },
    iconBadge: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.62)',
        textAlign: 'center',
        lineHeight: 21,
        paddingHorizontal: 4,
    },
    errorPill: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: 12,
        paddingVertical: 9,
        width: '100%',
    },
    errorText: {
        flex: 1,
        fontSize: 11,
        color: 'rgba(255,255,255,0.40)',
        lineHeight: 16,
        fontFamily: 'monospace',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.primary[600],
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 14,
        width: '100%',
        justifyContent: 'center',
        marginTop: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
        letterSpacing: 0.3,
    },
    hint: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.3)',
        textAlign: 'center',
        marginTop: 2,
    },
})
