import { StyleSheet } from 'react-native'
import React, { FC } from 'react'
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
            <Ionicons name="alert-circle-outline" size={24} color="black" />
            <Text variant='bodySmall' style={styles.txt} numberOfLines={2}>{title}</Text>
        </RRow>
    )
}

export default InformationBanner

const styles = StyleSheet.create({
    con: {
        paddingHorizontal: 12, backgroundColor: colors.yellow[100], borderRadius: 8, marginBottom: 12,
        alignItems: "center", gap: 4,
        overflow: "hidden",
        paddingVertical: 8
    },
    txt: {
        fontSize: 10,
        color: colors.gray[700],
        marginHorizontal: 1
    }
})