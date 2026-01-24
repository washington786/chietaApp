import { StyleSheet, View, FlatList, Dimensions, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import { RCol, RListLoading, RRow } from '@/components/common'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { DiscretionaryWindow } from '@/core/models/DiscretionaryDto'
import { useGetActiveWindowsQuery } from '@/store/api/api'
import { showToast } from '@/core'
import ActiveWindowDetails from './ActiveWindowDetails'
import ActiveWindowRenderItem from './ActiveWindowRenderItem'

const CARD_WIDTH = Dimensions.get('window').width * 0.7;
const SPACING = 16;

const DgActiveWindow = () => {
    const { data: apiData, isLoading, error } = useGetActiveWindowsQuery(undefined);
    const [selectedWindow, setSelectedWindow] = useState<DiscretionaryWindow | null>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const flatListRef = useRef<FlatList>(null)

    const discretionaryWindowsUnsorted: DiscretionaryWindow[] = apiData?.result?.items?.map((item: any) => item.discretionaryWindow) || []
    const discretionaryWindows = [...discretionaryWindowsUnsorted].sort((a, b) => b.id - a.id)

    useEffect(() => {
        if (error) {
            showToast({
                message: 'Failed to load active windows',
                type: 'error',
                title: 'Error',
                position: 'top',
            })
        }
    }, [error]);

    return (
        <View style={styles.container}>
            {isLoading ? (
                <RListLoading count={1} />
            ) : discretionaryWindows.length > 0 ? (
                <View style={{ backgroundColor: colors.white }}>
                    <FlatList
                        ref={flatListRef}
                        data={discretionaryWindows}
                        renderItem={({ item }) => <ActiveWindowRenderItem item={item} onPress={() => setSelectedWindow(item)} />}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={CARD_WIDTH + SPACING}
                        snapToAlignment="start"
                        decelerationRate="fast"
                        scrollEventThrottle={16}
                        contentContainerStyle={styles.carousel}
                        pagingEnabled={true}
                        onMomentumScrollEnd={(event) => {
                            const contentOffsetX = event.nativeEvent.contentOffset.x;
                            const index = Math.round(contentOffsetX / (CARD_WIDTH + SPACING));
                            setCurrentIndex(index);
                        }}
                    />
                    {/* Pagination Dots */}
                    <RRow style={styles.pagination}>
                        {discretionaryWindows.map((_, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dot,
                                    {
                                        backgroundColor: index === currentIndex ? colors.primary[900] : colors.zinc[300],
                                        width: index === currentIndex ? 32 : 8,
                                    }
                                ]}
                                onPress={() => {
                                    setCurrentIndex(index);
                                    flatListRef.current?.scrollToIndex({ index, animated: true });
                                }}
                            />
                        ))}
                    </RRow>
                </View>
            ) : (
                <RCol style={styles.emptyState}>
                    <MaterialIcons name='inbox' size={64} color={colors.zinc[300]} />
                    <Text variant='bodyLarge' style={styles.emptyText}>No discretionary windows available</Text>
                    <Text variant='bodySmall' style={styles.emptySubText}>Check back later for new opportunities</Text>
                </RCol>
            )}

            {/* Details Modal */}
            <Modal
                visible={!!selectedWindow}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setSelectedWindow(null)}
                presentationStyle="fullScreen"
            >
                {selectedWindow && (
                    <ActiveWindowDetails
                        window={selectedWindow}
                        onClose={() => setSelectedWindow(null)}
                    />
                )}
            </Modal>
        </View>
    )
}

export default DgActiveWindow;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        marginBottom: 8,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.zinc[100],
    },
    headerTitle: {
        fontWeight: '700',
        color: colors.zinc[800],
    },
    headerSubtitle: {
        fontWeight: '400',
        color: colors.zinc[500],
        marginTop: 1,
    },
    carousel: {
        paddingHorizontal: 20,
        paddingVertical: 2,
        gap: SPACING,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 48,
        paddingHorizontal: 20,
    },
    emptyText: {
        color: colors.zinc[700],
        fontWeight: '600',
        textAlign: 'center',
    },
    emptySubText: {
        color: colors.zinc[500],
        textAlign: 'center',
    },
    pagination: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 16,
        backgroundColor: colors.white,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
});