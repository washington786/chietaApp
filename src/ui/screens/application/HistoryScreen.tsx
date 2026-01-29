import { FlatList, View, TouchableOpacity, Text as NativeText } from 'react-native'
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
import { Searchbar } from 'react-native-paper'

/* ---------------- SCREEN ---------------- */

const HistoryScreen = () => {
    const { historyItemDetails } = usePageTransition()
    const { user } = useSelector((state: RootState) => state.auth)

    const [selectedOrgId, setSelectedOrgId] = useState<number>()
    const [searchQuery, setSearchQuery] = useState('')
    const [show, setShow] = useState(false)

    const sdfId = user?.sdfId

    const { data: orgsData, isLoading: orgsLoading } =
        useGetOrganizationsBySdfIdQuery(sdfId || 0, { skip: !sdfId })

    useEffect(() => {
        if (orgsData?.length && !selectedOrgId) {
            setSelectedOrgId(orgsData[0].id)
        }
    }, [orgsData])

    const { data, isLoading: timelineLoading, error } =
        useGetProjectTimelineQuery(selectedOrgId || 0, { skip: !selectedOrgId })

    useEffect(() => {
        if (error) {
            showToast({ title: 'Error', message: 'Failed to load timeline', type: 'error' })
        }
    }, [error])

    const items = useMemo(() => {
        if (!searchQuery) return data?.items || []
        const q = searchQuery.toLowerCase()
        return data?.items?.filter(i =>
            i.projectName.toLowerCase().includes(q) ||
            i.windowTitle.toLowerCase().includes(q)
        ) || []
    }, [data, searchQuery])

    if (orgsLoading || timelineLoading) return <RListLoading count={6} />

    return (
        <SafeArea>
            <RHeader
                name="Application Timelines"
                iconRight="search"
                hasRightIcon
                onPressRight={() => setShow(!show)}
            />

            {show && (
                <RCol style={{ padding: 10 }}>
                    <Searchbar
                        placeholder="Search application"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </RCol>
            )}

            <FlatList
                data={items}
                keyExtractor={i => String(i.projectId)}
                renderItem={({ item }) => (
                    <ProjectTimelineItem
                        item={item}
                        onPress={() => historyItemDetails({ appId: item.projectId, item })}
                    />
                )}
                contentContainerStyle={{ padding: 12 }}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                ListEmptyComponent={<REmpty title="No Applications Found" />}
            />
        </SafeArea>
    )
}

/* ---------------- CARD ---------------- */

const ProjectTimelineItem = ({ item, onPress }: { item: ProjectTimeline; onPress: () => void }) => {

    const stages = [
        { label: 'Application Started', done: item.applicationStarted },
        { label: 'Submitted', done: item.applicationSubmitted },
        { label: 'RSA Review', done: item.rsaReviewCompleted },
        { label: 'Grants Committee', done: item.grantsCommitteeReview },
        { label: 'Evaluation', done: item.evaluationCompleted },
    ]

    const currentIndex = stages.findIndex(s => !s.done)
    const visibleStages = stages.slice(currentIndex === -1 ? stages.length - 1 : currentIndex)

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            style={{
                borderWidth: 2,
                borderColor: colors.violet[700],
                borderRadius: 16,
                padding: 14,
                backgroundColor: '#fff',
                width: '100%',
                overflow: 'hidden',
            }}
        >
            {/* Title */}
            <NativeText
                style={{ fontSize: 16, fontWeight: '700', color: colors.violet[900] }}
                numberOfLines={2}
            >
                {item.projectName}
            </NativeText>

            {/* Window */}
            <NativeText
                style={{ marginTop: 4, color: colors.violet[600], fontSize: 13 }}
            >
                {item.windowTitle}
            </NativeText>

            {/* Chevron Stepper */}
            <ChevronStepper stages={visibleStages} />
        </TouchableOpacity>
    )
}

/* ---------------- CHEVRON ---------------- */

const ChevronStepper = ({ stages }: { stages: { label: string; done: boolean }[] }) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                marginTop: 14,
                width: '100%',
                borderRadius: 8,
                overflow: 'hidden',
            }}
        >
            {stages.map((stage, index) => {
                const isCurrent = index === 0

                const bg =
                    stage.label === 'Application Started'
                        ? colors.red[500]
                        : isCurrent
                        ? colors.emerald[500]
                        : colors.zinc[300]

                return (
                    <View key={stage.label} style={{ flex: 1, flexDirection: 'row' }}>
                        <View
                            style={{
                                flex: 1,
                                paddingVertical: 8,
                                backgroundColor: bg,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <NativeText
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                style={{
                                    fontSize: 11,
                                    fontWeight: '700',
                                    color: '#fff',
                                    textAlign: 'center',
                                }}
                            >
                                {stage.label}
                            </NativeText>
                        </View>

                        {index !== stages.length - 1 && (
                            <View
                                style={{
                                    width: 0,
                                    height: 0,
                                    borderTopWidth: 14,
                                    borderBottomWidth: 14,
                                    borderLeftWidth: 10,
                                    borderTopColor: 'transparent',
                                    borderBottomColor: 'transparent',
                                    borderLeftColor: bg,
                                }}
                            />
                        )}
                    </View>
                )
            })}
        </View>
    )
}

export default HistoryScreen
