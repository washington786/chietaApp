import { StyleSheet, View, FlatList, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import { RCol, RRow, RListLoading } from '@/components/common'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { DiscretionaryWindow } from '@/core/models/DiscretionaryDto'
import { useGetActiveWindowsQuery } from '@/store/api/api'
import { showToast } from '@/core'


const ActiveWindow = () => {
    const { data: apiData, isLoading, error } = useGetActiveWindowsQuery(undefined)

    const discretionaryWindows: DiscretionaryWindow[] = apiData?.result?.items?.map((item: any) => item.discretionaryWindow) || []

    useEffect(() => {
        if (error) {
            showToast({
                message: 'Failed to load active windows',
                type: 'error',
                title: 'Error',
                position: 'top',
            })
        }
    }, [error])

    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        // Check if date is valid and not a default date
        if (isNaN(date.getTime()) || date.getFullYear() === 1) {
            return 'N/A'
        }
        return date.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
        }).format(amount)
    }

    const renderCard = ({ item }: { item: DiscretionaryWindow }) => (
        <RCol style={styles.card}>
            {/* Header */}
            <RRow style={styles.cardHeader}>
                <RCol style={{ flex: 1 }}>
                    <Text variant='titleMedium' style={styles.cardTitle}>{item.title}</Text>
                    <Text variant='labelSmall' style={styles.cardReference}>{item.reference}</Text>
                </RCol>
                <View style={[styles.statusBadge, { backgroundColor: item.activeYN ? colors.green[500] : colors.red[500] }]}>
                    <Text style={styles.statusText}>{item.activeYN ? 'Active' : 'Inactive'}</Text>
                </View>
            </RRow>

            {/* Description */}
            {item.description && (
                <Text variant='bodySmall' style={styles.description}>{item.description}</Text>
            )}

            {/* Key Info */}
            <RCol style={styles.infoSection}>
                <InfoItem icon='code' label='Program Code' value={item.progCd} />
                <InfoItem icon='attach-money' label='Total Budget' value={formatCurrency(item.totBdgt)} />
            </RCol>

            {/* Dates */}
            <RCol style={styles.dateSection}>
                <Text variant='labelSmall' style={styles.sectionLabel}>Timeline</Text>
                <InfoItem icon='event' label='Launch Date' value={formatDate(item.launchDte)} />
                <InfoItem icon='deadline' label='Deadline' value={formatDate(item.deadlineTime)} />
                <InfoItem icon='date-range' label='Contract Start' value={formatDate(item.contractStartDate)} />
                <InfoItem icon='date-range' label='Contract End' value={formatDate(item.contractEndDate)} />
            </RCol>

            {/* Metadata */}
            <RCol style={styles.metaSection}>
                <Text variant='labelSmall' style={styles.metaText}>Updated: {formatDate(item.dteUpd)}</Text>
            </RCol>
        </RCol>
    )

    return (
        <View style={styles.container}>
            {isLoading ? (
                <RListLoading count={3} />
            ) : discretionaryWindows.length > 0 ? (
                <FlatList
                    data={discretionaryWindows}
                    renderItem={renderCard}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={Dimensions.get('window').width - 40}
                    decelerationRate="fast"
                    contentContainerStyle={styles.carousel}
                />
            ) : (
                <RCol style={styles.emptyState}>
                    <MaterialIcons name='inbox' size={48} color={colors.zinc[400]} />
                    <Text variant='bodyMedium' style={styles.emptyText}>No discretionary windows available</Text>
                </RCol>
            )}
        </View>
    )
}

function InfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <RRow style={styles.infoItem}>
            <MaterialIcons name={icon as any} size={16} color={colors.primary[900]} />
            <RCol style={{ flex: 1, marginLeft: 8 }}>
                <Text variant='labelSmall' style={styles.infoLabel}>{label}</Text>
                <Text variant='bodySmall' style={styles.infoValue}>{value}</Text>
            </RCol>
        </RRow>
    )
}

export default ActiveWindow

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.zinc[50],
        paddingVertical: 12,
    },
    carousel: {
        paddingHorizontal: 12,
        gap: 16,
    },
    card: {
        width: Dimensions.get('window').width - 40,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        gap: 12,
    },
    cardHeader: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardTitle: {
        color: colors.primary[900],
        fontWeight: '600',
        marginBottom: 4,
    },
    cardReference: {
        color: colors.zinc[500],
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    description: {
        color: colors.zinc[700],
        lineHeight: 18,
    },
    infoSection: {
        gap: 8,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: colors.zinc[200],
    },
    dateSection: {
        gap: 8,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: colors.zinc[200],
    },
    sectionLabel: {
        color: colors.primary[900],
        fontWeight: '600',
        marginBottom: 4,
    },
    infoItem: {
        alignItems: 'center',
    },
    infoLabel: {
        color: colors.zinc[600],
    },
    infoValue: {
        color: colors.zinc[900],
        fontWeight: '500',
        marginTop: 2,
    },
    metaSection: {
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: colors.zinc[200],
    },
    metaText: {
        color: colors.zinc[500],
        fontSize: 11,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    emptyText: {
        color: colors.zinc[600],
    },
})