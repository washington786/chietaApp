import {
    FlatList, StyleSheet, View, ActivityIndicator,
    TouchableOpacity, Image, ScrollView,
} from 'react-native'
import { moderateScale, scale, verticalScale } from '@/utils/responsive'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { REmpty, RInput, RListLoading, RRow, SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { ItemOrganization } from '@/components/modules/application'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import appFonts from '@/config/fonts'
import { showToast } from '@/core'
import { OrganisationDto } from '@/core/models/organizationDto'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchQuery } from '@/store/slice/Organization'
import { AppDispatch, RootState } from '@/store/store'
import { linkOrganizationAsync, loadAllOrganizations, loadLinkedOrganizationsAsync } from '@/store/slice/thunks/OrganizationThunks'
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useLazyGetOrgSdfByOrgQuery } from '@/store/api/api'
import { errorBox } from '@/components/loadAssets'

type FilterType = 'all' | 'active' | 'inactive' | 'linked';

const FILTERS: { key: FilterType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'all', label: 'All', icon: 'layers-outline' },
    { key: 'active', label: 'Active', icon: 'checkmark-circle-outline' },
    { key: 'inactive', label: 'Inactive', icon: 'close-circle-outline' },
    { key: 'linked', label: 'Linked', icon: 'link-outline' },
];

const AddNewOrganization = () => {
    const { filteredOrganizations, searchQuery, loading, linkedOrganizations } = useSelector(
        (state: RootState) => state.linkedOrganization
    );
    const { user } = useSelector((state: RootState) => state.auth);

    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [pageIndex, setPageIndex] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [linkingId, setLinkingId] = useState<number | null>(null);

    const { onBack } = usePageTransition();
    const dispatch = useDispatch<AppDispatch>();
    const [getOrgSdf] = useLazyGetOrgSdfByOrgQuery();
    const { open, close } = useGlobalBottomSheet();
    const pageSize = 20;

    const linkedIds = useMemo(
        () => new Set((linkedOrganizations ?? []).map((o: any) => o.id)),
        [linkedOrganizations]
    );

    // Initial load — both paginated org list and locally-stored linked orgs
    useEffect(() => {
        dispatch(loadLinkedOrganizationsAsync());
        dispatch(loadAllOrganizations({ first: 0, rows: pageSize }))
            .unwrap()
            .then((items) => { setHasMore(items.length >= pageSize); setPageIndex(0); })
            .catch(() => setHasMore(false));
    }, [dispatch]);

    // Sync search input to redux
    const handleSearch = useCallback((text: string) => {
        dispatch(setSearchQuery(text));
    }, [dispatch]);

    // Display list — "linked" filter uses the SecureStore-backed list directly
    // so it works regardless of pagination state
    const displayList = useMemo<OrganisationDto[]>(() => {
        if (activeFilter === 'linked') {
            return (linkedOrganizations ?? []) as OrganisationDto[];
        }
        let list = filteredOrganizations;
        if (activeFilter === 'active') list = list.filter(o => o.status?.toLowerCase() === 'active');
        if (activeFilter === 'inactive') list = list.filter(o => o.status?.toLowerCase() !== 'active');
        return list;
    }, [filteredOrganizations, activeFilter, linkedOrganizations]);

    function showLinkedCompanyError(orgName: string) {
        open(<AlreadyLinked orgName={orgName} close={close} />, { snapPoints: ['40%'] });
    }

    async function handleLinkOrganization(item: OrganisationDto) {
        if (linkingId !== null) return;
        setLinkingId(item.id);
        try {
            const sdfOrgData: any = await getOrgSdf(
                { organisationId: item.id, userId: user ? Number(user.id) : 0 }
            ).unwrap();

            if (sdfOrgData?.id) {
                showLinkedCompanyError(item.organisationTradingName);
                return;
            }

            await dispatch(linkOrganizationAsync(item)).unwrap();
            onBack();
            showToast({
                message: 'Organization linked successfully to your profile',
                type: 'success',
                title: 'Organization Linked',
                position: 'bottom',
            });
        } catch (error: any) {
            showToast({
                message: error?.message || error || 'Failed to link organization',
                type: 'error',
                title: 'Error',
                position: 'bottom',
            });
        } finally {
            setLinkingId(null);
        }
    }

    const handleLoadMore = useCallback(() => {
        // Don't paginate when search or non-paginated filters are active
        if (searchQuery.trim() || activeFilter === 'linked' || !hasMore || isLoadingMore || loading) return;
        setIsLoadingMore(true);
        const nextPage = pageIndex + 1;
        dispatch(loadAllOrganizations({ first: nextPage * pageSize, rows: pageSize }))
            .unwrap()
            .then((items) => {
                setPageIndex(nextPage);
                setHasMore(items.length >= pageSize);
            })
            .catch(() => setHasMore(false))
            .finally(() => setIsLoadingMore(false));
    }, [searchQuery, activeFilter, hasMore, isLoadingMore, loading, pageIndex, dispatch]);

    const renderItem = useCallback(({ index, item }: { index: number; item: OrganisationDto }) => (
        <ItemOrganization
            key={`${item.id}-${index}`}
            item={item}
            isLinked={linkedIds.has(item.id)}
            isLinking={linkingId === item.id}
            onPress={() => handleLinkOrganization(item)}
        />
    ), [linkedIds, linkingId]);

    const keyExtractor = useCallback((item: OrganisationDto) => `org-${item.id}`, []);

    const showInitialLoader = loading && filteredOrganizations.length === 0 && pageIndex === 0;

    const activeCount = filteredOrganizations.filter(o => o.status?.toLowerCase() === 'active').length;
    const inactiveCount = filteredOrganizations.filter(o => o.status?.toLowerCase() !== 'active').length;
    const linkedCount = (linkedOrganizations ?? []).length;

    const countFor = (key: FilterType) => {
        if (key === 'all') return filteredOrganizations.length;
        if (key === 'active') return activeCount;
        if (key === 'inactive') return inactiveCount;
        if (key === 'linked') return linkedCount;
        return 0;
    };

    // Only show empty state when not loading in any way
    const isAnyLoading = loading || isLoadingMore;
    const [show, setShow] = useState(false);

    return (
        <SafeArea>
            <RHeader name='Link An Organization' hasRightIcon iconRight='search' onPressRight={() => setShow(!show)} />

            {/* ── Search (uses project RInput) ──────────────────────── */}
            {
                show &&
                <View style={styles.searchWrap}>
                    <RInput
                        icon='search'
                        iconColor={colors.primary[400]}
                        placeholder='Search by name or registration number…'
                        placeholderTextColor={colors.slate[400]}
                        value={searchQuery}
                        onChangeText={handleSearch}
                        returnKeyType='search'
                        customStyle={styles.searchInput}
                    />
                </View>
            }

            {/* ── Filter chips ──────────────────────────────────────── */}
            <View style={styles.filterContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    alwaysBounceHorizontal={false}
                    contentContainerStyle={styles.filterRow}
                >
                    {FILTERS.map(f => {
                        const active = activeFilter === f.key;
                        return (
                            <TouchableOpacity
                                key={f.key}
                                onPress={() => setActiveFilter(f.key)}
                                style={[styles.chip, active && styles.chipActive]}
                                activeOpacity={0.75}
                            >
                                <Ionicons
                                    name={f.icon}
                                    size={moderateScale(14)}
                                />
                                <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                                    {f.label}
                                </Text>
                                <View style={[styles.chipBadge, active && styles.chipBadgeActive]}>
                                    <Text style={[styles.chipBadgeText, active && styles.chipBadgeTextActive]}>
                                        {countFor(f.key)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* ── Result count ──────────────────────────────────────── */}
            {!showInitialLoader && (
                <View style={styles.resultMeta}>
                    <Text style={styles.resultCount}>
                        {displayList.length} organization{displayList.length !== 1 ? 's' : ''}
                    </Text>
                    {searchQuery.trim() ? (
                        <Text style={styles.resultQuery}>for "{searchQuery}"</Text>
                    ) : null}
                </View>
            )}

            {/* ── List ──────────────────────────────────────────────── */}
            {showInitialLoader ? (
                <RListLoading count={7} />
            ) : (
                <FlatList
                    data={displayList}
                    style={styles.list}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    removeClippedSubviews
                    initialNumToRender={15}
                    maxToRenderPerBatch={15}
                    windowSize={10}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.4}
                    contentContainerStyle={styles.listContent}
                    ListFooterComponent={
                        isLoadingMore ? (
                            <View style={styles.loadMoreIndicator}>
                                <ActivityIndicator size='small' color={colors.primary[600]} />
                                <Text style={styles.loadMoreText}>Loading more…</Text>
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        // Don't show empty state while any loading is in progress
                        isAnyLoading ? null : (
                            <REmpty
                                title='No Organizations Found'
                                subtitle={
                                    activeFilter === 'linked'
                                        ? 'You have not linked any organizations yet.'
                                        : activeFilter !== 'all'
                                            ? `No organizations match the "${FILTERS.find(f => f.key === activeFilter)?.label}" filter.`
                                            : 'No organizations are available to link. Please add an organization on the web platform.'
                                }
                                icon='briefcase'
                            />
                        )
                    }
                />
            )}
        </SafeArea>
    );
};

export default AddNewOrganization;

// ─── Already Linked bottom sheet ─────────────────────────────────────────────
interface AlreadyLinkedProps { orgName: string; close: () => void; }
function AlreadyLinked({ close, orgName }: AlreadyLinkedProps) {
    return (
        <View style={sheet.wrap}>
            <RRow style={sheet.header}>
                <View style={sheet.titleRow}>
                    <View style={sheet.iconCircle}>
                        <Ionicons name='link' size={moderateScale(20)} color={colors.primary[600]} />
                    </View>
                    <Text variant='titleMedium' style={sheet.title}>Already Linked</Text>
                </View>
                <TouchableOpacity onPress={close} hitSlop={8}>
                    <EvilIcons name='close' size={moderateScale(32)} color={colors.gray[600]} />
                </TouchableOpacity>
            </RRow>

            <View style={sheet.body}>
                <Image source={errorBox} style={sheet.img} />
                <Text variant='titleSmall' style={sheet.heading}>Organization Already Linked</Text>
                <Text variant='bodySmall' style={sheet.msg}>
                    {`"${orgName}" is already linked to an SDF profile. Please check your linked organizations or contact support for assistance.`}
                </Text>
            </View>

            <TouchableOpacity onPress={close} style={sheet.closeBtn}>
                <Text style={sheet.closeBtnText}>Got it</Text>
            </TouchableOpacity>
        </View>
    );
}

const sheet = StyleSheet.create({
    wrap: { flex: 1, backgroundColor: 'white', padding: scale(20) },
    header: { justifyContent: 'space-between', alignItems: 'center', marginBottom: scale(20) },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: scale(10) },
    iconCircle: { width: scale(36), height: scale(36), borderRadius: scale(18), backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center' },
    title: { color: colors.gray[800] },
    body: { alignItems: 'center', gap: scale(12), paddingVertical: scale(8) },
    img: { width: scale(64), height: scale(64) },
    heading: { textAlign: 'center', color: colors.gray[800], fontFamily: `${appFonts.semiBold}` },
    msg: { textAlign: 'center', color: colors.gray[500], lineHeight: moderateScale(20) },
    closeBtn: { marginTop: scale(20), backgroundColor: colors.primary[600], borderRadius: scale(12), paddingVertical: scale(13), alignItems: 'center' },
    closeBtnText: { color: 'white', fontFamily: `${appFonts.semiBold}`, fontSize: moderateScale(14) },
});

const styles = StyleSheet.create({
    searchWrap: {
        marginHorizontal: scale(16),
        marginTop: scale(10),
        marginBottom: scale(6),
    },
    searchInput: {
        borderRadius: scale(12),
        borderColor: colors.primary[200],
        backgroundColor: colors.primary[50],
    },
    filterContainer: {
        height: verticalScale(52),
        justifyContent: 'center',
    },
    filterRow: {
        paddingHorizontal: scale(16),
        alignItems: 'center',
        gap: scale(8),
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
        paddingHorizontal: scale(13),
        paddingVertical: scale(8),
        borderRadius: scale(20),
        backgroundColor: colors.slate[100],
        borderWidth: 1,
        borderColor: colors.slate[200],
    },
    chipActive: {
        backgroundColor: colors.primary[950],
        borderColor: colors.primary[950],
    },
    chipLabel: {
        fontSize: moderateScale(12),
        fontFamily: `${appFonts.medium}`,
        color: colors.slate[600],
        lineHeight: moderateScale(16),
    },
    chipLabelActive: { color: colors.white },
    chipBadge: {
        borderRadius: scale(10),
        backgroundColor: colors.slate[200],
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(6),
        paddingVertical: scale(2),
    },
    chipBadgeActive: { backgroundColor: colors.primary[400] },
    chipBadgeText: {
        fontSize: moderateScale(10),
        fontFamily: `${appFonts.bold}`,
        color: colors.slate[600],
        lineHeight: moderateScale(14),
    },
    chipBadgeTextActive: { color: colors.white },
    resultMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
        paddingHorizontal: scale(18),
        paddingBottom: scale(6),
    },
    resultCount: {
        fontSize: moderateScale(12),
        fontFamily: `${appFonts.semiBold}`,
        color: colors.slate[600],
    },
    resultQuery: {
        fontSize: moderateScale(12),
        fontFamily: `${appFonts.regular}`,
        color: colors.slate[400],
    },
    list: { flex: 1 },
    listContent: {
        paddingHorizontal: scale(16),
        paddingTop: scale(4),
        paddingBottom: scale(32),
    },
    loadMoreIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(8),
        paddingVertical: scale(16),
    },
    loadMoreText: {
        fontSize: moderateScale(12),
        fontFamily: `${appFonts.regular}`,
        color: colors.slate[500],
    },
});
