import { StyleSheet } from 'react-native'
import colors from '@/config/colors'
import { moderateScale, scale, verticalScale } from '@/utils/responsive'


export const PickerStyle = StyleSheet.create({
    pickerContainer: {
        borderWidth: 1,
        borderColor: colors.slate[200],
        borderRadius: 6,
        marginBottom: scale(14),
        overflow: 'hidden',
        minHeight: verticalScale(54),
    },
    btn: {
        minHeight: verticalScale(42),
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: scale(6)
    },
    outline: {
        borderColor: colors.primary[500]
    }
})