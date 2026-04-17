import colors from "@/config/colors";
import { StyleSheet } from "react-native";
import { moderateScale, scale } from "@/utils/responsive";

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
    filterTabsContainer: {
        flexDirection: 'row',
        paddingVertical: 8,
        backgroundColor: colors.white,
        gap: 8,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.slate[100],
        borderWidth: 1,
        borderColor: colors.slate[200],
    },
    filterTabActive: {
        backgroundColor: colors.primary[600],
        borderColor: colors.primary[600],
    },
    filterTabText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.slate[700],
    },
    filterTabTextActive: {
        color: colors.white,
    },
    orgFilterContainer: {
        backgroundColor: colors.white,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[200],
    },
    orgListContent: {
        paddingHorizontal: 12,
        gap: 8,
    },
    orgChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: colors.slate[100],
        borderWidth: 1,
        borderColor: colors.slate[200],
        flexDirection: 'row',
        alignItems: 'center',
    },
    orgChipSelected: {
        backgroundColor: colors.primary[600],
        borderColor: colors.primary[600],
    },
    orgChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.slate[700],
    },
    orgChipTextSelected: {
        color: colors.white,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: scale(14),
        shadowColor: colors.slate[900],
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
        gap: 12,
    },
    projectTitle: {
        fontSize: moderateScale(15),
        fontWeight: '700',
        color: colors.slate[900],
    },
    projectSubtitle: {
        fontSize: moderateScale(12),
        color: colors.slate[600],
        marginTop: 3,
        fontWeight: '500',
    },
    stageBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        minWidth: 100,
        alignItems: 'center',
    },
    stageBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    progressIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12,
        gap: 3,
    },
    progressDot: {
        width: scale(26),
        height: scale(26),
        borderRadius: scale(13),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.slate[200],
        borderWidth: 2,
        borderColor: colors.slate[300],
    },
    progressDotCompleted: {
        backgroundColor: colors.primary[600],
        borderColor: colors.primary[600],
    },
    progressDotActive: {
        backgroundColor: colors.white,
        borderColor: colors.primary[600],
        borderWidth: 2,
    },
    progressDotActivePulse: {
        width: scale(9),
        height: scale(9),
        borderRadius: scale(5),
        backgroundColor: colors.primary[600],
    },
    progressDotPending: {
        backgroundColor: colors.slate[200],
        borderColor: colors.slate[300],
    },
    progressLine: {
        height: 2,
        width: scale(14),
        backgroundColor: colors.slate[300],
    },
    progressLineCompleted: {
        backgroundColor: colors.primary[600],
    },
    statusSection: {
        borderTopWidth: 1,
        borderTopColor: colors.slate[200],
        paddingTop: 12,
        gap: 4,
    },
    statusLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.slate[500],
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    statusValue: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.slate[900],
    },
    statusDate: {
        fontSize: 11,
        color: colors.slate[400],
        fontWeight: '500',
        fontStyle: 'italic',
    },
    // Legacy styles for backward compatibility
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
    // Organization Bottom Sheet Styles
    organizationBottomSheet: {
        padding: 16,
        backgroundColor: colors.white,
        gap: 16,
        position: "relative"
    },
    orgBottomSheetTitle: {
        color: colors.slate[900],
        fontWeight: '700',
        fontSize: moderateScale(22),
    },
    orgSearchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.slate[100],
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: colors.slate[200],
    },
    orgSearchInput: {
        flex: 1,
        fontSize: 14,
        color: colors.slate[700],
        fontWeight: '500',
    },
    orgItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.slate[50],
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: colors.slate[200],
    },
    orgItemSelected: {
        backgroundColor: colors.primary[50],
        borderColor: colors.primary[600],
        borderWidth: 2,
    },
    orgItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    orgItemIcon: {
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    orgItemIconSelected: {
        backgroundColor: colors.primary[600],
    },
    orgItemInfo: {
        flex: 1,
        gap: 2,
    },
    orgItemName: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.slate[900],
    },
    orgItemSdl: {
        fontSize: 12,
        color: colors.primary[600],
        fontWeight: '600',
    },
    orgItemCheckmark: {
        marginLeft: 8,
    },
    // Context bar (org pill + result count)
    contextBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingTop: 6,
        paddingBottom: 8,
        backgroundColor: colors.slate[50],
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[100],
    },
    orgPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: colors.primary[50],
        borderWidth: 1,
        borderColor: colors.primary[200],
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        maxWidth: '68%' as any,
    },
    orgPillText: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: colors.primary[700],
        flexShrink: 1,
    },
    resultCountText: {
        fontSize: 12,
        color: colors.slate[400],
        fontWeight: '500' as const,
    },
    // Enhanced filter scroll
    filterScrollView: {
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[100],
    },
    filterScrollContent: {
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 10,
        gap: 8,
        flexDirection: 'row' as const,
    },
    filterTabBadge: {
        backgroundColor: colors.slate[300],
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 1,
        minWidth: 22,
        alignItems: 'center' as const,
    },
    filterTabBadgeActive: {
        backgroundColor: 'rgba(255,255,255,0.25)',
    },
    filterTabBadgeText: {
        fontSize: 10,
        fontWeight: '700' as const,
        color: colors.slate[600],
    },
    filterTabBadgeTextActive: {
        color: colors.white,
    },
    // Search bar wrapper
    searchWrapper: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[100],
    },
    searchBar: {
        backgroundColor: colors.zinc[50],
        borderWidth: 1,
        borderColor: colors.zinc[200],
        elevation: 0,
    },
    // Org initials inside orgItemIcon
    orgItemInitials: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: colors.primary[600],
    },
    orgItemInitialsSelected: {
        color: colors.white,
    },
    // Grant type segmented toggle (Disc. / Mand.)
    grantTypeToggle: {
        flexDirection: 'row' as const,
        backgroundColor: colors.slate[100],
        borderRadius: 16,
        padding: 2,
        borderWidth: 1,
        borderColor: colors.slate[200],
    },
    grantTypePill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 14,
    },
    grantTypePillActive: {
        backgroundColor: colors.primary[600],
    },
    grantTypePillText: {
        fontSize: 11,
        fontWeight: '700' as const,
        color: colors.slate[500],
    },
    grantTypePillTextActive: {
        color: colors.white,
    },
})
