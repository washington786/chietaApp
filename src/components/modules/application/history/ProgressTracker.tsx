import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { moderateScale, scale } from '@/utils/responsive';
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
                const isLast = index === steps.length - 1;

                return (
                    <View key={index} style={styles.stepRow}>
                        {/* Left column: circle + connector line */}
                        <View style={styles.lineCol}>
                            <View style={[
                                styles.circle,
                                isCompleted && styles.circleCompleted,
                                isInProgress && styles.circleInProgress,
                                isPending && styles.circlePending,
                            ]}>
                                {isCompleted && (
                                    <Ionicons name="checkmark" size={moderateScale(20)} color="white" />
                                )}
                                {isInProgress && (
                                    <View style={styles.innerDot} />
                                )}
                            </View>
                            {!isLast && (
                                <View style={[
                                    styles.connector,
                                    (isCompleted || isInProgress) && styles.connectorActive,
                                ]} />
                            )}
                        </View>

                        {/* Right column: text content */}
                        <View style={[styles.content, isLast && styles.contentLast]}>
                            <Text style={[
                                styles.title,
                                isCompleted && styles.titleCompleted,
                                isInProgress && styles.titleInProgress,
                                isPending && styles.titlePending,
                            ]}>
                                {step.title}
                            </Text>
                            <View style={styles.statusRow}>
                                <Text style={[styles.status, { color: statusInfo.color }]}>
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
                    </View>
                );
            })}
        </View>
    );
};

export default ProgressTracker;

const styles = StyleSheet.create({
    container: {
        paddingVertical: scale(8),
    },
    // Each step is a horizontal row: [lineCol | content]
    stepRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    // Left column holds the circle and the vertical connector line
    lineCol: {
        alignItems: 'center',
        width: scale(48),
        marginRight: scale(16),
    },
    circle: {
        width: scale(44),
        height: scale(44),
        borderRadius: scale(22),
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
        width: scale(10),
        height: scale(10),
        borderRadius: scale(5),
        backgroundColor: colors.primary[600],
    },
    // Connector grows to fill remaining height in lineCol
    connector: {
        flex: 1,
        width: scale(2),
        backgroundColor: colors.slate[300],
        marginTop: scale(4),
        marginBottom: 0,
        minHeight: scale(24),
    },
    connectorActive: {
        backgroundColor: colors.emerald[500],
    },
    // Right column: text content, has bottom padding to space steps apart
    content: {
        flex: 1,
        paddingBottom: scale(28),
        paddingTop: scale(6),
    },
    contentLast: {
        paddingBottom: scale(8),
    },
    title: {
        fontSize: moderateScale(15),
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
        flexWrap: 'wrap',
        gap: scale(10),
        marginTop: scale(4),
    },
    status: {
        fontSize: moderateScale(11),
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    date: {
        fontSize: moderateScale(11),
        color: colors.slate[400],
        fontWeight: '500',
    },
});