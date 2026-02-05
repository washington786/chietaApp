import React, { ComponentProps, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import colors from '@/config/colors';
import appFonts from '@/config/fonts';

interface AuthGradientButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    iconName?: ComponentProps<typeof Feather>['name'] | null;
    containerStyle?: StyleProp<ViewStyle>;
}

const AuthGradientButton = ({ title, onPress, loading = false, disabled = false, iconName = 'arrow-right', containerStyle }: AuthGradientButtonProps) => {
    const isDisabled = disabled || loading;
    const iconAnim = useRef(new Animated.Value(0)).current;

    const animatedIconStyle = useMemo(() => (
        {
            transform: [
                {
                    translateX: iconAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 8],
                    }),
                },
                {
                    scale: iconAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.1],
                    }),
                },
            ],
        }
    ), [iconAnim]);

    useEffect(() => {
        if (!iconName) {
            return;
        }

        let animation: Animated.CompositeAnimation | null = null;

        if (!isDisabled) {
            animation = Animated.loop(
                Animated.sequence([
                    Animated.timing(iconAnim, {
                        toValue: 1,
                        duration: 600,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(iconAnim, {
                        toValue: 0,
                        duration: 600,
                        easing: Easing.in(Easing.quad),
                        useNativeDriver: true,
                    }),
                ])
            );
            animation.start();
        } else {
            iconAnim.setValue(0);
        }

        return () => {
            animation?.stop();
            iconAnim.setValue(0);
        };
    }, [iconName, isDisabled, iconAnim]);

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={[styles.wrapper, containerStyle, isDisabled && styles.disabled]}
        >
            <LinearGradient
                colors={[colors.primary[900], colors.primary[700]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
            >
                <View style={[styles.content, loading && styles.loading]}>
                    <Text style={styles.text}>{title}</Text>
                    {iconName && (
                        <Animated.View style={animatedIconStyle}>
                            <Feather name={iconName} size={18} color={'#fff'} />
                        </Animated.View>
                    )}
                </View>
            </LinearGradient>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        borderRadius: 30,
        overflow: 'hidden',
    },
    disabled: {
        opacity: 0.8,
    },
    gradientButton: {
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    loading: {
        opacity: 0.6,
    },
    text: {
        color: '#fff',
        fontFamily: `${appFonts.semiBold}`,
        fontSize: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});

export default AuthGradientButton;
