import { StyleSheet } from 'react-native'
import React, { useState, useMemo } from 'react'
import { RCol, RLoaderAnimation, Scroller, REmpty } from '@/components/common'
import { useRoute, RouteProp } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'
import { DocumentDto } from '@/core/models/MandatoryDto'
import { showToast } from '@/core'
import { useGetDocumentsByEntityQuery } from '@/store/api/api'
import { Expandable } from '@/components/modules/application'
import RDownload from '@/components/common/RDownload'

const FileManagementPage = () => {
    const { appId } = useRoute<RouteProp<navigationTypes, "applicationDetails">>().params;

    const [showDocs, setShowDocs] = useState<boolean>(true);

    // Fetch all document types
    const taxQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Tax Compliance' },
        { skip: !appId }
    );
    const companyQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Company Registration' },
        { skip: !appId }
    );
    const beeQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'BBBEE Certificate' },
        { skip: !appId }
    );
    const accredQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Proof of Accreditation' },
        { skip: !appId }
    );
    const commitQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Letter of Commitment' },
        { skip: !appId }
    );
    const learnerQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Learner Schedule' },
        { skip: !appId }
    );
    const orgQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Organization Declaration of Interest' },
        { skip: !appId }
    );
    const bankQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Proof of Banking Details' },
        { skip: !appId }
    );
    const appFormQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Application Form' },
        { skip: !appId }
    );

    // Helper function to get document from RTK Query data
    const getDocument = (query: any) => query.data?.result?.items?.[0]?.documents;

    // Check if any documents exist
    const hasDocuments = useMemo(() => {
        return !!(
            getDocument(taxQuery) ||
            getDocument(companyQuery) ||
            getDocument(beeQuery) ||
            getDocument(accredQuery) ||
            getDocument(commitQuery) ||
            getDocument(learnerQuery) ||
            getDocument(orgQuery) ||
            getDocument(bankQuery) ||
            getDocument(appFormQuery)
        );
    }, [taxQuery.data, companyQuery.data, beeQuery.data, accredQuery.data, commitQuery.data, learnerQuery.data, orgQuery.data, bankQuery.data, appFormQuery.data]);

    // Check if any queries are loading
    const isLoading = useMemo(() => {
        return !!(
            taxQuery.isLoading ||
            companyQuery.isLoading ||
            beeQuery.isLoading ||
            accredQuery.isLoading ||
            commitQuery.isLoading ||
            learnerQuery.isLoading ||
            orgQuery.isLoading ||
            bankQuery.isLoading ||
            appFormQuery.isLoading
        );
    }, [taxQuery.isLoading, companyQuery.isLoading, beeQuery.isLoading, accredQuery.isLoading, commitQuery.isLoading, learnerQuery.isLoading, orgQuery.isLoading, bankQuery.isLoading, appFormQuery.isLoading]);


    const handleDownload = (doc: DocumentDto) => {
        showToast({
            title: "Download",
            message: `Preparing ${doc.filename}...`,
            type: "success",
            position: "top"
        });
    };

    return (
        <Scroller style={styles.list}>
            {isLoading ? (
                <RLoaderAnimation />
            ) : !hasDocuments ? (
                <REmpty title='No Documents' subtitle='No documents have been uploaded for this application yet.' />
            ) : (
                <Expandable title='Manage Uploaded Documents' isExpanded={showDocs} onPress={() => setShowDocs(!showDocs)}>
                    <RCol style={styles.docs}>
                        {
                            taxQuery.isSuccess && getDocument(taxQuery) && (<RDownload title={getDocument(taxQuery).documenttype} fileName={getDocument(taxQuery).filename} onPress={() => { handleDownload(getDocument(taxQuery)) }} />)
                        }
                        {
                            companyQuery.isSuccess && getDocument(companyQuery) && (<RDownload title={getDocument(companyQuery).documenttype} fileName={getDocument(companyQuery).filename} onPress={() => { handleDownload(getDocument(companyQuery)) }} />)
                        }
                        {
                            beeQuery.isSuccess && getDocument(beeQuery) && (<RDownload title={getDocument(beeQuery).documenttype} fileName={getDocument(beeQuery).filename} onPress={() => { handleDownload(getDocument(beeQuery)) }} />)
                        }
                        {
                            accredQuery.isSuccess && getDocument(accredQuery) && (<RDownload title={getDocument(accredQuery).documenttype} fileName={getDocument(accredQuery).filename} onPress={() => { handleDownload(getDocument(accredQuery)) }} />)
                        }
                        {
                            commitQuery.isSuccess && getDocument(commitQuery) && (<RDownload title={getDocument(commitQuery).documenttype} fileName={getDocument(commitQuery).filename} onPress={() => { handleDownload(getDocument(commitQuery)) }} />)
                        }
                        {
                            learnerQuery.isSuccess && getDocument(learnerQuery) && (<RDownload title={getDocument(learnerQuery).documenttype} fileName={getDocument(learnerQuery).filename} onPress={() => { handleDownload(getDocument(learnerQuery)) }} />)
                        }
                        {
                            orgQuery.isSuccess && getDocument(orgQuery) && (<RDownload title={getDocument(orgQuery).documenttype} fileName={getDocument(orgQuery).filename} onPress={() => { handleDownload(getDocument(orgQuery)) }} />)
                        }
                        {
                            bankQuery.isSuccess && getDocument(bankQuery) && (<RDownload title={getDocument(bankQuery).documenttype} fileName={getDocument(bankQuery).filename} onPress={() => { handleDownload(getDocument(bankQuery)) }} />)
                        }
                        {
                            appFormQuery.isSuccess && getDocument(appFormQuery) && (<RDownload title={getDocument(appFormQuery).documenttype} fileName={getDocument(appFormQuery).filename} onPress={() => { handleDownload(getDocument(appFormQuery)) }} />)
                        }
                    </RCol>
                </Expandable>
            )}
        </Scroller>
    )
}

export default FileManagementPage

const styles = StyleSheet.create({
    list: {
        flex: 1,
        flexGrow: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    docs: {
        marginVertical: 10,
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
})