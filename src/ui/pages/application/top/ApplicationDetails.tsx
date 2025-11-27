import { FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Expandable } from '@/components/modules/application'
import { BarChart } from 'react-native-gifted-charts';
import { RUpload } from '@/components/common';
import { Text } from 'react-native-paper';
import colors from '@/config/colors';
import { bio, data } from '@/core/types/dt';

const ApplicationDetails = () => {
    const [expandBio, setBio] = useState(false);
    const [expandDocs, setDocs] = useState(false);
    const [expandRace, setRace] = useState(false);
    const [expandGender, setGender] = useState(false);
    const getCountByProvince = (data: bio[]) => {
        const counts: Record<string, number> = {};
        data.forEach(item => {
            counts[item.province] = (counts[item.province] || 0) + 1;
        });

        return Object.entries(counts).map(([label, value]) => ({ label, value }));
    };
    const getCountByGender = (data: bio[]) => {
        const counts: Record<string, number> = {};
        data.forEach(item => {
            counts[item.gender] = (counts[item.gender] || 0) + 1;
        });

        return Object.entries(counts).map(([label, value]) => ({ label, value }));
    };
    const getCountByRace = (data: bio[]) => {
        const counts: Record<string, number> = {};
        data.forEach(item => {
            counts[item.race] = (counts[item.race] || 0) + 1;
        });

        return Object.entries(counts).map(([label, value]) => ({ label, value }));
    };

    const provinceData = getCountByProvince(data);
    const genderData = getCountByGender(data);
    const raceDate = getCountByRace(data);
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