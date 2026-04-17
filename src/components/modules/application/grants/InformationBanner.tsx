import { StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { moderateScale, scale } from '@/utils/responsive'
import { RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '@/config/colors';

interface props {
    title?: string
}
const InformationBanner: FC<props> = ({ title }) => {
    return (
        <RRow style={styles.con}>
            <Ionicons name="alert-circle-outline" size={moderateScale(24)} color="black" />
            <Text variant='bodySmall' style={styles.txt} numberOfLines={2}>{title}</Text>
        </RRow>
    )
}

export default InformationBanner

const styles = StyleSheet.create({
    con: {
        paddingHorizontal: scale(12), backgroundColor: colors.secondary[200], borderRadius: scale(8), marginBottom: scale(12),
        alignItems: "center", gap: scale(4),
        overflow: "hidden",
        paddingVertical: scale(8),
    },
    txt: {
        fontSize: moderateScale(10),
        color: colors.gray[700],
        marginHorizontal: scale(1),
        width: "96%",
    }
})