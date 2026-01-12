import * as React from 'react';
import { DataTable, Text, IconButton } from 'react-native-paper';
import { StyleSheet, View, ScrollView } from 'react-native';
import colors from '@/config/colors';
import { RButton } from '@/components/common';
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet';

interface DgApplicationRow {
    id: string;
    programType: string;
    learningProgramme: string;
    subCategory: string | null;
    intervention: string;
    costPerLearner: number;
    noContinuing: number;
    noNew: number;
    totalLearners?: number;
    totalCost?: number;
}

interface DgTableProps {
    data: DgApplicationRow[];
    onEdit?: (row: DgApplicationRow) => void;
    onDelete?: (rowId: string) => void;
    isLoading?: boolean;
}

const DgTable: React.FC<DgTableProps> = ({ data, onEdit, onDelete, isLoading = false }) => {
    const [page, setPage] = React.useState<number>(0);
    const [numberOfItemsPerPageList] = React.useState([3, 5, 10]);
    const [itemsPerPage, onItemsPerPageChange] = React.useState(
        numberOfItemsPerPageList[0]
    );
    const { open: openBottomSheet, close: closeBottomSheet } = useGlobalBottomSheet();

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, data.length);

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    const handleViewDetails = (row: DgApplicationRow) => {
        const bottomSheetContent = (
            <ScrollView style={styles.bottomSheetContent}>
                <View style={styles.bottomSheetHeader}>
                    <Text style={styles.bottomSheetTitle}>Application Details</Text>
                </View>

                <View style={styles.detailsContainer}>
                    <DetailRow label="Program Type" value={row.programType} />
                    <DetailRow label="Learning Programme" value={row.learningProgramme} />
                    <DetailRow label="Subcategory" value={row.subCategory || 'N/A'} />
                    <DetailRow label="Intervention" value={row.intervention} />
                    <DetailRow label="Cost per Learner" value={`R${row.costPerLearner.toFixed(2)}`} />
                    <DetailRow label="No. Continuing" value={row.noContinuing.toString()} />
                    <DetailRow label="No. New" value={row.noNew.toString()} />
                    <DetailRow label="Total Learners" value={getTotalLearners(row).toString()} highlight />
                    <DetailRow label="Total Cost" value={`R${getTotalCost(row)}`} highlight />
                </View>

                <View style={styles.bottomSheetActions}>
                    {onEdit && (
                        <RButton
                            onPressButton={() => {
                                closeBottomSheet();
                                onEdit(row);
                            }}
                            title='Edit'
                            styleBtn={styles.editBtn}
                        />
                    )}
                    {onDelete && (
                        <RButton
                            onPressButton={() => {
                                closeBottomSheet();
                                onDelete(row.id);
                            }}
                            title='Delete'
                            styleBtn={styles.deleteBtn}
                        />
                    )}
                </View>
            </ScrollView>
        );

        openBottomSheet(bottomSheetContent, { snapPoints: ['60%', '90%'] });
    };

    const getTotalLearners = (row: DgApplicationRow) => {
        return row.noContinuing + row.noNew;
    };

    const getTotalCost = (row: DgApplicationRow) => {
        const total = getTotalLearners(row) * row.costPerLearner;
        return total.toFixed(2);
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading applications...</Text>
            </View>
        );
    }

    if (data.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>No applications added yet</Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView horizontal style={styles.tableScrollContainer}>
                <View style={styles.tableContainer}>
                    <DataTable style={styles.table}>
                        <DataTable.Header style={styles.header}>
                            <DataTable.Title style={styles.col12}>Program Type</DataTable.Title>
                            <DataTable.Title style={styles.col12}>Learning Programme</DataTable.Title>
                            <DataTable.Title style={styles.col10}>Subcategory</DataTable.Title>
                            <DataTable.Title style={styles.col12}>Intervention</DataTable.Title>
                            <DataTable.Title style={styles.col8} numeric>Cost/Learner</DataTable.Title>
                            <DataTable.Title style={styles.col8} numeric>Continuing</DataTable.Title>
                            <DataTable.Title style={styles.col8} numeric>New</DataTable.Title>
                            <DataTable.Title style={styles.col8} numeric>Total</DataTable.Title>
                            <DataTable.Title style={styles.col10} numeric>Total Cost</DataTable.Title>
                            <DataTable.Title style={styles.col12}>Actions</DataTable.Title>
                        </DataTable.Header>

                        {data.slice(from, to).map((row) => (
                            <DataTable.Row key={row.id} style={styles.row}>
                                <DataTable.Cell style={styles.col12}>
                                    <Text style={styles.cellText} numberOfLines={1}>
                                        {row.programType}
                                    </Text>
                                </DataTable.Cell>

                                <DataTable.Cell style={styles.col12}>
                                    <Text style={styles.cellText} numberOfLines={1}>
                                        {row.learningProgramme}
                                    </Text>
                                </DataTable.Cell>

                                <DataTable.Cell style={styles.col10}>
                                    <Text style={styles.cellText} numberOfLines={1}>
                                        {row.subCategory || '-'}
                                    </Text>
                                </DataTable.Cell>

                                <DataTable.Cell style={styles.col12}>
                                    <Text style={styles.cellText} numberOfLines={1}>
                                        {row.intervention}
                                    </Text>
                                </DataTable.Cell>

                                <DataTable.Cell style={styles.col8} numeric>
                                    <Text style={styles.cellText}>
                                        {row.costPerLearner}
                                    </Text>
                                </DataTable.Cell>

                                <DataTable.Cell style={styles.col8} numeric>
                                    <Text style={styles.cellText}>
                                        {row.noContinuing}
                                    </Text>
                                </DataTable.Cell>

                                <DataTable.Cell style={styles.col8} numeric>
                                    <Text style={styles.cellText}>
                                        {row.noNew}
                                    </Text>
                                </DataTable.Cell>

                                <DataTable.Cell style={styles.col8} numeric>
                                    <Text style={[styles.cellText, styles.boldText]}>
                                        {getTotalLearners(row)}
                                    </Text>
                                </DataTable.Cell>

                                <DataTable.Cell style={styles.col10} numeric>
                                    <Text style={[styles.cellText, styles.boldText]}>
                                        {getTotalCost(row)}
                                    </Text>
                                </DataTable.Cell>

                                <DataTable.Cell style={styles.col12}>
                                    <View style={styles.actionsContainer}>
                                        <IconButton
                                            icon="information"
                                            size={16}
                                            onPress={() => handleViewDetails(row)}
                                            style={styles.iconBtn}
                                        />
                                        {onEdit && (
                                            <IconButton
                                                icon="pencil"
                                                size={16}
                                                onPress={() => onEdit(row)}
                                                style={styles.iconBtn}
                                            />
                                        )}
                                        {onDelete && (
                                            <IconButton
                                                icon="trash-can"
                                                size={16}
                                                iconColor="#EF4444"
                                                onPress={() => onDelete(row.id)}
                                                style={styles.iconBtn}
                                            />
                                        )}
                                    </View>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                </View>
            </ScrollView>

            <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(data.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} of ${data.length}`}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={itemsPerPage}
                onItemsPerPageChange={onItemsPerPageChange}
                showFastPaginationControls
                selectPageDropdownLabel={'Rows per page'}
                style={styles.pagination}
            />


        </>
    );
};

interface DetailRowProps {
    label: string;
    value: string;
    highlight?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, highlight = false }) => (
    <View style={[styles.detailRow, highlight && styles.detailRowHighlight]}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, highlight && styles.detailValueBold]}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    tableScrollContainer: {
        marginVertical: 12,
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.slate[200],
    },
    tableContainer: {
        minWidth: '100%',
    },
    table: {
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: colors.primary[50],
        borderBottomWidth: 2,
        borderBottomColor: colors.primary[200],
    },
    row: {
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[100],
        minHeight: 60,
        paddingVertical: 8,
    },
    col12: {
        width: 120,
        paddingHorizontal: 8,
    },
    col10: {
        width: 100,
        paddingHorizontal: 6,
    },
    col8: {
        width: 80,
        paddingHorizontal: 6,
    },
    cellText: {
        fontSize: 12,
        color: colors.slate[700],
    },
    boldText: {
        fontWeight: '600',
        color: colors.primary[900],
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBtn: {
        margin: 0,
        padding: 4,
    },
    pagination: {
        borderTopWidth: 1,
        borderTopColor: colors.slate[200],
        paddingVertical: 8,
        backgroundColor: colors.slate[50],
    },
    container: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        marginVertical: 12,
    },
    loadingText: {
        fontSize: 14,
        color: colors.slate[600],
    },
    emptyText: {
        fontSize: 14,
        color: colors.slate[600],
        fontWeight: '500',
    },
    bottomSheet: {
        paddingHorizontal: 0,
    },
    bottomSheetContent: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingBottom: 24,
        maxHeight: '80%',
    },
    bottomSheetHeader: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[200],
        marginBottom: 16,
    },
    bottomSheetTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.primary[950],
    },
    detailsContainer: {
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[100],
    },
    detailRowHighlight: {
        backgroundColor: colors.primary[50],
        paddingHorizontal: 12,
        borderRadius: 4,
        marginVertical: 4,
        borderBottomWidth: 0,
    },
    detailLabel: {
        fontSize: 13,
        color: colors.slate[600],
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 13,
        color: colors.primary[950],
        fontWeight: '500',
    },
    detailValueBold: {
        fontWeight: '700',
        color: colors.primary[900],
    },
    bottomSheetActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    editBtn: {
        backgroundColor: colors.primary[900],
        flex: 1,
    },
    deleteBtn: {
        backgroundColor: '#EF4444',
        flex: 1,
    },
});

export default DgTable;
