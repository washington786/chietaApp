import { StyleSheet, View, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import { RCol, RListLoading } from '@/components/common'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { DiscretionaryWindow } from '@/core/models/DiscretionaryDto'
import { useGetActiveWindowsQuery } from '@/store/api/api'
import { showToast } from '@/core'
import { LinearGradient } from 'expo-linear-gradient'


const DgActiveWindow = () => {
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
        <TouchableOpacity activeOpacity={0.5}>
            <View style={styles.card}>

                {/* Top Row */}
                <View style={styles.headerRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.reference}>{item.reference}</Text>
                    </View>

                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: item.activeYN ? colors.green[500] : colors.red[500] }
                    ]}>
                        <Text style={styles.statusText}>
                            {item.activeYN ? 'Active' : 'Inactive'}
                        </Text>
                    </View>
                </View>

                {/* Budget */}
                <Text style={styles.budget}>
                    {formatCurrency(item.totBdgt)}
                </Text>

                {/* Dates Row */}
                <View style={styles.dateRow}>
                    <View>
                        <Text style={styles.dateLabel}>Launch</Text>
                        <Text style={styles.dateValue}>{formatDate(item.launchDte)}</Text>
                    </View>

                    <View>
                        <Text style={styles.dateLabel}>Deadline</Text>
                        <Text style={styles.deadlineValue}>
                            {formatDate(item.deadlineTime)}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );


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

export default DgActiveWindow

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    carousel: {
        paddingHorizontal: 12,
        gap: 8,
        paddingVertical: 8
    },
    card: {
        backgroundColor: colors.primary[50],
        borderWidth: 1,
        borderColor: colors.primary[200],
        width: Dimensions.get('window').width * 0.65,
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },

    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },

    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
    },

    reference: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    statusText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#FFF',
    },

    budget: {
        fontSize: 18,
        fontWeight: '800',
        color: '#2B2B2B',
        marginVertical: 6,
    },

    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },

    dateLabel: {
        fontSize: 11,
        color: '#999',
    },

    dateValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },

    deadlineValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#D32F2F',
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