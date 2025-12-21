import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RCol, REmpty, RListLoading, SafeArea } from '@/components/common';
import RHeader from '@/components/common/RHeader';
import { Searchbar, Snackbar } from 'react-native-paper';
import colors from '@/config/colors';
import { AddMgApplicationItem } from '@/components/modules/application';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { linkMgApplication } from '@/store/slice/MandatorySlice';
import { fetchMandatoryGrantData } from '@/store/slice/thunks/MandatoryThunks';
import { showToast } from '@/core';
import { MandatoryApplicationDto } from '@/core/models/MandatoryDto';
import Animated, { FadeInDown } from 'react-native-reanimated';

const AddNewApplicationPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [snackbar, setSnackbar] = useState<{ visible: boolean; lastLinkedId: number | null }>({
        visible: false,
        lastLinkedId: null,
    });

    const { onBack } = usePageTransition();
    const { applications, error, loading } = useSelector((state: RootState) => state.mandatoryGrant);

    const filteredApplications = applications.filter(item =>
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const dispatch = useDispatch<AppDispatch>();

    const handleLinkingProject = (id: number) => {
        dispatch(linkMgApplication(id));
        setSnackbar({ visible: true, lastLinkedId: id });
        setTimeout(() => {
            onBack();
        }, 2000);
    };

    const handleUndo = () => {
        if (snackbar.lastLinkedId !== null) {
            dispatch(linkMgApplication(snackbar.lastLinkedId));
            setSnackbar({ visible: false, lastLinkedId: null });
        }
    };


    useEffect(() => {
        dispatch(fetchMandatoryGrantData())
    }, [dispatch])

    if (error) {
        showToast({ message: error, title: "Error Fetching", type: "error", position: "top" });
    }

    const renderList = ({ index, item }: { index: number, item: MandatoryApplicationDto }) => {
        return (
            <Animated.View key={`app-${item.id}}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
                <AddMgApplicationItem onPress={() => handleLinkingProject(item.id)} item={item} />
            </Animated.View>
        )
    }

    if (loading) {
        return (
            <SafeArea>
                <RListLoading count={7} />
            </SafeArea>
        )
    }

    return (
        <SafeArea>
            <RHeader name='Add Mg Application' />
            <RCol style={styles.col}>
                <Searchbar
                    placeholder="Search application"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </RCol>
            <FlatList data={filteredApplications}
                style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
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

export default AddNewApplicationPage

const styles = StyleSheet.create({
    col: {
        paddingVertical: 6,
        paddingHorizontal: 12
    },
    searchBar: {
        backgroundColor: colors.slate[100]
    }
});