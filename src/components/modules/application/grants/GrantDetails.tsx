import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { RCol, RDivider, RRow } from '@/components/common'
import { Expandable } from './Expandable'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { EvilIcons } from '@expo/vector-icons'
import { errorBox } from '@/components/loadAssets'
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet'
import useGrants from '@/hooks/main/useGrants'

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

const GrantDetails: FC<GrantDetailsProps> = ({ data, appId }) => {
    const [showDetails, setShowDetails] = React.useState<boolean>(true);

    const { generateApprovedGrantsReport, generateRejectedGrantsReport } = useGrants({ appId });

    // Use data prop if provided, otherwise fall back to entry prop
    const displayData = data ?? null;

    const { close, open } = useGlobalBottomSheet();

    if (!displayData) {
        return (
            <RCol style={styles.moduleContainer}>
                <Text variant='bodySmall' style={{ color: colors.gray[500] }}>No grant details available</Text>
            </RCol>
        );
    }

    const focusAreaLabel = data?.focusArea || 'Grant Details';
    const subCategory = data?.subCategory || 'N/A';
    const intervention = data?.intervention || 'N/A';
    const approvedLearners = data?.gC_New || data?.number_New || 0;
    const costPerLearner = data?.gC_CostPerLearner || data?.costPerLearner || 0;
    const contractNo = data?.contract_Number || 'N/A';

    async function handleEvaluationDownload() {
        if (data?.status === 'Rejected') {
            await generateRejectedGrantsReport();
            return;
        }

        if (data?.status !== 'Approved' && data?.status !== 'Rejected') {
            open(<DownloadError close={close} file='evaluation outcome ' />, { snapPoints: ['40%'] });
        }

        await generateApprovedGrantsReport();
    }
    async function handleMOADownload() {
        if (data?.status !== 'Approved' && data?.status !== 'Rejected') {
            open(<DownloadError close={close} file="MOA " />, { snapPoints: ['40%'] });
        }
    }

    return (
        <RCol style={styles.moduleContainer}>
            <Expandable title={focusAreaLabel} isExpanded={showDetails} onPress={() => { setShowDetails(!showDetails) }}>
                <RCol style={{ padding: 5, gap: 4 }}>
                    <RRow style={styles.row}>
                        <Text variant='titleSmall'>Subcategory</Text>
                        <Text variant='bodySmall' style={styles.value} lineBreakMode='tail' numberOfLines={2}>{subCategory}</Text>
                    </RRow>
                    <RRow style={styles.row}>
                        <Text variant='titleSmall'>Intervention</Text>
                        <Text variant='bodySmall' style={styles.value} lineBreakMode='tail' numberOfLines={2}>{intervention}</Text>
                    </RRow>
                    <RRow style={styles.row}>
                        <Text variant='titleSmall'>Approved Learners</Text>
                        <Text variant='bodySmall' style={styles.value} lineBreakMode='tail' numberOfLines={2}>{approvedLearners}</Text>
                    </RRow>
                    <RRow style={styles.row}>
                        <Text variant='titleSmall'>Approved Amount/Learner</Text>
                        <Text variant='bodySmall' style={[styles.value, styles.cost]} lineBreakMode='tail' numberOfLines={2}>R{costPerLearner.toLocaleString()}</Text>
                    </RRow>
                    <RRow style={styles.row}>
                        <Text variant='titleSmall'>Contract No</Text>
                        <Text variant='bodySmall' style={[styles.value]} lineBreakMode='tail' numberOfLines={2}>{contractNo}</Text>
                    </RRow>

                    <RDivider />
                    <Text variant='bodySmall' style={{ color: colors.primary[800] }}>Memorandum of Agreement (MOA)</Text>

                    <RCol style={{ marginTop: 5 }}>
                        <Text variant='labelSmall' style={{ color: colors.zinc[800] }}>Download Files</Text>
                        <DownloadTemp fileName='Download Evaluation Outcome' onPress={handleEvaluationDownload} />

                        <DownloadTemp fileName='Download MOA' onPress={handleMOADownload} />
                    </RCol>

                </RCol>
            </Expandable>
        </RCol>
    )
}

function DownloadTemp({ fileName, onPress }: { fileName: string, onPress?: () => void }) {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginVertical: 5, borderWidth: 0.4, borderColor: colors.blue[300], padding: 8, borderRadius: 20, width: "auto" }}>
            <FontAwesome name="cloud-download" size={24} color={colors.blue[400]} />
            <Text variant='bodySmall' style={{ color: colors.gray[500] }}>{fileName}</Text>
        </TouchableOpacity>
    )
}


function DownloadError({ close, file }: { close: () => void, file: string }) {
    return (
        <View style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
            <RRow
                style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <Text variant="titleMedium">Download Error</Text>
                </View>

                <TouchableOpacity onPress={close}>
                    <EvilIcons name="close" size={32} color="black" />
                </TouchableOpacity>
            </RRow>

            <RCol style={{ alignItems: "center", gap: 16 }}>
                <Image source={errorBox} style={{ width: 64, height: 64 }} />
                <Text variant="headlineMedium" style={{ fontWeight: "bold", textAlign: "center" }}>
                    File Not Available
                </Text>

                <Text
                    variant="bodyMedium"
                    style={{ textAlign: "center", color: "#666", lineHeight: 24 }}
                >
                    An error occurred while trying to download the {file}
                    file. File not available for this application grant.
                </Text>
            </RCol>
        </View>
    )
}

export default GrantDetails

const styles = StyleSheet.create({
    moduleContainer: {
        marginVertical: 10,
    },
    row: { justifyContent: 'space-between', alignItems: 'center' },
    value: {
        flex: 1,
        textAlign: 'right',
        fontWeight: 'ultralight',
        fontSize: 10
    },
    cost: {
        fontWeight: 'bold',
        fontSize: 12,
        color: 'green',
    },
})