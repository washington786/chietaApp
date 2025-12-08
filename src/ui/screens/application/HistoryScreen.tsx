import { FlatList, StyleSheet, View } from 'react-native'
import React from 'react'
import { RCol, REmpty, SafeArea } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import { AppTrackingItem } from '@/components/modules/application'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import Animated, { FadeInDown } from 'react-native-reanimated'

const HistoryScreen = () => {
    const { historyItemDetails } = usePageTransition();

    const renderList = ({ index, item }: { index: number, item: any }) => {
        return (
            <Animated.View key={`tracking-${item}-${Date.now()}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
                <AppTrackingItem onPress={() => historyItemDetails({ appId: index.toString() })} />
            </Animated.View>
        )
    }
    return (
        <SafeArea>
            <FlatList data={[1, 2, 3, 4, 5]}
                keyExtractor={(item) => item.toString()}
                style={{ paddingHorizontal: 12, paddingVertical: 5, flex: 1, flexGrow: 1 }}
                renderItem={renderList}
                ListHeaderComponent={<RCol style={styles.conWrap}>
                    <Text variant='titleMedium' style={styles.textColor}>application tracking status</Text>
                </RCol>}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                removeClippedSubviews={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={21}
                ListEmptyComponent={REmpty}
            />
        </SafeArea>
    )
}

export default HistoryScreen

const styles = StyleSheet.create({
    conWrap: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 2

    },
    textColor: {
        color: colors.slate[900],
        textTransform: "capitalize",
    }
})