import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RHeader from '@/components/common/RHeader'
import { Scroller } from '@/components/common'

const PrivacyPage = () => {
    return (
        <>
            <RHeader name='Privacy' />
            <Scroller>
                <Text>AccountSettingsPage</Text>
            </Scroller>
        </>
    )
}

export default PrivacyPage

const styles = StyleSheet.create({})