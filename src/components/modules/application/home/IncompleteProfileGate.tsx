import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Linking,
    ScrollView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { moderateScale, scale } from '@/utils/responsive';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { useGetOrganizationsBySdfIdQuery } from '@/store/api/api';
import { colors } from '@/config/colors';
import { logout } from '@/store/slice/AuthSlice';

const WEB_APP_URL = 'https://ims.chieta.org.za';

interface ChecklistItem {
    key: string;
    icon: string;
    label: string;
    sublabel: string;
    done: boolean;
}

const IncompleteProfileGate: React.FC = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    const sdfId = user?.sdfId;

    const {
        data: orgs,
        isLoading: orgsLoading,
        refetch: refetchOrgs,
    } = useGetOrganizationsBySdfIdQuery(sdfId || 0, { skip: !sdfId });

    // ── Animations ──────────────────────────────────────────────────────────
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(28)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 480,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 60,
                friction: 10,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // ── Derive conditions ────────────────────────────────────────────────────
    const emailUnverified = !user?.isEmailConfirmed;
    const noSdfProfile = !user?.sdfId;
    const noOrgsLinked = !orgsLoading && (!orgs || orgs.length === 0);

    const checklist: ChecklistItem[] = [
        {
            key: 'email',
            icon: 'email-check-outline',
            label: 'Verify your email address',
            sublabel: `Sent to ${user?.email ?? 'your email'}`,
            done: !emailUnverified,
        },
        {
            key: 'sdf',
            icon: 'card-account-details-outline',
            label: 'Complete your SDF profile',
            sublabel: 'Skills Development Facilitator profile required',
            done: !noSdfProfile,
        },
        {
            key: 'org',
            icon: 'office-building-outline',
            label: 'Link an organisation',
            sublabel: 'Connect at least one organisation to your profile',
            done: !noOrgsLinked,
        },
    ];

    const pendingItems = checklist.filter(item => !item.done);
    const completedCount = checklist.filter(item => item.done).length;
    const progressPct = (completedCount / checklist.length) * 100;

    // ── Handlers ─────────────────────────────────────────────────────────────
    function handleOpenWebApp() {
        Linking.openURL(WEB_APP_URL).catch(() => {
            // URL couldn't be opened — silently no-op; user sees the URL in the pill
        });
    }

    function handleRefresh() {
        refetchOrgs();
    }

    function handleSignOut() {
        dispatch(logout() as any);
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <Animated.View
                    style={[
                        styles.root,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    {/* ── Top accent banner ─────────────────────────────────── */}
                    <LinearGradient
                        colors={[colors.primary[800], colors.primary[950]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.banner}
                    >
                        {/* Decorative blobs */}
                        <View style={styles.blobTopRight} />
                        <View style={styles.blobBottomLeft} />

                        <View style={styles.iconBadge}>
                            <MaterialCommunityIcons
                                name="shield-account-outline"
                                size={moderateScale(36)}
                                color={colors.primary[200]}
                            />
                        </View>

                        <Text style={styles.bannerTitle}>Complete Your Profile</Text>
                        <Text style={styles.bannerSubtitle}>
                            A few steps are needed before you can use the CHIETA IMS mobile app.
                        </Text>

                        {/* Progress row */}
                        <View style={styles.progressRow}>
                            <View style={styles.progressTrack}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { width: `${progressPct}%` as any },
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressLabel}>
                                {completedCount}/{checklist.length} completed
                            </Text>
                        </View>
                    </LinearGradient>

                    {/* ── Card body ─────────────────────────────────────────── */}
                    <View style={styles.card}>
                        {/* Section heading */}
                        <Text style={styles.cardHeading}>Setup Checklist</Text>
                        <Text style={styles.cardSubheading}>
                            Complete the steps below on the CHIETA web portal to unlock full
                            access.
                        </Text>

                        {/* Checklist items */}
                        <View style={styles.checklist}>
                            {checklist.map((item, idx) => (
                                <ChecklistRow
                                    key={item.key}
                                    item={item}
                                    isLast={idx === checklist.length - 1}
                                />
                            ))}
                        </View>

                        {/* Pending summary pill (only when items still pending) */}
                        {pendingItems.length > 0 && (
                            <View style={styles.pendingPill}>
                                <MaterialCommunityIcons
                                    name="information-outline"
                                    size={moderateScale(14)}
                                    color={colors.primary[600]}
                                />
                                <Text style={styles.pendingPillText}>
                                    {pendingItems.length} step
                                    {pendingItems.length > 1 ? 's' : ''} still pending
                                </Text>
                            </View>
                        )}
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
};

// ── Sub-component: individual checklist row ─────────────────────────────────

interface ChecklistRowProps {
    item: ChecklistItem;
    isLast: boolean;
}

const ChecklistRow: React.FC<ChecklistRowProps> = ({ item, isLast }) => {
    const rowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(rowAnim, {
            toValue: 1,
            duration: 350,
            delay: item.done ? 0 : 80,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.checklistRow,
                !isLast && styles.checklistRowBorder,
                { opacity: rowAnim },
            ]}
        >
            {/* Icon wrap */}
            <View
                style={[
                    styles.checklistIconWrap,
                    item.done
                        ? styles.checklistIconWrapDone
                        : styles.checklistIconWrapPending,
                ]}
            >
                <MaterialCommunityIcons
                    name={item.done ? 'check' : item.icon}
                    size={moderateScale(20)}
                    color={item.done ? colors.primary[700] : colors.primary[500]}
                />
            </View>

            {/* Labels */}
            <View style={styles.checklistTextWrap}>
                <Text
                    style={[
                        styles.checklistLabel,
                        item.done && styles.checklistLabelDone,
                    ]}
                >
                    {item.label}
                </Text>
                <Text style={styles.checklistSublabel}>{item.sublabel}</Text>
            </View>

            {/* Status badge */}
            <View
                style={[
                    styles.statusBadge,
                    item.done ? styles.statusBadgeDone : styles.statusBadgePending,
                ]}
            >
                <Text
                    style={[
                        styles.statusBadgeText,
                        item.done
                            ? styles.statusBadgeTextDone
                            : styles.statusBadgeTextPending,
                    ]}
                >
                    {item.done ? 'Done' : 'Pending'}
                </Text>
            </View>
        </Animated.View>
    );
};

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: scale(32),
    },
    root: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    // Banner
    banner: {
        paddingTop: scale(40),
        paddingBottom: scale(36),
        paddingHorizontal: scale(24),
        overflow: 'hidden',
    },
    blobTopRight: {
        position: 'absolute',
        width: scale(160),
        height: scale(160),
        borderRadius: scale(80),
        backgroundColor: 'rgba(255,255,255,0.05)',
        top: scale(-40),
        right: scale(-40),
    },
    blobBottomLeft: {
        position: 'absolute',
        width: scale(120),
        height: scale(120),
        borderRadius: scale(60),
        backgroundColor: 'rgba(255,255,255,0.04)',
        bottom: scale(-30),
        left: scale(-20),
    },
    iconBadge: {
        width: scale(68),
        height: scale(68),
        borderRadius: scale(34),
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: scale(16),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
    },
    bannerTitle: {
        fontSize: moderateScale(24),
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: scale(8),
        letterSpacing: -0.4,
    },
    bannerSubtitle: {
        fontSize: moderateScale(14),
        fontWeight: '400',
        color: colors.primary[200],
        lineHeight: moderateScale(21),
        marginBottom: scale(24),
    },

    // Progress
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
    },
    progressTrack: {
        flex: 1,
        height: scale(6),
        borderRadius: scale(3),
        backgroundColor: 'rgba(255,255,255,0.18)',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: scale(3),
        backgroundColor: colors.primary[300],
    },
    progressLabel: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: colors.primary[300],
    },

    // Card
    card: {
        marginHorizontal: scale(16),
        marginTop: scale(-20),
        backgroundColor: '#ffffff',
        borderRadius: scale(20),
        padding: scale(20),
        ...Platform.select({
            ios: {
                shadowColor: colors.primary[950],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 16,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    cardHeading: {
        fontSize: moderateScale(17),
        fontWeight: '700',
        color: colors.primary[950],
        marginBottom: scale(4),
    },
    cardSubheading: {
        fontSize: moderateScale(13),
        fontWeight: '400',
        color: colors.slate[500],
        lineHeight: moderateScale(19),
        marginBottom: scale(20),
    },

    // Checklist
    checklist: {
        borderRadius: scale(14),
        borderWidth: 1,
        borderColor: colors.slate[100],
        overflow: 'hidden',
        marginBottom: scale(20),
    },
    checklistRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(14),
        paddingHorizontal: scale(14),
        backgroundColor: '#fff',
        gap: scale(12),
    },
    checklistRowBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.slate[100],
    },
    checklistIconWrap: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    checklistIconWrapDone: {
        backgroundColor: colors.primary[50],
        borderWidth: 1,
        borderColor: colors.primary[100],
    },
    checklistIconWrapPending: {
        backgroundColor: colors.primary[50],
        borderWidth: 1,
        borderColor: colors.primary[100],
    },
    checklistTextWrap: {
        flex: 1,
        gap: scale(2),
    },
    checklistLabel: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: colors.primary[950],
    },
    checklistLabelDone: {
        color: colors.slate[400],
    },
    checklistSublabel: {
        fontSize: moderateScale(12),
        fontWeight: '400',
        color: colors.slate[400],
        lineHeight: moderateScale(17),
    },
    statusBadge: {
        paddingHorizontal: scale(9),
        paddingVertical: scale(4),
        borderRadius: scale(20),
        flexShrink: 0,
    },
    statusBadgeDone: {
        backgroundColor: colors.primary[50],
        borderWidth: 1,
        borderColor: colors.primary[100],
    },
    statusBadgePending: {
        backgroundColor: '#fff8f0',
        borderWidth: 1,
        borderColor: '#fde5c8',
    },
    statusBadgeText: {
        fontSize: moderateScale(11),
        fontWeight: '700',
    },
    statusBadgeTextDone: {
        color: colors.primary[700],
    },
    statusBadgeTextPending: {
        color: '#c87c2e',
    },

    // Divider
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.slate[100],
        marginBottom: scale(16),
    },

    // Portal pill
    portalLabel: {
        fontSize: moderateScale(12),
        fontWeight: '500',
        color: colors.slate[400],
        marginBottom: scale(8),
        textAlign: 'center',
    },
    portalPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
        backgroundColor: colors.primary[50],
        borderWidth: 1,
        borderColor: colors.primary[100],
        borderRadius: scale(30),
        paddingVertical: scale(10),
        paddingHorizontal: scale(16),
        marginBottom: scale(16),
        alignSelf: 'center',
    },
    portalUrl: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: colors.primary[700],
        flex: 1,
    },

    // CTA button
    ctaButton: {
        borderRadius: scale(14),
        overflow: 'hidden',
        marginBottom: scale(12),
    },
    ctaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(10),
        paddingVertical: scale(15),
        paddingHorizontal: scale(20),
    },
    ctaText: {
        fontSize: moderateScale(15),
        fontWeight: '700',
        color: '#ffffff',
        letterSpacing: 0.2,
    },

    // Refresh button
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(6),
        paddingVertical: scale(12),
        borderRadius: scale(12),
        borderWidth: 1,
        borderColor: colors.primary[100],
        backgroundColor: colors.primary[50],
        marginBottom: scale(16),
    },
    refreshText: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: colors.primary[700],
    },

    // Pending info pill
    pendingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        backgroundColor: colors.primary[50],
        borderRadius: scale(8),
        paddingVertical: scale(8),
        paddingHorizontal: scale(12),
        alignSelf: 'center',
    },
    pendingPillText: {
        fontSize: moderateScale(12),
        fontWeight: '500',
        color: colors.primary[600],
    },

    // Sign out
    signOutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(6),
        marginTop: scale(20),
        paddingVertical: scale(12),
    },
    signOutText: {
        fontSize: moderateScale(13),
        fontWeight: '500',
        color: colors.slate[400],
    },
});

export default IncompleteProfileGate;
