import { FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { RCol, SafeArea } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import { AppTrackingItem } from '@/components/modules/application'
import usePageTransition from '@/hooks/navigation/usePageTransition'

const HistoryScreen = () => {
    const { historyItemDetails } = usePageTransition();
    return (
        <SafeArea>
            <FlatList data={[]}
                style={{ paddingHorizontal: 12, paddingVertical: 5, flex: 1, flexGrow: 1 }}
                renderItem={null}
                ListHeaderComponent={<RCol style={styles.conWrap}>
                    <Text variant='titleMedium' style={styles.textColor}>application tracking status</Text>
                </RCol>}
                ListFooterComponent={() => {
                    return (
                        <>
                            <AppTrackingItem onPress={() => historyItemDetails({ appId: "2" })} />
                            <AppTrackingItem onPress={() => historyItemDetails({ appId: "2" })} />
                            <AppTrackingItem onPress={() => historyItemDetails({ appId: "2" })} />
                            <AppTrackingItem onPress={() => historyItemDetails({ appId: "2" })} />
                        </>
                    )
                }}
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