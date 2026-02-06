import colors from '@/config/colors';
import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';

const SQUARE_SIZE = 12;
const DURATION = 800;

const Square = ({ delay = 0, customStyle }: { delay?: number, customStyle?: ViewStyle }) => {
    const opacity = useSharedValue(0.3);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: DURATION / 2, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.3, { duration: DURATION / 2, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            false
        );
    }, []);

    return (
        <Animated.View
            style={[
                styles.square,
                animatedStyle,
                { marginLeft: delay > 0 ? 6 : 0 },
                customStyle,
            ]}
        />
    );
};

const RLoaderAnimation = ({ customStyle }: { customStyle?: ViewStyle }) => {
    return (
        <View style={styles.container}>
            <Square customStyle={customStyle} />
            <Square delay={100} customStyle={customStyle} />
            <Square delay={200} customStyle={customStyle} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
    },
    square: {
        width: 8,
        height: 8,
        backgroundColor: colors.primary[500],
        borderRadius: 2,
        marginHorizontal: 2,
    },
});

export default RLoaderAnimation;