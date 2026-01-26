import colors from "@/config/colors";
import { StyleSheet } from "react-native";

export const history_styles = StyleSheet.create({
    conWrap: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 8,
        backgroundColor: colors.slate[50],
    },
    textColor: {
        color: colors.slate[900],
        textTransform: "capitalize",
    },
    orgFilterContainer: {
        backgroundColor: colors.zinc[100],
        paddingVertical: 10,
    },
    orgListContent: {
        paddingHorizontal: 18,
        gap: 8,
    },
    orgChip: {
        paddingHorizontal: 30,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.slate[100],
        borderWidth: 1,
        borderColor: colors.slate[200],
    },
    orgChipSelected: {
        backgroundColor: colors.primary[700],
        borderColor: colors.primary[600],
    },
    orgChipText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.slate[700],
    },
    orgChipTextSelected: {
        color: colors.white,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 12,
        marginVertical: 6,
        shadowColor: colors.slate[900],
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
        gap: 8,
    },
    projectName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: colors.slate[900],
    },
    stageBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    stageBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 10,
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: colors.slate[500],
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.slate[800],
    },
    checklistRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
        gap: 8,
    },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginRight: 8,
    },
    checkCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 12,
    },
    checkLabel: {
        fontSize: 11,
        color: colors.slate[700],
    },
    dateRow: {
        borderTopWidth: 1,
        borderTopColor: colors.slate[200],
        paddingTop: 8,
    },
    dateLabel: {
        fontSize: 11,
        color: colors.slate[500],
        fontStyle: 'italic',
    },
})