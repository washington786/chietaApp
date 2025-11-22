import { StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { RCol, RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import Feather from '@expo/vector-icons/Feather';

interface props {
    isVerified?: boolean;
}

const ItemOrgs: FC<props> = ({ isVerified = true }) => {
    return (
        <RCol style={styles.con}>
            <Text variant='titleLarge' style={styles.itemText}>Retlhonolofetse Trading projects</Text>
            <Text variant='labelLarge' style={[styles.regTxt, styles.txt]}>2018/330478/07</Text>
            <RRow style={styles.row}>
                <Feather name={isVerified ? "check-square" : "x-square"} size={16} color={isVerified ? colors.green[600] : colors.red[600]} />
                <Text variant='labelMedium' style={[styles.regTxt, { color: isVerified ? colors.green[600] : colors.red[600] }]}>{isVerified ? "verified" : "unverified"}</Text>
            </RRow>
        </RCol>
    )
}

export default ItemOrgs

const styles = StyleSheet.create({
    con: {
        backgroundColor: colors.slate[100], flex: 1, borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 4,
        marginBottom: 6,
        gap: 4,
        borderWidth: 1,
        borderColor: colors.slate[200]
    },
    itemText: {
        color: colors.slate[600],
        fontSize: 18
    },
    regTxt: {
        fontSize: 14
    },
    txt: {
        color: colors.gray[400],
        fontSize: 12,
        fontWeight: "thin"
    },
    row: {
        alignItems: "center",
        gap: 4,
        marginVertical: 4
    }
})