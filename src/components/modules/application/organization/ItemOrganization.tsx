import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import colors from '@/config/colors'
import { RCol, RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import Feather from '@expo/vector-icons/Feather';
import { OrganisationDto } from '@/core/models/organizationDto'

interface props {
    onPress?: () => void;
    item?: OrganisationDto
}
const ItemOrganization: FC<props> = ({ onPress, item }) => {
    const { organisationName, organisationRegistrationNumber, status, organisationTradingName } = item || {};
    const isActive = status?.toLocaleLowerCase() === "active";

    return (
        <RCol style={styles.con}>
            <Text variant='titleLarge' style={styles.itemText}>{organisationTradingName}</Text>
            <Text variant='titleLarge' style={[styles.itemText, styles.trdeName]}>{organisationName}</Text>
            <Text variant='labelLarge' style={[styles.regTxt, styles.txt]}>#{organisationRegistrationNumber}</Text>
            <RRow style={styles.row}>
                <Feather name={isActive ? "check-circle" : "x-circle"} size={16} color={isActive ? colors.green[600] : colors.red[600]} />
                <Text variant='labelMedium' style={[styles.regTxt, { color: isActive ? colors.green[600] : colors.red[600] }]}>{isActive ? "active" : "inactive"}</Text>
            </RRow>
            <TouchableOpacity style={styles.abBtn} onPress={onPress}>
                <Feather name={"plus"} size={20} color={colors.slate[50]} />
            </TouchableOpacity>
        </RCol>
    )
}

export default ItemOrganization

const styles = StyleSheet.create({
    con: {
        backgroundColor: colors.slate[100],
        flex: 1,
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 4,
        marginBottom: 6,
        gap: 4,
        borderWidth: 1,
        borderColor: colors.slate[200],
        position: "relative"
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
    },
    abBtn: {
        position: "absolute", top: 6, right: 6, backgroundColor: colors.violet[900], padding: 10, borderRadius: 100
    },
    trdeName: {
        fontSize: 11,
    }
})