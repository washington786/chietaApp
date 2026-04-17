import { FlatList, View, TouchableOpacity, Text as NativeText, ScrollView } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { RCol, REmpty, RListLoading, SafeArea, RRow } from '@/components/common'
import colors from '@/config/colors'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { showToast } from '@/core'
import { useGetOrganizationsBySdfIdQuery, useGetProjectTimelineQuery, useGetOrgApplicationsQuery } from '@/store/api/api'
import { ProjectTimeline } from '@/core/models/DiscretionaryDto'
import { MandatoryApplicationDto } from '@/core/models/MandatoryDto'
import RHeader from '@/components/common/RHeader'
import { history_styles as styles } from '@/styles/HistoryStyles';
import { Searchbar, Text } from 'react-native-paper'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useGlobalBottomSheet, BottomSheetFlatList } from '@/hooks/navigation/BottomSheet'
import AntDesign from '@expo/vector-icons/AntDesign';
import { moderateScale, scale } from '@/utils/responsive';

const HistoryScreen = () => {
    const { historyItemDetails } = usePageTransition();
    const { user } = useSelector((state: RootState) => state.auth);

    // State for selected organization
    const [selectedOrgId, setSelectedOrgId] = useState<number | undefined>(undefined);
    const [grantType, setGrantType] = useState<'discretionary' | 'mandatory'>('discretionary');
    const [statusFilter, setStatusFilter] = useState<'all' | 'started' | 'submitted' | 'rsa review'>('all');
    const [mandatoryStatusFilter, setMandatoryStatusFilter] = useState<'all' | 'submitted' | 'approved' | 'pending'>('all');

    const sdfId = user?.sdfId;

    const { data: orgsData, isLoading: orgsLoading, error: orgsError } = useGetOrganizationsBySdfIdQuery(sdfId || 0, {
        skip: !sdfId,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [show, setShow] = useState<boolean>(false);

    const { open, close } = useGlobalBottomSheet();

    const organizations = useMemo(() => {
        if (orgsData) {
            return orgsData;
        }
        return [];
    }, [orgsData]);

    const selectedOrg = useMemo(
        () => organizations.find((org: OrgItem) => org.id === selectedOrgId),
        [organizations, selectedOrgId]
    );

    // Set default organization when data loads
    useEffect(() => {
        if (organizations.length > 0 && selectedOrgId === undefined) {
            setSelectedOrgId(organizations[0].id);
        }
    }, [organizations, selectedOrgId]);

    // Fetch project timeline data based on selected organization
    const { data, isLoading: timelineLoading, error: timelineError } = useGetProjectTimelineQuery(
        selectedOrgId || 0,
        { skip: !selectedOrgId, refetchOnFocus: true, refetchOnMountOrArgChange: true }
    );

    // Fetch mandatory applications for the selected organization
    const { data: mandatoryData, isLoading: mandatoryLoading, error: mandatoryError } = useGetOrgApplicationsQuery(
        selectedOrgId || 0,
        { skip: !selectedOrgId, refetchOnFocus: true, refetchOnMountOrArgChange: true }
    );


    const timelineItems = useMemo(() => {
        return data?.items || [];
    }, [data]);

    const filterCounts = useMemo(() => ({
        all: timelineItems.length,
        started: timelineItems.filter(i => i.applicationStarted && !i.applicationSubmitted).length,
        submitted: timelineItems.filter(i => i.applicationSubmitted).length,
    }), [timelineItems]);

    const mandatoryItems = useMemo(() => mandatoryData?.items || [], [mandatoryData]);

    const mandatoryFilterCounts = useMemo(() => ({
        all: mandatoryItems.length,
        submitted: mandatoryItems.filter((i: MandatoryApplicationDto) => i.grantStatus?.toLowerCase().includes('submitted')).length,
        approved: mandatoryItems.filter((i: MandatoryApplicationDto) => {
            const s = (i.grantStatus || '').toLowerCase();
            return s.includes('approved') || s.includes('completed');
        }).length,
        pending: mandatoryItems.filter((i: MandatoryApplicationDto) => {
            const s = (i.grantStatus || '').toLowerCase();
            return !s.includes('submitted') && !s.includes('approved') && !s.includes('completed');
        }).length,
    }), [mandatoryItems]);

    const filteredMandatoryItems = useMemo(() => {
        let filtered: MandatoryApplicationDto[] = mandatoryItems;

        if (mandatoryStatusFilter === 'submitted') {
            filtered = filtered.filter((i: MandatoryApplicationDto) => i.grantStatus?.toLowerCase().includes('submitted'));
        } else if (mandatoryStatusFilter === 'approved') {
            filtered = filtered.filter((i: MandatoryApplicationDto) => {
                const s = (i.grantStatus || '').toLowerCase();
                return s.includes('approved') || s.includes('completed');
            });
        } else if (mandatoryStatusFilter === 'pending') {
            filtered = filtered.filter((i: MandatoryApplicationDto) => {
                const s = (i.grantStatus || '').toLowerCase();
                return !s.includes('submitted') && !s.includes('approved') && !s.includes('completed');
            });
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter((i: MandatoryApplicationDto) =>
                i.description?.toLowerCase().includes(q) ||
                i.referenceNo?.toLowerCase().includes(q) ||
                i.organisation_Name?.toLowerCase().includes(q) ||
                i.grantStatus?.toLowerCase().includes(q)
            );
        }

        return filtered;
    }, [mandatoryItems, mandatoryStatusFilter, searchQuery]);

    const filteredTimelineItems = useMemo(() => {
        let filtered = timelineItems;

        // Apply status filter
        if (statusFilter === 'started') {
            filtered = filtered.filter(item => item.applicationStarted && !item.applicationSubmitted);
        } else if (statusFilter === 'submitted') {
            filtered = filtered.filter(item => item.applicationSubmitted);
        }

        // Apply search query
        if (!searchQuery.trim()) {
            return filtered;
        }

        const query = searchQuery.toLowerCase().trim();
        return filtered.filter(item =>
            item.projectName.toLowerCase().includes(query) ||
            item.windowTitle.toLowerCase().includes(query) ||
            item.organisationName.toLowerCase().includes(query) ||
            item.status.toLowerCase().includes(query) ||
            item.sdlNo.toLowerCase().includes(query)
        );
    }, [timelineItems, searchQuery, statusFilter]);

    useEffect(() => {
        if (orgsError) {
            const errorMessage = typeof orgsError === 'string' ? orgsError : 'Failed to fetch organizations';
            showToast({ message: errorMessage, type: "error", title: "Error", position: "top" });
        }
    }, [orgsError]);

    useEffect(() => {
        if (timelineError) {
            const errorMessage = typeof timelineError === 'string' ? timelineError : 'Failed to fetch project timeline';
            showToast({ message: errorMessage, type: "error", title: "Error", position: "top" });
        }
    }, [timelineError]);

    useEffect(() => {
        if (mandatoryError) {
            const errorMessage = typeof mandatoryError === 'string' ? mandatoryError : 'Failed to fetch mandatory applications';
            showToast({ message: errorMessage, type: "error", title: "Error", position: "top" });
        }
    }, [mandatoryError]);

    const renderList = ({ item }: { index: number, item: ProjectTimeline }) => {
        return (
            <View key={`proj-${item.projectId}`}>
                <ProjectTimelineItem item={item} onPress={() => historyItemDetails({ appId: item.projectId, item })} />
            </View>
        )
    }

    function handleOrgFilter() {
        open(<OrganizationBottomSheet close={close} organizations={organizations} selectedOrgId={selectedOrgId} onSelectOrg={(orgId) => {
            setSelectedOrgId(orgId);
            // Close is handled by the bottom sheet internally now
        }} />, { snapPoints: ["80%"] });
    }


    const activeDataLoading = grantType === 'discretionary' ? timelineLoading : mandatoryLoading;
    if (orgsLoading || activeDataLoading) {
        return <RListLoading count={7} />
    }

    return (
        <SafeArea>
            <RHeader name='Application Timelines' showBack={false} iconRight='search' hasRightIcon onPressRight={() => setShow(!show)} hasSecondIcon={false} iconSecond='building-circle-check' onPressSecond={handleOrgFilter} />

            {/* Org context bar: org pill + grant type toggle */}
            <View style={styles.contextBar}>
                <TouchableOpacity style={styles.orgPill} onPress={handleOrgFilter} activeOpacity={0.75}>
                    <MaterialCommunityIcons name="office-building-outline" size={moderateScale(14)} color={colors.primary[600]} />
                    <NativeText style={styles.orgPillText} numberOfLines={1}>
                        {selectedOrg?.organisationTradingName || selectedOrg?.organisationName || 'Select Organization'}
                    </NativeText>
                    <MaterialCommunityIcons name="chevron-down" size={moderateScale(14)} color={colors.primary[400]} />
                </TouchableOpacity>
                <View style={styles.grantTypeToggle}>
                    <TouchableOpacity
                        style={[styles.grantTypePill, grantType === 'discretionary' && styles.grantTypePillActive]}
                        onPress={() => { setGrantType('discretionary'); setStatusFilter('all'); }}
                        activeOpacity={0.75}
                    >
                        <NativeText style={[styles.grantTypePillText, grantType === 'discretionary' && styles.grantTypePillTextActive]}>
                            Discretionary
                        </NativeText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.grantTypePill, grantType === 'mandatory' && styles.grantTypePillActive]}
                        onPress={() => { setGrantType('mandatory'); setMandatoryStatusFilter('all'); }}
                        activeOpacity={0.75}
                    >
                        <NativeText style={[styles.grantTypePillText, grantType === 'mandatory' && styles.grantTypePillTextActive]}>
                            Mandatory
                        </NativeText>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Status Filter Tabs — different options per grant type */}
            <View style={styles.filterScrollView}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScrollContent}
                >
                    {grantType === 'discretionary' ? (
                        ([
                            { key: 'all' as const, label: 'All Statuses', count: filterCounts.all },
                            { key: 'started' as const, label: 'Started', count: filterCounts.started },
                            { key: 'submitted' as const, label: 'Submitted', count: filterCounts.submitted },
                        ]).map(tab => (
                            <TouchableOpacity
                                key={tab.key}
                                style={[styles.filterTab, statusFilter === tab.key && styles.filterTabActive]}
                                onPress={() => setStatusFilter(tab.key)}
                            >
                                <NativeText style={[styles.filterTabText, statusFilter === tab.key && styles.filterTabTextActive]}>
                                    {tab.label}
                                </NativeText>
                                <View style={[styles.filterTabBadge, statusFilter === tab.key && styles.filterTabBadgeActive]}>
                                    <NativeText style={[styles.filterTabBadgeText, statusFilter === tab.key && styles.filterTabBadgeTextActive]}>
                                        {tab.count}
                                    </NativeText>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        ([
                            { key: 'all' as const, label: 'All', count: mandatoryFilterCounts.all },
                            { key: 'submitted' as const, label: 'Submitted', count: mandatoryFilterCounts.submitted },
                            { key: 'approved' as const, label: 'Approved', count: mandatoryFilterCounts.approved },
                            { key: 'pending' as const, label: 'Pending', count: mandatoryFilterCounts.pending },
                        ]).map(tab => (
                            <TouchableOpacity
                                key={tab.key}
                                style={[styles.filterTab, mandatoryStatusFilter === tab.key && styles.filterTabActive]}
                                onPress={() => setMandatoryStatusFilter(tab.key)}
                            >
                                <NativeText style={[styles.filterTabText, mandatoryStatusFilter === tab.key && styles.filterTabTextActive]}>
                                    {tab.label}
                                </NativeText>
                                <View style={[styles.filterTabBadge, mandatoryStatusFilter === tab.key && styles.filterTabBadgeActive]}>
                                    <NativeText style={[styles.filterTabBadgeText, mandatoryStatusFilter === tab.key && styles.filterTabBadgeTextActive]}>
                                        {tab.count}
                                    </NativeText>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </View>

            {/* Collapsible search bar */}
            {show && (
                <View style={styles.searchWrapper}>
                    <Searchbar
                        placeholder="Search by name, status, SDL…"
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                        inputStyle={{ fontSize: moderateScale(13) }}
                    />
                </View>
            )}

            {/* Application List — switches between discretionary timeline and mandatory applications */}
            {grantType === 'discretionary' ? (
                <FlatList data={filteredTimelineItems}
                    keyExtractor={(item) => `${item.projectId}`}
                    style={{ paddingHorizontal: scale(12), paddingVertical: scale(5), flex: 1, flexGrow: 1 }}
                    contentContainerStyle={{ paddingBottom: scale(24) }}
                    renderItem={renderList}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: scale(12) }} />}
                    removeClippedSubviews={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={21}
                    ListEmptyComponent={<REmpty title='No Applications Found' icon='rotate-ccw' subtitle={searchQuery ? 'No applications match your search. Try different keywords.' : 'You currently do not have any applications for tracking status. Please create an application.'} />}
                />
            ) : (
                <FlatList
                    data={filteredMandatoryItems}
                    keyExtractor={(item: MandatoryApplicationDto) => `mg-${item.id}`}
                    style={{ paddingHorizontal: scale(12), paddingVertical: scale(5), flex: 1, flexGrow: 1 }}
                    contentContainerStyle={{ paddingBottom: scale(24) }}
                    renderItem={({ item }: { item: MandatoryApplicationDto }) => (
                        <MandatoryTimelineItem
                            item={item}
                            onPress={(mgItem) => historyItemDetails({ appId: mgItem.id, item: mgToProjectTimeline(mgItem) })}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: scale(12) }} />}
                    removeClippedSubviews={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={21}
                    ListEmptyComponent={<REmpty title='No Mandatory Applications Found' icon='rotate-ccw' subtitle={searchQuery ? 'No applications match your search. Try different keywords.' : 'No mandatory grant applications found for this organisation.'} />}
                />
            )}
        </SafeArea>
    )
}

/**
 * Component to display individual project timeline item
 */
const ProjectTimelineItem = ({ item, onPress }: { item: ProjectTimeline, onPress: (item: ProjectTimeline) => void }) => {
    const getStageColor = (currentStage: string) => {
        const stage = currentStage.toLowerCase().trim();
        if (stage.includes('submitted')) return { bg: '#e0f2fe', text: '#0369a1', border: colors.primary[500] };
        if (stage.includes('rsa review') || stage.includes('review completed')) return { bg: '#dcfce7', text: '#15803d', border: colors.emerald[500] };
        if (stage.includes('started') || stage.includes('application started')) return { bg: '#f3f4f6', text: '#4b5563', border: colors.slate[400] };
        if (stage.includes('grants committee')) return { bg: '#f3e8ff', text: '#6b21a8', border: colors.purple[500] };
        if (stage.includes('evaluation')) return { bg: '#fef3c7', text: '#92400e', border: colors.yellow[500] };
        if (stage.includes('final')) return { bg: '#d1fae5', text: '#065f46', border: colors.emerald[600] };
        return { bg: '#f3f4f6', text: '#4b5563', border: colors.slate[400] };
    };

    const stageColors = getStageColor(item.currentStage);

    return (
        <TouchableOpacity style={[styles.card, { borderLeftColor: stageColors.border, borderLeftWidth: 5 }]} activeOpacity={0.7} onPress={() => onPress(item)}>
            {/* Header with Title and Badge */}
            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <Text variant='titleMedium' style={styles.projectTitle}>{item.projectName}</Text>
                    <Text variant='bodySmall' style={styles.projectSubtitle}>{item.windowTitle}</Text>
                </View>
                <View style={[styles.stageBadge, { backgroundColor: stageColors.bg }]}>
                    <NativeText style={[styles.stageBadgeText, { color: stageColors.text }]}>
                        {item.currentStage.toUpperCase()}
                    </NativeText>
                </View>
            </View>

            {/* Timeline/Progress Indicator */}
            <View style={styles.progressIndicator}>
                <ProgressDot completed={item.applicationStarted} />
                <ProgressLine completed={item.applicationStarted && item.applicationSubmitted} />
                <ProgressDot completed={item.applicationSubmitted} />
                <ProgressLine completed={item.applicationSubmitted && item.rsaReviewCompleted} />
                <ProgressDot completed={item.rsaReviewCompleted} active={!item.rsaReviewCompleted && item.applicationSubmitted} />
                <ProgressLine completed={item.rsaReviewCompleted && item.grantsCommitteeReview} />
                <ProgressDot completed={item.grantsCommitteeReview} />
                <ProgressLine completed={item.grantsCommitteeReview && item.evaluationCompleted} />
                <ProgressDot completed={item.evaluationCompleted} />
            </View>

            {/* Status Info */}
            <View style={styles.statusSection}>
                <NativeText style={styles.statusLabel}>STATUS</NativeText>
                <RRow style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <NativeText style={styles.statusValue}>{item.status}</NativeText>
                    <NativeText style={styles.statusDate}>Last Updated: {new Date(item.statusChangedDate).toLocaleDateString()}</NativeText>
                </RRow>
            </View>
        </TouchableOpacity>
    );
};

/** Derive progress-stage booleans from a mandatory grantStatus string */
function getMgStageFlags(grantStatus: string): {
    applicationStarted: boolean;
    applicationSubmitted: boolean;
    rsaReviewCompleted: boolean;
    grantsCommitteeReview: boolean;
    evaluationCompleted: boolean;
} {
    const s = (grantStatus || '').toLowerCase();
    const submitted = s.includes('submitted') || s.includes('rsa') || s.includes('committee') || s.includes('approved') || s.includes('evaluation') || s.includes('completed') || s.includes('final');
    const rsaDone = s.includes('rsa review completed') || s.includes('committee') || s.includes('approved') || s.includes('evaluation completed') || s.includes('completed') || s.includes('final');
    const committee = s.includes('committee') || s.includes('approved') || s.includes('evaluation completed') || s.includes('completed') || s.includes('final');
    const evalDone = s.includes('evaluation completed') || s.includes('completed') || s.includes('final');
    return {
        applicationStarted: true,
        applicationSubmitted: submitted,
        rsaReviewCompleted: rsaDone,
        grantsCommitteeReview: committee,
        evaluationCompleted: evalDone,
    };
}

/** Map a MandatoryApplicationDto to the ProjectTimeline shape expected by ApplicationStatusDetails */
function mgToProjectTimeline(mg: MandatoryApplicationDto): ProjectTimeline {
    const flags = getMgStageFlags(mg.grantStatus);
    return {
        projectId: mg.id,
        projectName: mg.referenceNo || `REF-${mg.id}`,
        projectShortName: mg.referenceNo || '',
        status: mg.grantStatus || '',
        statusChangedDate: String(mg.submissionDte || mg.dteCreated || new Date().toISOString()),
        organisationName: mg.organisation_Trading_Name || mg.organisation_Name || '',
        sdlNo: mg.organisationSDL || '',
        focusArea: null,
        subCategory: null,
        intervention: null,
        projectType: 'Mandatory Grant',
        windowTitle: mg.description || 'Mandatory Grant Application',
        projectEndDate: String(mg.closingDate || ''),
        rejectedAfterAssessment: false,
        isFinalStage: flags.evaluationCompleted,
        currentStage: mg.grantStatus || 'Application Started',
        ...flags,
    };
}

/**
 * Card component for mandatory grant applications — mirrors ProjectTimelineItem styling
 */
const MandatoryTimelineItem = ({ item, onPress }: { item: MandatoryApplicationDto; onPress: (item: MandatoryApplicationDto) => void }) => {
    const getMgStageColor = (status: string) => {
        const s = (status || '').toLowerCase().trim();
        if (s.includes('approved') || s.includes('final') || s.includes('completed')) return { bg: '#d1fae5', text: '#065f46', border: colors.emerald[600] };
        if (s.includes('committee')) return { bg: '#f3e8ff', text: '#6b21a8', border: colors.purple[500] };
        if (s.includes('evaluation')) return { bg: '#fef3c7', text: '#92400e', border: colors.yellow[500] };
        if (s.includes('rsa') || s.includes('review')) return { bg: '#dcfce7', text: '#15803d', border: colors.emerald[500] };
        if (s.includes('submitted')) return { bg: '#e0f2fe', text: '#0369a1', border: colors.primary[500] };
        if (s.includes('rejected') || s.includes('declined')) return { bg: '#fee2e2', text: '#991b1b', border: colors.red[500] };
        return { bg: '#f3f4f6', text: '#4b5563', border: colors.slate[400] };
    };

    const flags = getMgStageFlags(item.grantStatus);
    const stageColors = getMgStageColor(item.grantStatus);
    const title = item.description?.split('-')[0]?.trim() || item.referenceNo || 'Mandatory Grant';
    const subtitle = item.organisation_Trading_Name || item.organisation_Name || '';
    const dateLabel = item.submissionDte
        ? new Date(String(item.submissionDte)).toLocaleDateString()
        : item.dteCreated
            ? new Date(String(item.dteCreated)).toLocaleDateString()
            : '—';

    return (
        <TouchableOpacity
            style={[styles.card, { borderLeftColor: stageColors.border, borderLeftWidth: 5 }]}
            activeOpacity={0.7}
            onPress={() => onPress(item)}
        >
            {/* Header: title + status badge */}
            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <Text variant='titleMedium' style={styles.projectTitle} numberOfLines={2}>{title}</Text>
                    <Text variant='bodySmall' style={styles.projectSubtitle} numberOfLines={1}>{subtitle}</Text>
                </View>
                <View style={[styles.stageBadge, { backgroundColor: stageColors.bg }]}>
                    <NativeText style={[styles.stageBadgeText, { color: stageColors.text }]}>
                        {(item.grantStatus || 'STARTED').toUpperCase()}
                    </NativeText>
                </View>
            </View>

            {/* Progress indicator — mirrors DG dot/line structure */}
            <View style={styles.progressIndicator}>
                <ProgressDot completed={flags.applicationStarted} />
                <ProgressLine completed={flags.applicationStarted && flags.applicationSubmitted} />
                <ProgressDot completed={flags.applicationSubmitted} active={!flags.applicationSubmitted} />
                <ProgressLine completed={flags.applicationSubmitted && flags.rsaReviewCompleted} />
                <ProgressDot completed={flags.rsaReviewCompleted} active={!flags.rsaReviewCompleted && flags.applicationSubmitted} />
                <ProgressLine completed={flags.rsaReviewCompleted && flags.grantsCommitteeReview} />
                <ProgressDot completed={flags.grantsCommitteeReview} />
                <ProgressLine completed={flags.grantsCommitteeReview && flags.evaluationCompleted} />
                <ProgressDot completed={flags.evaluationCompleted} />
            </View>

            {/* Status footer */}
            <View style={styles.statusSection}>
                <NativeText style={styles.statusLabel}>STATUS</NativeText>
                <RRow style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <NativeText style={styles.statusValue}>{item.grantStatus || 'In Progress'}</NativeText>
                    <NativeText style={styles.statusDate}>Ref: {item.referenceNo || '—'}</NativeText>
                </RRow>
                <NativeText style={[styles.statusDate, { marginTop: 2 }]}>Last Updated: {dateLabel}</NativeText>
            </View>
        </TouchableOpacity>
    );
};

/**
 * Progress indicator dot component
 */
const ProgressDot = ({ completed, active }: { completed: boolean; active?: boolean }) => {
    if (completed) {
        return (
            <View style={[styles.progressDot, styles.progressDotCompleted]}>
                <MaterialCommunityIcons name="check" size={moderateScale(12)} color="white" />
            </View>
        );
    }
    if (active) {
        return (
            <View style={[styles.progressDot, styles.progressDotActive]}>
                <View style={styles.progressDotActivePulse} />
            </View>
        );
    }
    return <View style={[styles.progressDot, styles.progressDotPending]} />;
};

/**
 * Progress indicator line component
 */
const ProgressLine = ({ completed }: { completed: boolean }) => {
    return <View style={[styles.progressLine, completed && styles.progressLineCompleted]} />;
};


type OrgItem = { id: number; organisationTradingName: string; organisationName: string; sdfId?: string };

function OrganizationBottomSheet({ organizations, selectedOrgId, onSelectOrg, close }: {
    organizations: OrgItem[];
    selectedOrgId: number | undefined;
    onSelectOrg: (orgId: number) => void;
    close: () => void;
}) {
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredOrgs = React.useMemo((): OrgItem[] => {
        if (!searchQuery.trim()) return organizations;

        const query = searchQuery.toLowerCase();
        return organizations.filter(org =>
            (org.organisationTradingName?.toLowerCase() || '').includes(query) ||
            (org.organisationName?.toLowerCase() || '').includes(query) ||
            (org.sdfId?.toLowerCase() || '').includes(query)
        );
    }, [organizations, searchQuery]);

    const handleSelectOrg = (orgId: number) => {
        onSelectOrg(orgId);
        // Use setTimeout to ensure the state is updated first
        setTimeout(() => {
            close();
        }, 100);
    };

    return (
        <View style={{ flex: 1, paddingHorizontal: scale(16), paddingTop: scale(12) }}>
            {/* Header */}
            <Text variant='headlineMedium' style={styles.orgBottomSheetTitle}>Switch Organization</Text>
            <Text variant='bodySmall' style={{ fontSize: moderateScale(12) }}>choose the entity for your application view.</Text>

            <TouchableOpacity onPress={close} style={{ position: "absolute", top: scale(5), right: scale(8), backgroundColor: colors.red[100], borderRadius: scale(100), padding: scale(5) }}>
                <AntDesign name="close" size={moderateScale(24)} color={colors.gray[600]} />
            </TouchableOpacity>

            {/* Search Bar */}
            <Searchbar
                placeholder='Search for organization or SDL...'
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ borderRadius: 10, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate[200] }}
            />

            {/* Organization List — BottomSheetFlatList is required for FlatList inside a bottomsheet */}
            <BottomSheetFlatList<OrgItem>
                data={filteredOrgs}
                keyExtractor={(item: OrgItem) => `${item.id}`}
                renderItem={({ item }: { item: OrgItem }) => (
                    <SwitchOrgItem
                        item={item}
                        isSelected={selectedOrgId === item.id}
                        onPress={() => handleSelectOrg(item.id)}
                    />
                )}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: scale(12), paddingBottom: scale(36) }}
                ListFooterComponent={<View style={{ height: scale(8) }} />}
                bounces={false}
                overScrollMode="never"
            />
        </View>
    );
}

/**
 * Individual organization item for the switch organization bottom sheet
 */
const SwitchOrgItem = ({ item, isSelected, onPress }: { item: OrgItem; isSelected: boolean; onPress: () => void }) => {
    const orgName = item.organisationTradingName || item.organisationName || '';
    const initials = orgName.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('') || '?';
    return (
        <TouchableOpacity
            style={[
                styles.orgItem,
                isSelected && styles.orgItemSelected
            ]}
            onPress={onPress}
        >
            <View style={styles.orgItemLeft}>
                <View style={[styles.orgItemIcon, isSelected && styles.orgItemIconSelected]}>
                    <NativeText style={[styles.orgItemInitials, isSelected && styles.orgItemInitialsSelected]}>
                        {initials}
                    </NativeText>
                </View>
                <RCol style={styles.orgItemInfo}>
                    <RRow style={{ alignItems: 'center', gap: 6 }}>
                        <Text style={styles.orgItemName} numberOfLines={1}>
                            {item.organisationTradingName || item.organisationName}
                        </Text>
                        <MaterialCommunityIcons
                            name="check-decagram"
                            size={moderateScale(14)}
                            color={colors.primary[600]}
                        />
                    </RRow>
                    <Text style={styles.orgItemSdl} numberOfLines={1}>
                        SDL: {item.sdfId || item.id}
                    </Text>
                </RCol>
            </View>
            {isSelected && (
                <View style={styles.orgItemCheckmark}>
                    <MaterialCommunityIcons
                        name="check-circle"
                        size={moderateScale(24)}
                        color={colors.primary[600]}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
}


export default HistoryScreen
