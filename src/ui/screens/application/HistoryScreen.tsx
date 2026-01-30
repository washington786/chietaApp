import { FlatList, View, TouchableOpacity, Text as NativeText } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { RCol, REmpty, RListLoading, SafeArea, RRow } from '@/components/common'
import colors from '@/config/colors'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { showToast } from '@/core'
import { useGetOrganizationsBySdfIdQuery, useGetProjectTimelineQuery } from '@/store/api/api'
import { ProjectTimeline } from '@/core/models/DiscretionaryDto'
import RHeader from '@/components/common/RHeader'
import { history_styles as styles } from '@/styles/HistoryStyles';
import { Searchbar, Text } from 'react-native-paper'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet'
import AntDesign from '@expo/vector-icons/AntDesign';

const HistoryScreen = () => {
    const { historyItemDetails } = usePageTransition();
    const { user } = useSelector((state: RootState) => state.auth);

    // State for selected organization
    const [selectedOrgId, setSelectedOrgId] = useState<number | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<'all' | 'started' | 'submitted' | 'rsa review'>('all');

    const sdfId = user?.sdfId;

    const { data: orgsData, isLoading: orgsLoading, error: orgsError } = useGetOrganizationsBySdfIdQuery(sdfId || 0, {
        skip: !sdfId
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

    // Set default organization when data loads
    useEffect(() => {
        if (organizations.length > 0 && selectedOrgId === undefined) {
            setSelectedOrgId(organizations[0].id);
        }
    }, [organizations, selectedOrgId]);

    // Fetch project timeline data based on selected organization
    const { data, isLoading: timelineLoading, error: timelineError } = useGetProjectTimelineQuery(
        selectedOrgId || 0,
        { skip: !selectedOrgId }
    );


    const timelineItems = useMemo(() => {
        return data?.items || [];
    }, [data]);

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
        }} />, { snapPoints: ["60%"] });
    }


    if (orgsLoading || timelineLoading) {
        return <RListLoading count={7} />
    }

    return (
        <SafeArea>
            <RHeader name='Application Timelines' showBack={false} iconRight='search' hasRightIcon onPressRight={() => setShow(!show)} hasSecondIcon={true} iconSecond='building-circle-check' onPressSecond={handleOrgFilter} />

            {/* Status Filter Tabs */}
            <RCol style={{ paddingHorizontal: 12 }}>
                <Text style={{ fontWeight: 'thin', fontSize: 10, color: colors.gray[400] }}>Filter by Status:</Text>

                <View style={styles.filterTabsContainer}>
                    <TouchableOpacity
                        style={[styles.filterTab, statusFilter === 'all' && styles.filterTabActive]}
                        onPress={() => setStatusFilter('all')}
                    >
                        <Text style={[styles.filterTabText, statusFilter === 'all' && styles.filterTabTextActive]}>All Statuses</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterTab, statusFilter === 'started' && styles.filterTabActive]}
                        onPress={() => setStatusFilter('started')}
                    >
                        <Text style={[styles.filterTabText, statusFilter === 'started' && styles.filterTabTextActive]}>Started</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterTab, statusFilter === 'submitted' && styles.filterTabActive]}
                        onPress={() => setStatusFilter('submitted')}
                    >
                        <Text style={[styles.filterTabText, statusFilter === 'submitted' && styles.filterTabTextActive]}>Submitted</Text>
                    </TouchableOpacity>
                </View>
            </RCol>

            {
                show && (

                    <RCol style={{
                        paddingVertical: 6,
                        paddingHorizontal: 12
                    }}>
                        <Searchbar
                            placeholder="Search application"
                            onChangeText={setSearchQuery}
                            value={searchQuery}
                            style={{ backgroundColor: colors.zinc[50], borderWidth: 1, borderColor: colors.zinc[300] }}
                        />
                    </RCol>
                )
            }

            {/* Timeline List */}
            <FlatList data={filteredTimelineItems}
                keyExtractor={(item) => `${item.projectId}`}
                style={{ paddingHorizontal: 12, paddingVertical: 5, flex: 1, flexGrow: 1 }}
                contentContainerStyle={{ paddingBottom: 24 }}
                renderItem={renderList}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                removeClippedSubviews={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={21}
                ListEmptyComponent={<REmpty title='No Applications Found' icon='rotate-ccw' subtitle={searchQuery ? 'No applications match your search. Try different keywords.' : 'You currently do not have any applications for tracking status. Please create an application.'} />}
            />
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

/**
 * Progress indicator dot component
 */
const ProgressDot = ({ completed, active }: { completed: boolean; active?: boolean }) => {
    if (completed) {
        return (
            <View style={[styles.progressDot, styles.progressDotCompleted]}>
                <MaterialCommunityIcons name="check" size={12} color="white" />
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


function OrganizationBottomSheet({ organizations, selectedOrgId, onSelectOrg, close }: {
    organizations: Array<{ id: number; organisationTradingName: string; organisationName: string; sdfId?: string }>;
    selectedOrgId: number | undefined;
    onSelectOrg: (orgId: number) => void;
    close: () => void;
}) {
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredOrgs = React.useMemo(() => {
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
        <RCol style={styles.organizationBottomSheet}>
            {/* Header */}
            <Text variant='headlineMedium' style={styles.orgBottomSheetTitle}>Switch Organization</Text>
            <Text variant='bodySmall' style={{ fontSize: 12 }}>choose the entity for your application view.</Text>

            <TouchableOpacity onPress={close} style={{ position: "absolute", top: 5, right: 8, backgroundColor: colors.red[100], borderRadius: 100, padding: 5 }}>
                <AntDesign name="close" size={24} color={colors.gray[600]} />
            </TouchableOpacity>

            {/* Search Bar */}
            <Searchbar
                placeholder='Search for organization or SDL...'
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ borderRadius: 10, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate[200] }}
            />

            {/* Organization List */}
            <FlatList
                data={filteredOrgs}
                keyExtractor={(item) => `${item.id}`}
                renderItem={({ item }) => (
                    <SwitchOrgItem
                        item={item}
                        isSelected={selectedOrgId === item.id}
                        onPress={() => handleSelectOrg(item.id)}
                    />
                )}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
            />
        </RCol>
    );
}

/**
 * Individual organization item for the switch organization bottom sheet
 */
const SwitchOrgItem = ({ item, isSelected, onPress }: { item: any; isSelected: boolean; onPress: () => void }) => {
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
                    <MaterialCommunityIcons
                        name="office-building"
                        size={24}
                        color={isSelected ? colors.white : colors.primary[600]}
                    />
                </View>
                <RCol style={styles.orgItemInfo}>
                    <RRow style={{ alignItems: 'center', gap: 6 }}>
                        <Text style={styles.orgItemName} numberOfLines={1}>
                            {item.organisationTradingName || item.organisationName}
                        </Text>
                        <MaterialCommunityIcons
                            name="check-decagram"
                            size={14}
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
                        size={24}
                        color={colors.primary[600]}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
}


export default HistoryScreen