import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { REmpty, RListLoading, SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { ApplicationItem, InformationBanner } from '@/components/modules/application'
import { FAB } from 'react-native-paper'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import colors from '@/config/colors'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { showToast } from '@/core'
import { fetchMandatoryGrantData } from '@/store/slice/thunks/MandatoryThunks'
import { MandatoryApplicationDto } from '@/core/models/MandatoryDto'

const MandatoryPage = () => {
    const { newApplication } = usePageTransition();

    const { applications, loading, error } = useSelector((state: RootState) => state.mandatoryGrant);

    console.log(applications);


    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchMandatoryGrantData())
    }, [dispatch])

    if (error) {
        showToast({ message: error, title: "Error Fetching", type: "error", position: "top" });
    }

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
                <FlatList data={applications}
                    style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
                    renderItem={renderList}
                    ListHeaderComponent={<InformationBanner title='view your applications and apply for new grants. You can only submit during open grant window.' />}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                    removeClippedSubviews={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={21}
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