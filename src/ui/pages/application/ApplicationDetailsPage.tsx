import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import TopNav from '@/navigation/TopNav'

const ApplicationDetailsPage = () => {
    return (
        <SafeArea>
            <RHeader name='Applications Details' />
            <TopNav />
        </SafeArea>
    )
}

export default ApplicationDetailsPage

const styles = StyleSheet.create({})