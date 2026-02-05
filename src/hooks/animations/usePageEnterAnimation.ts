import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';

interface PageEnterAnimationOptions {
    /**
     * Vertical offset (in px) the view should start from before animating in.
     */
    initialOffset?: number;
    /**
     * Duration of the fade portion of the animation.
     */
    duration?: number;
    /**
     * Optional delay before the animation begins.
     */
    delay?: number;
}

const usePageEnterAnimation = (options: PageEnterAnimationOptions = {}) => {
    const {
        initialOffset = 36,
        duration = 360,
        delay = 0,
    } = options;

    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(initialOffset)).current;

    useEffect(() => {
        opacity.setValue(0);
        translateY.setValue(initialOffset);

        // Run a subtle fade + upward slide to soften screen transitions.
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration,
                delay,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: duration + 140,
                delay,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, [delay, duration, initialOffset, opacity, translateY]);

    const animatedStyle = useMemo(
        () => ({
            opacity,
            transform: [{ translateY }],
        }) as Animated.WithAnimatedObject<ViewStyle>,
        [opacity, translateY],
    );

    return { animatedStyle };
};

export default usePageEnterAnimation;
