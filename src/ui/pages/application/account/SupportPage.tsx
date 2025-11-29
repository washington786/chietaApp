import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RHeader from '@/components/common/RHeader'
import { Scroller } from '@/components/common'

const SupportPage = () => {
    return (
        <>
            <RHeader name='Support' />
            <Scroller>
                <Text>AccountSettingsPage</Text>
            </Scroller>
        </>
    )
}

export default SupportPage

const styles = StyleSheet.create({})