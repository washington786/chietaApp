import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Step } from '@/core/types/steps';
import colors from '@/config/colors';

interface ProgressTrackerProps {
    steps: Step[];
}

const ProgressTracker = ({ steps }: ProgressTrackerProps) => {
    return (
        <View style={styles.container}>
            {steps.map((step, index) => (
                <View key={index} style={styles.stepContainer}>
                    {/* Circle */}
                    <View style={[
                        styles.circle,
                        step.status === 'completed' && styles.circleCompleted,
                        step.status === 'failed' && styles.circleFailed,
                    ]}>
                        {step.status === 'completed' && (
                            <Ionicons name="checkmark" size={24} color="white" />
                        )}
                        {step.status === 'failed' && (
                            <Ionicons name="close-sharp" size={24} color="white" />
                        )}
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={[
                            styles.title,
                            step.status === 'completed' && styles.titleCompleted,
                            step.status === 'failed' && styles.titleFailed,
                        ]}>
                            {step.title}
                        </Text>
                        <Text style={styles.date}>Done - {step.date}</Text>
                    </View>

                    {/* Connector (except last item) */}
                    {index < steps.length - 1 && (
                        <View style={styles.connector} />
                    )}
                </View>
            ))}
        </View>
    );
};

export default ProgressTracker;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
    },
    stepContainer: {
        position: 'relative',
        marginBottom: 24,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary[900],
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    circleCompleted: {
        backgroundColor: colors.primary[900],
    },
    circleFailed: {
        backgroundColor: colors.red[600],
    },
    content: {
        position: 'absolute',
        left: 60,
        top: 0,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.gray[500],
    },
    titleCompleted: {
        color: colors.gray[600],
    },
    titleFailed: {
        color: colors.gray[600],
        textDecorationLine: 'line-through',
    },
    date: {
        fontSize: 12,
        color: colors.slate[500],
        marginTop: 2,
    },
    connector: {
        position: 'absolute',
        left: 20,
        top: 40,
        height: 24,
        width: 2,
        backgroundColor: colors.slate[300],
        zIndex: 0,
    },
});