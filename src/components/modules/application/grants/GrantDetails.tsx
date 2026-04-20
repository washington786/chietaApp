import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { FC, useState } from 'react'
import { RCol, RDivider, RRow } from '@/components/common'
import { Expandable } from './Expandable'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import appFonts from '@/config/fonts'
import Ionicons from '@expo/vector-icons/Ionicons'
import { EvilIcons } from '@expo/vector-icons'
import { errorBox } from '@/components/loadAssets'
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet'
import useGrants from '@/hooks/main/useGrants'
import { moderateScale, scale } from '@/utils/responsive'

export interface GrantDetailsData {
    id: number;
    sdl: string;
    organisationId: number;
    organisation_Name: string;
    organisation_Trade_Name: string;
    contract_Number: string;
    projectId: number;
    applicationStatusId: number;
    projectType: string;
    focusArea: string;
    subCategory: string;
    intervention: string;
    otherIntervention?: string;
    number_Continuing: number;
    number_New: number;
    costPerLearner: number;
    gC_Continuing: number;
    gC_New: number;
    gC_CostPerLearner: number;
    hdi: number;
    female: number;
    youth: number;
    number_Disabled: number;
    rural: number;
    province: string;
    municipality: string;
    status?: string;
}

interface GrantDetailsProps {
    data?: GrantDetailsData;
    appId: number;
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({
    label,
    value,
    valueStyle,
}: {
    label: string;
    value: string | number;
    valueStyle?: object;
}) {
    return (
        <View style={statStyles.pill}>
            <Text style={statStyles.pillLabel}>{label}</Text>
            <Text style={[statStyles.pillValue, valueStyle]}>{value}</Text>
        </View>
    );
}

const statStyles = StyleSheet.create({
    pill: {
        flex: 1,
        backgroundColor: colors.gray[50],
        borderRadius: 10,
        paddingVertical: scale(9),
        paddingHorizontal: scale(10),
        alignItems: 'center',
        gap: 3,
        borderWidth: 1,
        borderColor: colors.gray[100],
    },
    pillLabel: {
        fontSize: moderateScale(10),
        fontFamily: `${appFonts.regular}`,
        color: colors.slate[400],
        textAlign: 'center',
    },
    pillValue: {
        fontSize: moderateScale(13),
        fontFamily: `${appFonts.semiBold}`,
        color: colors.gray[800],
        textAlign: 'center',
    },
});

// ─── Download action button ───────────────────────────────────────────────────
function DownloadButton({
    label,
    sublabel,
    icon,
    accentColor,
    loading,
    onPress,
    disabled,
}: {
    label: string;
    sublabel?: string;
    icon: keyof typeof Ionicons.glyphMap;
    accentColor: string;
    loading?: boolean;
    onPress?: () => void;
    disabled?: boolean;
}) {
    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={onPress}
            disabled={loading || disabled}
            style={[dlStyles.btn, (loading || disabled) && dlStyles.btnDisabled]}
        >
            <View style={[dlStyles.iconCircle, { backgroundColor: accentColor + '18' }]}>
                {loading
                    ? <ActivityIndicator size={18} color={accentColor} />
                    : <Ionicons name={icon} size={20} color={accentColor} />
                }
            </View>
            <View style={dlStyles.textBlock}>
                <Text style={dlStyles.label}>{loading ? 'Generating…' : label}</Text>
                {sublabel ? <Text style={dlStyles.sublabel}>{sublabel}</Text> : null}
            </View>
            {!loading && (
                <Ionicons name='chevron-forward' size={16} color={colors.gray[300]} />
            )}
        </TouchableOpacity>
    );
}

const dlStyles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        backgroundColor: colors.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.gray[100],
        paddingVertical: scale(10),
        paddingHorizontal: scale(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    btnDisabled: { opacity: 0.6 },
    iconCircle: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(19),
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBlock: { flex: 1 },
    label: {
        fontSize: moderateScale(13),
        fontFamily: `${appFonts.semiBold}`,
        color: colors.gray[800],
    },
    sublabel: {
        fontSize: moderateScale(11),
        fontFamily: `${appFonts.regular}`,
        color: colors.slate[400],
        marginTop: 1,
    },
});

// ─── Main component ───────────────────────────────────────────────────────────
const GrantDetails: FC<GrantDetailsProps> = ({ data, appId }) => {
    const [showDetails, setShowDetails] = useState<boolean>(true);
    const [evaluationLoading, setEvaluationLoading] = useState(false);
    const [moaLoading, setMoaLoading] = useState(false);

    const { generateApprovedGrantsReport, generateRejectedGrantsReport } = useGrants({ appId });
    const { close, open } = useGlobalBottomSheet();

    if (!data) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name='document-outline' size={28} color={colors.gray[300]} />
                <Text style={styles.emptyText}>No grant details available</Text>
            </View>
        );
    }

    const focusAreaLabel = data.focusArea || 'Grant Details';
    const subCategory = data.subCategory || 'N/A';
    const intervention = data.intervention || 'N/A';
    const approvedLearners = data.gC_New || data.number_New || 0;
    const costPerLearner = data.gC_CostPerLearner || data.costPerLearner || 0;
    const contractNo = data.contract_Number || null;
    const isApproved = contractNo !== null;

    async function handleEvaluationDownload() {
        if (evaluationLoading) return;
        setEvaluationLoading(true);
        try {
            if (isApproved) {
                await generateApprovedGrantsReport();
            } else {
                await generateRejectedGrantsReport();
            }
        } finally {
            setEvaluationLoading(false);
        }
    }

    async function handleMOADownload() {
        if (moaLoading) return;
        setMoaLoading(true);
        try {
            // MOA is not yet available — show informative bottom sheet
            open(<DownloadError close={close} file='MOA' />, { snapPoints: ['40%'] });
        } finally {
            setMoaLoading(false);
        }
    }

    return (
        <View style={styles.card}>
            <Expandable
                title={intervention !== 'Other' ? focusAreaLabel : data.otherIntervention || focusAreaLabel}
                isExpanded={showDetails}
                onPress={() => setShowDetails(v => !v)}
            >
                {/* ── Stats grid ────────────────────────────────────── */}
                <View style={styles.statsGrid}>
                    <StatPill label='Approved Learners' value={approvedLearners} />
                    <StatPill
                        label='Amount / Learner'
                        value={`R ${costPerLearner.toLocaleString()}`}
                        valueStyle={{ color: colors.emerald[600] }}
                    />
                </View>

                {/* ── Info rows ─────────────────────────────────────── */}
                <View style={styles.infoSection}>
                    <InfoRow label='Subcategory' value={subCategory} />
                    <InfoRow label='Intervention' value={intervention} />
                    <InfoRow
                        label='Contract No'
                        value={contractNo ?? '—'}
                        valueStyle={contractNo ? { color: colors.primary[600], fontFamily: `${appFonts.semiBold}` } : {}}
                    />
                    <View style={[styles.statusBadgeRow]}>
                        <Text style={styles.infoLabel}>Status</Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: isApproved ? colors.emerald[50] : colors.red[50] },
                        ]}>
                            <View style={[
                                styles.statusDot,
                                { backgroundColor: isApproved ? colors.emerald[500] : colors.red[400] },
                            ]} />
                            <Text style={[
                                styles.statusText,
                                { color: isApproved ? colors.emerald[700] : colors.red[600] },
                            ]}>
                                {isApproved ? 'Approved' : 'Not Approved'}
                            </Text>
                        </View>
                    </View>
                </View>

                <RDivider />

                {/* ── Downloads ─────────────────────────────────────── */}
                <View style={styles.downloadsSection}>
                    <View style={styles.downloadHeader}>
                        <Ionicons name='cloud-download-outline' size={16} color={colors.primary[600]} />
                        <Text style={styles.downloadTitle}>Documents</Text>
                    </View>

                    <DownloadButton
                        label='Evaluation Outcome'
                        sublabel={isApproved ? 'Approval letter (PDF)' : 'Rejection letter (PDF)'}
                        icon='document-text-outline'
                        accentColor={isApproved ? colors.emerald[600] : colors.red[500]}
                        loading={evaluationLoading}
                        onPress={handleEvaluationDownload}
                    />

                    <DownloadButton
                        label='Memorandum of Agreement'
                        sublabel='MOA document (PDF)'
                        icon='reader-outline'
                        accentColor={colors.primary[600]}
                        loading={moaLoading}
                        onPress={handleMOADownload}
                        disabled={!isApproved}
                    />
                </View>
            </Expandable>
        </View>
    );
};

// ─── Info row (compact key-value) ─────────────────────────────────────────────
function InfoRow({ label, value, valueStyle }: { label: string; value: string; valueStyle?: object }) {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={[styles.infoValue, valueStyle]} numberOfLines={2}>{value}</Text>
        </View>
    );
}

// ─── Error bottom sheet ───────────────────────────────────────────────────────
function DownloadError({ close, file }: { close: () => void; file: string }) {
    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
            <RRow style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Text variant='titleMedium'>Document Unavailable</Text>
                <TouchableOpacity onPress={close}>
                    <EvilIcons name='close' size={32} color='black' />
                </TouchableOpacity>
            </RRow>
            <RCol style={{ alignItems: 'center', gap: 16 }}>
                <Image source={errorBox} style={{ width: 64, height: 64 }} />
                <Text variant='headlineMedium' style={{ fontWeight: 'bold', textAlign: 'center' }}>
                    File Not Available
                </Text>
                <Text variant='bodyMedium' style={{ textAlign: 'center', color: '#666', lineHeight: 24 }}>
                    The {file} document is not yet available for this grant application. Please check back later or contact support.
                </Text>
            </RCol>
        </View>
    );
}

export default GrantDetails

const styles = StyleSheet.create({
    card: {
        marginVertical: 6,
        backgroundColor: colors.white,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        overflow: 'hidden',
    },
    statsGrid: {
        flexDirection: 'row',
        gap: scale(8),
        paddingHorizontal: scale(12),
        paddingTop: scale(10),
        paddingBottom: scale(6),
    },
    infoSection: {
        paddingHorizontal: scale(12),
        paddingVertical: scale(6),
        gap: 2,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: scale(7),
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[50],
    },
    infoLabel: {
        fontSize: moderateScale(12),
        fontFamily: `${appFonts.regular}`,
        color: colors.slate[500],
        flex: 1,
    },
    infoValue: {
        fontSize: moderateScale(12),
        fontFamily: `${appFonts.medium}`,
        color: colors.gray[800],
        flex: 1.5,
        textAlign: 'right',
    },
    statusBadgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: scale(7),
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: scale(10),
        paddingVertical: scale(4),
        borderRadius: 20,
    },
    statusDot: {
        width: scale(7),
        height: scale(7),
        borderRadius: scale(4),
    },
    statusText: {
        fontSize: moderateScale(11),
        fontFamily: `${appFonts.semiBold}`,
    },
    downloadsSection: {
        paddingHorizontal: scale(12),
        paddingTop: scale(10),
        paddingBottom: scale(14),
        gap: scale(8),
    },
    downloadHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 2,
    },
    downloadTitle: {
        fontSize: moderateScale(12),
        fontFamily: `${appFonts.semiBold}`,
        color: colors.primary[700],
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: scale(24),
        gap: 8,
    },
    emptyText: {
        fontSize: moderateScale(13),
        fontFamily: `${appFonts.regular}`,
        color: colors.gray[400],
    },
})