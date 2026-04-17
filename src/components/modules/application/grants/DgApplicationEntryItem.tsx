import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'
import { moderateScale, scale } from '@/utils/responsive'
import { Button, IconButton, Surface, Divider } from 'react-native-paper'
import { useGlobalBottomSheet, BottomSheetScrollView } from '@/hooks/navigation/BottomSheet'
import colors from '@/config/colors'
import { RCol, RRow } from '@/components/common'
import DocumentsList from './DocumentsList'
import { useGetDocumentsByEntityQuery } from '@/store/api/api'
import { Expandable } from './Expandable'

export interface ApplicationEntry {
    id: string;
    programType: string;
    learningProgramme: string;
    subCategory: string;
    intervention: string;
    noContinuing: number;
    noNew: number;
    noFemale: number;
    noHistoricallyDisadvantaged: number;
    noYouth: number;
    noDisabled: number;
    noRural: number;
    costPerLearner: number;
    province: string;
    district: string;
    municipality: string;
}

interface DgApplicationEntryItemProps {
    data: ApplicationEntry;
    onEdit?: (data: ApplicationEntry) => void;
    onDelete?: (id: string) => void;
}

const DgApplicationEntryItem: React.FC<DgApplicationEntryItemProps> = ({
    data,
    onEdit,
    onDelete
}) => {
    const { open: openBottomSheet, close: closeBottomSheet } = useGlobalBottomSheet();

    // Document types to fetch
    const documentTypes = [
        'Tax Compliance',
        'Company Registration',
        'BEE Certificate',
        'Accreditation',
        'Commitment Letter',
        'Learner Schedule',
        'Organisation Interest',
        'Bank Details',
        'Application Form'
    ];

    // Fetch all documents for this entry
    const entityId = parseInt(data.id, 10);
    const documentQueries = documentTypes.map(docType =>
        useGetDocumentsByEntityQuery(
            {
                entityId,
                module: 'Projects',
                documentType: docType
            },
            { skip: !data.id || isNaN(entityId) }
        )
    );

    const handleView = useCallback(() => {
        const totalContinuing = data.noContinuing;
        const totalNew = data.noNew;
        const totalLearners = totalContinuing + totalNew;
        const totalCost = totalLearners * data.costPerLearner;

        // Collect all documents from all queries
        const allDocuments = documentQueries
            .flatMap(query => query.data?.result?.items || [])
            .flatMap(item => item.documents || []);

        openBottomSheet(
            <EntryDetailsSheet
                data={data}
                allDocuments={allDocuments}
                totalLearners={totalLearners}
                totalCost={totalCost}
                onClose={closeBottomSheet}
                onEdit={onEdit}
                onDelete={onDelete}
            />,
            { snapPoints: ['60%', '90%'] }
        );
    }, [data, onEdit, onDelete, openBottomSheet, closeBottomSheet, documentQueries]);

    return (
        <Surface style={styles.card}>
            <View style={styles.content}>
                <Text style={styles.programType} numberOfLines={1} ellipsizeMode="tail">{data.programType}</Text>
                <Text style={styles.learningProgramme} numberOfLines={1} ellipsizeMode="tail">{data.learningProgramme}</Text>
                <Text style={styles.intervention} numberOfLines={1} ellipsizeMode="tail">{data.intervention}</Text>
            </View>
            <Divider style={styles.divider} />
            <RRow style={styles.statsContainer}>
                <Text style={styles.stat}>{(data.noContinuing + data.noNew).toString()} Learners</Text>
                <Text style={styles.stat}>R{data.costPerLearner.toLocaleString()}/Learner</Text>
            </RRow>
            <RRow style={styles.actionsContainer}>
                <IconButton
                    icon="eye"
                    size={moderateScale(20)}
                    iconColor={colors.primary[600]}
                    onPress={handleView}
                    style={styles.iconButton}
                />
                {onEdit && (
                    <IconButton
                        icon="pencil"
                        size={moderateScale(20)}
                        iconColor={colors.gray[600]}
                        onPress={() => onEdit(data)}
                        style={styles.iconButton}
                    />
                )}
                {onDelete && (
                    <IconButton
                        icon="trash-can"
                        size={moderateScale(20)}
                        iconColor={colors.red[500]}
                        onPress={() => onDelete(data.id)}
                        style={styles.iconButton}
                    />
                )}
            </RRow>
        </Surface>
    );
};

const DetailRow = ({
    label,
    value,
    highlighted
}: {
    label: string;
    value: string;
    highlighted?: boolean
}) => (
    <View style={[styles.detailRow, highlighted && styles.highlightedRow]}>
        <Text style={[styles.label, highlighted && styles.highlightedLabel]}>{label}</Text>
        <Text style={[styles.value, highlighted && styles.highlightedValue]}>{value}</Text>
    </View>
);

const EntryDetailsSheet = ({
    data,
    allDocuments,
    totalLearners,
    totalCost,
    onClose,
    onEdit,
    onDelete,
}: {
    data: ApplicationEntry;
    allDocuments: any[];
    totalLearners: number;
    totalCost: number;
    onClose: () => void;
    onEdit?: (data: ApplicationEntry) => void;
    onDelete?: (id: string) => void;
}) => {
    const [showProgrammeInfo, setShowProgrammeInfo] = React.useState(true);
    const [showLearnerDistribution, setShowLearnerDistribution] = React.useState(false);
    const [showCostInformation, setShowCostInformation] = React.useState(false);

    return (
        <BottomSheetScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.bottomSheetContentContainer}
            enableFooterMarginAdjustment={true}
            bounces={false}
            overScrollMode="never"
        >
            <View style={styles.bottomSheetHeader}>
                <Text style={styles.bottomSheetTitle}>Application Details</Text>
                <IconButton
                    icon="close"
                    size={moderateScale(24)}
                    iconColor={colors.gray[600]}
                    onPress={onClose}
                    style={styles.closeButton}
                />
            </View>
            <Expandable
                title="Programme Information"
                isExpanded={showProgrammeInfo}
                onPress={() => setShowProgrammeInfo(!showProgrammeInfo)}
            >
                {/* <Surface style={styles.detailSection}> */}
                <Text style={styles.sectionTitle}>Programme Information</Text>
                <DetailRow label="Programme Type" value={data.programType} />
                <DetailRow label="Learning Programme" value={data.learningProgramme} />
                <DetailRow label="Sub Category" value={data.subCategory} />
                <DetailRow label="Intervention" value={data.intervention} />
                {/* </Surface> */}
            </Expandable>

            <Expandable
                title="Learner Distribution"
                isExpanded={showLearnerDistribution}
                onPress={() => setShowLearnerDistribution(!showLearnerDistribution)}
            >
                {/* <Surface style={styles.detailSection}> */}
                <Text style={styles.sectionTitle}>Learner Distribution</Text>
                <DetailRow label="Continuing Students" value={data.noContinuing.toString()} />
                <DetailRow label="New Students" value={data.noNew.toString()} />
                <DetailRow label="Total Learners" value={totalLearners.toString()} highlighted />
                <DetailRow label="Female" value={data.noFemale.toString()} />
                <DetailRow label="Historically Disadvantaged" value={data.noHistoricallyDisadvantaged.toString()} />
                <DetailRow label="Youth" value={data.noYouth.toString()} />
                <DetailRow label="Disabled" value={data.noDisabled.toString()} />
                <DetailRow label="Rural" value={data.noRural.toString()} />
                {/* </Surface> */}
            </Expandable>

            <Expandable
                title="Costs & Location"
                isExpanded={showCostInformation}
                onPress={() => setShowCostInformation(!showCostInformation)}
            >
                {/* <Surface style={styles.detailSection}> */}
                <Text style={styles.sectionTitle}>Costs & Location</Text>
                <DetailRow label="Cost Per Learner" value={`R ${data.costPerLearner.toLocaleString()}`} />
                <DetailRow label="Total Cost" value={`R ${totalCost.toLocaleString()}`} highlighted />
                <DetailRow label="Province" value={data.province} />
                <DetailRow label="District" value={data.district} />
                <DetailRow label="Municipality" value={data.municipality} />
                {/* </Surface> */}
            </Expandable>

            {allDocuments.length > 0 && (
                <Surface style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Uploaded Documents ({allDocuments.length})</Text>
                    <DocumentsList documents={allDocuments} />
                </Surface>
            )}

            <View style={styles.actionButtons}>
                {onEdit && (
                    <Button
                        mode="contained"
                        onPress={() => {
                            onClose();
                            onEdit(data);
                        }}
                        style={styles.editButton}
                        labelStyle={styles.buttonText}
                        icon="pencil"
                    >
                        Edit
                    </Button>
                )}
                {onDelete && (
                    <Button
                        mode="contained"
                        onPress={() => {
                            onClose();
                            onDelete(data.id);
                        }}
                        style={styles.deleteButton}
                        labelStyle={styles.buttonText}
                        icon="trash-can"
                    >
                        Delete
                    </Button>
                )}
            </View>
        </BottomSheetScrollView>
    );
};

export default DgApplicationEntryItem

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: scale(16),
        padding: scale(16),
        marginHorizontal: scale(8),
        width: scale(250),
        elevation: 1,
        shadowColor: colors.gray[100],
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    content: {
        marginBottom: scale(12),
    },
    programType: {
        fontSize: moderateScale(15),
        fontWeight: '700',
        color: colors.slate[900],
        marginBottom: scale(4),
    },
    learningProgramme: {
        fontSize: moderateScale(13),
        color: colors.gray[700],
        marginBottom: scale(4),
    },
    intervention: {
        fontSize: moderateScale(12),
        color: colors.gray[500],
    },
    divider: {
        marginBottom: scale(12),
        backgroundColor: colors.gray[200],
    },
    statsContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: scale(12),
    },
    stat: {
        fontSize: moderateScale(13),
        color: colors.primary[600],
        fontWeight: '600',
    },
    actionsContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: scale(4),
    },
    iconButton: {
        margin: 0,
        borderRadius: scale(20),
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(16),
        paddingBottom: scale(12),
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200],
        paddingHorizontal: scale(12),
    },
    bottomSheetTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: colors.slate[900],
    },
    closeButton: {
        margin: 0,
    },
    detailSection: {
        marginBottom: scale(24),
        backgroundColor: colors.white,
        borderRadius: scale(12),
        padding: scale(16),
        elevation: 1,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: colors.slate[900],
        marginBottom: scale(12),
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: scale(10),
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
    },
    highlightedRow: {
        backgroundColor: colors.primary[50],
        borderRadius: scale(8),
        paddingHorizontal: scale(8),
        marginHorizontal: scale(-8),
        marginVertical: scale(4),
    },
    label: {
        fontSize: moderateScale(14),
        color: colors.gray[600],
        width: '38%',
        minWidth: scale(96),
        marginRight: scale(10),
    },
    highlightedLabel: {
        fontWeight: '600',
        color: colors.primary[700],
    },
    value: {
        fontSize: moderateScale(14),
        fontWeight: '500',
        color: colors.slate[900],
        flex: 1,
        textAlign: 'right',
    },
    highlightedValue: {
        color: colors.primary[700],
        fontWeight: '700',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: scale(12),
        marginTop: scale(16),
        paddingHorizontal: scale(16),
    },
    editButton: {
        flex: 1,
        backgroundColor: colors.blue[600],
        borderRadius: scale(8),
    },
    deleteButton: {
        flex: 1,
        backgroundColor: colors.red[600],
        borderRadius: scale(8),
    },
    buttonText: {
        color: colors.white,
        fontWeight: '600',
    },
    bottomSheetContentContainer: {
        paddingHorizontal: scale(12),
        paddingBottom: scale(48),
    },
})
