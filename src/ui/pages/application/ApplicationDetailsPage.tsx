import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import TopNav from '@/navigation/TopNav'
import { RouteProp, useRoute } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'

type ApplicationParams = {
    type: string;
    appId: string;
    orgId: string;
};

const ApplicationDetailsPage = () => {
    const route = useRoute<RouteProp<navigationTypes>>();
    const { type } = route.params as ApplicationParams;

    return (
        <SafeArea>
            <RHeader name={'Applications Details'} />
            <TopNav type={type} />
        </SafeArea>
    )
}

export default ApplicationDetailsPage

const styles = StyleSheet.create({})