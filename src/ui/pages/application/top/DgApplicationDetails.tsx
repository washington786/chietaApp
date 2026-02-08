import { FlatList, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import colors from '@/config/colors'
import { Text, IconButton, Tooltip } from 'react-native-paper'
import { Expandable, RUploadSuccess, DgEntryList, RUploadSuccessFile } from '@/components/modules/application'
import { RButton, RCol, RInput, RRow, RSelected, RUpload } from '@/components/common'
import { SelectList } from 'react-native-dropdown-select-list'
import { dg_styles as styles } from '@/styles/DgStyles';
import { RouteProp, useRoute } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store'
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet'
import ProjectDetailsItem from '@/components/modules/application/grants/ProjectDetailsItem'
import useDg from '@/hooks/main/useDg'
import { EvilIcons } from '@expo/vector-icons';

const DgApplicationDetails = () => {
    const { appId: projectId } = useRoute<RouteProp<navigationTypes, "applicationDetails">>().params;
    const appId = parseInt(projectId as string || '0');
    const projectIdStr = projectId as string;

    const user = useSelector((state: RootState) => state.auth.user);
    const userId = typeof user?.id === 'string' ? parseInt(user.id) : (user?.id || 0);

    const { selectedProject } = useSelector((state: RootState) => state.discretionaryGrant);

    const { open, close } = useGlobalBottomSheet();

    // Initialize the custom hook with application params
    const {
        // State
        currentStep,
        expandDocs,
        expandProv,
        expandProg,
        expandLoc,
        selectedProvince,
        selectedDistrict,
        selectedMunicipality,
        programmeType,
        learningProgramme,
        subCategory,
        intervention,
        noContinuing,
        noNew,
        noFemale,
        noHDI,
        noYouth,
        noDisabled,
        noRural,
        costPerLearner,
        entries,
        editingEntryId,
        applicationForm,
        taxComplience,
        companyReg,
        beeCert,
        accredetation,
        commitmentLetter,
        learnerSchedule,
        declarationInterest,
        bankingDetailsProof,
        hasSubmitted,

        setDocs,
        setProv,
        setProg,
        setLoc,
        setProgrammeType,
        setLearningProgramme,
        setSubCategory,
        setIntervention,

        setNoContinuing,
        setNoNew,
        setNoFemale,
        setNoHDI,
        setNoYouth,
        setNoDisabled,
        setNoRural,
        setCostPerLearner,

        // Queries
        projectTypes,
        focusAreas,
        adminCriteria,
        evalMethods,
        bankProofQuery,
        beeQuery,
        scheduleQuery,
        declarationQuery,
        signedAppQuery,
        taxQuery,
        accredQuery,
        companyQuery,
        commitQuery,

        // Mutations
        isSavingApplication,

        // Computed values
        projectClosureStatus,
        provinceOptions,
        districtOptions,
        municipalityOptions,
        missingDocuments,
        allDocumentsUploaded,

        // Handlers
        handleProvChange,
        handleDistrictChange,
        handleMunicipalityChange,
        handleTaxUpload,
        handleCompanyReg,
        handleBeeCert,
        handleProofAccredetation,
        handleLetterCommitment,
        handleLearnerSchedule,
        handleOrgInterest,
        handleBankDetails,
        handleApplicationFormUpload,
        handleEditEntry,
        handleDeleteEntry,
        handleNext,
        handlePrev,

        handleSubmitApplication,
        handleSaveApplication,

        // Helpers
        getDocument,
        getSelectedLabel,
        generate,
    } = useDg({ projectId: projectIdStr, appId, userId });

    //validation
    let total = parseInt(noContinuing) + parseInt(noNew);
    // Auto-populate programme type and learning programme from selectedProject
    useEffect(() => {
        if (selectedProject?.projType && projectTypes?.length > 0) {
            // Find the project type ID that matches the projType description
            const matchingType = projectTypes.find((pt: any) => pt.value === selectedProject.projType);
            if (matchingType) {
                setProgrammeType(matchingType.key);
            }
        }
        if (selectedProject?.focusArea && focusAreas?.length > 0) {
            // Find the focus area ID that matches the focusArea description
            const matchingArea = focusAreas.find((fa: any) => fa.value === selectedProject.focusArea);
            if (matchingArea) {
                setLearningProgramme(matchingArea.key);
            }
        }
    }, [selectedProject?.projType, selectedProject?.focusArea, projectTypes, focusAreas, setProgrammeType, setLearningProgramme]);

    const programmeLabel = getSelectedLabel(programmeType, projectTypes)?.value ?? '';
    const focusAreaLabel = getSelectedLabel(learningProgramme, focusAreas)?.value ?? '';


    const shouldShowReadOnly = hasSubmitted || projectClosureStatus.isClosed;

    // console.log("Project:", selectedProject);
    // console.log("Project Closure Status:", projectClosureStatus);
    // console.log("Project submitted:", hasSubmitted);

    if (shouldShowReadOnly) {
        return <ProjectDetailsItem projectId={appId} />
    }

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
                                        {/* <SelectList
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

                                        /> */}
                                        {/* <SelectList
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

                                        /> */}
                                        <RSelected label='Programme Type' value={programmeLabel} placeholder='No option selected' helperText='Selection locked' />

                                        <RSelected label='Learning Programme' value={focusAreaLabel} placeholder='No option selected' helperText='Selection locked' />
                                        <SelectList
                                            setSelected={(val: any) => {
                                                setSubCategory(val);
                                                const selectedCrit = adminCriteria.find(ac => ac.key === val);
                                                if (selectedCrit?.focusCritEvalId) {
                                                    setIntervention("");
                                                }
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

                                    <Expandable title='Learner Details' isExpanded={expandProv} onPress={() => setProv(!expandProv)}>
                                        <RInput placeholder='#Continuing' keyboardType='number-pad' value={noContinuing} onChangeText={(val) => { setNoContinuing(val); }} />
                                        <RInput placeholder='#New' keyboardType='number-pad' value={noNew} onChangeText={(val) => { setNoNew(val); }} />
                                        <RInput placeholder='#Female' keyboardType='number-pad' value={noFemale} onChangeText={(val) => { setNoFemale(val); }} />
                                        {
                                            parseInt(noFemale) > total && <Text style={{ color: colors.red[600], marginBottom: 1 }}>Number of female learners cannot exceed total number of learners</Text>
                                        }
                                        <RInput placeholder='#HDI' keyboardType='number-pad' value={noHDI} onChangeText={(val) => { setNoHDI(val); }} />
                                        {
                                            parseInt(noHDI) > total && <Text style={{ color: colors.red[600], marginBottom: 1 }}>Number of HDI learners cannot exceed total number of learners</Text>
                                        }
                                        <RInput placeholder='#Youth' keyboardType='number-pad' value={noYouth} onChangeText={(val) => { setNoYouth(val); }} />
                                        {
                                            parseInt(noYouth) > total && <Text style={{ color: colors.red[600], marginBottom: 1 }}>Number of youth learners cannot exceed total number of learners</Text>
                                        }
                                        <RInput placeholder='#Disabled' keyboardType='number-pad' value={noDisabled} onChangeText={(val) => { setNoDisabled(val); }} />
                                        {
                                            parseInt(noDisabled) > total && <Text style={{ color: colors.red[600], marginBottom: 1, fontSize: 8 }}>Number of disabled learners cannot exceed total number of learners</Text>
                                        }
                                        <RInput placeholder='#Rural' keyboardType='number-pad' value={noRural} onChangeText={(val) => { setNoRural(val); }} />
                                        {
                                            parseInt(noRural) > total && <Text style={{ color: colors.red[600], marginBottom: 1, fontSize: 8 }}>Number of rural learners cannot exceed total number of learners</Text>
                                        }
                                        <RInput placeholder='#Cost Per learner' keyboardType='decimal-pad' value={costPerLearner} onChangeText={(val) => { setCostPerLearner(val); }} />
                                    </Expandable>

                                    <Expandable title='Project Location' isExpanded={expandLoc} onPress={() => setLoc(!expandLoc)}>
                                        <SelectList
                                            setSelected={(val: any) => handleProvChange(val)}
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

                                    <RButton
                                        onPressButton={handleSaveApplication}
                                        title={isSavingApplication ? 'Saving...' : editingEntryId ? 'Update Entry' : 'Save Application Entry'}
                                        styleBtn={styles.saveBtn}
                                        disabled={isSavingApplication}
                                    />

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
                                    {allDocumentsUploaded ? (
                                        <View style={{ ...styles.warningBox, backgroundColor: colors.emerald[50], borderColor: colors.emerald[200] }}>
                                            <Text style={{ ...styles.warningText, color: colors.emerald[700] }}>
                                                ✓ All required documents uploaded
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={styles.warningBox}>
                                            <Text style={styles.warningText}>
                                                Required: {missingDocuments.map(d => d.name).join(', ')}
                                            </Text>
                                        </View>
                                    )}

                                    <Expandable title='Supporting documents' isExpanded={expandDocs} onPress={() => setDocs(!expandDocs)}>
                                        <View style={{ gap: 12 }}>
                                            <View>
                                                <RUpload title='Tax Clearance' onPress={handleTaxUpload} />
                                                {taxComplience && taxComplience.assets && <RUploadSuccess file={taxComplience} />}
                                                {!taxComplience && getDocument(taxQuery)?.filename && <RUploadSuccessFile file={getDocument(taxQuery)?.filename} />}
                                            </View>
                                            <View>
                                                <RUpload title='Company Registration' onPress={handleCompanyReg} />
                                                {companyReg && companyReg.assets && <RUploadSuccess file={companyReg} />}
                                                {!companyReg && getDocument(companyQuery)?.filename && <RUploadSuccessFile file={getDocument(companyQuery)?.filename} />}
                                            </View>
                                            <View>
                                                <RUpload title='BBBEE Certificate/Affidavit' onPress={handleBeeCert} />
                                                {beeCert && beeCert.assets && <RUploadSuccess file={beeCert} />}
                                                {!beeCert && getDocument(beeQuery)?.filename && <RUploadSuccessFile file={getDocument(beeQuery)?.filename} />}
                                            </View>
                                            <View>
                                                <RUpload title='Proof of Accreditation' onPress={handleProofAccredetation} />
                                                {accredetation && accredetation.assets && <RUploadSuccess file={accredetation} />}
                                                {!accredetation && getDocument(accredQuery)?.filename && <RUploadSuccessFile file={getDocument(accredQuery)?.filename} />}
                                            </View>
                                            <View>
                                                <RUpload title='Letter  of Commitment' onPress={handleLetterCommitment} />
                                                {commitmentLetter && commitmentLetter.assets && <RUploadSuccess file={commitmentLetter} />}
                                                {!commitmentLetter && getDocument(commitQuery)?.filename && <RUploadSuccessFile file={getDocument(commitQuery)?.filename} />}
                                            </View>
                                            <View>
                                                <RUpload title='Learner Schedule' onPress={handleLearnerSchedule} />
                                                {learnerSchedule && learnerSchedule.assets && <RUploadSuccess file={learnerSchedule} />}
                                                {!learnerSchedule && getDocument(scheduleQuery)?.filename && <RUploadSuccessFile file={getDocument(scheduleQuery)?.filename} />}
                                            </View>
                                            <View>
                                                <RUpload title='Organization Declaration' onPress={handleOrgInterest} />
                                                {declarationInterest && declarationInterest.assets && <RUploadSuccess file={declarationInterest} />}
                                                {!declarationInterest && getDocument(declarationQuery)?.filename && <RUploadSuccessFile file={getDocument(declarationQuery)?.filename} />}
                                            </View>
                                            <View>
                                                <RUpload title='Banking Details Proof' onPress={handleBankDetails} />
                                                {bankingDetailsProof && bankingDetailsProof.assets && <RUploadSuccess file={bankingDetailsProof} />}
                                                {!bankingDetailsProof && getDocument(bankProofQuery)?.filename && <RUploadSuccessFile file={getDocument(bankProofQuery)?.filename} />}
                                            </View>
                                        </View>
                                    </Expandable>
                                </>
                            )}

                            {/* Step 3: Application Form */}
                            {currentStep === 3 && (
                                <>
                                    {/* <MessageWrapper text="Ensure all uploaded documents are accurate and complete before submission." /> */}
                                    <View style={styles.formSection}>
                                        <RButton
                                            onPressButton={generate}
                                            title='Download Application Form'
                                            styleBtn={styles.btnSecondary}
                                        />
                                        <RUpload title='Upload Signed Application' onPress={handleApplicationFormUpload} />
                                        {applicationForm && applicationForm.assets && <RUploadSuccess file={applicationForm} />}
                                        {!applicationForm && getDocument(signedAppQuery)?.filename && <RUploadSuccessFile file={getDocument(signedAppQuery)?.filename} />}
                                    </View>
                                </>
                            )}

                            <View style={{ height: 80 }} />
                        </>
                    )
                }}
            />
            <View style={styles.buttonContainer}>
                <IconButton
                    icon="chevron-left"
                    iconColor={colors.primary[900]}
                    size={32}
                    onPress={handlePrev}
                    disabled={currentStep === 1}
                />
                <Text variant='labelLarge' style={styles.stepText}>Step {currentStep} of 3</Text>
                {currentStep === 3 ? (
                    <Tooltip title="Submit Application">
                        <IconButton
                            icon={"check"}
                            iconColor={colors.green[600]}
                            size={32}
                            onPress={() => open(<SubmitSheet close={close} submit={() => { handleSubmitApplication(); close(); }} />, { snapPoints: ["40%"] })}
                        />
                    </Tooltip>
                ) : (
                    <IconButton
                        icon={"chevron-right"}
                        iconColor={colors.primary[900]}
                        size={32}
                        onPress={handleNext}
                    />
                )}
            </View>
        </View>
    )
}

function SubmitSheet({ close, submit }: { close: () => void, submit: () => void }) {
    return (
        <View style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
            <RRow
                style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Text variant="titleMedium">Application Submission</Text>
                </View>

                <TouchableOpacity onPress={close} activeOpacity={0.8} style={{ backgroundColor: colors.red[100], borderRadius: 100, padding: 8 }}>
                    <EvilIcons name="close" size={32} color="gray" />
                </TouchableOpacity>
            </RRow>

            <RCol style={{ alignItems: "center", gap: 16 }}>
                <Text
                    variant="bodyMedium"
                    style={{ textAlign: "center", color: "#666", lineHeight: 24 }}
                >
                    By submitting this application, you confirm that all information provided is accurate and complete to the best of your knowledge. You understand that any false information may lead to disqualification from the application process.
                </Text>
                <TouchableOpacity style={{ padding: 10, backgroundColor: colors.green[600], borderRadius: 5, width: "100%", alignItems: "center", paddingVertical: 12 }} activeOpacity={0.8} onPress={submit}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>Submit Application</Text>
                </TouchableOpacity>
            </RCol>
        </View>
    );
}

export default DgApplicationDetails;

