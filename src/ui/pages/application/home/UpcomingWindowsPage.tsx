import React, { memo, useCallback, useMemo, useState } from 'react'
import {
    FlatList,
    ListRenderItemInfo,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { moderateScale } from '@/utils/responsive'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { REmpty, RListLoading, SafeArea } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import colors from '@/config/colors'
import { DiscretionaryWindow } from '@/core/models/DiscretionaryDto'
import { useGetUpcomingEventsQuery } from '@/store/api/api'
import { daysChipColor, daysLabel, daysUntil, EventCardProps, fmtDate, GrantType, TOGGLE_OPTIONS, ToggleProps } from '@/core/helpers/upcomings'
import { UpcomingStyles as styles } from '@/styles/UpcomingStyles'

const EventCard = memo(({ item, index }: EventCardProps) => {
    const days = daysUntil(item.launchDte)

    return (
        <Animated.View entering={FadeInDown.duration(500).delay(index * 80).springify()}>
            <View style={styles.card}>
                {/* Top row: program code + days chip */}
                <View style={styles.cardTopRow}>
                    <View style={styles.progBadge}>
                        <Text style={styles.progBadgeText}>{item.progCd}</Text>
                    </View>
                    <View style={[styles.daysChip, { backgroundColor: daysChipColor(days) }]}>
                        <MaterialCommunityIcons name="clock-outline" size={moderateScale(12)} color="#fff" style={{ marginRight: 4 }} />
                        <Text style={styles.daysChipText}>{daysLabel(days)}</Text>
                    </View>
                </View>

                {/* Title */}
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>

                {/* Reference */}
                <View style={styles.refRow}>
                    <MaterialCommunityIcons name="tag-outline" size={moderateScale(13)} color={colors.primary[400]} />
                    <Text style={styles.refText}>{item.reference}</Text>
                </View>

                {/* Description */}
                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Dates row */}
                <View style={styles.datesRow}>
                    <View style={styles.dateBlock}>
                        <MaterialCommunityIcons name="rocket-launch-outline" size={moderateScale(14)} color={colors.primary[400]} />
                        <View style={styles.dateTexts}>
                            <Text style={styles.dateLbl}>Launch Date</Text>
                            <Text style={styles.dateVal}>{fmtDate(item.launchDte)}</Text>
                        </View>
                    </View>
                    <View style={styles.dateSep} />
                    <View style={styles.dateBlock}>
                        <MaterialCommunityIcons name="flag-checkered" size={moderateScale(14)} color={colors.primary[400]} />
                        <View style={styles.dateTexts}>
                            <Text style={styles.dateLbl}>Deadline</Text>
                            <Text style={styles.dateVal}>{fmtDate(item.deadlineTime)}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Animated.View>
    )
})


const GrantToggle = memo(({ value, onChange }: ToggleProps) => (
    <View style={styles.toggleContainer}>
        <View style={styles.toggleHeader}>
            <Ionicons name="calendar-outline" size={moderateScale(14)} color={colors.primary[500]} />
            <Text style={styles.toggleHeaderText}>Grant Type</Text>
        </View>
        <View style={styles.toggle}>
            {TOGGLE_OPTIONS.map((opt) => {
                const active = value === opt.type
                return (
                    <TouchableOpacity
                        key={opt.type}
                        activeOpacity={0.75}
                        style={[styles.togglePill, active && styles.togglePillActive]}
                        onPress={() => onChange(opt.type)}
                    >
                        {active && <View style={styles.togglePillGlow} />}
                        <View style={[styles.toggleIconWrap, active && styles.toggleIconWrapActive]}>
                            <Ionicons
                                name={active ? opt.iconActive : opt.icon}
                                size={moderateScale(18)}
                                color={active ? '#fff' : colors.primary[500]}
                            />
                        </View>
                        <View style={styles.toggleTextBlock}>
                            <Text style={[styles.togglePillText, active && styles.togglePillTextActive]}>
                                {opt.label}
                            </Text>
                        </View>
                        {active && (
                            <View style={styles.toggleActiveDot} />
                        )}
                    </TouchableOpacity>
                )
            })}
        </View>
    </View>
))

// ─── Page ─────────────────────────────────────────────────────────────────────────
const UpcomingWindowsPage = () => {
    const [grantType, setGrantType] = useState<GrantType>('discretionary')

    const { data, isLoading, isFetching, isError, refetch } = useGetUpcomingEventsQuery(undefined, {
        skip: grantType !== 'discretionary',
    })

    const events: DiscretionaryWindow[] = useMemo(
        () => (grantType === 'discretionary' ? (data?.items ?? []) : []),
        [grantType, data],
    )

    const renderItem = useCallback(
        ({ item, index }: ListRenderItemInfo<DiscretionaryWindow>) => (
            <EventCard item={item} index={index} />
        ),
        [],
    )

    const keyExtractor = useCallback((item: DiscretionaryWindow) => String(item.id), [])

    const separator = useCallback(() => <View style={styles.separator} />, [])

    const emptyComp = useMemo(() => {
        if (isLoading || isFetching) return null
        return (
            <REmpty
                title={
                    grantType === 'mandatory'
                        ? 'No mandatory events scheduled'
                        : 'No upcoming events'
                }
                subtitle={
                    grantType === 'mandatory'
                        ? 'Mandatory grant windows will appear here once scheduled'
                        : 'Check back soon for upcoming discretionary grant windows'
                }
                icon='briefcase'
                style={{ minHeight: 300 }}
            />
        )
    }, [isLoading, isFetching, grantType])

    const header = useMemo(
        () => <GrantToggle value={grantType} onChange={setGrantType} />,
        [grantType],
    )

    if (isLoading) return <RListLoading count={5} />

    return (
        <SafeArea>
            <RHeader name="Upcoming Grant Events" />
            {isError && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>Failed to load events. </Text>
                    <TouchableOpacity onPress={refetch}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}
            <FlatList
                data={events}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ListHeaderComponent={header}
                ListEmptyComponent={emptyComp}
                ItemSeparatorComponent={separator}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews
                initialNumToRender={8}
                maxToRenderPerBatch={8}
                windowSize={11}
            />
        </SafeArea>
    )
}

export default UpcomingWindowsPage