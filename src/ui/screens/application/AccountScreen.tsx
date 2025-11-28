import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { RCol, RDivider, RRow, SafeArea, Scroller } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import Ionicons from '@expo/vector-icons/Ionicons';

const AccountScreen = () => {
    return (
        <SafeArea>
            <RCol style={styles.conWrap}>
                <Text variant='titleLarge' style={styles.textColor}>Account Management</Text>
            </RCol>

            <Scroller style={{ marginTop: 20, paddingHorizontal: 12 }}>
                <RCol style={{ borderRadius: 10, backgroundColor: colors.primary[50] }}>
                    <Text variant='titleSmall' style={{ paddingVertical: 5 }}>Profile Section</Text>
                    <RDivider />
                    <AccWrapper icon='person-sharp' title='Account settings' />
                    <AccWrapper icon='lock-closed-sharp' title='Privacy' />
                    <AccWrapper icon='help-circle-sharp' title='Support' />
                </RCol>
                <RCol style={{ marginVertical: 10 }}>
                    <Text variant='titleSmall'>Application Section</Text>
                    <RDivider />
                    <AccWrapper icon='exit-outline' title='sign out' />
                    <AccWrapper icon='remove-circle-sharp' title='deactivate account' />
                </RCol>
            </Scroller>

        </SafeArea>
    )
}

interface props {
    title?: string;
    icon: 'person-sharp' | 'help-circle-sharp' | 'lock-closed-sharp' | 'exit-outline' | 'remove-circle-sharp'
}

function AccWrapper({ icon, title }: props) {
    return (
        <TouchableOpacity>
            <RRow style={styles.wrap}>
                <RRow style={styles.rw}>
                    <Ionicons name={icon} size={24} color="black" />
                    <Text variant='titleMedium' style={{ textTransform: "capitalize" }}>{title}</Text>
                </RRow>
                <Ionicons name="chevron-forward" size={24} color="black" />
            </RRow>
        </TouchableOpacity>
    )
}

export default AccountScreen

const styles = StyleSheet.create({
    conWrap: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12

    },
    textColor: {
        color: colors.primary[900]
    },

    //
    wrap: {
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 16
    },
    rw: {
        alignItems: "center",
        gap: 5,
        flex: 1,
        paddingVertical: 2
    }
})