import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { moderateScale, scale, verticalScale } from '@/utils/responsive'
import React, { useMemo } from 'react'
import RHeader from '@/components/common/RHeader'
import { RCol, RRow, SafeArea, Scroller } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ProgressTracker } from '@/components/modules/application'
import Ionicons from '@expo/vector-icons/Ionicons';
import { RouteProp, useRoute } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'
import { ProjectTimeline } from '@/core/models/DiscretionaryDto'
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { chatSquare } from '@/components/loadAssets'
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet'

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

    const { open, close } = useGlobalBottomSheet();

    function handleAssistance() {
        open(<ApplicationHelp close={close} />, { snapPoints: ["40%"] });
    }
    return (
        <SafeArea>
            <RHeader name='Track Application Status' />
            <Scroller contentContainerStyle={styles.container}>
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
                        <MaterialIcons name="info" size={moderateScale(24)} color={colors.yellow[700]} />
                        <Text variant='bodyMedium' style={[styles.txtClr, { color: colors.yellow[800] }]}>Application is still in progress. Please complete and submit.</Text>
                    </RRow>
                )}

                {isApplicationSubmitted && (
                    <RRow style={[styles.messageBox, styles.msgSuccess]}>
                        <MaterialIcons name="check-circle" size={moderateScale(24)} color={colors.emerald[600]} />
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
                    <TouchableOpacity style={styles.helpSection} onPress={handleAssistance}>
                        <Ionicons name="help-circle-outline" size={moderateScale(20)} color={colors.slate[400]} />
                        <Text variant='bodySmall' style={styles.helpText}>Need assistance with your application?</Text>
                    </TouchableOpacity>
                </RCol>

            </Scroller>
        </SafeArea>
    )
}

function ApplicationHelp({ close }: { close: () => void }) {
    return (
        <View style={{ flex: 1, backgroundColor: "white", padding: scale(16) }}>
            <RRow
                style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: scale(20),
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: scale(4) }}>
                    <Image source={chatSquare} style={{ width: scale(20), height: scale(20) }} />
                    <Text variant="titleMedium" style={styles.assistantTitle}>Application Assistant</Text>
                </View>

                <TouchableOpacity onPress={close} style={{ backgroundColor: colors.slate[100], borderRadius: 100, padding: scale(4) }}>
                    <EvilIcons name="close" size={moderateScale(32)} color="black" />
                </TouchableOpacity>
            </RRow>

            {/* Main Content */}
            <RCol style={styles.helpContent}>
                <Text
                    variant="bodyMedium"
                    style={styles.helpDescription}
                >
                    Please email us your questions or concerns regarding your application, and our dedicated support team will get back to you as soon as possible.
                </Text>

                {/* Email Card */}
                <TouchableOpacity style={styles.emailCard}>
                    <View style={styles.emailLeft}>
                        <View style={styles.emailIcon}>
                            <MaterialIcons name="mail-outline" size={moderateScale(24)} color="white" />
                        </View>
                        <RCol style={{ gap: scale(2) }}>
                            <Text variant="labelSmall" style={styles.emailLabel}>CONTACT EMAIL</Text>
                            <Text variant="titleMedium" style={styles.emailAddress}>misqueries@chieta.org.za</Text>
                        </RCol>
                    </View>
                </TouchableOpacity>

                {/* Response Time Info */}
                <RRow style={styles.responseInfo}>
                    <View style={styles.responseDot} />
                    <Text variant="bodySmall" style={styles.responseText}>Our team typically responds within 24 hours</Text>
                </RRow>
            </RCol>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(12),
        paddingBottom: verticalScale(32),
        backgroundColor: colors.white,
        flexGrow: 1,
    },
    referenceBox: {
        backgroundColor: colors.slate[50],
        borderRadius: scale(8),
        padding: scale(14),
        marginBottom: scale(12),
        gap: scale(4),
        borderLeftWidth: 4,
        borderLeftColor: colors.primary[800],
    },
    refLabel: {
        color: colors.primary[800],
        fontWeight: '700',
        fontSize: moderateScale(11),
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    orgTitle: {
        color: colors.slate[900],
        fontWeight: 'bold',
        fontSize: moderateScale(12),
        marginBottom: scale(1),
    },
    detailsGrid: {
        gap: scale(8),
        marginTop: scale(5),
    },
    detailRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    detailLabel: {
        color: colors.slate[500],
        fontWeight: '600',
        fontSize: moderateScale(10),
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    detailValue: {
        color: colors.slate[800],
        fontWeight: 'black',
        flex: 1,
        textAlign: 'right',
        fontSize: moderateScale(13),
    },
    messageBox: {
        padding: scale(10),
        borderRadius: scale(10),
        marginBottom: scale(12),
        gap: scale(10),
        alignItems: 'flex-start',
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
        fontSize: moderateScale(13),
    },
    progressSection: {
        gap: scale(10),
    },
    progressHeader: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressTitle: {
        color: colors.slate[400],
        fontWeight: '700',
        fontSize: moderateScale(12),
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    phaseLabel: {
        color: colors.emerald[600],
        fontWeight: '700',
        fontSize: moderateScale(12),
    },
    statusBox: {
        backgroundColor: colors.white,
        borderRadius: scale(12),
        padding: scale(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
    },
    helpSection: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(8),
        paddingVertical: scale(16),
        flexDirection: 'row',
    },
    helpText: {
        color: colors.slate[400],
        fontWeight: '500',
        fontSize: moderateScale(12),
    },
    titles: {
        marginVertical: scale(16),
        color: colors.slate[900],
        fontWeight: '700',
        fontSize: moderateScale(20),
    },
    wrapper: {
        backgroundColor: colors.slate[50],
        borderRadius: scale(16),
        padding: scale(20),
        marginBottom: scale(20),
        gap: scale(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    row: {
        justifyContent: 'flex-start',
        width: '100%',
        marginVertical: scale(6),
    },
    center: {
        alignItems: 'center',
    },
    gap: {
        gap: scale(12),
    },
    sdlNo: {
        color: colors.slate[600],
        fontWeight: '500',
        fontSize: moderateScale(14),
    },
    labelText: {
        color: colors.slate[800],
        fontWeight: '500',
    },
    currentStageBox: {
        backgroundColor: colors.primary[50],
        borderRadius: scale(16),
        padding: scale(20),
        marginBottom: scale(20),
        borderLeftWidth: 5,
        borderLeftColor: colors.primary[500],
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    stageTitleText: {
        color: colors.slate[700],
        marginBottom: scale(8),
        fontWeight: '600',
        fontSize: moderateScale(16),
    },
    stageText: {
        color: colors.primary[700],
        fontWeight: '700',
        fontSize: moderateScale(22),
    },
    helpModal: {
        flex: 1,
        backgroundColor: colors.white,
    },
    helpHeader: {
        backgroundColor: colors.primary[600],
        paddingHorizontal: scale(20),
        paddingVertical: scale(16),
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: scale(20),
        borderBottomRightRadius: scale(20),
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
        flex: 1,
    },
    headerIcon: {
        width: scale(48),
        height: scale(48),
        borderRadius: scale(12),
        backgroundColor: colors.primary[700],
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: colors.white,
        fontWeight: '700',
    },
    headerSubtitle: {
        color: colors.primary[100],
        fontWeight: '500',
    },
    assistantTitle: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: colors.slate[900],
    },
    helpContent: {
        flex: 1,
        padding: scale(8),
        gap: scale(20),
    },
    helpDescription: {
        color: colors.gray[400],
        lineHeight: moderateScale(18),
        fontWeight: '400',
    },
    emailCard: {
        flexDirection: 'row',
        backgroundColor: colors.primary[100],
        borderRadius: scale(16),
        padding: scale(8),
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.primary[200],
    },
    emailLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
        flex: 1,
    },
    emailIcon: {
        width: scale(48),
        height: scale(48),
        borderRadius: scale(12),
        backgroundColor: colors.primary[600],
        justifyContent: 'center',
        alignItems: 'center',
    },
    emailLabel: {
        color: colors.primary[600],
        fontWeight: '700',
        fontSize: moderateScale(10),
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    emailAddress: {
        color: colors.slate[900],
        fontWeight: '700',
        fontSize: moderateScale(14),
    },
    emailRight: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tapLabel: {
        color: colors.primary[600],
        fontWeight: '700',
        fontSize: moderateScale(10),
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    responseInfo: {
        alignItems: 'center',
        gap: scale(8),
        paddingVertical: scale(12),
    },
    responseDot: {
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: colors.emerald[500],
    },
    responseText: {
        color: colors.slate[600],
        fontWeight: '500',
        fontSize: moderateScale(12),
    }
})

export default ApplicationStatusDetails