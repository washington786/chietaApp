import colors from "@/config/colors";
import { StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "@/utils/responsive";

export const dg_styles = StyleSheet.create({
    con: { paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1, backgroundColor: "white", position: 'relative' },
    title: {
        fontSize: 16,
        color: colors.primary[950],
        marginVertical: 10
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: colors.slate[200],
        borderRadius: 6,
        marginBottom: 16,
        overflow: 'hidden',
        minHeight: 60,
    },
    btn: {
        backgroundColor: colors.primary[900],
        marginTop: 10,
        flex: 1,
        marginHorizontal: 6
    },
    btnSecondary: {
        backgroundColor: colors.primary[500],
        marginTop: 10,
        marginBottom: 12
    },
    btnDisabled: {
        opacity: 0.5
    },
    boxStyle: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.slate[200],
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    dropdown: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.slate[200],
        borderRadius: 6
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        paddingHorizontal: 12
    },
    stepCircle: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(19),
        backgroundColor: colors.slate[100],
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.slate[200]
    },
    stepCircleActive: {
        backgroundColor: colors.primary[900],
        borderColor: colors.primary[900]
    },
    stepNumber: {
        fontSize: moderateScale(15),
        fontWeight: '600',
        color: colors.slate[600]
    },
    stepNumberActive: {
        color: 'white'
    },
    stepLine: {
        height: 2,
        flex: 1,
        backgroundColor: colors.slate[200],
        marginHorizontal: 8
    },
    stepLineActive: {
        backgroundColor: colors.primary[900]
    },
    stepLineCompleted: {
        backgroundColor: colors.green[600]
    },
    stepCircleCompleted: {
        backgroundColor: colors.green[600],
        borderColor: colors.green[600]
    },
    downloadBtn: {
        backgroundColor: colors.primary[700],
        borderRadius: 12,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 12,
        shadowColor: colors.primary[950],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    downloadBtnDisabled: {
        backgroundColor: colors.primary[400],
        shadowOpacity: 0,
        elevation: 0,
    },
    downloadBtnTextGroup: {
        flexDirection: 'column' as const,
    },
    downloadBtnText: {
        color: 'white',
        fontSize: moderateScale(13),
        fontWeight: '700' as const,
        letterSpacing: 0.4,
    },
    downloadBtnSubText: {
        color: colors.primary[200],
        fontSize: moderateScale(10),
        marginTop: 2,
    },
    stepLabelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        paddingHorizontal: 12
    },
    stepLabel: {
        fontSize: 12,
        color: colors.slate[600],
        textAlign: 'center',
        flex: 1
    },
    stepLabelActive: {
        color: colors.primary[900],
        fontWeight: '600'
    },
    warningBox: {
        backgroundColor: '#FEF3C7',
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
        padding: 12,
        borderRadius: 4,
        marginBottom: 16
    },
    warningText: {
        color: '#92400E',
        fontSize: 14,
        fontWeight: '500'
    },
    formSection: {
        marginVertical: 12
    },
    buttonContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.slate[50],
        paddingHorizontal: scale(12),
        paddingVertical: scale(10),
        borderTopWidth: 1,
        borderTopColor: colors.slate[200],
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: verticalScale(64),
    },
    stepText: {
        color: colors.slate[700],
        marginHorizontal: 12,
        fontWeight: '600'
    },
    saveBtn: {
        backgroundColor: colors.primary[800],
        marginTop: 12,
        marginBottom: 12
    }
})