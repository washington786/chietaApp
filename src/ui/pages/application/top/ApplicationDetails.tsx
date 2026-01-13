import { FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Expandable } from '@/components/modules/application'
import { BarChart } from 'react-native-gifted-charts';
import { RListLoading, RUpload } from '@/components/common';
import { Text } from 'react-native-paper';
import colors from '@/config/colors';
import { showToast } from '@/core';
import { MandatoryGrantBiodataDto } from '@/core/models/MandatoryDto';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useGetApplicationBiosQuery } from '@/store/api/api';
import { navigationTypes } from '@/core/types/navigationTypes';

const ApplicationDetails = () => {

    const { appId } = useRoute<RouteProp<navigationTypes, "applicationDetails">>().params;

    const { data, isLoading: loading, error } = useGetApplicationBiosQuery(appId, { skip: !appId });

    const biodata = data?.items || [];

    const [expandBio, setBio] = useState(false);
    const [expandDocs, setDocs] = useState(false);
    const [expandRace, setRace] = useState(false);
    const [expandGender, setGender] = useState(false);

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

    if (error) {
        let errorMessage: string = 'Failed to load biodata';
        if (error && typeof error === 'object' && 'data' in error && error.data) {
            errorMessage = JSON.stringify(error.data);
        } else if (error && typeof error === 'object' && 'message' in error && error.message) {
            errorMessage = error.message as string;
        }
        showToast({ title: "Error Fetching", message: errorMessage, type: "error", position: "top" });
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

                        <Text variant='titleMedium' style={styles.title}>All uploaded Mandotory Files</Text>

                        <Expandable title='Banking, training report, & verification' isExpanded={expandDocs} onPress={() => setDocs(!expandDocs)}>
                            <RUpload title='Proof of Banking details' onPress={() => { }} />
                            <RUpload title='Annual training report' onPress={() => { }} />
                            <RUpload title='verification document' onPress={() => { }} />
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