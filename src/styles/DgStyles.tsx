import colors from "@/config/colors";
import { StyleSheet } from "react-native";

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
        width: 40,
        height: 40,
        borderRadius: 20,
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
        fontSize: 16,
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
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: colors.slate[200],
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 70
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