import { StyleSheet } from 'react-native'
import React from 'react'
import RHeader from '@/components/common/RHeader'
import { RCol, RRow, Scroller } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ProgressTracker } from '@/components/modules/application'
import { Step } from '@/core/types/steps'
import Ionicons from '@expo/vector-icons/Ionicons';

const steps: Step[] = [
    {
        title: 'Application Submitted',
        date: '18/11/2025',
        status: 'completed' as const,
    },
    {
        title: 'RSA Review completed',
        date: '12/12/2025',
        status: 'completed' as const,
    },
    {
        title: 'GAC & GEC Review',
        date: '12/12/2025',
        status: 'pending' as const,
    },
];

const ApplicationStatusDetails = () => {
    return (
        <>
            <RHeader name='Track Application' />
            <Scroller style={styles.container}>
                <Text variant='labelLarge'>Application Details</Text>
                <RCol style={styles.wrapper}>
                    <Text variant='titleSmall' style={styles.orgTitle}>Retlhonolofetse Trading Projects</Text>
                    <Text variant='bodySmall' style={styles.orgTitle}>2018/330478/07</Text>
                    <RRow style={[styles.rowtFlex, styles.center, styles.gap, styles.row]}>
                        <Feather name="rotate-cw" size={18} color="black" />
                        <Text variant='labelMedium'>Discretionary Grant 2025</Text>
                    </RRow>
                    <RRow style={[styles.rowtFlex, styles.center, styles.gap, styles.row]}>
                        <Feather name="calendar" size={18} color="black" />
                        <Text variant='labelMedium'>18/11/2025 12:00 PM</Text>
                    </RRow>
                </RCol>
                <RRow style={styles.messageBox}>
                    <MaterialIcons name="celebration" size={24} color="black" />
                    <Text variant='bodySmall'>congrats, you have completed your discretionary grant application. view status below</Text>
                </RRow>
                <Text variant='labelLarge'>Application Status</Text>
                <RCol style={styles.statusBox}>
                    <ProgressTracker steps={steps} />
                </RCol>
                <RRow style={[styles.messageBox, { width: "100%" }]}>
                    <Ionicons name="chatbox-outline" size={24} color="black" />
                    <Text variant='bodySmall' style={{ width: "90%" }}>we are sorry, your application has been rejected by the committee due to insufficient supporting documents. Be on the look for next open window.</Text>
                </RRow>
            </Scroller>
        </>
    )
}

export default ApplicationStatusDetails

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
    },
    wrapper: {
        backgroundColor: colors.primary[50],
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 10,
        marginVertical: 10
    },
    orgTitle: {
        textTransform: "capitalize"
    },
    rowtFlex: {
        flex: 1
    },
    center: {
        alignItems: "center"
    },
    gap: {
        gap: 8
    },
    row: {
        marginTop: 5,
        paddingVertical: 4
    },
    messageBox: {
        backgroundColor: colors.slate[100],
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 10,
        marginVertical: 10,
        alignItems: "center",
        gap: 4,
        overflow: "hidden"
    },
    statusBox: {
        backgroundColor: colors.slate[100],
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 10,
        marginVertical: 10,
    },
})