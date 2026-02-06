import { StyleSheet } from 'react-native'
import React, { useState, useMemo } from 'react'
import { RCol, RLoaderAnimation, Scroller, REmpty } from '@/components/common'
import { useRoute, RouteProp } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'
import { DocumentDto } from '@/core/models/MandatoryDto'
import { showToast } from '@/core'
import { useGetDocumentsByEntityQuery, useGetGrantDetailsViewQuery, useGetProjectDetailsListViewQuery } from '@/store/api/api'
import { Expandable, GrantDetails } from '@/components/modules/application'
import RDownload from '@/components/common/RDownload'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { FlatList } from 'react-native'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'

const FileManagementPage = () => {
    const { appId } = useRoute<RouteProp<navigationTypes, "applicationDetails">>().params;
    const { selectedProject } = useSelector((state: RootState) => state.discretionaryGrant);
    const projType = selectedProject?.projType;

    const [showDocs, setShowDocs] = useState<boolean>(false);
    const [showGrant, setShowGrant] = useState<boolean>(true);

    // Define required documents by project type (using actual DB names)
    const documentsByProjectType: Record<string, string[]> = {
        'Learning Projects': [
            'Bank Proof',
            'BEE Certificate',
            'Schedule',
            'Declaration',
            'Workplace Approval',
            'Signed Application',
            'Tax Clearance',
            'Accreditation',
            'Proposal',
            'Company Registration',
            'Commitment'
        ],
        'Research Projects': [
            'Bank Proof',
            'BEE Certificate',
            'Schedule',
            'Declaration',
            'Workplace Approval',
            'Signed Application',
            'Tax Clearance',
            'Accreditation',
            'Proposal',
            'Company Registration',
            'Commitment'
        ],
        'Strategic Projects': [
            'Bank Proof',
            'Tax Clearance',
            'BEE Certificate',
            'Declaration',
            'Signed Application',
            'Proposal',
            'Company Registration',
            'Commitment'
        ]
    };

    const requiredDocuments = documentsByProjectType[projType || ''] || [];

    // Fetch all document types
    const allDocuments: Record<string, any> = {
        'Bank Proof': useGetDocumentsByEntityQuery(
            { entityId: appId, module: 'Projects', documentType: 'Bank Proof' },
            { skip: !appId || !requiredDocuments.includes('Bank Proof') }
        ),
        'BEE Certificate': useGetDocumentsByEntityQuery(
            { entityId: appId, module: 'Projects', documentType: 'BEE Certificate' },
            { skip: !appId || !requiredDocuments.includes('BEE Certificate') }
        ),
        'Schedule': useGetDocumentsByEntityQuery(
            { entityId: appId, module: 'Projects', documentType: 'Schedule' },
            { skip: !appId || !requiredDocuments.includes('Schedule') }
        ),
        'Declaration': useGetDocumentsByEntityQuery(
            { entityId: appId, module: 'Projects', documentType: 'Declaration' },
            { skip: !appId || !requiredDocuments.includes('Declaration') }
        ),
        'Workplace Approval': useGetDocumentsByEntityQuery(
            { entityId: appId, module: 'Projects', documentType: 'Workplace Approval' },
            { skip: !appId || !requiredDocuments.includes('Workplace Approval') }
        ),
        'Signed Application': useGetDocumentsByEntityQuery(
            { entityId: appId, module: 'Projects', documentType: 'Signed Application' },
            { skip: !appId || !requiredDocuments.includes('Signed Application') }
        ),
        'Tax Clearance': useGetDocumentsByEntityQuery(
            { entityId: appId, module: 'Projects', documentType: 'Tax Clearance' },
            { skip: !appId || !requiredDocuments.includes('Tax Clearance') }
        ),
        'Accreditation': useGetDocumentsByEntityQuery(
            { entityId: appId, module: 'Projects', documentType: 'Accreditation' },
            { skip: !appId || !requiredDocuments.includes('Accreditation') }
        ),
        'Proposal': useGetDocumentsByEntityQuery(
            { entityId: appId, module: 'Projects', documentType: 'Proposal' },
            { skip: !appId || !requiredDocuments.includes('Proposal') }
        ),
        'Company Registration': useGetDocumentsByEntityQuery(
            { entityId: appId, module: 'Projects', documentType: 'Company Registration' },
            { skip: !appId || !requiredDocuments.includes('Company Registration') }
        ),
        'Commitment': useGetDocumentsByEntityQuery(
            { entityId: appId, module: 'Projects', documentType: 'Commitment' },
            { skip: !appId || !requiredDocuments.includes('Commitment') }
        ),
    };

    const { data: grants, isLoading: grantsLoading, error } = useGetProjectDetailsListViewQuery(Number(appId), { skip: !appId });

    // Helper function to get document from RTK Query data
    const getDocument = (query: any) => query.data?.result?.items?.[0]?.documents;


    // Check if any documents exist
    const hasDocuments = useMemo(() => {
        return requiredDocuments.some(docType => getDocument(allDocuments[docType]));
    }, [requiredDocuments, allDocuments]);

    // Check if any queries are loading
    const isLoading = useMemo(() => {
        return requiredDocuments.some(docType => allDocuments[docType]?.isLoading);
    }, [requiredDocuments, allDocuments]);


    const handleDownload = (doc: DocumentDto) => {
        showToast({
            title: "Download",
            message: `Preparing ${doc.filename}...`,
            type: "success",
            position: "top"
        });
    };

    return (
        <>
            <FlatList
                data={[]}
                renderItem={() => null}
                style={styles.list}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <>
                        {isLoading ? (
                            <RLoaderAnimation />
                        ) : !hasDocuments ? (
                            <REmpty title='No Documents' subtitle='No documents have been uploaded for this application yet.' />
                        ) : (
                            <Expandable title='Manage Uploaded Documents' isExpanded={showDocs} onPress={() => setShowDocs(!showDocs)}>
                                <RCol style={styles.docs}>
                                    {requiredDocuments.map((docType) => {
                                        const query = allDocuments[docType];
                                        const doc = getDocument(query);
                                        return (
                                            doc && query.isSuccess && (
                                                <RDownload
                                                    key={docType}
                                                    title={doc.documenttype}
                                                    fileName={doc.filename}
                                                    onPress={() => { handleDownload(doc) }}
                                                />
                                            )
                                        );
                                    })}
                                </RCol>
                            </Expandable>
                        )}

                        <Expandable title='Grant Management' isExpanded={showGrant} onPress={() => setShowGrant(!showGrant)}>
                            <FlatList
                                data={grants}
                                keyExtractor={(item) => String(item.id)}
                                renderItem={({ item }) => (
                                    <GrantDetails data={item} appId={Number(appId)} />
                                )}
                                showsVerticalScrollIndicator={false}
                                ListEmptyComponent={<RCol>
                                    <Text variant='bodySmall' style={{ color: colors.gray[500] }}>No grant details available</Text>
                                </RCol>}
                            />
                        </Expandable>
                    </>
                }
            />
        </>
    )
}

export default FileManagementPage

const styles = StyleSheet.create({
    list: {
        flex: 1,
        flexGrow: 1,
        paddingHorizontal: 12,
        paddingTop: 6,
        paddingBottom: 20,
    },
    docs: {
        marginVertical: 10,
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
})