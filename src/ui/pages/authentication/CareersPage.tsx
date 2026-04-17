import {
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from 'react-native'
import { moderateScale, scale, verticalScale } from '@/utils/responsive'
import React from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import RHeader from '@/components/common/RHeader'
import { Scroller } from '@/components/common'
import colors from '@/config/colors'

const primary = colors.primary // bossanova

// Header height on the base design device (iPhone 14 Pro Max, 932h logical px)
const HEADER_H = verticalScale(50)
// Available content area on base device after header
const BASE_AVAIL_H = 882 // 932 - 50

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
    <View style={S.cardHeader}>
        <View style={S.cardIconChip}>
            <MaterialCommunityIcons name={icon as any} size={moderateScale(15)} color={primary[600]} />
        </View>
        <Text style={S.cardHeaderTitle}>{label}</Text>
        <View style={S.cardBadge}>
            <Text style={S.cardBadgeText}>{badge}</Text>
        </View>
    </View>
)

const FeatureRow = ({ icon, label }: { icon: string; label: string }) => (
    <View style={S.featureRow}>
        <View style={S.featureIconWrap}>
            <MaterialCommunityIcons name={icon as any} size={moderateScale(14)} color={primary[600]} />
        </View>
        <Text style={S.featureLabel}>{label}</Text>
    </View>
)

// ────────────────────────────────────────────────────────────────────────────

const CareersPage = () => {
    const { height } = useWindowDimensions()

    // vf (vertical factor): 1.0 on design device, <1 on shorter screens.
    // Multiplied into all vertical spacing so content always fits without scrolling.
    const vf = Math.min(1, (height - HEADER_H) / BASE_AVAIL_H)

    const openCareerGuidance = () =>
        Linking.openURL('https://chieta.org.za/careers/career-guidance-portal/')

    const openVacancies = () =>
        Linking.openURL('https://chieta.org.za/careers/vacancies/')

    return (
        <View style={S.container}>
            <RHeader name='Career Guidance and Jobs' showBack={true} />
            <Scroller style={S.scrollOuter}>
                {/* flex: 1 fills the content container so content never leaves whitespace */}
                <View style={S.inner}>

                    {/* Hero banner */}
                    <LinearGradient
                        colors={[primary[950], primary[700]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[S.heroBanner, {
                            paddingVertical: verticalScale(16) * vf,
                            marginBottom: verticalScale(12) * vf,
                        }]}
                    >
                        <View style={[S.heroIconWrap, { marginBottom: verticalScale(8) * vf }]}>
                            <MaterialCommunityIcons name='briefcase-variant-outline' size={moderateScale(26)} color={primary[200]} />
                        </View>
                        <Text style={[S.heroTitle, { marginBottom: verticalScale(4) * vf }]}>CHIETA Careers</Text>
                        <Text style={S.heroSub}>
                            Explore career guidance resources and current vacancies within the Chemical Industries Education and Training Authority.
                        </Text>
                    </LinearGradient>

                    {/* Card — Career Guidance Portal */}
                    <Animated.View
                        entering={FadeInDown.delay(80).duration(420).springify()}
                        style={[S.card, { marginBottom: verticalScale(12) * vf }]}
                    >
                        <CardHeader icon='compass-outline' label='Career Guidance Portal' badge='Resource' />
                        <View style={[S.cardBody, {
                            paddingTop: verticalScale(10) * vf,
                            paddingBottom: verticalScale(12) * vf,
                        }]}>
                            <Text style={S.cardDesc}>
                                Explore structured career pathways within the chemical industries sector, access mentorship programmes, and plan your professional development journey.
                            </Text>
                            <View style={[S.divider, { marginVertical: verticalScale(8) * vf }]} />
                            <View style={{ gap: verticalScale(6) * vf, marginBottom: verticalScale(10) * vf }}>
                                <FeatureRow icon='chevron-right-circle-outline' label='Sector-specific career pathways' />
                                <FeatureRow icon='chevron-right-circle-outline' label='Learning and development resources' />
                                <FeatureRow icon='chevron-right-circle-outline' label='Mentorship programmes' />
                            </View>
                            <Pressable
                                onPress={openCareerGuidance}
                                style={({ pressed }) => [S.ctaBtn, pressed && S.ctaBtnPressed]}
                            >
                                <LinearGradient
                                    colors={[primary[700], primary[900]]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[S.ctaBtnGradient, { paddingVertical: verticalScale(11) * vf }]}
                                >
                                    <Ionicons name='globe-outline' size={moderateScale(16)} color={colors.white} />
                                    <Text style={S.ctaBtnText}>Visit Career Guidance Portal</Text>
                                    <MaterialCommunityIcons name='arrow-right' size={moderateScale(16)} color={colors.white} />
                                </LinearGradient>
                            </Pressable>
                        </View>
                    </Animated.View>

                    {/* Card — Vacancies */}
                    <Animated.View
                        entering={FadeInDown.delay(160).duration(420).springify()}
                        style={[S.card, { marginBottom: verticalScale(10) * vf }]}
                    >
                        <CardHeader icon='briefcase-search-outline' label='Vacancies at CHIETA' badge='Jobs' />
                        <View style={[S.cardBody, {
                            paddingTop: verticalScale(10) * vf,
                            paddingBottom: verticalScale(12) * vf,
                        }]}>
                            <Text style={S.cardDesc}>
                                Browse current job openings at CHIETA and join a team dedicated to advancing skills development across South Africa's chemical industries sector.
                            </Text>
                            <View style={[S.divider, { marginVertical: verticalScale(8) * vf }]} />
                            <View style={{ gap: verticalScale(6) * vf, marginBottom: verticalScale(10) * vf }}>
                                <FeatureRow icon='chevron-right-circle-outline' label='Current CHIETA job listings' />
                                <FeatureRow icon='chevron-right-circle-outline' label='Application requirements' />
                                <FeatureRow icon='chevron-right-circle-outline' label='Latest available positions' />
                            </View>
                            <Pressable
                                onPress={openVacancies}
                                style={({ pressed }) => [S.ctaBtn, pressed && S.ctaBtnPressed]}
                            >
                                <LinearGradient
                                    colors={[primary[700], primary[900]]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[S.ctaBtnGradient, { paddingVertical: verticalScale(11) * vf }]}
                                >
                                    <Ionicons name='briefcase-outline' size={moderateScale(16)} color={colors.white} />
                                    <Text style={S.ctaBtnText}>View Current Vacancies</Text>
                                    <MaterialCommunityIcons name='arrow-right' size={moderateScale(16)} color={colors.white} />
                                </LinearGradient>
                            </Pressable>
                        </View>
                    </Animated.View>

                    <View style={[S.footer, { marginTop: verticalScale(4) * vf }]}>
                        <Ionicons name='information-circle-outline' size={moderateScale(13)} color={colors.slate[400]} />
                        <Text style={S.footerText}>
                            Opens the official CHIETA website in your browser.
                        </Text>
                    </View>

                </View>
            </Scroller>
        </View>
    )
}

export default CareersPage

const S = StyleSheet.create({
    container: {
        flex: 1,
    },
    // Scroller's `style` prop maps to contentContainerStyle (backward compat).
    // flexGrow: 1 is already set by Scroller's default contentContainer style.
    scrollOuter: {
        paddingHorizontal: scale(14),
        paddingTop: verticalScale(8),
        paddingBottom: verticalScale(16),
    },
    // Fills the scroll content container so content is always screen-height-tall
    inner: {
        flex: 1,
    },

    // ── Hero ────────────────────────────────────────────────────────────────
    heroBanner: {
        borderRadius: scale(14),
        paddingHorizontal: scale(20),
    },
    heroIconWrap: {
        width: scale(44),
        height: scale(44),
        borderRadius: scale(11),
        backgroundColor: 'rgba(255,255,255,0.14)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroTitle: {
        fontSize: moderateScale(17),
        fontWeight: '700',
        color: colors.white,
        letterSpacing: 0.2,
    },
    heroSub: {
        fontSize: moderateScale(12),
        color: 'rgba(255,255,255,0.78)',
        lineHeight: moderateScale(18),
    },

    // ── Cards ────────────────────────────────────────────────────────────────
    card: {
        backgroundColor: colors.white,
        borderRadius: scale(5),
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
        paddingVertical: verticalScale(10),
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[100],
    },
    cardIconChip: {
        width: scale(26),
        height: scale(26),
        borderRadius: scale(7),
        backgroundColor: primary[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardHeaderTitle: {
        flex: 1,
        fontSize: moderateScale(11.5),
        fontWeight: '700',
        color: colors.slate[700],
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardBadge: {
        backgroundColor: primary[50],
        borderRadius: scale(20),
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(3),
    },
    cardBadgeText: {
        fontSize: moderateScale(9.5),
        fontWeight: '600',
        color: primary[600],
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    cardBody: {
        paddingHorizontal: scale(14),
    },
    cardDesc: {
        fontSize: moderateScale(12.5),
        color: colors.slate[500],
        lineHeight: moderateScale(19),
    },
    divider: {
        height: 1,
        backgroundColor: colors.slate[100],
    },

    // ── Feature list ─────────────────────────────────────────────────────────
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(9),
    },
    featureIconWrap: {
        width: scale(20),
        height: scale(20),
        borderRadius: scale(5),
        backgroundColor: primary[50],
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureLabel: {
        fontSize: moderateScale(12.5),
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
    },
    footerText: {
        fontSize: moderateScale(11.5),
        color: colors.slate[400],
    },
})