import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { scale, verticalScale } from '@/utils/responsive';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolateColor,
    Extrapolation,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LIGHT = '#f0f0f0';
const MEDIUM = '#e0e0e0';
const DARK = '#d0d0d0';

const SkeletonLoader = () => {
    const translateX = useSharedValue(-SCREEN_WIDTH);

    useEffect(() => {
        translateX.value = withRepeat(
            withTiming(SCREEN_WIDTH * 2, {
                duration: 1500,
            }),
            -1,
            false
        );
    }, []);

    const shimmerStyle = useAnimatedStyle(() => {
        const inputRange = [-SCREEN_WIDTH, 0, SCREEN_WIDTH];
        const backgroundColor = interpolateColor(
            translateX.value,
            inputRange,
            [LIGHT, MEDIUM, LIGHT],
            'RGB'
        );
        return {
            backgroundColor,
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <View style={styles.cardContainer}>
            {/* Static background */}
            <View style={styles.cardStatic}>
                <View style={[styles.line, styles.fullLine]} />
                <View style={[styles.line, styles.shortLine]} />
                <View style={[styles.line, styles.mediumLine]} />
            </View>

            {/* Shimmer overlay */}
            <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
        </View>
    );
};


const styles = StyleSheet.create({
    cardContainer: {
        position: 'relative',
        marginBottom: verticalScale(16),
    },
    cardStatic: {
        backgroundColor: '#f0f0f0',
        borderRadius: scale(12),
        padding: scale(16),
        overflow: 'hidden',
    },
    shimmerOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: scale(12),
        transform: [{ skewX: '30deg' }],
    },
    line: {
        height: scale(12),
        backgroundColor: '#e0e0e0',
        borderRadius: scale(6),
        marginBottom: verticalScale(10),
    },
    fullLine: {
        width: '100%',
    },
    mediumLine: {
        width: '80%',
    },
    shortLine: {
        width: '60%',
    },
});

export default SkeletonLoader;