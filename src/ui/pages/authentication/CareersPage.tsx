import {
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import { moderateScale, scale } from '@/utils/responsive'
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
            <MaterialCommunityIcons name={icon as any} size={moderateScale(15)} color={primary[600]} />
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
            <MaterialCommunityIcons name={icon as any} size={moderateScale(14)} color={primary[600]} />
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
                        <MaterialCommunityIcons name='briefcase-variant-outline' size={moderateScale(28)} color={primary[200]} />
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
                                <Ionicons name='globe-outline' size={moderateScale(16)} color={colors.white} />
                                <Text style={styles.ctaBtnText}>Visit Career Guidance Portal</Text>
                                <MaterialCommunityIcons name='arrow-right' size={moderateScale(16)} color={colors.white} />
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
                                <Ionicons name='briefcase-outline' size={moderateScale(16)} color={colors.white} />
                                <Text style={styles.ctaBtnText}>View Current Vacancies</Text>
                                <MaterialCommunityIcons name='arrow-right' size={moderateScale(16)} color={colors.white} />
                            </LinearGradient>
                        </Pressable>
                    </View>
                </Animated.View>

                <View style={styles.footer}>
                    <Ionicons name='information-circle-outline' size={moderateScale(13)} color={colors.slate[400]} />
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
        paddingHorizontal: scale(14),
        paddingTop: scale(8),
        paddingBottom: scale(32),
    },

    // ── Hero ────────────────────────────────────────────────────────────────
    heroBanner: {
        borderRadius: scale(14),
        padding: scale(20),
        marginBottom: scale(16),
    },
    heroIconWrap: {
        width: scale(48),
        height: scale(48),
        borderRadius: scale(12),
        backgroundColor: 'rgba(255,255,255,0.14)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: scale(12),
    },
    heroTitle: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: colors.white,
        marginBottom: scale(6),
        letterSpacing: 0.2,
    },
    heroSub: {
        fontSize: moderateScale(12.5),
        color: 'rgba(255,255,255,0.78)',
        lineHeight: moderateScale(19),
    },

    // ── Cards ────────────────────────────────────────────────────────────────
    card: {
        backgroundColor: colors.white,
        borderRadius: scale(5),
        marginBottom: scale(14),
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
        gap: scale(10),
        backgroundColor: colors.slate[50],
        paddingHorizontal: scale(14),
        paddingVertical: scale(12),
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[100],
    },
    cardIconChip: {
        width: scale(28),
        height: scale(28),
        borderRadius: scale(8),
        backgroundColor: primary[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardHeaderTitle: {
        flex: 1,
        fontSize: moderateScale(12),
        fontWeight: '700',
        color: colors.slate[700],
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardBadge: {
        backgroundColor: primary[50],
        borderRadius: scale(20),
        paddingHorizontal: scale(9),
        paddingVertical: scale(3),
    },
    cardBadgeText: {
        fontSize: moderateScale(10),
        fontWeight: '600',
        color: primary[600],
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    cardBody: {
        paddingHorizontal: scale(14),
        paddingTop: scale(14),
        paddingBottom: scale(16),
    },
    cardDesc: {
        fontSize: moderateScale(13),
        color: colors.slate[500],
        lineHeight: moderateScale(20),
    },
    divider: {
        height: 1,
        backgroundColor: colors.slate[100],
        marginVertical: scale(12),
    },

    // ── Feature list ─────────────────────────────────────────────────────────
    featureList: {
        gap: scale(8),
        marginBottom: scale(16),
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(9),
    },
    featureIconWrap: {
        width: scale(22),
        height: scale(22),
        borderRadius: scale(6),
        backgroundColor: primary[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureLabel: {
        fontSize: moderateScale(13),
        color: colors.slate[600],
        fontWeight: '500',
    },

    // ── CTA button ───────────────────────────────────────────────────────────
    ctaBtn: {
        borderRadius: scale(10),
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
        gap: scale(8),
        paddingVertical: scale(13),
        paddingHorizontal: scale(16),
    },
    ctaBtnText: {
        flex: 1,
        textAlign: 'center',
        color: colors.white,
        fontSize: moderateScale(13),
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    // ── Footer note ───────────────────────────────────────────────────────────
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(5),
        marginTop: scale(4),
    },
    footerText: {
        fontSize: moderateScale(11.5),
        color: colors.slate[400],
    },
})