import { FlatList, StyleSheet } from 'react-native'
import React, { useState, useMemo } from 'react'
import colors from '@/config/colors'
import { Text } from 'react-native-paper'
import { Expandable, RUploadSuccess } from '@/components/modules/application'
import { RButton, RCol, RInput, RUpload } from '@/components/common'
import { Picker } from '@react-native-picker/picker'
import { main_manicipalities, mainDistricts, provinces } from '@/core/helpers/data'
import { Province } from '@/core/types/provTypes'
import { SelectList } from 'react-native-dropdown-select-list'
import { DocumentPickerResult } from 'expo-document-picker'
import useDocumentPicker from '@/hooks/main/UseDocumentPicker'
import { showToast } from '@/core'

const DgApplicationDetails = () => {
    const [expandDocs, setDocs] = useState(false);
    const [expandProv, setProv] = useState(false);
    const [expandProg, setProg] = useState(false);

    const [selectedProvince, setProvince] = useState<Province>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedMunicipality, setSelectedMunipality] = useState<string>("");

    const [district, setDistrict] = useState<string[]>([]);
    const [manucipality, setManucipality] = useState<string[]>([]);

    const [programmeType, setProgrammeType] = useState<string>("");
    const [learningProgramme, setLearningProgramme] = useState<string>("");
    const [subCategory, setSubCategory] = useState<string>("");
    const [intervention, setIntervention] = useState<string>("");

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

    // Memoize data arrays to prevent SelectList resets on re-render
    const provinceOptions = useMemo(
        () => provinces.map((p) => ({ key: p, value: p })),
        []
    );

    const districtOptions = useMemo(
        () => district.map((d) => ({ key: d, value: d })),
        [district]
    );

    const municipalityOptions = useMemo(
        () => manucipality.map((m) => ({ key: m, value: m })),
        [manucipality]
    );

    // document upload

    const { pickDocument, error, isLoading } = useDocumentPicker();

    const [taxComplience, setTaxComplience] = useState<DocumentPickerResult>();
    const [companyReg, setCompanyReg] = useState<DocumentPickerResult>();
    const [beeCert, setBeeCert] = useState<DocumentPickerResult>();
    const [accredetation, setAccredetation] = useState<DocumentPickerResult>();
    const [commitmentLetter, setCommitmentLetter] = useState<DocumentPickerResult>();
    const [learnerSchedule, setLearnerSchedule] = useState<DocumentPickerResult>();
    const [declarationInterest, setDeclarationInterest] = useState<DocumentPickerResult>();
    const [bankingDetailsProof, setBankDetails] = useState<DocumentPickerResult>();

    if (error) {
        console.log(error);
        showToast({ message: error, title: "Upload", type: "error", position: "top" })
    }

    async function handleTaxUpload() {
        try {
            const result = await pickDocument();
            if (result) {
                setTaxComplience(result);
            }
        } catch (error) {
            showToast({ message: "failed to upload document", title: "Upload", type: "error", position: "top" })
        }
    }
    async function handleCompanyReg() {
        try {
            const result = await pickDocument();
            if (result) {
                setCompanyReg(result);
            }
        } catch (error) {
            showToast({ message: "failed to upload document", title: "Upload", type: "error", position: "top" })
        }
    }
    async function handleBeeCert() {
        try {
            const result = await pickDocument();
            if (result) {
                setBeeCert(result);
            }
        } catch (error) {
            showToast({ message: "failed to upload document", title: "Upload", type: "error", position: "top" })
        }
    }
    async function handleProofAccredetation() {
        try {
            const result = await pickDocument();
            if (result) {
                setAccredetation(result);
            }
        } catch (error) {
            showToast({ message: "failed to upload document", title: "Upload", type: "error", position: "top" })
        }
    }
    async function handleLetterCommitment() {
        try {
            const result = await pickDocument();
            if (result) {
                setCommitmentLetter(result);
            }
        } catch (error) {
            showToast({ message: "failed to upload document", title: "Upload", type: "error", position: "top" })
        }
    }

    async function handleLearnerSchedule() {
        try {
            const result = await pickDocument();
            if (result) {
                setLearnerSchedule(result);
            }
        } catch (error) {
            showToast({ message: "failed to upload document", title: "Upload", type: "error", position: "top" })
        }
    }

    async function handleOrgInterest() {
        try {
            const result = await pickDocument();
            if (result) {
                setDeclarationInterest(result);
            }
        } catch (error) {
            showToast({ message: "failed to upload document", title: "Upload", type: "error", position: "top" })
        }
    }

    async function handleBankDetails() {
        try {
            const result = await pickDocument();
            if (result) {
                setBankDetails(result);
            }
        } catch (error) {
            showToast({ message: "failed to upload document", title: "Upload", type: "error", position: "top" })
        }
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
                        <Text variant='titleMedium' style={styles.title}>Program</Text>
                        <Expandable title='Programme Details' isExpanded={expandProg} onPress={() => setProg(!expandProg)}>
                            <SelectList
                                setSelected={(val: any) => setProgrammeType(val)}
                                data={[]}
                                save="value"
                                placeholder='Programme Type'
                            />
                            <SelectList
                                setSelected={(val: any) => setLearningProgramme(val)}
                                data={[]}
                                save="value"
                                placeholder='Learning Programme'
                            />
                            <SelectList
                                setSelected={(val: any) => setSubCategory(val)}
                                data={[]}
                                save="value"
                                placeholder='SubCategory'
                            />
                            <SelectList
                                setSelected={(val: any) => setIntervention(val)}
                                data={[]}
                                save="value"
                                placeholder='Intervention'
                            />
                        </Expandable>

                        <Text variant='titleMedium' style={styles.title}>Capture Application</Text>
                        <Expandable title='Learner Details' isExpanded={expandProv} onPress={() => setProv(!expandProv)}>

                            <RInput placeholder='#Continuing' />
                            <RInput placeholder='#New' />
                            <RInput placeholder='#Female' />
                            <RInput placeholder='#HDI' />
                            <RInput placeholder='#Youth' />
                            <RInput placeholder='#Disabled' />
                            <RInput placeholder='#Rural' />

                            <SelectList
                                setSelected={(val: any) => handleProvChange(val as Province)}
                                data={provinceOptions}
                                save="value"
                                placeholder='Select Province'
                                search={true}
                                boxStyles={{ marginBottom: 16 }}
                                dropdownStyles={{ marginBottom: 16 }}
                                defaultOption={selectedProvince ? { key: selectedProvince, value: selectedProvince } : undefined}
                            />

                            <SelectList
                                setSelected={(val: any) => handleDistrictChange(val)}
                                data={districtOptions}
                                save="value"
                                placeholder='Select District'
                                search={true}
                                boxStyles={{ marginBottom: 16 }}
                                dropdownStyles={{ marginBottom: 16 }}
                                defaultOption={selectedDistrict ? { key: selectedDistrict, value: selectedDistrict } : undefined}
                            />

                            <SelectList
                                setSelected={(val: any) => handleMunicipalityChange(val)}
                                data={municipalityOptions}
                                save="value"
                                placeholder='Select Municipality'
                                search={true}
                                boxStyles={{ marginBottom: 16 }}
                                dropdownStyles={{ marginBottom: 16 }}
                                defaultOption={selectedMunicipality ? { key: selectedMunicipality, value: selectedMunicipality } : undefined}
                            />
                        </Expandable>

                        <Text variant='titleMedium' style={styles.title}>All uploaded Mandotory Files</Text>

                        <Expandable title='Supporting documents' isExpanded={expandDocs} onPress={() => setDocs(!expandDocs)}>
                            <RUpload title='Tax Compliance' onPress={handleTaxUpload} />
                            {taxComplience && taxComplience.assets && <RUploadSuccess file={taxComplience} />}
                            <RUpload title='Company Registration' onPress={handleCompanyReg} />
                            {companyReg && companyReg.assets && <RUploadSuccess file={companyReg} />}
                            <RUpload title='BBBEE Certificate/Affidavit' onPress={handleBeeCert} />
                            {beeCert && beeCert.assets && <RUploadSuccess file={beeCert} />}
                            <RUpload title='proof of accredetation' onPress={handleProofAccredetation} />
                            {accredetation && accredetation.assets && <RUploadSuccess file={accredetation} />}
                            <RUpload title='Letter of commitment' onPress={handleLetterCommitment} />
                            {commitmentLetter && commitmentLetter.assets && <RUploadSuccess file={commitmentLetter} />}
                            <RUpload title='learner schedule' onPress={handleLearnerSchedule} />
                            {learnerSchedule && learnerSchedule.assets && <RUploadSuccess file={learnerSchedule} />}
                            <RUpload title='organization declaration of interest' onPress={handleOrgInterest} />
                            {declarationInterest && declarationInterest.assets && <RUploadSuccess file={declarationInterest} />}
                            <RUpload title='Proof of banking details' onPress={handleBankDetails} />
                            {bankingDetailsProof && bankingDetailsProof.assets && <RUploadSuccess file={bankingDetailsProof} />}
                        </Expandable>

                        <RButton onPressButton={() => { }} title='Submit application' styleBtn={styles.btn} />
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
    btn: {
        backgroundColor: colors.primary[900],
        marginTop: 10
    }
})