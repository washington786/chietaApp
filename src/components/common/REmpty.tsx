import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

type EmptyScreenProps = {
    icon?: keyof typeof Feather.glyphMap;
    title: string;
    subtitle?: string;
    backgroundColor?: string;
};

const REmpty = ({
    icon = "folder",
    title = "No items found",
    subtitle = "When you have items, they’ll appear here",
    backgroundColor = "#f8f9fa",
}: EmptyScreenProps) => {
    const { height } = useWindowDimensions();

    return (
        <View style={[styles.container, { backgroundColor, minHeight: height - 200 }]}>
            <Animated.View entering={FadeInDown.duration(600)} style={styles.content}>
                <View style={styles.iconCircle}>
                    <Feather name={icon} size={48} color="#6c5ce7" />
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
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#6c5ce7' + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2d3436',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#636e72',
        textAlign: 'center',
        lineHeight: 24,
    },
});

export default REmpty;