import { FlatList, View } from 'react-native'
import React, { useState, useMemo } from 'react'
import colors from '@/config/colors'
import { Text, IconButton } from 'react-native-paper'
import { Expandable, RUploadSuccess, DgEntryList } from '@/components/modules/application'
import { RButton, RInput, RUpload } from '@/components/common'
import { main_manicipalities, mainDistricts, provinces } from '@/core/helpers/data'
import { Province } from '@/core/types/provTypes'
import { SelectList } from 'react-native-dropdown-select-list'
import { DocumentPickerResult } from 'expo-document-picker'
import useDocumentPicker from '@/hooks/main/UseDocumentPicker'
import { showToast } from '@/core'
import { useGetProjectTypeQuery, useGetFocusAreaQuery, useGetAdminCritQuery, useGetEvalMethodsQuery, useCreateEditApplicationMutation, useDeleteApplicationMutation, useCreateEditApplicationDetailsMutation, useGetProjectDetailsQuery } from '@/store/api/api';
import { dg_styles as styles } from '@/styles/DgStyles';
import { RouteProp, useRoute } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store'

const DgApplicationDetails = () => {
    const { appId: projectId } = useRoute<RouteProp<navigationTypes, "applicationDetails">>().params;

    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?.id || 0;

    // Fetch existing project details
    const { data: projectDetails } = useGetProjectDetailsQuery(projectId, { skip: !projectId });

    const [deleteApplication] = useDeleteApplicationMutation();

    const [createEditApplicationDetails, { isLoading: isSavingApplication }] = useCreateEditApplicationDetailsMutation();

    const [currentStep, setCurrentStep] = useState(1);
    const [expandDocs, setDocs] = useState(false);
    const [expandProv, setProv] = useState(false);
    const [expandProg, setProg] = useState(false);
    const [expandLoc, setLoc] = useState(false);

    const [selectedProvince, setProvince] = useState<Province>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedMunicipality, setSelectedMunipality] = useState<string>("");

    const [district, setDistrict] = useState<string[]>([]);
    const [manucipality, setManucipality] = useState<string[]>([]);

    const [programmeType, setProgrammeType] = useState<string>("");
    const [learningProgramme, setLearningProgramme] = useState<string>("");
    const [subCategory, setSubCategory] = useState<string>("");
    const [intervention, setIntervention] = useState<string>("");

    // Form inputs for learner details
    const [noContinuing, setNoContinuing] = useState<string>("");
    const [noNew, setNoNew] = useState<string>("");
    const [noFemale, setNoFemale] = useState<string>("");
    const [noHDI, setNoHDI] = useState<string>("");
    const [noYouth, setNoYouth] = useState<string>("");
    const [noDisabled, setNoDisabled] = useState<string>("");
    const [noRural, setNoRural] = useState<string>("");
    const [costPerLearner, setCostPerLearner] = useState<string>("");

    // Store entries
    const [entries, setEntries] = useState<any[]>([]);

    const [applicationForm, setApplicationForm] = useState<DocumentPickerResult>();

    // Fetch project types
    const { data: projectTypesData } = useGetProjectTypeQuery(undefined);
    const projectTypes = useMemo(() =>
        Array.isArray(projectTypesData)
            ? projectTypesData.map((pt: any) => ({ key: pt.id, value: pt.projTypDesc }))
            : [],
        [projectTypesData]
    );

    // Fetch focus areas (learning programmes) when project type is selected
    const { data: focusAreaData } = useGetFocusAreaQuery(programmeType, { skip: !programmeType });
    const focusAreas = useMemo(() =>
        Array.isArray(focusAreaData)
            ? focusAreaData.map((fa: any) => ({ key: fa.id, value: fa.focusAreaDesc || fa.name }))
            : [],
        [focusAreaData]
    );

    // Fetch admin criteria (sub categories) when both project type and focus area are selected
    const { data: adminCritData } = useGetAdminCritQuery(
        { projType: programmeType, focusId: learningProgramme },
        { skip: !programmeType || !learningProgramme }
    );
    const adminCriteria = useMemo(() =>
        Array.isArray(adminCritData)
            ? adminCritData.map((ac: any) => ({ key: ac.id, value: ac.adminDesc || ac.name }))
            : [],
        [adminCritData]
    );

    // Fetch evaluation methods (interventions) when all parameters are selected
    const { data: evalMethodsData } = useGetEvalMethodsQuery(
        { projType: programmeType, focusId: learningProgramme, critId: subCategory },
        { skip: !programmeType || !learningProgramme || !subCategory }
    );
    const evalMethods = useMemo(() =>
        Array.isArray(evalMethodsData)
            ? evalMethodsData.map((em: any) => ({ key: em.id, value: em.evalMthdDesc || em.name }))
            : [],
        [evalMethodsData]
    );

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

    function getSelectedLabel(selectedId: string, dataArray: any[]) {
        if (!selectedId) return undefined;
        const selected = dataArray.find(item => item.key == selectedId);
        return selected ? { key: selected.key, value: selected.value } : undefined;
    }

    const requiredDocuments = [
        { name: 'Tax Compliance', file: taxComplience },
        { name: 'Company Registration', file: companyReg },
        { name: 'BBBEE Certificate/Affidavit', file: beeCert },
        { name: 'Organization Declaration of Interest', file: declarationInterest },
        { name: 'Proof of Banking Details', file: bankingDetailsProof }
    ];

    const missingDocuments = requiredDocuments.filter(doc => !doc.file?.assets);

    const canProceedFromStep1 = () => {
        return entries.length > 0;
    };

    const handleSaveApplication = async () => {
        if (!programmeType || !learningProgramme || !intervention) {
            showToast({ message: "Please select Programme Type, Learning Programme, and Intervention", title: "Incomplete", type: "error", position: "top" });
            return;
        }
        if (!selectedProvince || !selectedDistrict || !selectedMunicipality) {
            showToast({ message: "Please select Province, District, and Municipality", title: "Incomplete", type: "error", position: "top" });
            return;
        }
        if (!noContinuing || !noNew || !costPerLearner) {
            showToast({ message: "Please fill all learner details", title: "Incomplete", type: "error", position: "top" });
            return;
        }

        try {
            const programTypeLabel = projectTypes.find(p => p.key === programmeType)?.value || programmeType;
            const learningProgrammeLabel = focusAreas.find(f => f.key === learningProgramme)?.value || learningProgramme;
            const subCategoryLabel = adminCriteria.find(a => a.key === subCategory)?.value || subCategory;
            const interventionLabel = evalMethods.find(e => e.key === intervention)?.value || intervention;

            // Use existing projectId - no need to create a new application
            if (!projectId) {
                throw new Error("Invalid project ID");
            }

            // Create the application details/entry for the existing project
            const detailsPayload = {
                id: 0,
                projectId: parseInt(projectId),
                projectTypeId: parseInt(programmeType),
                focusAreaId: parseInt(learningProgramme),
                subCategoryId: parseInt(subCategory),
                interventionId: parseInt(intervention),
                otherIntervention: "",
                focusCritEvalId: parseInt(subCategory),
                number_Continuing: parseInt(noContinuing),
                number_New: parseInt(noNew),
                costPerLearner: parseFloat(costPerLearner),
                hdi: parseInt(noHDI) || 0,
                female: parseInt(noFemale) || 0,
                youth: parseInt(noYouth) || 0,
                number_Disabled: parseInt(noDisabled) || 0,
                rural: parseInt(noRural) || 0,
                province: selectedProvince,
                municipality: selectedMunicipality,
                district: selectedDistrict,
                focusarea: learningProgrammeLabel,
                subcat: subCategoryLabel,
                inter: interventionLabel,
                userId: userId,
            };

            console.log("Creating application details with payload:", detailsPayload);
            const detailsResult = await createEditApplicationDetails(detailsPayload).unwrap();

            console.log("Application details response:", detailsResult);

            const detailsId = detailsResult?.result?.id || detailsResult?.id;

            if (!detailsId) {
                throw new Error("Failed to create application entry: No ID returned from server");
            }

            const newEntry = {
                id: detailsId.toString(),
                programType: programTypeLabel,
                learningProgramme: learningProgrammeLabel,
                subCategory: subCategoryLabel,
                intervention: interventionLabel,
                noContinuing: parseInt(noContinuing),
                noNew: parseInt(noNew),
                noFemale: parseInt(noFemale) || 0,
                noHistoricallyDisadvantaged: parseInt(noHDI) || 0,
                noYouth: parseInt(noYouth) || 0,
                noDisabled: parseInt(noDisabled) || 0,
                noRural: parseInt(noRural) || 0,
                costPerLearner: parseFloat(costPerLearner),
                province: selectedProvince,
                district: selectedDistrict,
                municipality: selectedMunicipality,
            };

            setEntries([...entries, newEntry]);

            // Reset form
            setProgrammeType("");
            setLearningProgramme("");
            setSubCategory("");
            setIntervention("");
            setProvince("");
            setSelectedDistrict("");
            setSelectedMunipality("");
            setNoContinuing("");
            setNoNew("");
            setNoFemale("");
            setNoHDI("");
            setNoYouth("");
            setNoDisabled("");
            setNoRural("");
            setCostPerLearner("");
            setDistrict([]);
            setManucipality([]);

            setProg(true); // Collapse programme section
            setLoc(true); // Collapse location section
            setProv(true); // Collapse province section

            showToast({ message: "Application entry saved successfully", title: "Success", type: "success", position: "top" });
        } catch (error: any) {
            console.log(error);

            showToast({
                message: error?.data?.error?.message || error?.message || "Failed to save application entry",
                title: "Error",
                type: "error",
                position: "top"
            });
        }
    };

    const handleEditEntry = (entry: any) => {
        // TODO: Implement edit functionality
        showToast({ message: "Edit functionality coming soon", title: "Info", type: "success", position: "top" });
    };

    const handleDeleteEntry = async (id: string) => {
        try {
            await deleteApplication({ id: parseInt(id), userId }).unwrap();
            setEntries(entries.filter(e => e.id !== id));
            showToast({ message: "Entry deleted successfully", title: "Success", type: "success", position: "top" });
        } catch (error: any) {
            console.log(error);
            showToast({
                message: error?.data?.error?.message || "Failed to delete entry",
                title: "Error",
                type: "error",
                position: "top"
            });
        }
    };

    const canProceedFromStep2 = () => {
        return missingDocuments.length === 0;
    };

    const handleNext = () => {
        if (currentStep === 1 && !canProceedFromStep1()) {
            showToast({ message: "Please fill all required fields in Step 1", title: "Incomplete", type: "error", position: "top" });
            return;
        }
        if (currentStep === 2 && !canProceedFromStep2()) {
            showToast({
                message: `Missing required documents: ${missingDocuments.map(d => d.name).join(', ')}`,
                title: "Upload Required Files",
                type: "error",
                position: "top"
            });
            return;
        }
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    async function handleApplicationFormUpload() {
        try {
            const result = await pickDocument();
            if (result) {
                setApplicationForm(result);
            }
        } catch (error) {
            showToast({ message: "failed to upload document", title: "Upload", type: "error", position: "top" })
        }
    }

    const handleSubmitApplication = async () => {
        if (!applicationForm?.assets) {
            showToast({ message: "Please upload the signed application form", title: "Submission", type: "error", position: "top" });
            return;
        }
        // TODO: Submit application with all data
        showToast({ message: "Application submitted successfully", title: "Success", type: "success", position: "top" });
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList data={[]}
                style={styles.con}
                renderItem={null}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ListFooterComponentStyle={{ paddingBottom: 30 }}
                ListFooterComponent={() => {
                    return (
                        <>
                            {/* Stepper Header */}
                            <View style={styles.stepperContainer}>
                                <View style={[styles.stepCircle, currentStep >= 1 && styles.stepCircleActive]}>
                                    <Text style={[styles.stepNumber, currentStep >= 1 && styles.stepNumberActive]}>1</Text>
                                </View>
                                <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />
                                <View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}>
                                    <Text style={[styles.stepNumber, currentStep >= 2 && styles.stepNumberActive]}>2</Text>
                                </View>
                                <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />
                                <View style={[styles.stepCircle, currentStep >= 3 && styles.stepCircleActive]}>
                                    <Text style={[styles.stepNumber, currentStep >= 3 && styles.stepNumberActive]}>3</Text>
                                </View>
                            </View>

                            {/* Step Labels */}
                            <View style={styles.stepLabelsContainer}>
                                <Text style={[styles.stepLabel, currentStep === 1 && styles.stepLabelActive]}>Program & Application</Text>
                                <Text style={[styles.stepLabel, currentStep === 2 && styles.stepLabelActive]}>Upload Files</Text>
                                <Text style={[styles.stepLabel, currentStep === 3 && styles.stepLabelActive]}>Application Form</Text>
                            </View>

                            {/* Step 1: Program and Capture Application */}
                            {currentStep === 1 && (
                                <>
                                    <Text variant='titleMedium' style={styles.title}>Program & Application details</Text>
                                    <Expandable title='Programme Details' isExpanded={expandProg} onPress={() => setProg(!expandProg)}>
                                        <SelectList
                                            setSelected={(val: any) => {
                                                setProgrammeType(val);
                                                setLearningProgramme("");
                                                setSubCategory("");
                                                setIntervention("");
                                            }}
                                            data={projectTypes}
                                            save="key"
                                            placeholder='Programme Type'
                                            defaultOption={getSelectedLabel(programmeType, projectTypes)}
                                            boxStyles={styles.boxStyle}
                                            dropdownStyles={styles.dropdown}
                                        />
                                        <SelectList
                                            setSelected={(val: any) => {
                                                setLearningProgramme(val);
                                                setSubCategory("");
                                                setIntervention("");
                                            }}
                                            data={focusAreas}
                                            save="key"
                                            placeholder='Learning Programme'
                                            defaultOption={getSelectedLabel(learningProgramme, focusAreas)}
                                            boxStyles={styles.boxStyle}
                                            dropdownStyles={styles.dropdown}
                                        />
                                        <SelectList
                                            setSelected={(val: any) => {
                                                setSubCategory(val);
                                                setIntervention("");
                                            }}
                                            data={adminCriteria}
                                            save="key"
                                            placeholder='SubCategory'
                                            defaultOption={getSelectedLabel(subCategory, adminCriteria)}
                                            boxStyles={styles.boxStyle}
                                            dropdownStyles={styles.dropdown}
                                        />
                                        <SelectList
                                            setSelected={(val: any) => setIntervention(val)}
                                            data={evalMethods}
                                            save="key"
                                            placeholder='Intervention'
                                            defaultOption={getSelectedLabel(intervention, evalMethods)}
                                            boxStyles={styles.boxStyle}
                                            dropdownStyles={styles.dropdown}
                                        />
                                    </Expandable>

                                    {/* <Text variant='titleMedium' style={styles.title}>Capture Application</Text> */}
                                    <Expandable title='Learner Details' isExpanded={expandProv} onPress={() => setProv(!expandProv)}>

                                        <RInput
                                            placeholder='#Continuing'
                                            keyboardType='number-pad'
                                            value={noContinuing}
                                            onChangeText={setNoContinuing}
                                        />
                                        <RInput
                                            placeholder='#New'
                                            keyboardType='number-pad'
                                            value={noNew}
                                            onChangeText={setNoNew}
                                        />
                                        <RInput
                                            placeholder='#Female'
                                            keyboardType='number-pad'
                                            value={noFemale}
                                            onChangeText={setNoFemale}
                                        />
                                        <RInput
                                            placeholder='#HDI'
                                            keyboardType='number-pad'
                                            value={noHDI}
                                            onChangeText={setNoHDI}
                                        />
                                        <RInput
                                            placeholder='#Youth'
                                            keyboardType='number-pad'
                                            value={noYouth}
                                            onChangeText={setNoYouth}
                                        />
                                        <RInput
                                            placeholder='#Disabled'
                                            keyboardType='number-pad'
                                            value={noDisabled}
                                            onChangeText={setNoDisabled}
                                        />
                                        <RInput
                                            placeholder='#Rural'
                                            keyboardType='number-pad'
                                            value={noRural}
                                            onChangeText={setNoRural}
                                        />
                                        <RInput
                                            placeholder='#Cost Per learner'
                                            keyboardType='numeric'
                                            value={costPerLearner}
                                            onChangeText={setCostPerLearner}
                                        />

                                    </Expandable>

                                    <Expandable title='Project Location' isExpanded={expandLoc} onPress={() => setLoc(!expandLoc)}>
                                        <SelectList
                                            setSelected={(val: any) => handleProvChange(val as Province)}
                                            data={provinceOptions}
                                            save="value"
                                            placeholder='Select Province'
                                            search={true}
                                            boxStyles={styles.boxStyle}
                                            dropdownStyles={styles.dropdown}
                                            defaultOption={selectedProvince ? { key: selectedProvince, value: selectedProvince } : undefined}
                                        />

                                        <SelectList
                                            setSelected={(val: any) => handleDistrictChange(val)}
                                            data={districtOptions}
                                            save="value"
                                            placeholder='Select District'
                                            search={true}
                                            boxStyles={styles.boxStyle}
                                            dropdownStyles={styles.dropdown}
                                            defaultOption={selectedDistrict ? { key: selectedDistrict, value: selectedDistrict } : undefined}
                                        />

                                        <SelectList
                                            setSelected={(val: any) => handleMunicipalityChange(val)}
                                            data={municipalityOptions}
                                            save="value"
                                            placeholder='Select Municipality'
                                            search={true}
                                            boxStyles={styles.boxStyle}
                                            dropdownStyles={styles.dropdown}
                                            defaultOption={selectedMunicipality ? { key: selectedMunicipality, value: selectedMunicipality } : undefined}
                                        />
                                    </Expandable>

                                    {/* Save Button */}
                                    <RButton
                                        onPressButton={handleSaveApplication}
                                        title={isSavingApplication ? 'Saving...' : 'Save Application Entry'}
                                        styleBtn={styles.saveBtn}
                                        disabled={isSavingApplication}
                                    />

                                    {/* Display Saved Entries */}
                                    {entries.length > 0 && (
                                        <>
                                            <Text variant='titleMedium' style={[styles.title, { marginTop: 20 }]}>Saved Entries</Text>
                                            <View style={{ height: 200, marginBottom: 20 }}>
                                                <DgEntryList
                                                    data={entries}
                                                    onEdit={handleEditEntry}
                                                    onDelete={handleDeleteEntry}
                                                />
                                            </View>
                                        </>
                                    )}
                                </>
                            )}

                            {/* Step 2: Upload Required Files */}
                            {currentStep === 2 && (
                                <>
                                    <Text variant='titleMedium' style={styles.title}>Upload Required Files</Text>
                                    {missingDocuments.length > 0 && (
                                        <View style={styles.warningBox}>
                                            <Text style={styles.warningText}>
                                                Required: {missingDocuments.map(d => d.name).join(', ')}
                                            </Text>
                                        </View>
                                    )}

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
                                </>
                            )}

                            {/* Step 3: Application Form */}
                            {currentStep === 3 && (
                                <>
                                    <Text variant='titleMedium' style={styles.title}>Application Form</Text>
                                    <View style={styles.formSection}>
                                        <RButton
                                            onPressButton={() => {
                                                // TODO: Implement template download
                                                showToast({ message: "Downloading template...", title: "Download", type: "success", position: "top" });
                                            }}
                                            title='Download Template'
                                            styleBtn={styles.btnSecondary}
                                        />
                                        <RUpload title='Upload Signed Application Form' onPress={handleApplicationFormUpload} />
                                        {applicationForm && applicationForm.assets && <RUploadSuccess file={applicationForm} />}
                                    </View>
                                </>
                            )}

                            {/* Spacer for fixed buttons */}
                            <View style={{ height: 80 }} />
                        </>
                    )
                }}
            />
            {/* Navigation Icon Buttons - Fixed at Bottom */}
            <View style={styles.buttonContainer}>
                <IconButton
                    icon="chevron-left"
                    iconColor={colors.primary[900]}
                    size={32}
                    onPress={handlePrev}
                    disabled={currentStep === 1}
                />
                <Text variant='labelLarge' style={styles.stepText}>Step {currentStep} of 3</Text>
                <IconButton
                    icon={currentStep === 3 ? "check" : "chevron-right"}
                    iconColor={colors.primary[900]}
                    size={32}
                    onPress={currentStep === 3 ? handleSubmitApplication : handleNext}
                />
            </View>
        </View>
    )

}

export default DgApplicationDetails