import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useCallback } from 'react'
import { Button, IconButton } from 'react-native-paper'
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet'
import colors from '@/config/colors'
import { RCol, RRow, SafeArea } from '@/components/common'

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

    const handleView = useCallback(() => {
        const totalContinuing = data.noContinuing;
        const totalNew = data.noNew;
        const totalLearners = totalContinuing + totalNew;
        const totalCost = totalLearners * data.costPerLearner;

        openBottomSheet(
            <SafeArea>
                <ScrollView
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    contentContainerStyle={{ paddingBottom: 80, marginBottom: 80 }}
                    showsVerticalScrollIndicator={true}
                >
                    <View style={styles.bottomSheetHeader}>
                        <Text style={styles.bottomSheetTitle}>Application Details</Text>
                    </View>
                    <View style={styles.detailSection}>
                        <Text style={styles.sectionTitle}>Programme Information</Text>
                        <DetailRow label="Programme Type" value={data.programType} />
                        <DetailRow label="Learning Programme" value={data.learningProgramme} />
                        <DetailRow label="Sub Category" value={data.subCategory} />
                        <DetailRow label="Intervention" value={data.intervention} />
                    </View>

                    <View style={styles.detailSection}>
                        <Text style={styles.sectionTitle}>Learner Distribution</Text>
                        <DetailRow label="Continuing Students" value={data.noContinuing.toString()} />
                        <DetailRow label="New Students" value={data.noNew.toString()} />
                        <DetailRow label="Total Learners" value={totalLearners.toString()} highlighted />
                        <DetailRow label="Female" value={data.noFemale.toString()} />
                        <DetailRow label="Historically Disadvantaged" value={data.noHistoricallyDisadvantaged.toString()} />
                        <DetailRow label="Youth" value={data.noYouth.toString()} />
                        <DetailRow label="Disabled" value={data.noDisabled.toString()} />
                        <DetailRow label="Rural" value={data.noRural.toString()} />
                    </View>

                    <View style={styles.detailSection}>
                        <Text style={styles.sectionTitle}>Costs & Location</Text>
                        <DetailRow label="Cost Per Learner" value={`R ${data.costPerLearner}`} />
                        <DetailRow label="Total Cost" value={`R ${totalCost}`} highlighted />
                        <DetailRow label="Province" value={data.province} />
                        <DetailRow label="District" value={data.district} />
                        <DetailRow label="Municipality" value={data.municipality} />
                    </View>
                    <Button mode='text' onPress={closeBottomSheet}>close</Button>
                    <View style={{ height: 120 }} />
                </ScrollView>
            </SafeArea>,
            { snapPoints: ['80%'] }
        );
    }, [data, onEdit, onDelete, openBottomSheet]);

    return (
        <RCol style={{ gap: 2, backgroundColor: colors.zinc[100], paddingVertical: 8, paddingHorizontal: 4, width: 250, borderRadius: 8, marginHorizontal: 8 }}>
            <RCol>
                <Text style={styles.programType} numberOfLines={1}>{data.programType}</Text>
                <Text style={styles.learningProgramme} numberOfLines={1}>{data.learningProgramme}</Text>
                <Text style={styles.intervention} numberOfLines={1}>{data.intervention}</Text>
            </RCol>
            <RRow style={{ alignItems: 'center', gap: 12 }}>
                <Text style={styles.stat}>{data.noContinuing + data.noNew} learners</Text>
                <Text style={styles.stat}>R{data.costPerLearner}/learner</Text>
            </RRow>

            <RRow style={{ alignItems: 'center', justifyContent: "flex-end" }}>
                <IconButton
                    icon="eye"
                    size={24}
                    iconColor={colors.primary[500]}
                    onPress={handleView}
                    style={styles.iconButton}
                />
                {onEdit && (
                    <IconButton
                        icon="pencil"
                        size={24}
                        iconColor={colors.slate[500]}
                        onPress={() => onEdit(data)}
                        style={styles.iconButton}
                    />
                )}
                {onDelete && (
                    <IconButton
                        icon="trash-can"
                        size={24}
                        iconColor={colors.red[600]}
                        onPress={() => onDelete(data.id)}
                        style={styles.iconButton}
                    />
                )}
            </RRow>

        </RCol>
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
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, highlighted && styles.highlightedValue]}>{value}</Text>
    </View>
);

export default DgApplicationEntryItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200],
        backgroundColor: colors.slate[50],
    },
    content: {
        flex: 1,
        marginRight: 8,
    },
    textContainer: {
        marginBottom: 6,
    },
    programType: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.slate[900],
        marginBottom: 2,
    },
    learningProgramme: {
        fontSize: 12,
        color: colors.gray[500],
        marginBottom: 2,
    },
    intervention: {
        fontSize: 11,
        color: colors.gray[400],
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    stat: {
        fontSize: 11,
        color: colors.primary[500],
        fontWeight: '500',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 0,
    },
    iconButton: {
        margin: 0,
    },
    bottomSheetContent: {
        padding: 16,
        paddingBottom: 32,
        flexGrow: 1,
    },
    bottomSheetHeader: {
        marginBottom: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200],
    },
    bottomSheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.slate[900],
    },
    detailSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.slate[900],
        marginBottom: 10,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200],
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.gray[200],
    },
    highlightedRow: {
        backgroundColor: colors.blue[50],
        paddingHorizontal: 8,
        marginHorizontal: -8,
        paddingVertical: 10,
    },
    label: {
        fontSize: 13,
        color: colors.gray[600],
        flex: 1,
    },
    value: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.slate[900],
    },
    highlightedValue: {
        color: colors.primary[600],
        fontWeight: '600',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: colors.gray[200],
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButton: {
        backgroundColor: colors.yellow[500],
    },
    deleteButton: {
        backgroundColor: colors.red[600],
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.slate[50],
    },
})