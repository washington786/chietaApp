import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { REmpty, RListLoading, SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { FAB } from 'react-native-paper'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { DgApplicationItem, InformationBanner } from '@/components/modules/application'
import colors from '@/config/colors'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchDiscretionaryGrantData } from '@/store/slice/thunks/DiscretionaryThunks'
import { showToast } from '@/core'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { DiscretionaryProjectDto } from '@/core/models/DiscretionaryDto'

const DiscretionaryPage = () => {
    const { newDgApplication } = usePageTransition();
    const { applications, loading, error } = useSelector((state: RootState) => state.discretionaryGrant);

    const linked = applications.filter((p) => p.isLinked);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchDiscretionaryGrantData())
    }, [dispatch])

    if (error) {
        showToast({ message: error, title: "Error Fetching", type: "error", position: "top" });
    }

    const renderList = ({ index, item }: { index: number, item: DiscretionaryProjectDto }) => {
        return (
            <Animated.View key={`app-${item.id}}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
                <DgApplicationItem item={item} />
            </Animated.View>
        )
    }

    if (loading) {
        return <RListLoading count={7} />
    } else {
        return (
            <SafeArea>
                <RHeader name='Discretionary Grant Applications' />
                <FlatList
                    data={linked}
                    style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
                    renderItem={renderList}
                    ListHeaderComponent={< InformationBanner title='list of Discretionary grants applied for.You can only submit during open grant window.' />}
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
                    onPress={newDgApplication}
                    color='white'
                />
            </SafeArea>
        )
    }

}

export default DiscretionaryPage

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        borderRadius: 100,
        backgroundColor: colors.primary[900],
    },
})