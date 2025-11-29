import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Scroller } from '@/components/common'
import RHeader from '@/components/common/RHeader'

const AccountSettingsPage = () => {
    return (
        <>
            <RHeader name='Account Settings' />
            <Scroller>
                <Text>AccountSettingsPage</Text>
            </Scroller>
        </>
    )
}

export default AccountSettingsPage

const styles = StyleSheet.create({})