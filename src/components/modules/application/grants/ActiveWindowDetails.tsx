import { StyleSheet, View, ScrollView, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { moderateScale, scale } from '@/utils/responsive'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import { RCol, RRow, SafeArea } from '@/components/common'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { DiscretionaryWindow } from '@/core/models/DiscretionaryDto'
import { LinearGradient } from 'expo-linear-gradient'

interface ActiveWindowDetailsProps {
    window: DiscretionaryWindow
    onClose: () => void
}

const ActiveWindowDetails: React.FC<ActiveWindowDetailsProps> = ({ window, onClose }) => {
    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
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

    const daysUntilDeadline = (): number => {
        const deadline = new Date(window.deadlineTime)
        const today = new Date()
        const diffTime = deadline.getTime() - today.getTime()
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const days = daysUntilDeadline()
    const isExpiringSoon = days <= 30 && days > 0

    // Animation for content entry
    const fadeAnim = useRef(new Animated.Value(0)).current
    const translateY = useRef(new Animated.Value(20)).current

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true })
        ]).start()
    }, [])

    return (
        <SafeArea>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                {/* Header */}
                <LinearGradient
                    colors={[colors.primary[900], colors.primary[700]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <RRow style={styles.headerTop}>
                        <RCol style={{ flex: 1 }}>
                            <Text style={styles.headerTitle}>{window.title}</Text>
                            <Text style={styles.headerReference}>{window.reference}</Text>
                        </RCol>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
                            <MaterialIcons name="close" size={moderateScale(28)} color={colors.white} />
                        </TouchableOpacity>
                    </RRow>

                    <View style={[
                        styles.statusBadgeHeader,
                        { backgroundColor: window.activeYN ? colors.green[500] : colors.red[500] }
                    ]}>
                        <MaterialIcons name={window.activeYN ? 'check-circle' : 'cancel'} size={moderateScale(16)} color={colors.white} />
                        <Text style={styles.statusTextHeader}>{window.activeYN ? 'Active' : 'Inactive'}</Text>
                    </View>
                </LinearGradient>

                {/* Main Content */}
                <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY }] }]}>
                    {/* Description */}
                    {window.description && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <MaterialIcons name="description" size={moderateScale(20)} color={colors.primary[900]} />
                                <Text style={styles.sectionTitle}>Description</Text>
                            </View>
                            <Text style={styles.description}>{window.description}</Text>
                        </View>
                    )}

                    {/* Budget Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <MaterialIcons name="attach-money" size={moderateScale(20)} color={colors.primary[900]} />
                            <Text style={styles.sectionTitle}>Budget</Text>
                        </View>
                        <Text style={styles.budgetAmount}>{formatCurrency(window.totBdgt)}</Text>
                    </View>

                    {/* Timeline Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <MaterialIcons name="timeline" size={moderateScale(20)} color={colors.primary[900]} />
                            <Text style={styles.sectionTitle}>Timeline</Text>
                        </View>

                        <DetailRow
                            icon="event"
                            label="Launch Date"
                            value={formatDate(window.launchDte)}
                        />

                        <DetailRow
                            icon="event"
                            label="Deadline"
                            value={formatDate(window.deadlineTime)}
                            highlight={isExpiringSoon}
                            highlightColor={colors.red[500]}
                        />

                        {isExpiringSoon && days > 0 && (
                            <View style={styles.daysRemaining}>
                                <MaterialIcons name="schedule" size={moderateScale(16)} color={colors.red[500]} />
                                <Text style={styles.daysRemainingText}>
                                    {days} {days === 1 ? 'day' : 'days'} remaining
                                </Text>
                            </View>
                        )}

                        {window.contractStartDate && window.contractStartDate !== '0001-01-01T00:00:00' && (
                            <DetailRow
                                icon="date-range"
                                label="Contract Start"
                                value={formatDate(window.contractStartDate)}
                            />
                        )}

                        {window.contractEndDate && window.contractEndDate !== '0001-01-01T00:00:00' && (
                            <DetailRow
                                icon="date-range"
                                label="Contract End"
                                value={formatDate(window.contractEndDate)}
                            />
                        )}
                    </View>

                    {/* Program Information */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <MaterialIcons name="info" size={moderateScale(20)} color={colors.primary[900]} />
                            <Text style={styles.sectionTitle}>Program Information</Text>
                        </View>

                        <DetailRow icon="code" label="Program Code" value={window.progCd} />
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeArea>
    )
}

interface DetailRowProps {
    icon: string
    label: string
    value: string
    highlight?: boolean
    highlightColor?: string
}

function DetailRow({ icon, label, value, highlight, highlightColor }: DetailRowProps) {
    return (
        <View style={[styles.detailRow, highlight && { borderLeftColor: highlightColor, borderLeftWidth: 4 }]}>
            <View style={styles.detailIconContainer}>
                <MaterialIcons name={icon as any} size={moderateScale(20)} color={colors.primary[900]} />
            </View>
            <RCol style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={[styles.detailValue, highlight && { color: highlightColor }]}>
                    {value}
                </Text>
            </RCol>
        </View>
    )
}

export default ActiveWindowDetails

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: colors.white,
    },
    headerGradient: {
        paddingTop: scale(20),
        paddingBottom: scale(32),
        paddingHorizontal: scale(20),
        borderBottomLeftRadius: scale(30),
        borderBottomRightRadius: scale(30),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
    },
    headerTop: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: scale(20),
    },
    headerTitle: {
        fontSize: moderateScale(24),
        fontWeight: '800',
        color: colors.white,
        marginBottom: scale(6),
    },
    headerReference: {
        fontSize: moderateScale(14),
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: '500',
    },
    closeButton: {
        padding: scale(12),
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: scale(12),
    },
    statusBadgeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: scale(14),
        paddingVertical: scale(8),
        borderRadius: scale(24),
        gap: scale(8),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statusTextHeader: {
        color: colors.white,
        fontSize: moderateScale(13),
        fontWeight: '600',
    },
    content: {
        paddingHorizontal: scale(12),
        paddingVertical: scale(24),
        gap: scale(16),
    },
    section: {
        gap: scale(16),
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.zinc[200],
        borderRadius: scale(8),
        padding: scale(6),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        marginBottom: scale(12),
    },
    sectionTitle: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: colors.primary[900],
    },
    description: {
        fontSize: moderateScale(15),
        color: colors.zinc[700],
        lineHeight: moderateScale(22),
        paddingVertical: scale(12),
        paddingHorizontal: scale(16),
        backgroundColor: colors.primary[50],
        borderRadius: scale(12),
        borderLeftWidth: 4,
        borderLeftColor: colors.primary[900],
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    budgetAmount: {
        fontSize: moderateScale(32),
        fontWeight: '800',
        color: colors.primary[900],
        paddingVertical: scale(8),
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: scale(16),
        paddingHorizontal: scale(16),
        backgroundColor: colors.zinc[50],
        borderRadius: scale(12),
        gap: scale(16),
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    detailIconContainer: {
        paddingTop: scale(2),
        backgroundColor: colors.primary[100],
        borderRadius: scale(8),
        padding: scale(8),
    },
    detailLabel: {
        fontSize: moderateScale(13),
        color: colors.zinc[600],
        fontWeight: '600',
        marginBottom: scale(4),
    },
    detailValue: {
        fontSize: moderateScale(16),
        color: colors.zinc[900],
        fontWeight: '600',
    },
    daysRemaining: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        paddingVertical: scale(16),
        paddingHorizontal: scale(16),
        backgroundColor: 'rgba(211, 47, 47, 0.08)',
        borderRadius: scale(12),
        borderLeftWidth: 4,
        borderLeftColor: colors.red[500],
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    daysRemainingText: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: colors.red[500],
    },
    metaSection: {
        paddingVertical: scale(16),
        paddingHorizontal: scale(16),
        backgroundColor: colors.zinc[100],
        borderRadius: scale(12),
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    metaLabel: {
        fontSize: moderateScale(13),
        color: colors.zinc[600],
        fontWeight: '600',
    },
    metaValue: {
        fontSize: moderateScale(14),
        color: colors.zinc[800],
        fontWeight: '500',
        marginTop: scale(6),
    },
})