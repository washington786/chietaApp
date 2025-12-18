import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { InformationBanner } from '@/components/modules/application'
import { FileWrapper } from '@/components/modules/application/grants/FileWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { showToast } from '@/core';
import { REmpty, RListLoading } from '@/components/common';
import { fetchMandatoryGrantData } from '@/store/slice/thunks/MandatoryThunks';
import { useRoute } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MandatoryGrantPaymentDto } from '@/core/models/MandatoryDto';
import { getMonth } from '@/core/utils/dayTime';
import usePageTransition from '@/hooks/navigation/usePageTransition';

interface PageTypes {
    appId: string,
    orgId: string
}

const BankDetailsPage = () => {
    const { pdfViewer } = usePageTransition();
    const { appId } = useRoute().params as PageTypes;
    const { payments, error, loading } = useSelector((state: RootState) => state.mandatoryGrant);

    console.log(payments);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchMandatoryGrantData());
    }, [dispatch]);

    const renderList = ({ index, item }: { index: number, item: MandatoryGrantPaymentDto }) => {
        const year = new Date().getFullYear();
        const filename = `${getMonth(item.month)}-${year}`
        return (
            <Animated.View key={`pay-${item.id}}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
                <FileWrapper fileName={filename} onPress={() => pdfViewer({ payment: item })} />
            </Animated.View>
        )
    }
    if (error) {
        showToast({ title: "Error Fetching", message: error, type: "error", position: "top" });
    }

    if (loading) {
        return <RListLoading count={7} />
    }

    return (
        <FlatList data={payments}
            style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
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