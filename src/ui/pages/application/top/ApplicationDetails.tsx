import { FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Expandable } from '@/components/modules/application'
import { BarChart } from 'react-native-gifted-charts';
import { RUpload } from '@/components/common';
import { Text } from 'react-native-paper';
import colors from '@/config/colors';

interface bio {
    idNumber: string;
    disabled: string;
    gender: string;
    province: string;
    nationality: string;
    race: string;
}
const data: bio[] = [{ "idNumber": "9001011234081", "gender": "Female", "disabled": "No", "race": "Black", "nationality": "South African", "province": "Gauteng" }, { "idNumber": "8507155780032", "gender": "Male", "disabled": "No", "race": "Coloured", "nationality": "South African", "province": "Western Cape" }, { "idNumber": "9902300456789", "gender": "Female", "disabled": "Yes", "race": "Black", "nationality": "South African", "province": "KwaZulu-Natal" }, { "idNumber": "7705129999123", "gender": "Male", "disabled": "No", "race": "Indian", "nationality": "South African", "province": "Gauteng" }, { "idNumber": "0304052345016", "gender": "Female", "disabled": "No", "race": "Black", "nationality": "South African", "province": "Limpopo" }, { "idNumber": "6508277654320", "gender": "Male", "disabled": "Yes", "race": "White", "nationality": "South African", "province": "Free State" }, { "idNumber": "8209130004128", "gender": "Female", "disabled": "No", "race": "Coloured", "nationality": "South African", "province": "Northern Cape" }, { "idNumber": "9106245432115", "gender": "Male", "disabled": "No", "race": "Black", "nationality": "Zimbabwean", "province": "Mpumalanga" }, { "idNumber": "0401011000009", "gender": "Female", "disabled": "Yes", "race": "Indian", "nationality": "South African", "province": "KwaZulu-Natal" }, { "idNumber": "8803308123454", "gender": "Male", "disabled": "No", "race": "Black", "nationality": "South African", "province": "North West" }, { "idNumber": "7602292999007", "gender": "Male", "disabled": "No", "race": "Coloured", "nationality": "South African", "province": "Western Cape" }, { "idNumber": "0202020234005", "gender": "Female", "disabled": "No", "race": "Black", "nationality": "Mozambican", "province": "Gauteng" }, { "idNumber": "9308086789002", "gender": "Male", "disabled": "Yes", "race": "White", "nationality": "South African", "province": "Eastern Cape" }, { "idNumber": "0012310000124", "gender": "Female", "disabled": "No", "race": "Other", "nationality": "South African", "province": "Limpopo" }, { "idNumber": "8701015999018", "gender": "Male", "disabled": "No", "race": "Black", "nationality": "South African", "province": "Gauteng" }]

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