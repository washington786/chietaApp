import { FlatList, StyleSheet, View, TouchableOpacity, Text as NativeText } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { RCol, REmpty, RListLoading, SafeArea } from '@/components/common'
import colors from '@/config/colors'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { showToast } from '@/core'
import { useGetOrganizationsBySdfIdQuery, useGetProjectTimelineQuery } from '@/store/api/api'
import { ProjectTimeline } from '@/core/models/DiscretionaryDto'
import RHeader from '@/components/common/RHeader'
import { history_styles as styles } from '@/styles/HistoryStyles';
import { Searchbar } from 'react-native-paper'

const HistoryScreen = () => {
    const { historyItemDetails } = usePageTransition();
    const { user } = useSelector((state: RootState) => state.auth);

    // State for selected organization
    const [selectedOrgId, setSelectedOrgId] = useState<number | undefined>(undefined);

    const sdfId = user?.sdfId;

    const { data: orgsData, isLoading: orgsLoading, error: orgsError } = useGetOrganizationsBySdfIdQuery(sdfId || 0, {
        skip: !sdfId
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [show, setShow] = useState<boolean>(false);

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
        if (!searchQuery.trim()) {
            return timelineItems;
        }

        const query = searchQuery.toLowerCase().trim();
        return timelineItems.filter(item =>
            item.projectName.toLowerCase().includes(query) ||
            item.windowTitle.toLowerCase().includes(query) ||
            item.organisationName.toLowerCase().includes(query) ||
            item.status.toLowerCase().includes(query) ||
            item.sdlNo.toLowerCase().includes(query)
        );
    }, [timelineItems, searchQuery]);

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

    const renderList = ({ index, item }: { index: number, item: ProjectTimeline }) => {
        return (
            <View key={`proj-${item.projectId}`}>
                <ProjectTimelineItem item={item} onPress={() => historyItemDetails({ appId: item.projectId, item })} />
            </View>
        )
    }

    const renderOrgItem = ({ item }: { item: any }) => {
        const isSelected = selectedOrgId === item.id;
        return (
            <TouchableOpacity
                onPress={() => setSelectedOrgId(item.id)}
                style={[
                    styles.orgChip,
                    isSelected && styles.orgChipSelected
                ]}
            >
                <NativeText style={[
                    styles.orgChipText,
                    isSelected && styles.orgChipTextSelected
                ]} numberOfLines={1}>
                    {item.organisationTradingName || item.organisationName || 'Unknown'}
                </NativeText>
            </TouchableOpacity>
        );
    };

    if (orgsLoading || timelineLoading) {
        return <RListLoading count={7} />
    }

    return (
        <SafeArea>
            <RHeader name='Application Timelines' showBack={false} iconRight='search' hasRightIcon onPressRight={() => setShow(!show)} />

            {/* Organizations Filter */}
            {organizations.length > 0 && (
                <View style={styles.orgFilterContainer}>
                    <FlatList
                        data={organizations}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={renderOrgItem}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.orgListContent}
                    />
                </View>
            )}

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
                renderItem={renderList}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
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
        if (stage.includes('submitted')) return { bg: '#fef3c7', text: '#92400e' };
        if (stage.includes('rsa review') || stage.includes('review completed')) return { bg: '#dbeafe', text: '#1e40af' };
        if (stage.includes('started') || stage.includes('application started')) return { bg: '#f3f4f6', text: '#4b5563' };
        if (stage.includes('grants committee')) return { bg: '#e0f2fe', text: '#0369a1' };
        if (stage.includes('evaluation')) return { bg: '#e9d5ff', text: '#6b21a8' };
        if (stage.includes('final')) return { bg: '#d1fae5', text: '#065f46' };
        return { bg: '#f3f4f6', text: '#4b5563' };
    };

    const stageColors = getStageColor(item.currentStage);

    return (
        <TouchableOpacity style={[styles.card, { borderLeftColor: stageColors.text, borderLeftWidth: 4 }]} activeOpacity={0.7} onPress={() => onPress(item)}>
            {/* Header Row */}
            <View style={styles.headerRow}>
                <NativeText style={styles.projectName} numberOfLines={2}>{item.projectName}</NativeText>
                <View style={[styles.stageBadge, { backgroundColor: stageColors.bg }]}>
                    <NativeText style={[styles.stageBadgeText, { color: stageColors.text }]}>
                        {item.currentStage}
                    </NativeText>
                </View>
            </View>

            {/* Details Row */}
            <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                    <NativeText style={styles.detailLabel}>Window</NativeText>
                    <NativeText style={styles.detailValue} numberOfLines={1}>{item.windowTitle}</NativeText>
                </View>
                <View style={styles.detailItem}>
                    <NativeText style={styles.detailLabel}>Status</NativeText>
                    <NativeText style={styles.detailValue} numberOfLines={1}>{item.status}</NativeText>
                </View>
            </View>

            {/* Checklist Row */}
            <View style={styles.checklistRow}>
                <ChecklistItem label="Application Started" completed={item.applicationStarted} />
                <ChecklistItem label="Submitted" completed={item.applicationSubmitted} />
                <ChecklistItem label="RSA Review" completed={item.rsaReviewCompleted} />
                <ChecklistItem label="Grants Committee" completed={item.grantsCommitteeReview} />
                <ChecklistItem label="Evaluation" completed={item.evaluationCompleted} />
            </View>

            {/* Date Row */}
            <View style={styles.dateRow}>
                <NativeText style={styles.dateLabel}>
                    Last Updated: {new Date(item.statusChangedDate).toLocaleDateString()}
                </NativeText>
            </View>
        </TouchableOpacity>
    );
};

/**
 * Component to display individual checklist item
 */
const ChecklistItem = ({ label, completed }: { label: string; completed: boolean }) => {
    return (
        <View style={styles.checkItem}>
            <View style={[styles.checkCircle, { backgroundColor: completed ? colors.emerald[500] : colors.slate[200] }]}>
                <NativeText style={[styles.checkmark, { opacity: completed ? 1 : 0 }]}>✓</NativeText>
            </View>
            <NativeText style={[styles.checkLabel, { opacity: completed ? 1 : 0.6 }]}>{label}</NativeText>
        </View>
    );
};

export default HistoryScreen