import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RCol, REmpty, RListLoading, SafeArea } from '@/components/common';
import RHeader from '@/components/common/RHeader';
import { Searchbar, Snackbar } from 'react-native-paper';
import colors from '@/config/colors';
import { AddDgApplicationItem } from '@/components/modules/application';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { DiscretionaryProjectDto } from '@/core/models/DiscretionaryDto';
import { showToast } from '@/core';
import { fetchDiscretionaryGrantData } from '@/store/slice/thunks/DiscretionaryThunks';
import { linkProjectToOrganization } from '@/store/slice/DiscretionarySlice';
import usePageTransition from '@/hooks/navigation/usePageTransition';

const AddNewDgApplicationPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const [showSearch, setShowSearch] = useState(false);

    const [snackbar, setSnackbar] = useState<{ visible: boolean; lastLinkedId: number | null }>({
        visible: false,
        lastLinkedId: null,
    });

    const { onBack } = usePageTransition();
    const { applications, error, loading } = useSelector((state: RootState) => state.discretionaryGrant);

    const filteredApplications = applications.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.organisationName.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        showToast({ message: error, title: "Error Fetching", type: "error", position: "top" });
    }

    const renderList = ({ index, item }: { index: number, item: DiscretionaryProjectDto }) => {
        return (
            <Animated.View key={`app-${item.id}}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
                <AddDgApplicationItem onPress={() => handleLinkingProject(item.id)} item={item} />
            </Animated.View>
        )
    }

    if (loading) {
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
                <FlatList data={filteredApplications}
                    style={{ paddingHorizontal: 12, paddingVertical: 6, flexGrow: 1, flex: 1 }}
                    renderItem={renderList}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                    removeClippedSubviews={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={21}
                    ListEmptyComponent={<REmpty title='No Applications Found' subtitle={`Applications available inthe cycle will appear here.`} />}
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
        backgroundColor: colors.slate[100]
    }
})