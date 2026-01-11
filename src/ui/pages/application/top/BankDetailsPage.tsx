import { FlatList, StyleSheet, View } from 'react-native'
import React from 'react'
import { InformationBanner } from '@/components/modules/application'
import { FileWrapper } from '@/components/modules/application/grants/FileWrapper';
import { showToast } from '@/core';
import { REmpty, RListLoading } from '@/components/common';
import { useRoute } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MandatoryGrantPaymentDto } from '@/core/models/MandatoryDto';
import { getMonth } from '@/core/utils/dayTime';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { useGetMandatoryGrantPaymentsQuery, useGetOrgApplicationsQuery } from '@/store/api/api';

interface PageTypes {
    appId: string,
    orgId: string,
    type: string
}

const BankDetailsPage = () => {
    const { pdfViewer } = usePageTransition();
    const { appId, orgId, type } = useRoute().params as PageTypes;

    // Fetch applications to get the one with matching appId to extract SDL
    const { data: applicationsData } = useGetOrgApplicationsQuery(orgId, { skip: !orgId });
    const application = applicationsData?.items?.find((app: any) => app.id == appId);
    const sdl = application?.organisationSDL || '';

    const { data, isLoading: loading, error } = useGetMandatoryGrantPaymentsQuery(sdl, { skip: !sdl });

    console.log("sdl: ", sdl);
    console.log("payments: ", data?.items);


    const payments = data?.items || [];

    const renderList = ({ index, item }: { index: number, item: MandatoryGrantPaymentDto }) => {
        const filename = `${getMonth(item.month)}-${item.grantYear}`
        return (
            <Animated.View key={`pay-${index}-${item.sdlCode}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
                <FileWrapper fileName={filename} onPress={() => pdfViewer({ payment: item })} />
            </Animated.View>
        )
    }
    if (error) {
        let errorMessage: string = 'Failed to load payments';
        if (error && typeof error === 'object' && 'data' in error && error.data) {
            errorMessage = JSON.stringify(error.data);
        } else if (error && typeof error === 'object' && 'message' in error && error.message) {
            errorMessage = error.message as string;
        }
        showToast({ title: "Error Fetching", message: errorMessage, type: "error", position: "top" });
    }

    if (loading) {
        return <RListLoading count={7} />
    }

    if (type === "dg-app") {
        return (
            <REmpty title='No Payments Found' subtitle={`Discretionary Grant Applications do not have payment statements`} icon='credit-card' />
        )
    }

    return (
        <FlatList data={payments}
            style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
            keyExtractor={(item, index) => `${index}-${item.sdlCode}-${item.grantYear}-${item.month}`}
            renderItem={renderList}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
            removeClippedSubviews={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={21}
            ListEmptyComponent={<REmpty title='No Payments Found' subtitle={`when you have payments, they'll appear here`} icon='credit-card' />}
            ListHeaderComponent={<InformationBanner title='Please select pdf statements you want to download.' />}
        />
    )
}

export default BankDetailsPage

const styles = StyleSheet.create({})