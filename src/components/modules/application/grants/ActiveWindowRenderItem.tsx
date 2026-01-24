import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { DiscretionaryWindow } from '@/core/models/DiscretionaryDto'
import colors from '@/config/colors'
import { LinearGradient } from 'expo-linear-gradient'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated'

const CARD_WIDTH = Dimensions.get('window').width * 0.7;
const CARD_HEIGHT = 400;

const ActiveWindowRenderItem = ({ item, onPress }: { item: DiscretionaryWindow; onPress: () => void }) => {
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
        }).format(amount)
    }

    const formatDate = (dateString: string | null | undefined): string | null => {
        if (!dateString) return null
        const date = new Date(dateString)
        if (isNaN(date.getTime()) || date.getFullYear() === 1) {
            return null
        }
        return date.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
    }

    const calculateTimeElapsed = (): number => {
        const launchDate = new Date(item.launchDte)
        const deadlineDate = new Date(item.deadlineTime)
        const now = new Date()

        const totalTime = deadlineDate.getTime() - launchDate.getTime()
        const elapsedTime = now.getTime() - launchDate.getTime()

        if (totalTime <= 0) return 0
        const percentage = Math.min((elapsedTime / totalTime) * 100, 100)
        return Math.max(percentage, 0)
    }

    const scale = useSharedValue(1)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }))

    const handlePressIn = () => {
        scale.value = withSpring(0.95)
    }

    const handlePressOut = () => {
        scale.value = withSpring(1)
    }

    const launchDate = formatDate(item.launchDte)
    const deadlineDate = formatDate(item.deadlineTime)
    const timeElapsed = calculateTimeElapsed()

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
        >
            <Animated.View style={[
                styles.cardWrapper,
                animatedStyle
            ]}>
                <LinearGradient
                    colors={[colors.primary[600], colors.primary[800]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    {/* Header with Badge and Info Icon */}
                    <View style={styles.topSection}>
                        <Text style={styles.availableLabel}>AVAILABLE BUDGET</Text>
                        <View style={styles.topRight}>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: item.activeYN ? colors.green[500] : colors.red[500] }
                            ]}>
                                <Text style={styles.statusText}>
                                    {item.activeYN ? 'ACTIVE' : 'INACTIVE'}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onPress} style={styles.infoIcon}>
                                <MaterialIcons name="info" size={24} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Budget Amount */}
                    <Text style={styles.budget}>
                        {formatCurrency(item.totBdgt)}
                    </Text>

                    {/* Dates Row */}
                    <View style={styles.datesContainer}>
                        {launchDate && (
                            <Text style={styles.dateText}>{launchDate}</Text>
                        )}
                        {deadlineDate && (
                            <Text style={styles.dateText}>-{deadlineDate}</Text>
                        )}
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBarBackground}>
                            <View
                                style={[
                                    styles.progressBar,
                                    { width: `${timeElapsed}%` }
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {Math.round(timeElapsed)}% time elapsed
                        </Text>
                    </View>

                    {/* Footer with Title and Reference */}
                    <View style={styles.footerSection}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.reference}>REF: {item.reference}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </Animated.View>
        </TouchableOpacity>
    )
}

export default ActiveWindowRenderItem

const styles = StyleSheet.create({
    cardWrapper: {
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#6d28d9',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 12,
        width: CARD_WIDTH,
        height: CARD_HEIGHT * 0.76,
    },

    card: {
        borderRadius: 24,
        padding: 20,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },

    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },

    availableLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.85)',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },

    topRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    budget: {
        fontSize: 26,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },

    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    },

    dateText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)',
        letterSpacing: 0.3,
    },

    progressContainer: {
        marginBottom: 18,
    },

    progressBarBackground: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
    },

    progressBar: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 3,
    },

    progressText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.85)',
        letterSpacing: 0.3,
    },

    footerSection: {
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.15)',
    },

    title: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 4,
    },

    reference: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '600',
    },

    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },

    statusText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: 0.5,
    },

    infoIcon: {
        padding: 8,
    },
})