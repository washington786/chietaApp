import { StyleSheet, Text, View } from 'react-native'
import React, { FC, memo, useMemo } from 'react'
import { moderateScale, scale, verticalScale } from '@/utils/responsive';
import { Feather } from '@expo/vector-icons'
import colors from '@/config/colors'
import appFonts from '@/config/fonts'

interface RSelectedProps {
    label?: string
    value?: string | number | null | undefined
    placeholder?: string
    helperText?: string
}

const RSelected: FC<RSelectedProps> = ({
    label = 'Selected Option',
    value,
    placeholder = 'No option selected',
    helperText = 'Selection locked',
}) => {
    const { displayValue, isPlaceholder } = useMemo(() => {
        const normalized = value === null || value === undefined
            ? ''
            : typeof value === 'string'
                ? value
                : String(value)

        const trimmed = normalized.trim()

        return {
            displayValue: trimmed.length > 0 ? normalized : placeholder,
            isPlaceholder: trimmed.length === 0,
        }
    }, [placeholder, value])

    return (
        <View style={styles.wrapper} pointerEvents="none">
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.selectBox}>
                <Text
                    style={[styles.value, isPlaceholder && styles.placeholder]}
                    numberOfLines={1}
                >
                    {displayValue}
                </Text>
                <Feather name="chevron-down" size={18} color={colors.slate[300]} />
            </View>
            {helperText && <Text style={styles.helper}>{helperText}</Text>}
        </View>
    )
}

export default memo(RSelected)

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    label: {
        fontSize: moderateScale(12),
        color: colors.gray[400],
        marginBottom: verticalScale(6),
        fontFamily: `${appFonts.medium}`,
    },
    selectBox: {
        borderRadius: scale(8),
        borderWidth: 1,
        borderColor: colors.zinc[200],
        backgroundColor: colors.zinc[100],
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(14),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    value: {
        flex: 1,
        fontSize: moderateScale(16),
        color: colors.gray[400],
        fontFamily: `${appFonts.semiBold}`,
        marginRight: scale(12),
    },
    placeholder: {
        color: colors.slate[300],
        fontFamily: `${appFonts.medium}`,
    },
    helper: {
        marginTop: verticalScale(6),
        fontSize: moderateScale(11),
        color: colors.slate[300],
        fontFamily: `${appFonts.medium}`,
    },
})