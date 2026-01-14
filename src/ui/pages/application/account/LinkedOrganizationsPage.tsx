import { FlatList, StyleSheet, View } from 'react-native'
import React, { useMemo, useState, useEffect, useRef } from 'react'
import RHeader from '@/components/common/RHeader'
import { RCol, REmpty, RListLoading } from '@/components/common'
import ItemOrgs from '@/components/modules/application/home/ItemOrgs'
import { OrganisationDto } from '@/core/models/organizationDto'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { OrgDetails } from '@/components/modules/application/home/LinkedOrganizations'
import { Searchbar } from 'react-native-paper'
import colors from '@/config/colors'
import { showToast } from '@/core'
import { UnifiedOrgItem } from '@/core/types/unifiedData'
import { loadLinkedOrganizationsAsync, loadOrganizations } from '@/store/slice/thunks/OrganizationThunks'

const LinkedOrganizationsPage = () => {

    const [showSearch, setShowSearch] = useState(false);

    const { discretionaryGrants, mandatoryGrants, linkOrgDoc } = usePageTransition();

    const { linkedOrganizations, error, loading, organizations } = useSelector((state: RootState) => state.linkedOrganization);
    const { user } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch<AppDispatch>();

    const [visible, setVisible] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const prevErrorRef = useRef<typeof error>(null);

    const onChangeSearch = (query: string) => setSearchQuery(query);

    const { close, open } = useGlobalBottomSheet();

    useEffect(() => {
        if (user && user?.id) {
            dispatch(loadOrganizations(user.id));
        }
        dispatch(loadLinkedOrganizationsAsync());
    }, [dispatch, user?.id]);

    useEffect(() => {
        if (error && !prevErrorRef.current) {
            showToast({ message: error, type: "error", title: "Error", position: "top" });
        }
        prevErrorRef.current = error;
    }, [error]);

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

    const unifiedList = useMemo(() => {
        const allItems: UnifiedOrgItem[] = [];

        // Add main organizations
        organizations.forEach(org => {
            allItems.push({ type: 'main', data: org });
        });

        // Add footer organizations (linked, not cancelled)
        linkedOrganizations
            .filter(l => l.approvalStatus !== 'cancelled')
            .map(l => organizations.find(o => o.id === l.id))
            .filter(Boolean)
            .forEach(org => {
                allItems.push({ type: 'footer', data: org as OrganisationDto });
            });

        // Now filter the entire list
        if (!searchQuery.trim()) return allItems;

        const query = searchQuery.toLowerCase();
        return allItems.filter(item =>
            item.data.organisationName.toLowerCase().includes(query) ||
            item.data.organisationTradingName.toLowerCase().includes(query) ||
            item.data.organisationRegistrationNumber.includes(searchQuery)
        );
    }, [organizations, linkedOrganizations, searchQuery]);

    const renderItem = ({ item }: { item: UnifiedOrgItem }) => {
        if (item.type === 'main') {
            return <ItemOrgs org={item.data} onPress={() => onPress(item.data)} />;
        } else {
            return (
                <ItemOrgs
                    org={item.data}
                    onNewLinking={() => handleOrgLinking(item.data)}
                    isLinkingRequired={true}
                />
            );
        }
    };

    if (loading) {
        return (<RListLoading count={7} />);
    } else {
        return (
            <>
                <RHeader name='My Organizations' hasRightIcon onPressRight={() => setShowSearch(!showSearch)} iconRight='search' />
                {showSearch &&
                    <RCol style={styles.con}>
                        <Searchbar value={searchQuery} onChangeText={onChangeSearch} style={styles.search} placeholder='Search Organization' />
                    </RCol>
                }
                <FlatList
                    data={unifiedList}
                    keyExtractor={(item) => `${item.type}-${item.data.id}`}
                    renderItem={renderItem}
                    style={{ paddingVertical: 5, flex: 1, flexGrow: 1, paddingHorizontal: 12 }}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                    removeClippedSubviews={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={21}
                    ListEmptyComponent={
                        <REmpty
                            title="No Organizations"
                            subtitle="Sorry, you currently do not have any organizations linked to your profile. Please link an organization first."
                            icon="briefcase"
                        />
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