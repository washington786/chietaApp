import { StyleSheet } from 'react-native'
import colors from '@/config/colors'


export const PickerStyle = StyleSheet.create({
    pickerContainer: {
        borderWidth: 1,
        borderColor: colors.slate[200],
        borderRadius: 6,
        marginBottom: 16,
        overflow: 'hidden',
        minHeight: 60,
    },
    btn: {
        minHeight: 45,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 8
    },
    outline: {
        borderColor: colors.primary[500]
    }
})