import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import { RCol, REmpty, RListLoading, SafeArea, RText } from '@/components/common';
import RHeader from '@/components/common/RHeader';
import { Searchbar, Snackbar } from 'react-native-paper';
import colors from '@/config/colors';
import { AddDgApplicationItem } from '@/components/modules/application';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { activeWindow, DiscretionaryProjectDto } from '@/core/models/DiscretionaryDto';
import { showToast } from '@/core';
import { fetchDiscretionaryGrantData } from '@/store/slice/thunks/DiscretionaryThunks';
import { linkProjectToOrganization } from '@/store/slice/DiscretionarySlice';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { useGetActiveWindowsParamsQuery } from '@/store/api/api';

const AddNewDgApplicationPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const [snackbar, setSnackbar] = useState<{ visible: boolean; lastLinkedId: number | null }>({
        visible: false,
        lastLinkedId: null,
    });

    const { onBack } = usePageTransition();

    // Fetch active discretionary windows
    const { data: windowsData, isLoading: windowsLoading, error } = useGetActiveWindowsParamsQuery(undefined);

    // Get active windows filtered by search query
    const activeWindows = useMemo(() => {
        const items = windowsData?.result?.items || [];
        return items.filter((w: activeWindow) => {
            // Only show active windows
            if (!w.activeYN) return false;
            // If no search query, show all active windows
            if (!searchQuery) return true;
            // Filter by search query matching any field
            const query = searchQuery.toLowerCase();
            const titleMatch = w.title?.toLowerCase().includes(query) ?? false;
            const focusMatch = w.focusArea?.toLowerCase().includes(query) ?? false;
            const projMatch = w.projType?.toLowerCase().includes(query) ?? false;
            return titleMatch || focusMatch || projMatch;
        });
    }, [windowsData, searchQuery]);


    const dispatch = useDispatch<AppDispatch>();

    const handleLinkingProject = (id: number) => {
        dispatch(linkProjectToOrganization(id));
        setSnackbar({ visible: true, lastLinkedId: id });
        setTimeout(() => {
            onBack();
        }, 2000);
    };

    const handleUndo = () => {
        if (snackbar.lastLinkedId !== null) {
            dispatch(linkProjectToOrganization(snackbar.lastLinkedId));
            setSnackbar({ visible: false, lastLinkedId: null });
        }
    };


    useEffect(() => {
        dispatch(fetchDiscretionaryGrantData())
    }, [dispatch])

    if (error) {
        showToast({ message: "Failed to fetch active windows", title: "Error Fetching", type: "error", position: "top" });
    }

    const renderList = ({ index, item }: { index: number, item: activeWindow }) => {
        return (
            <Animated.View key={`app-${item.id}}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
                <AddDgApplicationItem onPress={() => handleLinkingProject(item.id)} item={item} />
            </Animated.View>
        )
    }

    if (windowsLoading) {
        return (
            <SafeArea>
                <RListLoading count={7} />
            </SafeArea>
        )
    } else {
        return (
            <SafeArea>
                <RHeader name='Add Dg Application' hasRightIcon onPressRight={() => setShowSearch(!showSearch)} iconRight='search' />
                {
                    showSearch && (

                        <RCol style={styles.col}>
                            <Searchbar
                                placeholder="Search application"
                                onChangeText={setSearchQuery}
                                value={searchQuery}
                                style={styles.searchBar}
                            />
                        </RCol>
                    )
                }
                <FlatList data={activeWindows}
                    style={{ paddingHorizontal: 12, paddingVertical: 16, flexGrow: 1, flex: 1, marginTop: 2 }}
                    renderItem={renderList}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                    removeClippedSubviews={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={21}
                    ListEmptyComponent={<REmpty title='No Applications Found' subtitle={`Applications available in the cycle will appear here.`} />}
                />
                <Snackbar
                    visible={snackbar.visible}
                    style={{ marginBottom: 20 }}
                    onDismiss={() => setSnackbar({ visible: false, lastLinkedId: null })}
                    action={{ label: 'Undo', onPress: handleUndo }}>
                    Application added successfully to your organization profile.
                </Snackbar>
            </SafeArea>
        )
    }
}

export default AddNewDgApplicationPage

const styles = StyleSheet.create({
    col: {
        paddingVertical: 6,
        paddingHorizontal: 12
    },
    searchBar: {
        backgroundColor: colors.zinc[100],
        borderWidth: 0.5,
        borderColor: colors.zinc[300]
    },
    windowInfo: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: colors.slate[50],
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[200]
    },
    windowBadge: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.slate[100],
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.slate[300]
    },
    windowBadgeActive: {
        backgroundColor: colors.blue[600],
        borderColor: colors.blue[700]
    }
})