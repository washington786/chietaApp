import { FlatList, StyleSheet, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RCol, REmpty, SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { ItemOrganization } from '@/components/modules/application'
import { Searchbar } from 'react-native-paper'
import colors from '@/config/colors'
import { showToast } from '@/core'
import { OrganisationDto } from '@/core/models/organizationDto'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchQuery } from '@/store/slice/Organization'
import { AppDispatch, RootState } from '@/store/store'
import { linkOrganizationAsync, loadAllOrganizations } from '@/store/slice/thunks/OrganizationThunks'

const AddNewOrganization = () => {
    const { filteredOrganizations, searchQuery, organizations, loading } = useSelector(
        (state: RootState) => state.linkedOrganization
    );

    const [showSearch, setSearchVisible] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const { onBack } = usePageTransition();
    const dispatch = useDispatch<AppDispatch>();

    const pageSize = 20;

    // Initial load
    useEffect(() => {
        dispatch(loadAllOrganizations({ first: 0, rows: pageSize }));
    }, [dispatch]);

    function handleLinkOrganization(item: OrganisationDto) {
        dispatch(linkOrganizationAsync(item))
            .unwrap()
            .then(() => {
                onBack();
                showToast({
                    message: 'Organization linked successfully to your profile',
                    type: 'success',
                    title: 'Organization Linking',
                    position: 'bottom',
                });
            })
            .catch((error: any) => {
                showToast({
                    message: error || 'Failed to link organization',
                    type: 'error',
                    title: 'Error',
                    position: 'bottom',
                });
            });
    }

    const handleSearch = (query: string) => {
        dispatch(setSearchQuery(query));
    };

    const handleLoadMore = () => {
        if (!isLoadingMore && !loading && filteredOrganizations.length > 0) {
            setIsLoadingMore(true);
            const nextPage = pageIndex + 1;
            dispatch(loadAllOrganizations({ first: nextPage * pageSize, rows: pageSize }))
                .then(() => {
                    setPageIndex(nextPage);
                    setIsLoadingMore(false);
                })
                .catch(() => {
                    setIsLoadingMore(false);
                });
        }
    };

    const renderList = ({ index, item }: { index: number, item: OrganisationDto }) => {
        return (
            <ItemOrganization key={`org-${item.id}-${index}`} onPress={() => handleLinkOrganization(item)} item={item} />
        )
    }

    const renderFooter = () => {
        if (!isLoadingMore) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="large" color={colors.primary[900]} />
            </View>
        );
    };

    return (
        <SafeArea>
            <RHeader name='Link An Organization' hasRightIcon={true} iconRight='search' onPressRight={() => setSearchVisible(!showSearch)} />
            {
                showSearch &&
                <RCol style={styles.col}>
                    <Searchbar
                        placeholder="Search"
                        onChangeText={handleSearch}
                        value={searchQuery}
                        style={styles.searchBar}
                    />
                </RCol>
            }
            <FlatList data={filteredOrganizations}
                style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
                renderItem={renderList}
                keyExtractor={(item, index) => `organization-${item.id}-${index}`}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                removeClippedSubviews={true}
                initialNumToRender={15}
                maxToRenderPerBatch={15}
                windowSize={10}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.3}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={loading ? null : <REmpty title='No Organizations' subtitle='Sorry, no organizations are available to link. Please add an organization on web platform.' icon='briefcase' />}
            />
        </SafeArea>
    )
}

export default AddNewOrganization

const styles = StyleSheet.create({
    col: {
        paddingVertical: 6,
        marginVertical: 5,
        paddingHorizontal: 12
    },
    searchBar: {
        backgroundColor: colors.slate[100],
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    }
})