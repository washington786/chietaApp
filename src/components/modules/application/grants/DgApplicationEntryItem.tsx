import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useCallback } from 'react'
import { Button, IconButton, Surface, Divider } from 'react-native-paper'
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet'
import colors from '@/config/colors'
import { RCol, RRow, SafeArea } from '@/components/common'
import DocumentsList from './DocumentsList'
import { useGetDocumentsByEntityQuery } from '@/store/api/api'

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
    const documentQueries = documentTypes.map(docType =>
        useGetDocumentsByEntityQuery(
            {
                entityId: parseInt(data.id),
                module: 'Projects',
                documentType: docType
            },
            { skip: !data.id }
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
            <SafeArea>
                <ScrollView
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    showsVerticalScrollIndicator={true}
                >
                    <View style={styles.bottomSheetHeader}>
                        <Text style={styles.bottomSheetTitle}>Application Details</Text>
                        <IconButton
                            icon="close"
                            size={24}
                            iconColor={colors.gray[600]}
                            onPress={closeBottomSheet}
                            style={styles.closeButton}
                        />
                    </View>
                    <Surface style={styles.detailSection}>
                        <Text style={styles.sectionTitle}>Programme Information</Text>
                        <DetailRow label="Programme Type" value={data.programType} />
                        <DetailRow label="Learning Programme" value={data.learningProgramme} />
                        <DetailRow label="Sub Category" value={data.subCategory} />
                        <DetailRow label="Intervention" value={data.intervention} />
                    </Surface>

                    <Surface style={styles.detailSection}>
                        <Text style={styles.sectionTitle}>Learner Distribution</Text>
                        <DetailRow label="Continuing Students" value={data.noContinuing.toString()} />
                        <DetailRow label="New Students" value={data.noNew.toString()} />
                        <DetailRow label="Total Learners" value={totalLearners.toString()} highlighted />
                        <DetailRow label="Female" value={data.noFemale.toString()} />
                        <DetailRow label="Historically Disadvantaged" value={data.noHistoricallyDisadvantaged.toString()} />
                        <DetailRow label="Youth" value={data.noYouth.toString()} />
                        <DetailRow label="Disabled" value={data.noDisabled.toString()} />
                        <DetailRow label="Rural" value={data.noRural.toString()} />
                    </Surface>

                    <Surface style={styles.detailSection}>
                        <Text style={styles.sectionTitle}>Costs & Location</Text>
                        <DetailRow label="Cost Per Learner" value={`R ${data.costPerLearner.toLocaleString()}`} />
                        <DetailRow label="Total Cost" value={`R ${totalCost.toLocaleString()}`} highlighted />
                        <DetailRow label="Province" value={data.province} />
                        <DetailRow label="District" value={data.district} />
                        <DetailRow label="Municipality" value={data.municipality} />
                    </Surface>

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
                                    closeBottomSheet();
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
                                    closeBottomSheet();
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
                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeArea>,
            { snapPoints: ['90%'] }
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
                    size={20}
                    iconColor={colors.primary[600]}
                    onPress={handleView}
                    style={styles.iconButton}
                />
                {onEdit && (
                    <IconButton
                        icon="pencil"
                        size={20}
                        iconColor={colors.gray[600]}
                        onPress={() => onEdit(data)}
                        style={styles.iconButton}
                    />
                )}
                {onDelete && (
                    <IconButton
                        icon="trash-can"
                        size={20}
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

export default DgApplicationEntryItem

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 8,
        width: 250,
        elevation: 1,
        shadowColor: colors.gray[100],
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    content: {
        marginBottom: 12,
    },
    programType: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.slate[900],
        marginBottom: 4,
    },
    learningProgramme: {
        fontSize: 13,
        color: colors.gray[700],
        marginBottom: 4,
    },
    intervention: {
        fontSize: 12,
        color: colors.gray[500],
    },
    divider: {
        marginBottom: 12,
        backgroundColor: colors.gray[200],
    },
    statsContainer: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    stat: {
        fontSize: 13,
        color: colors.primary[600],
        fontWeight: '600',
    },
    actionsContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
    },
    iconButton: {
        margin: 0,
        borderRadius: 20,
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200],
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.slate[900],
    },
    closeButton: {
        margin: 0,
    },
    detailSection: {
        marginBottom: 24,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        elevation: 1,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.slate[900],
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
    },
    highlightedRow: {
        backgroundColor: colors.primary[50],
        borderRadius: 8,
        paddingHorizontal: 8,
        marginHorizontal: -8,
        marginVertical: 4,
    },
    label: {
        fontSize: 14,
        color: colors.gray[600],
        flex: 1,
    },
    highlightedLabel: {
        fontWeight: '600',
        color: colors.primary[700],
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.slate[900],
        textAlign: 'right',
    },
    highlightedValue: {
        color: colors.primary[700],
        fontWeight: '700',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
        paddingHorizontal: 16,
    },
    editButton: {
        flex: 1,
        backgroundColor: colors.blue[600],
        borderRadius: 8,
    },
    deleteButton: {
        flex: 1,
        backgroundColor: colors.red[600],
        borderRadius: 8,
    },
    buttonText: {
        color: colors.white,
        fontWeight: '600',
    },
})