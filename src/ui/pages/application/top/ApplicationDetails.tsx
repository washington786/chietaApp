import { FlatList, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Expandable } from '@/components/modules/application'
import { BarChart } from 'react-native-gifted-charts';
import { REmpty, RListLoading } from '@/components/common';
import { Text } from 'react-native-paper';
import colors from '@/config/colors';
import { showToast } from '@/core';
import { DocumentDownloadDto, MandatoryGrantBiodataDto } from '@/core/models/MandatoryDto';
import { RouteProp, useRoute } from '@react-navigation/native';
import {
    useGetApplicationBiosQuery,
    useGetDocsByEntityIdQuery,
    useGetPersonByUserIdQuery,
    useGetOrganizationByIdQuery,
} from '@/store/api/api';
import { navigationTypes } from '@/core/types/navigationTypes';
import { RootState } from '@/store/store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { generateMgApprovalPdf, generateSubmissionLetterPdf } from '@/core/helpers/pdfGenerator';
import { GrantsMgApprovalTemplateParams } from '@/core/helpers/grantsTemplate';
import useDocumentDownloader from '@/hooks/main/UseDocumentDownloader';
import { ILetter } from '@/core/helpers/SubmissionLetter';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatFileSize = (bytes: string): string => {
    const n = parseInt(bytes, 10);
    if (isNaN(n) || n === 0) return '—';
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateStr: string): string => {
    try {
        return new Date(dateStr).toLocaleDateString('en-ZA', {
            day: '2-digit', month: 'short', year: 'numeric',
        });
    } catch {
        return dateStr;
    }
};

const getFileIconName = (fileType: string): keyof typeof Ionicons.glyphMap => {
    if (fileType.includes('pdf')) return 'document-text';
    if (fileType.includes('word') || fileType.includes('wordprocessingml')) return 'document';
    if (fileType.includes('sheet') || fileType.includes('spreadsheet')) return 'grid';
    if (fileType.startsWith('image/')) return 'image';
    return 'document-outline';
};

// ─── Document type colour palette ─────────────────────────────────────────────
type DocPalette = { bg: string; text: string; accent: string };

const DOC_TYPE_PALETTE: Record<string, DocPalette> = {
    'Signed Application': { bg: colors.primary[100], text: colors.primary[700], accent: colors.primary[500] },
    'Company Registration': { bg: colors.green[100], text: colors.green[700], accent: colors.green[600] },
    'Declaration': { bg: colors.purple[100], text: colors.purple[700], accent: colors.purple[500] },
    'Commitment': { bg: colors.secondary[100], text: colors.secondary[700], accent: colors.secondary[600] },
    'BEE Certificate': { bg: colors.violet[100], text: colors.violet[700], accent: colors.violet[500] },
    'Bank Proof': { bg: colors.emerald[100], text: colors.emerald[700], accent: colors.emerald[600] },
    'Tax Clearance': { bg: colors.blue[100], text: colors.blue[700], accent: colors.blue[600] },
    'Accreditation': { bg: colors.yellow[100], text: colors.yellow[700], accent: colors.yellow[600] },
    'Workplace Approval': { bg: colors.blue[50], text: colors.blue[700], accent: colors.blue[500] },
    'Bank confirmation': { bg: colors.emerald[100], text: colors.emerald[700], accent: colors.emerald[600] },
    'Verification': { bg: colors.purple[100], text: colors.purple[700], accent: colors.purple[500] },
};
const getDocPalette = (docType: string): DocPalette =>
    DOC_TYPE_PALETTE[docType] ?? { bg: colors.gray[100], text: colors.gray[600], accent: colors.gray[400] };

// ─── DocumentCard ─────────────────────────────────────────────────────────────
interface DocumentCardProps {
    doc: DocumentDownloadDto;
    downloading: boolean;
    onDownload: (doc: DocumentDownloadDto) => void;
}

function DocumentCard({ doc, downloading, onDownload }: DocumentCardProps) {
    const palette = getDocPalette(doc.documentType);
    const iconName = getFileIconName(doc.fileType);
    return (
        <View style={[cardStyles.card, { borderLeftColor: palette.accent }]}>
            <View style={[cardStyles.iconWrap, { backgroundColor: palette.bg }]}>
                <Ionicons name={iconName} size={22} color={palette.accent} />
            </View>
            <View style={cardStyles.info}>
                <Text style={cardStyles.filename} numberOfLines={2} ellipsizeMode="middle">
                    {doc.originalFileName}
                </Text>
                <View style={cardStyles.metaRow}>
                    <View style={[cardStyles.badge, { backgroundColor: palette.bg }]}>
                        <Text style={[cardStyles.badgeText, { color: palette.text }]}>
                            {doc.documentType}
                        </Text>
                    </View>
                    <Text style={cardStyles.metaDot}>{'·'}</Text>
                    <Text style={cardStyles.metaText}>{formatFileSize(doc.fileSize)}</Text>
                    <Text style={cardStyles.metaDot}>{'·'}</Text>
                    <Text style={cardStyles.metaText}>{formatDate(doc.dateCreated)}</Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={() => onDownload(doc)}
                disabled={downloading}
                style={[cardStyles.dlBtn, downloading && cardStyles.dlBtnBusy]}
                activeOpacity={0.7}
            >
                {downloading
                    ? <ActivityIndicator size={16} color={colors.blue[600]} />
                    : <Ionicons name="cloud-download-outline" size={20} color={colors.blue[600]} />
                }
            </TouchableOpacity>
        </View>
    );
}

const cardStyles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        borderLeftWidth: 4,
        paddingVertical: 11,
        paddingHorizontal: 12,
        marginVertical: 4,
        shadowColor: colors.slate[800],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    info: { flex: 1, gap: 5 },
    filename: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.gray[800],
        lineHeight: 17,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 5,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 20,
    },
    badgeText: { fontSize: 10, fontWeight: '700' },
    metaText: { fontSize: 11, color: colors.slate[500] },
    metaDot: { fontSize: 11, color: colors.slate[300] },
    dlBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: colors.blue[50],
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 6,
    },
    dlBtnBusy: { backgroundColor: colors.blue[100] },
});

const ApplicationDetails = () => {

    const { appId, orgId } = useRoute<RouteProp<navigationTypes, "applicationDetails">>().params;
    const user = useSelector((state: RootState) => state.auth.user);

    const { selectedApplication } = useSelector((state: RootState) => state.mandatoryGrant);

    const year = selectedApplication?.referenceNo?.substring(2, selectedApplication.referenceNo.length);
    const period = year ? (parseInt(year) - 1).toString() + '/' + year : '';

    const { data, isLoading: loading } = useGetApplicationBiosQuery(appId, { skip: !appId });
    const { data: OrgData } = useGetOrganizationByIdQuery(orgId, { skip: !orgId });
    const { data: sdfData } = useGetPersonByUserIdQuery(user?.id, { skip: !user?.id });

    const biodata = data?.items || [];

    // ── UI expand state ────────────────────────────────────────────────────
    const [expandBio, setBio] = useState(false);
    const [expandDocs, setDocs] = useState(true);
    const [expandRace, setRace] = useState(false);
    const [expandGender, setGender] = useState(false);

    // ── Per-document download tracking ────────────────────────────────────
    const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());

    // ── Document data via new endpoint ────────────────────────────────────
    const entityId = typeof appId === 'string' ? parseInt(appId, 10) : (appId ?? 0);
    const userId = user?.id ? parseInt(String(user.id), 10) : 0;

    const {
        data: documents = [],
        isLoading: docsLoading,
        isError: docsError,
        refetch: refetchDocs,
    } = useGetDocsByEntityIdQuery(
        { entityId, userId },
        { skip: !appId || !user?.id },
    );

    const { downloadDocument } = useDocumentDownloader();

    const getCountByProvince = (data: MandatoryGrantBiodataDto[]) => {
        const counts: Record<string, number> = {};
        data.forEach(item => {
            counts[item.province] = (counts[item.province] || 0) + 1;
        });

        return Object.entries(counts).map(([label, value]) => ({ label, value }));
    };
    const getCountByGender = (data: MandatoryGrantBiodataDto[]) => {
        const counts: Record<string, number> = {};
        data.forEach(item => {
            counts[item.gender] = (counts[item.gender] || 0) + 1;
        });

        return Object.entries(counts).map(([label, value]) => ({ label, value }));
    };
    const getCountByRace = (data: MandatoryGrantBiodataDto[]) => {
        const counts: Record<string, number> = {};
        data.forEach(item => {
            counts[item.race] = (counts[item.race] || 0) + 1;
        });

        return Object.entries(counts).map(([label, value]) => ({ label, value }));
    };

    const provinceData = getCountByProvince(biodata);
    const genderData = getCountByGender(biodata);
    const raceData = getCountByRace(biodata);

    // ── Document download handler ──────────────────────────────────────────
    const handleDocDownload = async (doc: DocumentDownloadDto) => {
        if (downloadingIds.has(doc.id)) return;

        setDownloadingIds(prev => new Set(prev).add(doc.id));
        try {
            const uri = await downloadDocument(doc.downloadUrl, doc.originalFileName);
            if (uri && uri !== 'dismissed') {
                showToast({
                    message: `"${doc.originalFileName}" is ready to save`,
                    title: 'Download ready',
                    type: 'success',
                    position: 'top',
                });
            } else if (!uri) {
                showToast({
                    message: `Could not download "${doc.originalFileName}"`,
                    title: 'Download failed',
                    type: 'error',
                    position: 'top',
                });
            }
        } finally {
            setDownloadingIds(prev => {
                const next = new Set(prev);
                next.delete(doc.id);
                return next;
            });
        }
    };

    const handleApprovalDownload = async () => {
        try {
            const sdf: string = sdfData?.result?.person.title + ' ' + sdfData?.result?.person.first_Name + ' ' + sdfData?.result?.person.last_Name;

            const temp: GrantsMgApprovalTemplateParams = {
                orgTradeName: OrgData?.organisationTradingName || OrgData?.organisationName || 'N/A',
                orgName: OrgData?.organisationName || 'N/A',
                date: new Date().toLocaleDateString('en-za', { month: '2-digit', day: '2-digit', year: 'numeric' }),
                date_code: period,
                sdfName: sdf || 'N/A',
                sdlNo: OrgData?.sdlNo || 'N/A',
            }
            await generateMgApprovalPdf(temp);
        } catch (error) {
            console.error("Error generating approval PDF:", error);
            showToast({ message: `Failed to generate Approval Letter`, title: "Error", type: "error", position: "top" });
        }
    }
    const handleSubmissionLetterDownload = async () => {
        try {
            const temp: ILetter = {
                Organisation_Name: OrgData?.organisationName || 'N/A',
                Trade_Name: OrgData?.organisationTradingName || 'N/A',
                SDL: OrgData?.sdlNo || 'N/A',
                Period: period,
                downloadedDate: new Date().toLocaleDateString('en-za', { month: '2-digit', day: '2-digit', year: 'numeric' }),
                isDG: false,
            };
            await generateSubmissionLetterPdf(temp);
        } catch (error) {
            console.error("Error generating submission letter PDF:", error);
            showToast({ message: `Failed to generate Submission Letter`, title: "Error", type: "error", position: "top" });
        }
    }

    if (loading) {
        return <RListLoading count={4} />
    }

    return (
        <FlatList data={[]}
            style={styles.con}
            renderItem={null}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListFooterComponentStyle={{ paddingBottom: 30 }}
            ListFooterComponent={() => {
                return (
                    <>
                        <Expandable title='Province stats' isExpanded={expandBio} onPress={() => setBio(!expandBio)}>
                            <BarChart
                                data={provinceData.map(item => ({ ...item, frontColor: colors.primary[600] }))}
                                barWidth={40}
                                spacing={30}
                                yAxisThickness={1}
                                xAxisThickness={1}
                                initialSpacing={20}
                                maxValue={Math.max(...provinceData.map(d => d.value)) + 2}
                                height={250}
                                xAxisLabelTextStyle={{ fontSize: 12, color: colors.slate[700] }}
                                yAxisTextStyle={{ fontSize: 12, color: colors.slate[700] }}
                            />
                        </Expandable>
                        <Expandable title='Race Stats' isExpanded={expandRace} onPress={() => setRace(!expandRace)}>
                            <BarChart
                                data={raceData.map(item => ({ ...item, frontColor: colors.secondary[600] }))}
                                barWidth={40}
                                spacing={30}
                                yAxisThickness={1}
                                xAxisThickness={1}
                                initialSpacing={20}
                                maxValue={Math.max(...raceData.map(d => d.value)) + 2}
                                height={250}
                                xAxisLabelTextStyle={{ fontSize: 12, color: colors.slate[700] }}
                                yAxisTextStyle={{ fontSize: 12, color: colors.slate[700] }}
                            />
                        </Expandable>
                        <Expandable title='Gender Stats' isExpanded={expandGender} onPress={() => setGender(!expandGender)}>
                            <BarChart
                                data={genderData.map(item => ({ ...item, frontColor: colors.red[600] }))}
                                barWidth={40}
                                spacing={30}
                                yAxisThickness={1}
                                xAxisThickness={1}
                                initialSpacing={20}
                                maxValue={Math.max(...genderData.map(d => d.value)) + 2}
                                height={250}
                                xAxisLabelTextStyle={{ fontSize: 12, color: colors.slate[700] }}
                                yAxisTextStyle={{ fontSize: 12, color: colors.slate[700] }}
                            />
                        </Expandable>

                        <Text variant='titleMedium' style={styles.sectionTitle}>Attached Documents</Text>

                        <Expandable
                            title={docsLoading ? 'Loading documents…' : `All uploaded files (${documents.length})`}
                            isExpanded={expandDocs}
                            onPress={() => setDocs(!expandDocs)}
                        >
                            {docsLoading && <RListLoading count={3} />}

                            {!docsLoading && docsError && (
                                <View style={styles.errorBox}>
                                    <Ionicons name="alert-circle-outline" size={28} color={colors.red[500]} />
                                    <Text style={styles.errorText}>Failed to load documents</Text>
                                    <TouchableOpacity onPress={refetchDocs} style={styles.retryBtn}>
                                        <Text style={styles.retryText}>Retry</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {!docsLoading && !docsError && documents.length === 0 && (
                                <REmpty
                                    title='No documents found'
                                    subtitle='No files have been uploaded for this application'
                                    icon='file'
                                    style={{ minHeight: 200 }}
                                />
                            )}

                            {!docsLoading && !docsError && documents.length > 0 &&
                                [...documents]
                                    .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
                                    .map(doc => (
                                        <DocumentCard
                                            key={doc.id}
                                            doc={doc}
                                            downloading={downloadingIds.has(doc.id)}
                                            onDownload={handleDocDownload}
                                        />
                                    ))
                            }
                        </Expandable>

                        {
                            selectedApplication?.grantStatus.toLowerCase().includes('approved') && (
                                <>
                                    <Text variant='titleMedium' style={styles.sectionTitle}>Download Approval Letter</Text>
                                    <DownloadTemp fileName='Approval Letter Document' onPress={handleApprovalDownload} />
                                </>
                            )
                        }

                        {
                            !selectedApplication?.grantStatus.toLowerCase().includes('application') && (
                                <>
                                    <Text variant='titleMedium' style={styles.sectionTitle}>Download Submission Letter</Text>
                                    <DownloadTemp fileName='Submission Letter Document' onPress={handleSubmissionLetterDownload} />
                                </>
                            )
                        }



                    </>
                )
            }}
        />
    )
}

function DownloadTemp({ fileName, onPress }: { fileName: string, onPress?: () => void }) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.approvalBtn}
        >
            <View style={styles.approvalIconWrap}>
                <FontAwesome name="cloud-download" size={18} color={colors.white} />
            </View>
            <Text variant='bodyMedium' style={styles.approvalBtnText}>{fileName}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.blue[400]} />
        </TouchableOpacity>
    )
}

export default ApplicationDetails

const styles = StyleSheet.create({
    con: { paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1, backgroundColor: colors.gray[50] },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.gray[700],
        marginTop: 14,
        marginBottom: 4,
    },
    errorBox: {
        alignItems: 'center',
        paddingVertical: 20,
        gap: 8,
    },
    errorText: {
        color: colors.red[500],
        fontSize: 13,
    },
    retryBtn: {
        paddingHorizontal: 20,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: colors.blue[600],
    },
    retryText: {
        color: colors.white,
        fontSize: 13,
        fontWeight: '600',
    },
    approvalBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: colors.blue[200],
        backgroundColor: colors.blue[50],
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
    },
    approvalIconWrap: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: colors.blue[600],
        alignItems: 'center',
        justifyContent: 'center',
    },
    approvalBtnText: {
        flex: 1,
        color: colors.gray[700],
        fontWeight: '600',
    },
})