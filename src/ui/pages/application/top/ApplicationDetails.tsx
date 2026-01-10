import { FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Expandable } from '@/components/modules/application'
import { BarChart } from 'react-native-gifted-charts';
import { RListLoading, RUpload } from '@/components/common';
import { Text } from 'react-native-paper';
import colors from '@/config/colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { showToast } from '@/core';
import { fetchMandatoryGrantData } from '@/store/slice/thunks/MandatoryThunks';
import { MandatoryGrantBiodataDto } from '@/core/models/MandatoryDto';

interface PageTypes {
    appId: string,
    orgId: string
}

const ApplicationDetails = () => {

    // const { appId } = useRoute().params as PageTypes;

    const { biodata, error, loading } = useSelector((state: RootState) => state.mandatoryGrant);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchMandatoryGrantData());
    }, [dispatch]);

    const [expandBio, setBio] = useState(false);
    const [expandDocs, setDocs] = useState(false);
    const [expandRace, setRace] = useState(false);
    const [expandGender, setGender] = useState(false);

    // const orgData = biodata.find((bio) => bio.applicationId === appId);

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
            counts[item.gender!] = (counts[item.gender!] || 0) + 1;
        });

        return Object.entries(counts).map(([label, value]) => ({ label, value }));
    };
    const getCountByRace = (data: MandatoryGrantBiodataDto[]) => {
        const counts: Record<string, number> = {};
        data.forEach(item => {
            counts[item.race!] = (counts[item.race!] || 0) + 1;
        });

        return Object.entries(counts).map(([label, value]) => ({ label, value }));
    };

    const provinceData = getCountByProvince(biodata!);
    const genderData = getCountByGender(biodata!);
    const raceDate = getCountByRace(biodata!);

    if (error) {
        showToast({ title: "Error Fetching", message: error, type: "error", position: "top" });
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
                            <BarChart data={provinceData}
                                barWidth={20}
                                spacing={12}
                                yAxisThickness={0}
                                xAxisThickness={0}
                                initialSpacing={10}
                                maxValue={Math.max(...provinceData.map(d => d.value)) + 1} />
                        </Expandable>
                        <Expandable title='Race Stats' isExpanded={expandRace} onPress={() => setRace(!expandRace)}>
                            <BarChart data={raceDate}
                                barWidth={20}
                                spacing={12}
                                yAxisThickness={0}
                                xAxisThickness={0}
                                initialSpacing={10}
                                maxValue={Math.max(...genderData.map(d => d.value)) + 1} />
                        </Expandable>
                        <Expandable title='Gender Stats' isExpanded={expandGender} onPress={() => setGender(!expandGender)}>
                            <BarChart data={genderData}
                                barWidth={20}
                                spacing={12}
                                yAxisThickness={0}
                                xAxisThickness={0}
                                initialSpacing={10}
                                maxValue={Math.max(...genderData.map(d => d.value)) + 1} />
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