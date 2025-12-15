import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import RHeader from '@/components/common/RHeader'
import { RCol, REmpty, RListLoading, RLoaderAnimation, SkeletonLoader } from '@/components/common'
import ItemOrgs from '@/components/modules/application/home/ItemOrgs'
import { OrganisationDto } from '@/core/models/organizationDto'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { OrgDetails } from '@/components/modules/application/home/LinkedOrganizations'
import { Searchbar } from 'react-native-paper'
import colors from '@/config/colors'

const LinkedOrganizationsPage = () => {
    const { discretionaryGrants, mandatoryGrants, linkOrgDoc } = usePageTransition();
    const { linkedOrganizations, error, loading, organizations } = useSelector((state: RootState) => state.linkedOrganization);

    const [visible, setVisible] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const onChangeSearch = (query: string) => setSearchQuery(query);

    const { close, open } = useGlobalBottomSheet();

    function handleMandatoryGrants(org: OrganisationDto) {
        close();
        mandatoryGrants({ orgId: String(org.id) });
    }

    function handleDiscretionaryGrants(org: OrganisationDto) {
        close();
        discretionaryGrants({ orgId: String(org.id) });
    }

    function handleOrgLinking(org: OrganisationDto) {
        linkOrgDoc({ orgId: String(org.id) });
    }

    function handleDialog() {
        close();
        setVisible(!visible);
    };

    function onPress(org: OrganisationDto) {
        open(
            <OrgDetails
                onDiscretionaryGrants={() => handleDiscretionaryGrants(org)} onMandatoryGrants={() => handleMandatoryGrants(org)} onDelink={handleDialog} orgName={`${org.organisationTradingName}`} />, { snapPoints: ["50%"] })
    }

    // Filter main organization list
    const filteredOrganizations = organizations.filter(org =>
        org.organisationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.organisationTradingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.organisationRegistrationNumber.includes(searchQuery)
    );

    // Footer data: linked orgs that are not cancelled
    const footerOrganizations = linkedOrganizations
        .filter(l => l.approvalStatus !== 'cancelled')
        .map(l => organizations.find(o => o.id === l.id))
        .filter(Boolean) as OrganisationDto[];

    const renderList = ({ item }: { index: number, item: OrganisationDto }) => {
        return (
            <ItemOrgs org={item} onPress={() => onPress(item)} />
        )
    }

    const renderAddNewItem = ({ item }: { index: number, item: OrganisationDto }) => {
        return (
            <ItemOrgs org={item} onNewLinking={() => handleOrgLinking(item)} isLinkingRequired={true} key={`${item.id}`} />
        )
    }

    if (loading) {
        return (<RListLoading count={7} />);
    } else {
        return (
            <>
                <RHeader name='My Organizations' />
                <RCol style={styles.con}>
                    <Searchbar value={searchQuery} onChangeText={onChangeSearch} style={styles.search} placeholder='Search Organization' />
                </RCol>
                {/* <RLoaderAnimation /> */}
                <FlatList data={filteredOrganizations}
                    keyExtractor={(item) => `linked-orgs-${item.id}`}
                    style={{ paddingVertical: 5, flex: 1, flexGrow: 1, paddingHorizontal: 12 }}
                    renderItem={renderList}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                    removeClippedSubviews={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    ListEmptyComponent={<REmpty title='No Organizations' subtitle='sorry, you currenlty do not have any organizations linked to your profile. Please link organization first.' icon='briefcase' />}
                    windowSize={21}
                    ListFooterComponent={
                        footerOrganizations.length > 0 ? (
                            <FlatList data={footerOrganizations}
                                keyExtractor={(item) => `linked-orgs-${item.id}`}
                                renderItem={renderAddNewItem}
                                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                                removeClippedSubviews={false}
                                initialNumToRender={1}
                                maxToRenderPerBatch={1}
                                windowSize={21}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            />
                        ) : null

                    }
                />
            </>
        )
    }

}

export default LinkedOrganizationsPage

const styles = StyleSheet.create({
    con: {
        paddingHorizontal: 12,
        gap: 8,
        marginVertical: 10,

    },
    anim: {
        padding: 5,
    },
    search: {
        backgroundColor: colors.slate[50],
        borderWidth: 1,
        borderColor: colors.zinc[200],
    }
})