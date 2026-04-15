import colors from "@/config/colors";
import { StyleSheet } from "react-native";

export const UpcomingStyles = StyleSheet.create({
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },

    // Toggle
    toggleContainer: {
        marginVertical: 14,
    },
    toggleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 8,
        paddingHorizontal: 2,
    },
    toggleHeaderText: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.primary[500],
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    toggle: {
        flexDirection: 'row',
        gap: 10,
    },
    togglePill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 4,
        paddingHorizontal: 14,
        borderRadius: 14,
        backgroundColor: colors.primary[50],
        borderWidth: 1.5,
        borderColor: colors.primary[100],
        overflow: 'hidden',
    },
    togglePillActive: {
        backgroundColor: colors.primary[800],
        borderColor: colors.primary[700],
        shadowColor: colors.primary[900],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    togglePillGlow: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary[600],
        opacity: 0.25,
    },
    toggleIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: colors.primary[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleIconWrapActive: {
        backgroundColor: colors.primary[600],
    },
    toggleTextBlock: {
        flex: 1,
    },
    togglePillText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.primary[700],
        marginBottom: 1,
    },
    togglePillTextActive: {
        color: '#fff',
    },
    togglePillSub: {
        fontSize: 10,
        fontWeight: '500',
        color: colors.primary[400],
    },
    togglePillSubActive: {
        color: colors.primary[200],
    },
    toggleActiveDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: colors.primary[300],
    },

    // Card
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.primary[100],
        shadowColor: colors.primary[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    progBadge: {
        backgroundColor: colors.primary[50],
        borderWidth: 1,
        borderColor: colors.primary[200],
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    progBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.primary[700],
        letterSpacing: 0.5,
    },
    daysChip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    daysChipText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#fff',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary[900],
        marginBottom: 6,
        lineHeight: 22,
    },
    refRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 6,
    },
    refText: {
        fontSize: 12,
        color: colors.primary[500],
        fontWeight: '500',
    },
    cardDesc: {
        fontSize: 13,
        color: '#6b7280',
        lineHeight: 19,
        marginBottom: 4,
    },
    divider: {
        height: 1,
        backgroundColor: colors.primary[50],
        marginVertical: 12,
    },
    datesRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateBlock: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
    },
    dateTexts: {
        flex: 1,
    },
    dateLbl: {
        fontSize: 10,
        color: '#9ca3af',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        marginBottom: 2,
    },
    dateVal: {
        fontSize: 12,
        color: colors.primary[800],
        fontWeight: '600',
    },
    dateSep: {
        width: 1,
        height: 32,
        backgroundColor: colors.primary[100],
        marginHorizontal: 12,
    },

    // Misc
    separator: {
        height: 10,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fef2f2',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        marginBottom: 4,
        borderRadius: 8,
    },
    errorText: {
        fontSize: 13,
        color: '#dc2626',
    },
    retryText: {
        fontSize: 13,
        color: colors.primary[600],
        fontWeight: '700',
    },
})