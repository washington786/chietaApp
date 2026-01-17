import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { RCol, REmpty, RListLoading, SafeArea } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import { AppTrackingItem } from '@/components/modules/application'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { showToast } from '@/core'
import { fetchDiscretionaryProjectsAsync } from '@/store/slice/ProjectSlice'
import { DiscretionaryGrantApplication } from '@/core/models/DiscretionaryDto'

const HistoryScreen = () => {
    const { historyItemDetails } = usePageTransition();

    const { error, filteredItems, loading } = useSelector((state: RootState) => state.discretionaryProjects);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchDiscretionaryProjectsAsync());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            showToast({ message: error, type: "error", title: "Error", position: "top" });
        }
    }, [error]);

    const renderList = ({ index, item }: { index: number, item: DiscretionaryGrantApplication }) => {
        return (
            <View key={`proj-${item.id}`}>
                <AppTrackingItem onPress={() => historyItemDetails({ appId: item.id, item: item })} item={item} />
            </View>
        )
    }

    if (loading) {
        return <RListLoading count={7} />
    } else {
        return (
            <SafeArea>
                <FlatList data={filteredItems}
                    keyExtractor={(item) => `${item.id}`}
                    style={{ paddingHorizontal: 12, paddingVertical: 5, flex: 1, flexGrow: 1 }}
                    renderItem={renderList}
                    ListHeaderComponent={<RCol style={styles.conWrap}>
                        <Text variant='titleMedium' style={styles.textColor}>application tracking status</Text>
                    </RCol>}
                    stickyHeaderIndices={[0]}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                    removeClippedSubviews={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={21}
                    ListEmptyComponent={<REmpty title='No Applications Available' icon='rotate-ccw' subtitle={`You currently do not have any applications for tracking status. Please create an application.`} />}
                />
            </SafeArea>
        )
    }

}

export default HistoryScreen

const styles = StyleSheet.create({
    conWrap: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 8,
        backgroundColor: colors.slate[50],
    },
    textColor: {
        color: colors.slate[900],
        textTransform: "capitalize",
    }
})