import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RCol, REmpty, SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { ItemOrganization } from '@/components/modules/application'
import { Searchbar } from 'react-native-paper'
import colors from '@/config/colors'
import { showToast } from '@/core'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { OrganisationDto } from '@/core/models/organizationDto'
import { org_data } from '@/core/types/dummy'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { useDispatch, useSelector } from 'react-redux'
import { setAllOrganizations, setSearchQuery } from '@/store/slice/Organization'
import { AppDispatch, RootState } from '@/store/store'
import { linkOrganizationAsync } from '@/store/slice/thunks/OrganizationThunks'

const AddNewOrganization = () => {
    const { filteredOrganizations, searchQuery } = useSelector(
        (state: RootState) => state.linkedOrganization
    );

    const [showSearch, setSearchVisible] = useState(false);

    const { onBack } = usePageTransition();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(setAllOrganizations(org_data));
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
                console.log(error);
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

    const renderList = ({ index, item }: { index: number, item: OrganisationDto }) => {
        return (
            <Animated.View key={`org-${item.id}}`} entering={FadeInDown.duration(600).delay(index * 100).springify()}>
                <ItemOrganization onPress={() => handleLinkOrganization(item)} item={item} />
            </Animated.View>
        )
    }

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
                keyExtractor={(item, index) => `organization-${item.organisationName}-${index}`}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                removeClippedSubviews={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={21}
                ListEmptyComponent={<REmpty title='No Organizations' subtitle='Sorry, no organizations are available to link. Please add an organization on web platform.' icon='briefcase' />}
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
    }
})