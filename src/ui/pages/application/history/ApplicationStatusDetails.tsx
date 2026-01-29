import { StyleSheet } from 'react-native'
import React, { useMemo } from 'react'
import RHeader from '@/components/common/RHeader'
import { RCol, RRow, Scroller } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
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

    const fmDate = new Date(item.statusChangedDate).toLocaleDateString('en-za', {
        day: "numeric",
        month: "numeric",
        year: "numeric"
    });

    return (
        <>
            <RHeader name='Track Application Status' />
            <Scroller style={styles.container}>
                {/* Reference Header Section */}
                <RCol style={styles.referenceBox}>
                    <Text variant='labelSmall' style={styles.refLabel}>REFERENCE: {item.sdlNo}</Text>
                    <Text variant='headlineMedium' style={styles.orgTitle}>{item.organisationName}</Text>

                    <RCol style={styles.detailsGrid}>
                        <RRow style={styles.detailRow}>
                            <Text variant='labelSmall' style={styles.detailLabel}>TYPE</Text>
                            <Text variant='bodyMedium' style={styles.detailValue}>{item.windowTitle}</Text>
                        </RRow>
                        <RRow style={styles.detailRow}>
                            <Text variant='labelSmall' style={styles.detailLabel}>CYCLE</Text>
                            <Text variant='bodyMedium' style={styles.detailValue}>{item.projectName}</Text>
                        </RRow>
                        <RRow style={styles.detailRow}>
                            <Text variant='labelSmall' style={styles.detailLabel}>LAST UPDATED</Text>
                            <Text variant='bodyMedium' style={styles.detailValue}>{fmDate}</Text>
                        </RRow>
                    </RCol>
                </RCol>

                {/* Status Message */}
                {!isApplicationSubmitted && (
                    <RRow style={[styles.messageBox, styles.msgWarning]}>
                        <MaterialIcons name="info" size={24} color={colors.yellow[700]} />
                        <Text variant='bodyMedium' style={[styles.txtClr, { color: colors.yellow[800] }]}>Application is still in progress. Please complete and submit.</Text>
                    </RRow>
                )}

                {isApplicationSubmitted && (
                    <RRow style={[styles.messageBox, styles.msgSuccess]}>
                        <MaterialIcons name="check-circle" size={24} color={colors.emerald[600]} />
                        <Text variant='bodyMedium' style={[styles.txtClr, { color: colors.slate[900] }]}>Your application has been submitted successfully. Track the live progress below.</Text>
                    </RRow>
                )}

                {/* Progress Section */}
                <RCol style={styles.progressSection}>
                    <RRow style={styles.progressHeader}>
                        <Text variant='labelLarge' style={styles.progressTitle}>APPLICATION PROGRESS</Text>
                        <Text variant='labelSmall' style={styles.phaseLabel}>Phase 1 Complete</Text>
                    </RRow>

                    <RCol style={styles.statusBox}>
                        <ProgressTracker steps={steps} />
                    </RCol>

                    {/* Help Section */}
                    <RRow style={styles.helpSection}>
                        <Ionicons name="help-circle-outline" size={20} color={colors.slate[400]} />
                        <Text variant='bodySmall' style={styles.helpText}>Need assistance with your application?</Text>
                    </RRow>
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
    referenceBox: {
        backgroundColor: colors.slate[50],
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        gap: 12,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary[800],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    refLabel: {
        color: colors.primary[800],
        fontWeight: '700',
        fontSize: 11,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    orgTitle: {
        color: colors.slate[900],
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 1,
    },
    detailsGrid: {
        gap: 8,
        marginTop: 5,
    },
    detailRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    detailLabel: {
        color: colors.slate[500],
        fontWeight: '600',
        fontSize: 10,
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    detailValue: {
        color: colors.primary[800],
        fontWeight: 'black',
        flex: 1,
        textAlign: 'right',
    },
    messageBox: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        gap: 12,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    msg: {
        backgroundColor: colors.emerald[500],
    },
    msgSuccess: {
        backgroundColor: colors.emerald[50],
        borderWidth: 1,
        borderColor: colors.emerald[200],
    },
    msgWarning: {
        backgroundColor: colors.yellow[50],
        borderWidth: 1,
        borderColor: colors.yellow[200],
    },
    txtClr: {
        flex: 1,
        fontWeight: '500',
    },
    progressSection: {
        gap: 16,
    },
    progressHeader: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressTitle: {
        color: colors.slate[400],
        fontWeight: '700',
        fontSize: 12,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    phaseLabel: {
        color: colors.emerald[600],
        fontWeight: '700',
        fontSize: 12,
    },
    statusBox: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    helpSection: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
    },
    helpText: {
        color: colors.slate[400],
        fontWeight: '500',
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
    sdlNo: {
        color: colors.slate[600],
        fontWeight: '500',
        fontSize: 14,
    },
    labelText: {
        color: colors.slate[800],
        fontWeight: '500',
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