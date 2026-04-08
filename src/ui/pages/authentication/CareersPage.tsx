import {
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import React from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import RHeader from '@/components/common/RHeader'
import { Scroller } from '@/components/common'
import colors from '@/config/colors'

const primary = colors.primary // bossanova

// ─── Reusable card building blocks ──────────────────────────────────────────

const CardHeader = ({
    icon,
    label,
    badge,
}: {
    icon: string
    label: string
    badge: string
}) => (
    <View style={styles.cardHeader}>
        <View style={styles.cardIconChip}>
            <MaterialCommunityIcons name={icon as any} size={15} color={primary[600]} />
        </View>
        <Text style={styles.cardHeaderTitle}>{label}</Text>
        <View style={styles.cardBadge}>
            <Text style={styles.cardBadgeText}>{badge}</Text>
        </View>
    </View>
)

const FeatureRow = ({ icon, label }: { icon: string; label: string }) => (
    <View style={styles.featureRow}>
        <View style={styles.featureIconWrap}>
            <MaterialCommunityIcons name={icon as any} size={14} color={primary[600]} />
        </View>
        <Text style={styles.featureLabel}>{label}</Text>
    </View>
)

// ────────────────────────────────────────────────────────────────────────────

const CareersPage = () => {

    const openCareerGuidance = () =>
        Linking.openURL('https://chieta.org.za/careers/career-guidance-portal/')

    const openVacancies = () =>
        Linking.openURL('https://chieta.org.za/careers/vacancies/')

    return (
        <>
            <RHeader name='Career Guidance and Jobs' showBack={true} />
            <Scroller style={styles.scroller}>

                {/* Hero banner */}
                <LinearGradient
                    colors={[primary[950], primary[700]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroBanner}
                >
                    <View style={styles.heroIconWrap}>
                        <MaterialCommunityIcons name='briefcase-variant-outline' size={28} color={primary[200]} />
                    </View>
                    <Text style={styles.heroTitle}>CHIETA Careers</Text>
                    <Text style={styles.heroSub}>
                        Explore career guidance resources and current vacancies within the Chemical Industries Education and Training Authority.
                    </Text>
                </LinearGradient>

                {/* Card — Career Guidance Portal */}
                <Animated.View entering={FadeInDown.delay(80).duration(420).springify()} style={styles.card}>
                    <CardHeader
                        icon='compass-outline'
                        label='Career Guidance Portal'
                        badge='Resource'
                    />
                    <View style={styles.cardBody}>
                        <Text style={styles.cardDesc}>
                            Explore structured career pathways within the chemical industries sector, access mentorship programmes, and plan your professional development journey.
                        </Text>

                        <View style={styles.divider} />

                        <View style={styles.featureList}>
                            <FeatureRow icon='chevron-right-circle-outline' label='Sector-specific career pathways' />
                            <FeatureRow icon='chevron-right-circle-outline' label='Learning and development resources' />
                            <FeatureRow icon='chevron-right-circle-outline' label='Mentorship programmes' />
                        </View>

                        <Pressable
                            onPress={openCareerGuidance}
                            style={({ pressed }) => [
                                styles.ctaBtn,
                                pressed && styles.ctaBtnPressed,
                            ]}
                        >
                            <LinearGradient
                                colors={[primary[700], primary[900]]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.ctaBtnGradient}
                            >
                                <Ionicons name='globe-outline' size={16} color={colors.white} />
                                <Text style={styles.ctaBtnText}>Visit Career Guidance Portal</Text>
                                <MaterialCommunityIcons name='arrow-right' size={16} color={colors.white} />
                            </LinearGradient>
                        </Pressable>
                    </View>
                </Animated.View>

                {/* Card — Vacancies */}
                <Animated.View entering={FadeInDown.delay(160).duration(420).springify()} style={styles.card}>
                    <CardHeader
                        icon='briefcase-search-outline'
                        label='Vacancies at CHIETA'
                        badge='Jobs'
                    />
                    <View style={styles.cardBody}>
                        <Text style={styles.cardDesc}>
                            Browse current job openings at CHIETA and join a team dedicated to advancing skills development across South Africa's chemical industries sector.
                        </Text>

                        <View style={styles.divider} />

                        <View style={styles.featureList}>
                            <FeatureRow icon='chevron-right-circle-outline' label='Current CHIETA job listings' />
                            <FeatureRow icon='chevron-right-circle-outline' label='Application requirements' />
                            <FeatureRow icon='chevron-right-circle-outline' label='Latest available positions' />
                        </View>

                        <Pressable
                            onPress={openVacancies}
                            style={({ pressed }) => [
                                styles.ctaBtn,
                                pressed && styles.ctaBtnPressed,
                            ]}
                        >
                            <LinearGradient
                                colors={[primary[700], primary[900]]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.ctaBtnGradient}
                            >
                                <Ionicons name='briefcase-outline' size={16} color={colors.white} />
                                <Text style={styles.ctaBtnText}>View Current Vacancies</Text>
                                <MaterialCommunityIcons name='arrow-right' size={16} color={colors.white} />
                            </LinearGradient>
                        </Pressable>
                    </View>
                </Animated.View>

                <View style={styles.footer}>
                    <Ionicons name='information-circle-outline' size={13} color={colors.slate[400]} />
                    <Text style={styles.footerText}>
                        Opens the official CHIETA website in your browser.
                    </Text>
                </View>

            </Scroller>
        </>
    )
}

export default CareersPage

const styles = StyleSheet.create({
    scroller: {
        paddingHorizontal: 14,
        paddingTop: 8,
        paddingBottom: 32,
    },

    // ── Hero ────────────────────────────────────────────────────────────────
    heroBanner: {
        borderRadius: 14,
        padding: 20,
        marginBottom: 16,
    },
    heroIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.14)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    heroTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.white,
        marginBottom: 6,
        letterSpacing: 0.2,
    },
    heroSub: {
        fontSize: 12.5,
        color: 'rgba(255,255,255,0.78)',
        lineHeight: 19,
    },

    // ── Cards ────────────────────────────────────────────────────────────────
    card: {
        backgroundColor: colors.white,
        borderRadius: 5,
        marginBottom: 14,
        shadowColor: colors.slate[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 1,
        overflow: 'hidden',
        borderWidth: 0.8,
        borderColor: colors.slate[100],
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: colors.slate[50],
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[100],
    },
    cardIconChip: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: primary[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardHeaderTitle: {
        flex: 1,
        fontSize: 12,
        fontWeight: '700',
        color: colors.slate[700],
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardBadge: {
        backgroundColor: primary[50],
        borderRadius: 20,
        paddingHorizontal: 9,
        paddingVertical: 3,
    },
    cardBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: primary[600],
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    cardBody: {
        paddingHorizontal: 14,
        paddingTop: 14,
        paddingBottom: 16,
    },
    cardDesc: {
        fontSize: 13,
        color: colors.slate[500],
        lineHeight: 20,
    },
    divider: {
        height: 1,
        backgroundColor: colors.slate[100],
        marginVertical: 12,
    },

    // ── Feature list ─────────────────────────────────────────────────────────
    featureList: {
        gap: 8,
        marginBottom: 16,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    featureIconWrap: {
        width: 22,
        height: 22,
        borderRadius: 6,
        backgroundColor: primary[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureLabel: {
        fontSize: 13,
        color: colors.slate[600],
        fontWeight: '500',
    },

    // ── CTA button ───────────────────────────────────────────────────────────
    ctaBtn: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    ctaBtnPressed: {
        opacity: 0.88,
        transform: [{ scale: 0.985 }],
    },
    ctaBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 13,
        paddingHorizontal: 16,
    },
    ctaBtnText: {
        flex: 1,
        textAlign: 'center',
        color: colors.white,
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    // ── Footer note ───────────────────────────────────────────────────────────
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        marginTop: 4,
    },
    footerText: {
        fontSize: 11.5,
        color: colors.slate[400],
    },
})