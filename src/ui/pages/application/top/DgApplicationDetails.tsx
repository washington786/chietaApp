import { FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import colors from '@/config/colors'
import { Text } from 'react-native-paper'
import { Expandable } from '@/components/modules/application'
import { RCol, RInput, RUpload } from '@/components/common'
import { Picker } from '@react-native-picker/picker'
import { main_manicipalities, mainDistricts, provinces } from '@/core/helpers/data'
import { Province } from '@/core/types/provTypes'

const DgApplicationDetails = () => {
    const [expandDocs, setDocs] = useState(false);
    const [expandProv, setProv] = useState(false);
    const [expandProg, setProg] = useState(false);

    const [selectedProvince, setProvince] = useState<Province>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedMunicipality, setSelectedMunipality] = useState<string>("");

    const [district, setDistrict] = useState<string[]>([]);
    const [manucipality, setManucipality] = useState<string[]>([]);

    function handleProvChange(val: Province) {
        setProvince(val)
        setDistrict(mainDistricts[val] || [])
        setManucipality(main_manicipalities[val] || [])
    }

    function handleDistrictChange(val: string) {
        setSelectedDistrict(val);
    }
    function handleMunicipalityChange(val: string) {
        setSelectedMunipality(val);
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
                        <Text variant='titleMedium' style={styles.title}>Capture Application</Text>
                        <Expandable title='Learner Details' isExpanded={expandProv} onPress={() => setProv(!expandProv)}>

                            <RInput placeholder='#Continuing' />
                            <RInput placeholder='#New' />
                            <RInput placeholder='#Female' />
                            <RInput placeholder='#HDI' />
                            <RInput placeholder='#Youth' />
                            <RInput placeholder='#Disabled' />
                            <RInput placeholder='#Rural' />


                            <RCol style={styles.pickerContainer}>
                                <Picker onValueChange={handleProvChange} selectedValue={selectedProvince}>
                                    <Picker.Item label="Select Province" value="" />
                                    {provinces.map((province, index) => (
                                        <Picker.Item key={index} label={province} value={province} />
                                    ))}
                                </Picker>
                            </RCol>

                            <RCol style={styles.pickerContainer}>

                                <Picker onValueChange={handleDistrictChange} selectedValue={selectedDistrict}>
                                    <Picker.Item label="Select District" value="" />
                                    {
                                        district.map((district, index) => <Picker.Item label={district} value={district} key={`${index}-${district}`} />)
                                    }
                                </Picker>
                            </RCol>
                            <RCol style={styles.pickerContainer}>

                                <Picker onValueChange={handleMunicipalityChange} selectedValue={selectedMunicipality}>
                                    <Picker.Item label="Select Municipality" value="" />
                                    {
                                        manucipality.map((manucipality, index) => <Picker.Item label={manucipality} value={district} key={`${index}-${district}`} />)
                                    }
                                </Picker>
                            </RCol>
                        </Expandable>
                        <Text variant='titleMedium' style={styles.title}>Program</Text>
                        <Expandable title='Programme Details' isExpanded={expandProg} onPress={() => setProg(!expandProg)}>

                            <RInput placeholder='Programme Type' />
                            <RInput placeholder='Leearning Programme' />
                            <RInput placeholder='SubCategory' />
                            <RInput placeholder='Intervention' />
                        </Expandable>
                        <Text variant='titleMedium' style={styles.title}>All uploaded Mandotory Files</Text>

                        <Expandable title='Supporting documents' isExpanded={expandDocs} onPress={() => setDocs(!expandDocs)}>
                            <RUpload title='Tax Compliance' onPress={() => { }} />
                            <RUpload title='Company Registration' onPress={() => { }} />
                            <RUpload title='BBBEE Certificate/Affidavit' onPress={() => { }} />
                            <RUpload title='proof of accredetation' onPress={() => { }} />
                            <RUpload title='Letter of commitment' onPress={() => { }} />
                            <RUpload title='learner schedule' onPress={() => { }} />
                            <RUpload title='organization declaration of interest' onPress={() => { }} />
                            <RUpload title='Proof of banking details' onPress={() => { }} />
                        </Expandable>
                    </>
                )
            }}
        />
    )

}

export default DgApplicationDetails

const styles = StyleSheet.create({
    con: { paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1, backgroundColor: "white" },
    title: {
        fontSize: 16,
        color: colors.primary[950],
        marginVertical: 10
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: colors.slate[200],
        borderRadius: 6,
        marginBottom: 16,
        overflow: 'hidden',
        minHeight: 60,
    },
})