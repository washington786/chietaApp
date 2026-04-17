import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { moderateScale, scale } from '@/utils/responsive';

type EmptyScreenProps = {
    icon?: keyof typeof Feather.glyphMap;
    title: string;
    subtitle?: string;
    backgroundColor?: string;
    style?: ViewStyle;
};

const REmpty = ({
    icon = "folder",
    title = "No items found",
    subtitle = "When you have items, they’ll appear here",
    backgroundColor = "#f8f9fa",
    style,
}: EmptyScreenProps) => {
    const { height } = useWindowDimensions();

    return (
        <View style={[styles.container, { backgroundColor, minHeight: height - 200 }, style]}>
            <Animated.View entering={FadeInDown.duration(600)} style={styles.content}>
                <View style={styles.iconCircle}>
                    <Feather name={icon} size={moderateScale(44)} color="#6c5ce7" />
                </View>

                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    content: {
        alignItems: 'center',
        maxWidth: 400,
    },
    iconCircle: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(50),
        backgroundColor: '#6c5ce7' + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(28),
    },
    title: {
        fontSize: moderateScale(22),
        fontWeight: '700',
        color: '#2d3436',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: moderateScale(15),
        color: '#636e72',
        textAlign: 'center',
        lineHeight: moderateScale(22),
    },
});

export default REmpty;