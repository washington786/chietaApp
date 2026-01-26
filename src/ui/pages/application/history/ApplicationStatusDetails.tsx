import { StyleSheet } from 'react-native'
import React, { useMemo } from 'react'
import RHeader from '@/components/common/RHeader'
import { RCol, RRow, Scroller } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ProgressTracker } from '@/components/modules/application'
import Ionicons from '@expo/vector-icons/Ionicons';
import { RouteProp, useRoute } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'
import { ProjectTimeline } from '@/core/models/DiscretionaryDto'

const ApplicationStatusDetails = () => {

    const route = useRoute<RouteProp<navigationTypes, 'historyDetails'>>();
    const item = route.params.item as ProjectTimeline;

    const steps = useMemo(() => {
        const fmDate = new Date(item.statusChangedDate).toLocaleDateString('en-za', {
            day: "numeric",
            month: "numeric",
            year: "numeric"
        });

        const stepsArray = [
            {
                title: 'Application Started',
                completed: item.applicationStarted,
                description: 'Application creation initiated'
            },
            {
                title: 'Application Submitted',
                completed: item.applicationSubmitted,
                description: 'Application submitted for review'
            },
            {
                title: 'RSA Review',
                completed: item.rsaReviewCompleted,
                description: 'Under review by RSA team'
            },
            {
                title: 'Grants Committee',
                completed: item.grantsCommitteeReview,
                description: 'Committee evaluation in progress'
            },
            {
                title: 'Evaluation',
                completed: item.evaluationCompleted,
                description: 'Final evaluation stage'
            }
        ];

        // Map to Step interface
        return stepsArray.map((step) => ({
            title: step.title,
            date: fmDate,
            status: (step.completed ? 'completed' : 'pending') as 'completed' | 'pending'
        }));
    }, [item]);

    const isApplicationSubmitted = item.applicationSubmitted;
    const isCompleted = item.evaluationCompleted;

    const fmDate = new Date(item.statusChangedDate).toLocaleDateString('en-za', {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    });

    return (
        <>
            <RHeader name='Track Application Status' />
            <Scroller style={styles.container}>
                <Text variant='titleLarge' style={styles.titles}>Application Details</Text>
                <RCol style={styles.wrapper}>
                    <Text variant='titleMedium' style={styles.orgTitle}>{item.organisationName}</Text>
                    <Text variant='bodyMedium' style={styles.sdlNo}>{item.sdlNo}</Text>
                    <RRow style={[styles.row, styles.center, styles.gap]}>
                        <Feather name="rotate-cw" size={20} color={colors.slate[700]} />
                        <Text variant='labelLarge' style={styles.labelText}>{item.projectName}</Text>
                    </RRow>
                    <RRow style={[styles.row, styles.center, styles.gap]}>
                        <Feather name="briefcase" size={20} color={colors.slate[700]} />
                        <Text variant='labelLarge' style={styles.labelText}>{item.windowTitle}</Text>
                    </RRow>
                    <RRow style={[styles.row, styles.center, styles.gap]}>
                        <Feather name="calendar" size={20} color={colors.slate[700]} />
                        <Text variant='labelLarge' style={styles.labelText}>Updated: {fmDate}</Text>
                    </RRow>
                    <RRow style={[styles.row, styles.center, styles.gap]}>
                        <Feather name="info" size={20} color={colors.slate[700]} />
                        <Text variant='labelLarge' style={styles.labelText}>Status: {item.status}</Text>
                    </RRow>
                </RCol>

                {!isApplicationSubmitted && (
                    <RRow style={[styles.messageBox, styles.msgWarning]}>
                        <MaterialIcons name="info" size={28} color="white" />
                        <Text variant='bodyMedium' style={styles.txtClr}>Application is still in progress. Please complete and submit.</Text>
                    </RRow>
                )}

                {isApplicationSubmitted && (
                    <RRow style={[styles.messageBox, styles.msg]}>
                        <MaterialIcons name="check-circle" size={28} color="white" />
                        <Text variant='bodyMedium' style={styles.txtClr}>Your application has been submitted. Track the status below.</Text>
                    </RRow>
                )}

                <Text variant='titleLarge' style={styles.titles}>Application Progress</Text>
                <RCol style={styles.statusBox}>
                    <ProgressTracker steps={steps} />
                </RCol>

            </Scroller>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 48,
        backgroundColor: colors.white,
    },
    titles: {
        marginVertical: 16,
        color: colors.slate[900],
        fontWeight: '700',
        fontSize: 20,
    },
    wrapper: {
        backgroundColor: colors.slate[50],
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    row: {
        justifyContent: 'flex-start',
        width: '100%',
        marginVertical: 6,
    },
    center: {
        alignItems: 'center',
    },
    gap: {
        gap: 12,
    },
    orgTitle: {
        color: colors.slate[900],
        fontWeight: '600',
        fontSize: 18,
    },
    sdlNo: {
        color: colors.slate[600],
        fontWeight: '500',
        fontSize: 14,
    },
    labelText: {
        color: colors.slate[800],
        fontWeight: '500',
    },
    messageBox: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        gap: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    msg: {
        backgroundColor: colors.emerald[500],
    },
    msgWarning: {
        backgroundColor: colors.yellow[500],
    },
    txtClr: {
        color: 'white',
        flex: 1,
        fontWeight: '500',
    },
    statusBox: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    currentStageBox: {
        backgroundColor: colors.primary[50],
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderLeftWidth: 5,
        borderLeftColor: colors.primary[500],
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    stageTitleText: {
        color: colors.slate[700],
        marginBottom: 8,
        fontWeight: '600',
        fontSize: 16,
    },
    stageText: {
        color: colors.primary[700],
        fontWeight: '700',
        fontSize: 22,
    }
})

export default ApplicationStatusDetails