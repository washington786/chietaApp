import { FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Expandable, RUploadSuccessFile } from '@/components/modules/application'
import { BarChart } from 'react-native-gifted-charts';
import { REmpty, RListLoading, RUpload } from '@/components/common';
import { Text } from 'react-native-paper';
import colors from '@/config/colors';
import { showToast } from '@/core';
import { MandatoryGrantBiodataDto } from '@/core/models/MandatoryDto';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useGetApplicationBiosQuery, useGetDocumentsByEntityQuery, useDownloadDocumentMutation } from '@/store/api/api';
import { navigationTypes } from '@/core/types/navigationTypes';
import RDownload from '@/components/common/RDownload';
import { RootState } from '@/store/store';

const ApplicationDetails = () => {

    const { appId } = useRoute<RouteProp<navigationTypes, "applicationDetails">>().params;
    const user = useSelector((state: RootState) => state.auth.user);

    const { data, isLoading: loading, error } = useGetApplicationBiosQuery(appId, { skip: !appId });

    const biodata = data?.items || [];

    const [expandBio, setBio] = useState(false);
    const [expandDocs, setDocs] = useState(false);
    const [expandRace, setRace] = useState(false);
    const [expandGender, setGender] = useState(false);

    const [downloadDocument, { isLoading: isDownloading }] = useDownloadDocumentMutation();

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

    //documents handling:
    const bank = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Mandatory', documentType: 'bank confirmation' },
        { skip: !appId }
    );
    const verification = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Mandatory', documentType: 'verification' },
        { skip: !appId }
    );
    const pivot = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Mandatory', documentType: 'wsp atr pivot' },
        { skip: !appId }
    );

    const getDocument = (query: any) => query.data?.result?.items?.[0]?.documents;

    const provinceData = getCountByProvince(biodata);
    const genderData = getCountByGender(biodata);
    const raceData = getCountByRace(biodata);

    // Document download handlers
    const getDocumentTypeForDownload = (documentType: string): string => {
        // Map document types to the API's expected format
        const typeMap: Record<string, string> = {
            'bank confirmation': 'Bank confirmation',
            'verification': 'Verification',
            'wsp atr pivot': 'WSP ATR Pivot',
        };
        return typeMap[documentType.toLowerCase()] || documentType;
    };

    const handleDownload = async (doc: any, docTitle: string, documentType: string) => {
        if (!doc) {
            showToast({ message: `${docTitle} not found`, title: "Error", type: "error", position: "top" });
            return;
        }

        if (!user?.id) {
            showToast({ message: "User information not available", title: "Error", type: "error", position: "top" });
            return;
        }

        if (!appId) {
            showToast({ message: "Application ID not available", title: "Error", type: "error", position: "top" });
            return;
        }

        try {
            console.log("[Download] Starting download for:", docTitle);
            showToast({ message: `Downloading ${docTitle}...`, title: "Loading", type: "info", position: "top" });

            const downloadParams = {
                docType: getDocumentTypeForDownload(documentType),
                userID: parseInt(user.id.toString(), 10),
                module: 'Mandatory',
                appid: typeof appId === 'string' ? parseInt(appId, 10) : appId,
            };

            console.log("[Download] Download params:", JSON.stringify(downloadParams, null, 2));
            const result = await downloadDocument(downloadParams).unwrap();

            console.log("[Download] Response received:", JSON.stringify(result, null, 2));

            if (result?.result?.isSuccess) {
                showToast({ message: `${docTitle} downloaded successfully`, title: "Success", type: "success", position: "top" });
            } else {
                console.log("[Download] isSuccess is false, result:", result?.result);
                showToast({ message: `Failed to download ${docTitle}`, title: "Error", type: "error", position: "top" });
            }
        } catch (err: any) {
            console.error("[Download] Error caught:", err);
            showToast({ message: `Failed to download ${docTitle}`, title: "Error", type: "error", position: "top" });
        }
    };

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

                        <Text variant='titleMedium' style={styles.title}>All uploaded Mandotory Files</Text>

                        <Expandable title='Banking, training report, & verification' isExpanded={expandDocs} onPress={() => setDocs(!expandDocs)}>
                            {bank && (
                                <RDownload title='Proof of Banking details' onPress={() => handleDownload(getDocument(bank), 'Banking Details', 'bank confirmation')} fileName={getDocument(bank)?.filename} />
                            )}

                            {pivot && (
                                <RDownload title='Annual training report' onPress={() => handleDownload(getDocument(pivot), 'Annual Training Report', 'wsp atr pivot')} fileName={getDocument(pivot)?.filename} />
                            )}

                            {verification && (
                                <RDownload title='verification document' onPress={() => handleDownload(getDocument(verification), 'Verification Document', 'verification')} fileName={getDocument(verification)?.filename} />
                            )}

                            {!bank && !pivot && !verification && (
                                <REmpty title='No Documents Found' subtitle='No mandatory documents have been uploaded for this application' icon='file' />
                            )}

                        </Expandable>
                    </>
                )
            }}
        />
    )
}

export default ApplicationDetails

const styles = StyleSheet.create({
    con: { paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1, backgroundColor: "white" },
    title: {
        fontSize: 16,
        color: colors.primary[950],
        marginVertical: 10
    }
})