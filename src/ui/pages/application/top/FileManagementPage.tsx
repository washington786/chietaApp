import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { RListLoading, REmpty } from '@/components/common'
import { useRoute, RouteProp } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'
import { showToast } from '@/core'
import { useGetDocsByEntityIdQuery, useGetDGOrgApplicationsQuery, useGetOrganizationByIdQuery, useGetProjectDetailsListViewQuery } from '@/store/api/api'
import { Expandable, GrantDetails } from '@/components/modules/application'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import colors from '@/config/colors'
import appFonts from '@/config/fonts'
import useDocumentDownloader from '@/hooks/main/UseDocumentDownloader'
import { DocumentDownloadDto } from '@/core/models/MandatoryDto'
import Ionicons from '@expo/vector-icons/Ionicons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { DownloadTemp } from './ApplicationDetails'
import { ILetter } from '@/core/helpers/SubmissionLetter'
import { generateSubmissionLetterPdf } from '@/core/helpers/pdfGenerator'

import { Text as RNText } from "react-native-paper"

const API_BASE_URL = 'https://ims.chieta.org.za:22743'

// ─── Identical palette & helpers to ApplicationDetails ────────────────────────
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
    'Schedule': { bg: colors.primary[50], text: colors.primary[700], accent: colors.primary[400] },
    'Proposal': { bg: colors.violet[50], text: colors.violet[700], accent: colors.violet[400] },
};
const getDocPalette = (docType: string): DocPalette =>
    DOC_TYPE_PALETTE[docType] ?? { bg: colors.gray[100], text: colors.gray[600], accent: colors.gray[400] };

const formatFileSize = (bytes: string): string => {
    const n = parseInt(bytes, 10);
    if (isNaN(n) || n === 0) return '—';
    if (n < 1024) return `${n} B`;
    if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1048576).toFixed(1)} MB`;
};
const formatDate = (dateStr: string): string => {
    try { return new Date(dateStr).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return dateStr; }
};
const getFileIconName = (fileType: string): keyof typeof Ionicons.glyphMap => {
    if (fileType?.includes('pdf')) return 'document-text';
    if (fileType?.includes('word') || fileType?.includes('wordprocessingml')) return 'document';
    if (fileType?.includes('sheet') || fileType?.includes('spreadsheet')) return 'grid';
    if (fileType?.startsWith('image/')) return 'image';
    return 'document-outline';
};

// ─── DocumentCard — identical to ApplicationDetails ───────────────────────────
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
                <Text style={cardStyles.filename} numberOfLines={2} ellipsizeMode='middle'>
                    {doc.originalFileName}
                </Text>
                <View style={cardStyles.metaRow}>
                    <View style={[cardStyles.badge, { backgroundColor: palette.bg }]}>
                        <Text style={[cardStyles.badgeText, { color: palette.text }]}>{doc.documentType}</Text>
                    </View>
                    <Text style={cardStyles.metaDot}>·</Text>
                    <Text style={cardStyles.metaText}>{formatFileSize(doc.fileSize)}</Text>
                    <Text style={cardStyles.metaDot}>·</Text>
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
                    : <Ionicons name='cloud-download-outline' size={20} color={colors.blue[600]} />
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
    filename: { fontSize: 13, fontWeight: '600', color: colors.gray[800], lineHeight: 17 },
    metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 5 },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
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

// ─── Page ─────────────────────────────────────────────────────────────────────
const FileManagementPage = () => {
    const { appId, orgId } = useRoute<RouteProp<navigationTypes, "applicationDetails">>().params;
    const user = useSelector((state: RootState) => state.auth.user);

    const [showDocs, setShowDocs] = useState(true);
    const [showGrant, setShowGrant] = useState(true);
    const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());

    const [submissionDownloading, setSubmissionDownloading] = useState(false);

    const entityId = typeof appId === 'string' ? parseInt(appId, 10) : (appId ?? 0);
    const userId = user?.id ? parseInt(String(user.id), 10) : 0;

    const { selectedProject: selectedApplication } = useSelector((state: RootState) => state.discretionaryGrant);
    const { data: OrgData } = useGetOrganizationByIdQuery(orgId, { skip: !orgId });

    // Use the RTK Query cache (already populated by DiscretionaryPage) to get the
    // authoritative project record for this specific appId — avoids stale store state.
    const { data: dgApplicationsData } = useGetDGOrgApplicationsQuery(orgId, { skip: !orgId });
    const projectFromQuery = dgApplicationsData?.result?.items?.find(
        (p: any) => p.id === entityId
    );
    // Prefer the query result; fall back to the store's selectedProject
    const activeProject = projectFromQuery ?? selectedApplication;

    const period = (() => {
        const start = activeProject?.contractStartDate;
        const end = activeProject?.contractEndDate;
        if (start && end) {
            const startYear = new Date(start).getFullYear();
            const endYear = new Date(end).getFullYear();
            if (startYear && endYear && startYear !== endYear) return `${startYear}/${endYear}`;
        }
        const match = activeProject?.title?.match(/(\d{4})-(\d{4})/);
        return match ? `${match[1]}/${match[2]}` : '';
    })();

    const {
        data: documents = [],
        isLoading: docsLoading,
        isError: docsError,
        refetch: refetchDocs,
    } = useGetDocsByEntityIdQuery(
        { entityId, userId },
        { skip: !appId || !user?.id },
    );

    const { data: grants } = useGetProjectDetailsListViewQuery(Number(appId), { skip: !appId });
    const { downloadDocument } = useDocumentDownloader();

    const handleDocDownload = async (doc: DocumentDownloadDto) => {
        if (downloadingIds.has(doc.id)) return;
        setDownloadingIds(prev => new Set(prev).add(doc.id));
        try {
            // Normalise URL — the API may return a relative path or an empty string
            let url = doc.downloadUrl?.trim();
            if (!url) {
                url = `${API_BASE_URL}/api/services/app/Account/DownloadFile?id=${doc.id}`;
            } else if (!url.startsWith('http')) {
                url = `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
            }

            const uri = await downloadDocument(url, doc.originalFileName);
            if (uri && uri !== 'dismissed') {
                showToast({ message: `"${doc.originalFileName}" is ready to save`, title: 'Download ready', type: 'success', position: 'top' });
            } else if (uri === null) {
                showToast({
                    title: 'File not found',
                    message: `"${doc.originalFileName}" could not be located on the server. Please contact support if this persists.`,
                    type: 'error',
                    position: 'top',
                });
            }
        } catch {
            showToast({ title: 'Download failed', message: `Could not download "${doc.originalFileName}". Please try again.`, type: 'error', position: 'top' });
        } finally {
            setDownloadingIds(prev => { const s = new Set(prev); s.delete(doc.id); return s; });
        }
    };

    const handleSubmissionLetterDownload = async () => {
        if (submissionDownloading) return;
        setSubmissionDownloading(true);
        try {
            const temp: ILetter = {
                Organisation_Name: OrgData?.organisationName || 'N/A',
                Trade_Name: OrgData?.organisationTradingName || 'N/A',
                SDL: OrgData?.sdlNo || 'N/A',
                Period: period,
                downloadedDate: new Date().toLocaleDateString('en-za', { month: '2-digit', day: '2-digit', year: 'numeric' }),
                isDG: true,
            };
            await generateSubmissionLetterPdf(temp);
        } catch (error) {
            console.error("Error generating submission letter PDF:", error);
            showToast({ message: `Failed to generate Submission Letter`, title: "Error", type: "error", position: "top" });
        } finally {
            setSubmissionDownloading(false);
        }
    }

    const sortedDocs = [...documents].sort(
        (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );

    return (
        <FlatList
            data={[]}
            renderItem={() => null}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            ListFooterComponent={
                <>
                    {/* ── Attached Documents ───────────────────────────────── */}
                    <Expandable
                        title={docsLoading ? 'Loading documents…' : `Attached Documents (${documents.length})`}
                        isExpanded={showDocs}
                        onPress={() => setShowDocs(v => !v)}
                    >
                        {docsLoading && <RListLoading count={3} />}

                        {!docsLoading && docsError && (
                            <View style={styles.errorBox}>
                                <Ionicons name='alert-circle-outline' size={28} color={colors.red[500]} />
                                <Text style={styles.errorText}>Failed to load documents</Text>
                                <TouchableOpacity onPress={refetchDocs} style={styles.retryBtn}>
                                    <Text style={styles.retryText}>Retry</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {!docsLoading && !docsError && documents.length === 0 && (
                            <REmpty
                                title='No documents found'
                                subtitle='No files have been uploaded for this application yet.'
                                icon='file'
                                style={{ minHeight: 200 }}
                            />
                        )}

                        {!docsLoading && !docsError && sortedDocs.map(doc => (
                            <DocumentCard
                                key={doc.id}
                                doc={doc}
                                downloading={downloadingIds.has(doc.id)}
                                onDownload={handleDocDownload}
                            />
                        ))}
                    </Expandable>

                    {/* ── Grant Management ─────────────────────────────────── */}
                    <View style={styles.section}>
                        <Expandable
                            title='Grant Management'
                            isExpanded={showGrant}
                            onPress={() => setShowGrant(v => !v)}
                        >
                            <FlatList
                                data={grants}
                                keyExtractor={(item) => String(item.id)}
                                renderItem={({ item }) => (
                                    <GrantDetails data={item} appId={Number(appId)} />
                                )}
                                scrollEnabled={false}
                                showsVerticalScrollIndicator={false}
                                ListEmptyComponent={
                                    <View style={styles.emptyGrant}>
                                        <MaterialCommunityIcons name='cash-clock' size={32} color={colors.gray[300]} />
                                        <Text style={styles.emptyGrantText}>No grant details available</Text>
                                    </View>
                                }
                            />
                        </Expandable>

                        {
                            !activeProject?.projectStatus?.toLowerCase().includes('registered') && (
                                <>
                                    <RNText variant='titleMedium' style={styles.sectionTitle}>Download Submission Letter</RNText>
                                    <DownloadTemp fileName='Submission Letter Document' onPress={handleSubmissionLetterDownload} isLoading={submissionDownloading} />
                                </>
                            )
                        }
                    </View>
                </>
            }
        />
    );
}

export default FileManagementPage

const styles = StyleSheet.create({
    list: {
        flex: 1,
        backgroundColor: colors.gray[50],
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.gray[700],
        marginTop: 14,
        marginBottom: 4,
    },
    content: {
        paddingHorizontal: 12,
        paddingTop: 6,
        paddingBottom: 32,
        gap: 8,
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
    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    emptyGrant: {
        alignItems: 'center' as const,
        paddingVertical: 28,
        gap: 8,
    },
    emptyGrantText: {
        fontSize: 13,
        fontFamily: `${appFonts.regular}`,
        color: colors.gray[400],
    },
})