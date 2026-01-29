import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Step } from '@/core/types/steps';
import colors from '@/config/colors';

interface ProgressTrackerProps {
    steps: Step[];
}

const ProgressTracker = ({ steps }: ProgressTrackerProps) => {
    const getStatusInfo = (step: Step, index: number) => {
        if (step.status === 'completed') {
            return { label: 'COMPLETED', color: colors.emerald[600] };
        } else if (step.status === 'pending') {
            // Check if this is the currently active step (first pending)
            const firstPendingIndex = steps.findIndex(s => s.status === 'pending');
            if (index === firstPendingIndex) {
                return { label: 'IN PROGRESS', color: colors.primary[600] };
            }
            return { label: 'Upcoming Stage', color: colors.slate[400] };
        }
        return { label: 'Pending results', color: colors.slate[400] };
    };

    return (
        <View style={styles.container}>
            {steps.map((step, index) => {
                const statusInfo = getStatusInfo(step, index);
                const isCompleted = step.status === 'completed';
                const isInProgress = !isCompleted && step.status === 'pending' && index === steps.findIndex(s => s.status === 'pending');
                const isPending = step.status === 'pending' && !isInProgress;

                return (
                    <View key={index} style={styles.stepContainer}>
                        {/* Circle */}
                        <View style={[
                            styles.circle,
                            isCompleted && styles.circleCompleted,
                            isInProgress && styles.circleInProgress,
                            isPending && styles.circlePending,
                        ]}>
                            {isCompleted && (
                                <Ionicons name="checkmark" size={24} color="white" />
                            )}
                            {isInProgress && (
                                <View style={styles.innerDot} />
                            )}
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <Text style={[
                                styles.title,
                                isCompleted && styles.titleCompleted,
                                isInProgress && styles.titleInProgress,
                                isPending && styles.titlePending,
                            ]}>
                                {step.title}
                            </Text>
                            <View style={styles.statusRow}>
                                <Text style={[
                                    styles.status,
                                    { color: statusInfo.color }
                                ]}>
                                    {statusInfo.label}
                                </Text>
                                {isCompleted && (
                                    <Text style={styles.date}>Completed on {step.date}</Text>
                                )}
                                {isInProgress && (
                                    <Text style={styles.date}>Awaiting Reviewer</Text>
                                )}
                                {isPending && (
                                    <Text style={styles.date}>Pending results</Text>
                                )}
                            </View>
                        </View>

                        {/* Connector (except last item) */}
                        {index < steps.length - 1 && (
                            <View style={[
                                styles.connector,
                                (isCompleted || isInProgress) && styles.connectorActive,
                            ]} />
                        )}
                    </View>
                );
            })}
        </View>
    );
};

export default ProgressTracker;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
    },
    stepContainer: {
        position: 'relative',
        marginBottom: 32,
    },
    circle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.slate[200],
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        borderWidth: 2,
        borderColor: colors.slate[300],
    },
    circleCompleted: {
        backgroundColor: colors.emerald[500],
        borderColor: colors.emerald[500],
    },
    circleInProgress: {
        backgroundColor: colors.white,
        borderColor: colors.primary[600],
        borderWidth: 2,
    },
    circlePending: {
        backgroundColor: colors.slate[100],
        borderColor: colors.slate[300],
    },
    innerDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary[600],
    },
    content: {
        position: 'absolute',
        left: 72,
        top: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.slate[400],
    },
    titleCompleted: {
        color: colors.emerald[600],
        fontWeight: '700',
    },
    titleInProgress: {
        color: colors.slate[900],
        fontWeight: '700',
    },
    titlePending: {
        color: colors.slate[300],
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 4,
    },
    status: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    date: {
        fontSize: 12,
        color: colors.slate[400],
        fontWeight: '500',
    },
    connector: {
        position: 'absolute',
        left: 23,
        top: 48,
        height: 32,
        width: 2,
        backgroundColor: colors.slate[300],
        zIndex: 0,
    },
    connectorActive: {
        backgroundColor: colors.emerald[500],
    },
});