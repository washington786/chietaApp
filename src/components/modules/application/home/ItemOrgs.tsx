import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { RCol, RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import Feather from '@expo/vector-icons/Feather';
import { OrganisationDto } from '@/core/models/organizationDto'

interface props {
    onPress?: () => void;
    isLinkingRequired?: boolean;
    onNewLinking?: () => void;
    org?: OrganisationDto
}

const ItemOrgs: FC<props> = ({ onPress, isLinkingRequired = false, onNewLinking, org }) => {

    function handlePress() {
        if (isLinkingRequired) {
            onNewLinking?.();
        } else {
            onPress?.();
        }
    }

    const isVerified = org?.status ? "verified" : "unverified";

    return (
        <TouchableOpacity onPress={handlePress}>
            <RCol style={styles.con}>

                {
                    isLinkingRequired && <RCol style={styles.new}>
                        <Text variant='bodySmall' style={styles.color}>new</Text>
                    </RCol>
                }

                <Text variant='titleLarge' style={styles.itemText}>{org?.organisationName}</Text>
                <Text variant='labelLarge' style={[styles.regTxt, styles.txt]}>#{org?.organisationRegistrationNumber}</Text>

                <RRow style={styles.row}>
                    <Feather name={isVerified ? "check-square" : "x-square"} size={16} color={isVerified ? colors.green[600] : colors.red[600]} />
                    <Text variant='labelMedium' style={[styles.regTxt, { color: isVerified ? colors.green[600] : colors.red[600] }]}>{isVerified ? "verified" : "unverified"}</Text>
                </RRow>

            </RCol>
        </TouchableOpacity>
    )
}

export default ItemOrgs

const styles = StyleSheet.create({
    con: {
        backgroundColor: colors.zinc[100], flex: 1, borderRadius: 10,
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
    },
    new: {
        backgroundColor: colors.yellow[600],
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        marginVertical: 2,
        marginHorizontal: 2,
        borderRadius: 100
    },
    color: {
        color: colors.slate[50],
    }
})