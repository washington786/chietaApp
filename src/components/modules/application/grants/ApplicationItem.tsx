import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { RCol, RDivider, RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import colors from '@/config/colors';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { MandatoryApplicationDto } from '@/core/models/MandatoryDto';
import { getMandatoryStatus } from '@/core/utils/mandatoryStatus';

interface props {
    item?: MandatoryApplicationDto;
}
const ApplicationItem: FC<props> = ({ item }) => {
    const { applicationDetails } = usePageTransition();
    const { description, referenceNo, submissionDte, grantStatusId } = item as MandatoryApplicationDto;
    const fmDate = new Date(submissionDte).toLocaleDateString('en-za', { year: "numeric", month: "numeric", day: "numeric", minute: "numeric", hour: "numeric" });
    const title = description.split('-')[0];

    let status = getMandatoryStatus(grantStatusId);

    return (
        <TouchableOpacity onPress={() => applicationDetails({ appId: String(item?.id), orgId: String(item?.organisationId), type: "mg-app" })}>
            <RCol style={styles.con}>
                <RRow style={styles.title}>
                    <MaterialCommunityIcons name="application-outline" size={18} color="black" />
                    <Text>{description}</Text>
                </RRow>
                <RDivider />
                <RRow style={styles.wrap}>
                    <Text variant='labelSmall' style={[styles.text]}>Reference</Text>
                    <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>{referenceNo}</Text>
                </RRow>
                <RRow style={styles.wrap}>
                    <Text variant='labelSmall' style={[styles.text]}>Title</Text>
                    <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>{title}</Text>
                </RRow>
                <RRow style={styles.wrap}>
                    <Text variant='labelSmall' style={[styles.text]}> status</Text>
                    <Text variant='titleMedium' style={[styles.text, styles.appTitle, styles.statusTxt]}>{status}</Text>
                </RRow>
                <RRow style={styles.wrap}>
                    <Text variant='labelSmall' style={[styles.text]}>Date submitted</Text>
                    <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>{fmDate}</Text>
                </RRow>
            </RCol>
        </TouchableOpacity>
    )
}

export default ApplicationItem

const styles = StyleSheet.create({
    con: { paddingHorizontal: 8, paddingVertical: 12, backgroundColor: colors.slate[50], borderRadius: 5, marginBottom: 12, borderColor: colors.slate[200], borderWidth: 1 },
    title: {
        alignItems: "center",
        gap: 4
    },
    text: {
        textTransform: "capitalize"
    },
    wrap: {
        alignItems: "center",
        justifyContent: "space-between"
    },
    appTitle: {
        fontSize: 12
    },
    statusTxt: {
        backgroundColor: colors.emerald[100],
        borderRadius: 5,
        padding: 4
    }
})