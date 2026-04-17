import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { moderateScale, scale } from '@/utils/responsive'
import colors from '@/config/colors'
import { RCol, RDivider, RRow } from '@/components/common';
import { Text } from 'react-native-paper';

import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { MandatoryApplicationDto } from '@/core/models/MandatoryDto';
import { getMandatoryStatus } from '@/core/utils/mandatoryStatus';

interface props {
    onPress: (id?: number) => void;
    item?: MandatoryApplicationDto;
}
const AddMgApplicationItem: FC<props> = ({ onPress, item }) => {
    const { description, referenceNo, dteCreated, grantStatusId } = item as MandatoryApplicationDto;
    const fmDate = new Date(dteCreated).toLocaleDateString('en-za', { year: "numeric", month: "numeric", day: "numeric", minute: "numeric", hour: "numeric" });

    const title = description.split('-')[0];

    let status = getMandatoryStatus(grantStatusId ?? 0);

    return (
        <RCol style={styles.con}>
            <RRow style={styles.title}>
                <MaterialCommunityIcons name="application-outline" size={moderateScale(18)} color="black" />
                <Text>{description}</Text>
            </RRow>
            <RDivider />
            <RRow style={styles.wrap}>
                <Text variant='labelSmall' style={[styles.text]}>Reference No</Text>
                <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>{referenceNo}</Text>
            </RRow>
            <RRow style={styles.wrap}>
                <Text variant='labelSmall' style={[styles.text]}>Intervention</Text>
                <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>{title}</Text>
            </RRow>
            <RRow style={styles.wrap}>
                <Text variant='labelSmall' style={[styles.text]}>Date Created</Text>
                <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>{fmDate}</Text>
            </RRow>
            <TouchableOpacity style={styles.abBtn} onPress={() => onPress(item?.id)}>
                <Feather name={"plus"} size={moderateScale(20)} color={colors.slate[50]} />
            </TouchableOpacity>
        </RCol>
    )
}

export default AddMgApplicationItem

const styles = StyleSheet.create({
    con: {
        backgroundColor: colors.slate[100], flex: 1, borderRadius: scale(10),
        paddingVertical: scale(6),
        paddingHorizontal: scale(4),
        marginBottom: scale(6),
        gap: scale(4),
        borderWidth: 1,
        borderColor: colors.slate[200],
        position: "relative",
        marginTop: scale(10),
    },
    itemText: {
        color: colors.slate[600],
        fontSize: moderateScale(18),
    },
    regTxt: {
        fontSize: moderateScale(14),
    },
    txt: {
        color: colors.gray[400],
        fontSize: moderateScale(12),
        fontWeight: "thin",
    },
    row: {
        alignItems: "center",
        gap: scale(4),
        marginVertical: scale(4),
    },
    abBtn: {
        position: "absolute", top: scale(-15), right: scale(-6), backgroundColor: colors.violet[900], padding: scale(10), borderRadius: scale(100),
    },
    trdeName: {
        fontSize: moderateScale(11),
    },
    title: {
        alignItems: "center",
        gap: scale(4),
    },
    text: {
        textTransform: "capitalize",
    },
    wrap: {
        alignItems: "center",
        justifyContent: "space-between",
    },
    appTitle: {
        fontSize: moderateScale(12),
    },
    statusTxt: {
        backgroundColor: colors.emerald[100],
        borderRadius: scale(5),
        padding: scale(4),
    }
})