import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { REmpty, RListLoading, SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { ApplicationItem, InformationBanner } from '@/components/modules/application'
import { FAB } from 'react-native-paper'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import colors from '@/config/colors'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { showToast } from '@/core'
import { MandatoryApplicationDto } from '@/core/models/MandatoryDto'
import { RouteProp, useRoute } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'
import { useGetOrgApplicationsQuery } from '@/store/api/api'

const MandatoryPage = () => {
    const { newApplication } = usePageTransition();
    const [allApplications, setAllApplications] = useState<MandatoryApplicationDto[]>([]);

    const router = useRoute<RouteProp<navigationTypes, "mandatory">>();

    const { orgId } = router.params;

    const { data, isLoading: loading, error } = useGetOrgApplicationsQuery(orgId || '', { skip: !orgId });

    useEffect(() => {
        if (error && orgId) {
            let errorMessage = 'Failed to load applications';
            if (error && typeof error === 'object' && 'data' in error && error.data) {
                errorMessage = JSON.stringify(error.data);
            } else if (error && typeof error === 'object' && 'message' in error && error.message) {
                errorMessage = error.message as string;
            }
            if (errorMessage && errorMessage !== 'null') {
                showToast({ message: errorMessage, title: "Error Fetching", type: "error", position: "top" });
            }
        }
    }, [error, orgId]);

    useEffect(() => {
        if (data?.items) {
            setAllApplications(data.items);
        }
    }, [data]);

    const renderList = ({ index, item }: { index: number, item: MandatoryApplicationDto }) => {
        return (
            <Animated.View key={`app-${item.id}}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
                <ApplicationItem item={item} />
            </Animated.View>
        )
    }

    if (loading) {
        return <RListLoading count={7} />
    } else {
        return (
            <SafeArea>
                <RHeader name='Mandatory Grant Applications' />
                <FlatList data={allApplications}
                    style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
                    renderItem={renderList}
                    ListHeaderComponent={<InformationBanner title='view your applications and apply for new grants. You can only submit during open grant window.' />}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                    removeClippedSubviews={false}
                    ListEmptyComponent={<REmpty title='No Applications Found' subtitle={`when you have applications, they'll appear here`} />}
                />
                <FAB
                    mode='flat'
                    icon="plus"
                    style={styles.fab}
                    onPress={newApplication}
                    color='white'
                />
            </SafeArea>
        )
    }

}

export default MandatoryPage

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        borderRadius: 100,
        backgroundColor: colors.primary[900]
    },
})