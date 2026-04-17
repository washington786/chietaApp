import { FlatList, StyleSheet, View } from 'react-native'
import { scale } from '@/utils/responsive'
import React, { useMemo, useState, useEffect, useRef } from 'react'
import RHeader from '@/components/common/RHeader'
import { RCol, REmpty, RListLoading } from '@/components/common'
import ItemOrgs from '@/components/modules/application/home/ItemOrgs'
import { OrganisationDto } from '@/core/models/organizationDto'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { Searchbar } from 'react-native-paper'
import colors from '@/config/colors'
import { showToast } from '@/core'
import { UnifiedOrgItem } from '@/core/types/unifiedData'
import { loadLinkedOrganizationsAsync } from '@/store/slice/thunks/OrganizationThunks'
import { useGetOrganizationsBySdfIdQuery } from '@/store/api/api'

const LinkedOrganizationsPage = () => {

    const [showSearch, setShowSearch] = useState(false);

    const { organisationDetails } = usePageTransition();

    const { linkedOrganizations, error, loading } = useSelector((state: RootState) => state.linkedOrganization);
    const { user } = useSelector((state: RootState) => state.auth);

    // Use sdfId directly from authenticated user (now correctly populated after login)
    const sdfId = user?.sdfId;

    // Get organizations using SDF ID
    const { data: organizationsData, isLoading: orgLoading, error: orgError } = useGetOrganizationsBySdfIdQuery(sdfId || 0, {
        skip: !sdfId
    });

    const dispatch = useDispatch<AppDispatch>();

    const [searchQuery, setSearchQuery] = useState('');
    const prevErrorRef = useRef<typeof error>(null);

    const onChangeSearch = (query: string) => setSearchQuery(query);

    useEffect(() => {
        dispatch(loadLinkedOrganizationsAsync());
    }, [dispatch]);

    useEffect(() => {
        if (error && !prevErrorRef.current) {
            showToast({ message: error, type: "error", title: "Error", position: "top" });
        }
        prevErrorRef.current = error;
    }, [error]);


    function handleOrganisationDetails(org: OrganisationDto) {
        organisationDetails({ orgId: String(org.id) });
    }


    const unifiedList = useMemo(() => {
        const allItems: UnifiedOrgItem[] = [];
        const orgs = organizationsData || [];

        // Build deduplicated org list: API orgs first, then any linked orgs not already included
        const seenIds = new Set<number>();
        orgs.forEach((org: OrganisationDto) => {
            seenIds.add(org.id);
            allItems.push({ type: 'main', data: org });
        });

        linkedOrganizations
            .filter(l => l.approvalStatus !== 'cancelled')
            .forEach(l => {
                if (!seenIds.has(l.id)) {
                    const org = orgs.find((o: OrganisationDto) => o.id === l.id);
                    if (org) {
                        seenIds.add(org.id);
                        allItems.push({ type: 'footer', data: org });
                    }
                }
            });

        // Filter the list
        if (!searchQuery.trim()) return allItems;

        const query = searchQuery.toLowerCase();
        return allItems.filter(item =>
            item.data.organisationName.toLowerCase().includes(query) ||
            item.data.organisationTradingName.toLowerCase().includes(query) ||
            item.data.organisationRegistrationNumber.includes(searchQuery)
        );
    }, [organizationsData, linkedOrganizations, searchQuery]);

    const renderItem = ({ item }: { item: UnifiedOrgItem }) => {
        return (
            <ItemOrgs
                org={item.data}
                onPress={() => handleOrganisationDetails(item.data)}
            />
        );
    };

    if (loading || orgLoading) {
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
                    contentContainerStyle={{ paddingBottom: 60 }}
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
        paddingHorizontal: scale(12),
        gap: scale(8),
        marginVertical: scale(10),

    },
    anim: {
        padding: scale(5),
    },
    search: {
        backgroundColor: colors.slate[50],
        borderWidth: 1,
        borderColor: colors.zinc[200],
    }
})