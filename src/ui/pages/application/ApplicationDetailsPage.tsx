import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import TopNav from '@/navigation/TopNav'
import { RouteProp, useRoute } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

type ApplicationParams = {
    type: string;
    appId: string;
    orgId: string;
};

const ApplicationDetailsPage = () => {
    const route = useRoute<RouteProp<navigationTypes, 'applicationDetails'>>();
    const { type, appId, orgId } = route.params as ApplicationParams;
    const { selectedApplication } = useSelector((state: RootState) => state.mandatoryGrant);

    const normalizedAppId = Number(appId);
    const selectedItem = type === 'mg-app' && !Number.isNaN(normalizedAppId) && selectedApplication?.id === normalizedAppId
        ? selectedApplication
        : undefined;

    return (
        <SafeArea>
            <RHeader name={'Applications Details'} />
            <TopNav type={type} appId={appId} orgId={orgId} item={selectedItem} />
        </SafeArea>
    )
}

export default ApplicationDetailsPage

const styles = StyleSheet.create({})