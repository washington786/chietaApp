
import { useState, useMemo, useEffect } from 'react';
import { DocumentPickerResult } from 'expo-document-picker';
import { Province } from '@/core/types/provTypes';
import { main_manicipalities, mainDistricts, provinces } from '@/core/helpers/data';
import { showToast } from '@/core';
import { checkProjectClosed } from '@/core/utils/CheckClosed';
import useDocumentPicker from '@/hooks/main/UseDocumentPicker';
import useGenerate from '@/hooks/main/useGenerate';
import {
    useGetProjectTypeQuery,
    useGetFocusAreaQuery,
    useGetAdminCritQuery,
    useGetEvalMethodsQuery,
    useDeleteApplicationMutation,
    useCreateEditApplicationDetailsMutation,
    useUploadProjectDocumentMutation,
    useGetDGProjectDetailsAppQuery,
    useGetDocumentsByEntityQuery,
    useValidateProjSubmissionMutation,
    useSubmitApplicationMutation,
} from '@/store/api/api';

interface UseDgParams {
    projectId: string;
    appId: number;
    userId: number;
}

interface ApplicationEntry {
    id: string;
    programmeTypeId: number;
    learningProgrammeId: number;
    subCategoryId: number;
    interventionId: number;
    focusCritEvalId: number;
    noContinuing: number;
    noNew: number;
    noFemale: number;
    noHistoricallyDisadvantaged: number;
    noYouth: number;
    noDisabled: number;
    noRural: number;
    costPerLearner: number;
    province: Province;
    district: string;
    municipality: string;
}

const useDg = ({ projectId, appId, userId }: UseDgParams) => {
    // ========== Form State ==========
    const [currentStep, setCurrentStep] = useState(1);
    const [expandDocs, setDocs] = useState(false);
    const [expandProv, setProv] = useState(false);
    const [expandProg, setProg] = useState(false);
    const [expandLoc, setLoc] = useState(false);

    // Location state
    const [selectedProvince, setProvince] = useState<Province>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedMunicipality, setSelectedMunipality] = useState<string>("");
    const [district, setDistrict] = useState<string[]>([]);
    const [manucipality, setManucipality] = useState<string[]>([]);

    // Programme selection state
    const [programmeType, setProgrammeType] = useState<string>("");
    const [learningProgramme, setLearningProgramme] = useState<string>("");
    const [subCategory, setSubCategory] = useState<string>("");
    const [focusCritEvalId, setFocusCritEvalId] = useState<string>("");
    const [intervention, setIntervention] = useState<string>("");

    // Learner details state
    const [noContinuing, setNoContinuing] = useState<string>("");
    const [noNew, setNoNew] = useState<string>("");
    const [noFemale, setNoFemale] = useState<string>("");
    const [noHDI, setNoHDI] = useState<string>("");
    const [noYouth, setNoYouth] = useState<string>("");
    const [noDisabled, setNoDisabled] = useState<string>("");
    const [noRural, setNoRural] = useState<string>("");
    const [costPerLearner, setCostPerLearner] = useState<string>("");

    // Entry management state
    const [entries, setEntries] = useState<any[]>([]);
    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

    // Document state
    const [applicationForm, setApplicationForm] = useState<DocumentPickerResult>();
    const [taxComplience, setTaxComplience] = useState<DocumentPickerResult>();
    const [companyReg, setCompanyReg] = useState<DocumentPickerResult>();
    const [beeCert, setBeeCert] = useState<DocumentPickerResult>();
    const [accredetation, setAccredetation] = useState<DocumentPickerResult>();
    const [commitmentLetter, setCommitmentLetter] = useState<DocumentPickerResult>();
    const [learnerSchedule, setLearnerSchedule] = useState<DocumentPickerResult>();
    const [declarationInterest, setDeclarationInterest] = useState<DocumentPickerResult>();
    const [bankingDetailsProof, setBankDetails] = useState<DocumentPickerResult>();

    // ========== API Queries & Mutations ==========
    const { data: dgProjectDetailsApp } = useGetDGProjectDetailsAppQuery(projectId, { skip: !projectId });

    const { data: projectTypesData } = useGetProjectTypeQuery(undefined);
    const projectTypes = useMemo(() =>
        Array.isArray(projectTypesData)
            ? projectTypesData.map((pt: any) => ({ key: pt.id, value: pt.projTypDesc }))
            : [],
        [projectTypesData]
    );

    const { data: focusAreaData } = useGetFocusAreaQuery(programmeType, { skip: !programmeType });
    const focusAreas = useMemo(() =>
        Array.isArray(focusAreaData)
            ? focusAreaData.map((fa: any) => ({ key: fa.id, value: fa.focusAreaDesc || fa.name }))
            : [],
        [focusAreaData]
    );

    const { data: adminCritData } = useGetAdminCritQuery(
        { projType: programmeType, focusId: learningProgramme },
        { skip: !programmeType || !learningProgramme }
    );
    const adminCriteria = useMemo(() =>
        Array.isArray(adminCritData)
            ? adminCritData.map((ac: any) => ({
                key: ac.id,
                value: ac.adminDesc || ac.name,
                focusCritEvalId: ac.focusCritEvalId || ac.id,
            }))
            : [],
        [adminCritData]
    );

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

    // Document queries
    const bankProofQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Bank Proof' },
        { skip: !appId }
    );
    const beeQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'BEE Certificate' },
        { skip: !appId }
    );
    const scheduleQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Schedule' },
        { skip: !appId }
    );
    const declarationQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Declaration' },
        { skip: !appId }
    );
    const workplaceQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Workplace Approval' },
        { skip: !appId }
    );
    const signedAppQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Signed Application' },
        { skip: !appId }
    );
    const taxQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Tax Clearance' },
        { skip: !appId }
    );
    const accredQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Accreditation' },
        { skip: !appId }
    );
    const proposalQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Proposal' },
        { skip: !appId }
    );
    const companyQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Company Registration' },
        { skip: !appId }
    );
    const commitQuery = useGetDocumentsByEntityQuery(
        { entityId: appId, module: 'Projects', documentType: 'Commitment' },
        { skip: !appId }
    );

    // Mutations
    const [deleteApplication] = useDeleteApplicationMutation();
    const [createEditApplicationDetails, { isLoading: isSavingApplication }] = useCreateEditApplicationDetailsMutation();
    const [uploadProjectDocument] = useUploadProjectDocumentMutation();
    const [validateProjectSubmission] = useValidateProjSubmissionMutation();
    const [submitApplication] = useSubmitApplicationMutation();

    // ========== Project Closure Status ==========
    const projectClosureStatus = useMemo(() => {
        if (dgProjectDetailsApp?.result?.items?.[0]?.projectDetails) {
            const details = dgProjectDetailsApp.result.items[0].projectDetails;
            const projectStatus = details.status || 'Registered';
            const projectEndDate = dgProjectDetailsApp.result.items[0]?.projectEndDate || new Date().toISOString();

            const closureCheck = checkProjectClosed(projectStatus, projectEndDate);
            return closureCheck;
        }
        // Default to open and editable while loading, don't use stale Redux value
        return { isClosed: false, isEditable: true };
    }, [dgProjectDetailsApp]);

    // ========== Document Picker ==========
    const { pickDocument, error } = useDocumentPicker();

    useEffect(() => {
        if (error) {
            console.log(error);
            showToast({ message: error, title: "Upload", type: "error", position: "top" });
        }
    }, [error]);

    // ========== Helper Functions ==========
    const getDocument = (query: any) => query.data?.result?.items?.[0]?.documents;

    const getSelectedLabel = (selectedId: string, dataArray: any[]) => {
        if (!selectedId) return undefined;
        const selected = dataArray.find(item => item.key == selectedId);
        return selected ? { key: selected.key, value: selected.value } : undefined;
    };

    const handleProvChange = (val: Province) => {
        setProvince(val);
        setDistrict(mainDistricts[val] || []);
        setManucipality(main_manicipalities[val] || []);
    };

    const handleDistrictChange = (val: string) => {
        setSelectedDistrict(val);
    };

    const handleMunicipalityChange = (val: string) => {
        setSelectedMunipality(val);
    };

    // ========== Location Options ==========
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

    // ========== Document Logging ==========
    useEffect(() => {
        console.log('=== DOCUMENT QUERIES STATUS ===');
        console.log('appId:', appId);
        console.log('Tax Query - entityId:', appId, 'Loading:', taxQuery.isLoading, 'Has data:', !!taxQuery.data);
        if (taxQuery.data) {
            console.log('Tax Query raw data:', JSON.stringify(taxQuery.data, null, 2));
            console.log('Tax Query - getDocument result:', getDocument(taxQuery));
            console.log('Tax Query - getDocument[0]:', getDocument(taxQuery)?.[0]);
        }
        console.log('Company Query - entityId:', appId, 'Loading:', companyQuery.isLoading, 'Has data:', !!companyQuery.data);
        if (companyQuery.data) {
            console.log('Company Query raw data:', JSON.stringify(companyQuery.data, null, 2));
            console.log('Company Query - getDocument result:', getDocument(companyQuery));
            console.log('Company Query - getDocument[0]:', getDocument(companyQuery)?.[0]);
        }
        console.log('BEE Query - entityId:', appId, 'Loading:', beeQuery.isLoading, 'Has data:', !!beeQuery.data);
        if (beeQuery.data) console.log('BEE Query data:', JSON.stringify(beeQuery.data, null, 2));
        console.log('Bank Proof Query - entityId:', appId, 'Loading:', bankProofQuery.isLoading, 'Has data:', !!bankProofQuery.data);
        if (bankProofQuery.data) console.log('Bank Proof Query data:', JSON.stringify(bankProofQuery.data, null, 2));
    }, [appId, taxQuery.data, companyQuery.data, beeQuery.data, bankProofQuery.data]);

    // ========== Document Upload Handlers ==========
    const handleDocumentUpload = async (
        fileName: string,
        docType: string,
        setDocumentState: (result: DocumentPickerResult) => void,
        queryToRefetch: any
    ) => {
        try {
            console.log(`=== ${fileName} UPLOAD START ===`);
            console.log('userId:', userId);
            console.log('appId:', appId);

            const result = await pickDocument();
            if (result && result.assets && result.assets[0]) {
                console.log("Picked file:", result.assets[0]);

                const uploadResult = await uploadProjectDocument({
                    file: result.assets[0],
                    docType,
                    userId,
                    appId,
                }).unwrap();

                console.log(`${fileName} upload response:`, uploadResult);

                setDocumentState(result);

                console.log(`Refetching ${docType} documents...`);
                const refetchResult = await queryToRefetch.refetch();
                console.log(`Refetch result for ${docType}:`, JSON.stringify(refetchResult, null, 2));

                showToast({
                    message: `${fileName} uploaded successfully`,
                    title: "Success",
                    type: "success",
                    position: "top",
                });
            }
        } catch (error: any) {
            console.error(`=== ${fileName} UPLOAD ERROR ===`);
            console.error("Error:", error);

            const errorMessage =
                error?.data?.message ||
                error?.data?.error?.message ||
                error?.message ||
                "failed to upload document";
            showToast({ message: errorMessage, title: "Upload", type: "error", position: "top" });
        }
    };

    const handleTaxUpload = () => handleDocumentUpload('Tax Clearance', 'Tax Clearance', setTaxComplience, taxQuery);
    const handleCompanyReg = () => handleDocumentUpload('Company Registration', 'Company Registration', setCompanyReg, companyQuery);
    const handleBeeCert = () => handleDocumentUpload('BEE Certificate', 'BEE Certificate', setBeeCert, beeQuery);
    const handleProofAccredetation = () => handleDocumentUpload('Accreditation', 'Accreditation', setAccredetation, accredQuery);
    const handleLetterCommitment = () => handleDocumentUpload('Commitment', 'Commitment', setCommitmentLetter, commitQuery);
    const handleLearnerSchedule = () => handleDocumentUpload('Schedule', 'Schedule', setLearnerSchedule, scheduleQuery);
    const handleOrgInterest = () => handleDocumentUpload('Declaration', 'Declaration', setDeclarationInterest, declarationQuery);
    const handleBankDetails = () => handleDocumentUpload('Bank Proof', 'Bank Proof', setBankDetails, bankProofQuery);

    // ========== Entry Management ==========
    // Populate entries from API response
    useEffect(() => {
        if (dgProjectDetailsApp?.result?.items && dgProjectDetailsApp.result.items.length > 0) {
            const mappedEntries = dgProjectDetailsApp.result.items.map((item: any) => {
                const details = item.projectDetails;
                return {
                    id: details.id,
                    programmeTypeId: details.projectType,
                    learningProgrammeId: details.focusArea,
                    subCategoryId: details.subCategory,
                    interventionId: details.intervention,
                    focusCritEvalId: details.subCategory,
                    programType: details.projectType,
                    learningProgramme: details.focusArea,
                    subCategory: details.subCategory,
                    intervention: details.intervention,
                    noContinuing: details.number_Continuing,
                    noNew: details.number_New,
                    noFemale: details.female,
                    noHistoricallyDisadvantaged: details.hdi,
                    noYouth: details.youth,
                    noDisabled: details.number_Disabled,
                    noRural: details.rural,
                    costPerLearner: details.costPerLearner,
                    province: details.province,
                    district: "",
                    municipality: details.municipality,
                };
            });
            setEntries(mappedEntries);
        }
    }, [dgProjectDetailsApp]);

    // Handle edit mode flow - set programme details in correct order
    useEffect(() => {
        if (editingEntryId && focusAreas.length > 0 && !subCategory) {
            setLearningProgramme(entries.find(e => e.id === editingEntryId)?.learningProgrammeId || "");
        }
    }, [focusAreas, editingEntryId, entries]);

    useEffect(() => {
        if (editingEntryId && adminCriteria.length > 0 && !intervention) {
            const entry = entries.find(e => e.id === editingEntryId);
            if (entry) {
                setSubCategory(entry.subCategoryId || "");
                setFocusCritEvalId(entry.focusCritEvalId?.toString() || "");
            }
        }
    }, [adminCriteria, editingEntryId, entries]);

    useEffect(() => {
        if (editingEntryId && evalMethods.length > 0 && !intervention) {
            const entry = entries.find(e => e.id === editingEntryId);
            setIntervention(entry?.interventionId || "");
        }
    }, [evalMethods, editingEntryId, entries]);

    const handleEditEntry = (entry: any) => {
        setProgrammeType(entry.programmeTypeId || "");
        setNoContinuing(entry.noContinuing?.toString() || "");
        setNoNew(entry.noNew?.toString() || "");
        setNoFemale(entry.noFemale?.toString() || "");
        setNoHDI(entry.noHistoricallyDisadvantaged?.toString() || "");
        setNoYouth(entry.noYouth?.toString() || "");
        setNoDisabled(entry.noDisabled?.toString() || "");
        setNoRural(entry.noRural?.toString() || "");
        setCostPerLearner(entry.costPerLearner?.toString() || "");
        setProvince(entry.province as Province || "");
        setSelectedDistrict(entry.district || "");
        setSelectedMunipality(entry.municipality || "");
        setEditingEntryId(entry.id);
        setProg(false);
        setLoc(false);
        setProv(false);
        showToast({ message: "Loading entry data...", title: "Edit Mode", type: "success", position: "top" });
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
                position: "top",
            });
        }
    };

    const resetFormFields = () => {
        setProgrammeType("");
        setLearningProgramme("");
        setSubCategory("");
        setFocusCritEvalId("");
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
    };

    // ========== Document Validation ==========
    const isDocumentUploaded = (doc: any) => {
        return doc.file?.assets || getDocument(doc.query)?.filename;
    };

    const requiredDocuments = [
        { name: 'Bank Proof', file: bankingDetailsProof, query: bankProofQuery },
        { name: 'Company Registration', file: companyReg, query: companyQuery },
        { name: 'BEE Certificate', file: beeCert, query: beeQuery },
        { name: 'Declaration', file: declarationInterest, query: declarationQuery },
        { name: 'Tax Clearance', file: taxComplience, query: taxQuery },
    ];

    const missingDocuments = requiredDocuments.filter(doc => !isDocumentUploaded(doc));
    const allDocumentsUploaded = missingDocuments.length === 0;

    // ========== Step Management ==========
    const canProceedFromStep1 = () => entries.length > 0;
    const canProceedFromStep2 = () => missingDocuments.length === 0;

    const handleNext = () => {
        if (currentStep === 1 && !canProceedFromStep1()) {
            showToast({
                message: "Please fill all required fields in Step 1",
                title: "Incomplete",
                type: "error",
                position: "top",
            });
            return;
        }
        if (currentStep === 2 && !canProceedFromStep2()) {
            showToast({
                message: `Missing required documents: ${missingDocuments.map(d => d.name).join(', ')}`,
                title: "Upload Required Files",
                type: "error",
                position: "top",
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

    // ========== Application Submission ==========
    const handleSubmitApplication = async () => {
        if (!applicationForm?.assets && !getDocument(signedAppQuery)?.filename) {
            showToast({
                message: "Please upload the signed application form",
                title: "Submission",
                type: "error",
                position: "top",
            });
            return;
        }

        try {
            const validationResult = await validateProjectSubmission(appId).unwrap();
            console.log("Validation result:", validationResult);

            if (!validationResult.success) {
                return { success: false, message: validationResult.message };
            }

            const submitResult = await submitApplication({ projId: appId, userId }).unwrap();
            console.log("Submit result:", submitResult);

            showToast({
                message: submitResult.message || "The application has been submitted successfully.",
                title: "Success",
                type: "success",
                position: "top",
            });

            return { success: true, message: submitResult.message };
        } catch (error: any) {
            console.error("Submission error:", error);
            const errorMessage =
                error?.data?.error?.message || error?.message || "Failed to submit application";
            showToast({ message: errorMessage, title: "Error", type: "error", position: "top" });
            return { success: false, message: errorMessage };
        }
    };

    const handleSaveApplication = async () => {
        setProg(!expandProg);
        setLoc(!expandLoc);
        setProv(!expandProv);

        if (!programmeType || !learningProgramme || !intervention) {
            showToast({
                message: "Please select Programme Type, Learning Programme, and Intervention",
                title: "Incomplete",
                type: "error",
                position: "top",
            });
            return;
        }
        if (!selectedProvince || !selectedDistrict || !selectedMunicipality) {
            showToast({
                message: "Please select Province, District, and Municipality",
                title: "Incomplete",
                type: "error",
                position: "top",
            });
            return;
        }
        if (!noContinuing || !noNew || !costPerLearner) {
            showToast({
                message: "Please fill all learner details",
                title: "Incomplete",
                type: "error",
                position: "top",
            });
            return;
        }

        try {
            const programTypeLabel = projectTypes.find(p => p.key === programmeType)?.value || programmeType;
            const learningProgrammeLabel = focusAreas.find(f => f.key === learningProgramme)?.value || learningProgramme;
            const subCategoryLabel = adminCriteria.find(a => a.key === subCategory)?.value || subCategory;
            const interventionLabel = evalMethods.find(e => e.key === intervention)?.value || intervention;

            if (!projectId) {
                showToast({
                    message: "Project ID not found",
                    title: "Error",
                    type: "error",
                    position: "top",
                });
                return;
            }

            const detailsPayload = {
                projectId: parseInt(projectId),
                projectTypeId: parseInt(programmeType),
                focusAreaId: parseInt(learningProgramme),
                subCategoryId: parseInt(subCategory),
                interventionId: parseInt(intervention),
                focusCritEvalId: parseInt(focusCritEvalId),
                otherIntervention: "",
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

            console.log("Application details response:", JSON.stringify(detailsResult, null, 2));

            let detailsId =
                detailsResult?.result?.id ||
                detailsResult?.id ||
                detailsResult?.data?.id ||
                detailsResult?.payload?.id;

            if (!detailsId && detailsResult?.success === true) {
                detailsId = `DG-${projectId}-${Date.now()}`;
            }

            if (!detailsId) {
                throw new Error(
                    `Failed to create application entry: No ID returned from server. ` +
                    `Response: ${JSON.stringify(detailsResult)}`
                );
            }

            const newEntry = {
                id: detailsId.toString(),
                programmeTypeId: parseInt(programmeType),
                learningProgrammeId: parseInt(learningProgramme),
                subCategoryId: parseInt(subCategory),
                interventionId: parseInt(intervention),
                focusCritEvalId: parseInt(focusCritEvalId),
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

            if (editingEntryId) {
                setEntries(entries.map(e => (e.id === editingEntryId ? { ...e, ...newEntry } : e)));
                setEditingEntryId(null);
            } else {
                setEntries([...entries, newEntry]);
            }

            resetFormFields();
            setProg(true);
            setLoc(true);
            setProv(true);

            showToast({
                message: editingEntryId ? "Application entry updated successfully" : "Application entry saved successfully",
                title: "Success",
                type: "success",
                position: "top",
            });
        } catch (error: any) {
            console.error("Full error object:", error);
            console.error("Error data:", error?.data);

            const errorMessage =
                error?.data?.error?.message ||
                error?.data?.message ||
                error?.message ||
                "Failed to save application entry";

            showToast({
                message: errorMessage,
                title: "Error",
                type: "error",
                position: "top",
            });
        }
    };

    // ========== useGenerate Integration ==========
    const { generate } = useGenerate({
        appId,
        programmeType: getSelectedLabel(programmeType, projectTypes)?.value,
        learningProgramme: getSelectedLabel(learningProgramme, focusAreas)?.value,
        subCategory: getSelectedLabel(subCategory, adminCriteria)?.value,
        intervention: getSelectedLabel(intervention, evalMethods)?.value,
        costPerLearner: costPerLearner ? parseFloat(costPerLearner) : 0,
        taxCompliance: !!(taxComplience?.assets || getDocument(taxQuery)?.filename),
        companyRegistration: !!(companyReg?.assets || getDocument(companyQuery)?.filename),
        beeCertificate: !!(beeCert?.assets || getDocument(beeQuery)?.filename),
        letterOfCommitment: !!(commitmentLetter?.assets || getDocument(commitQuery)?.filename),
        proofOfAccreditation: !!(accredetation?.assets || getDocument(accredQuery)?.filename),
        declarationOfInterest: !!(declarationInterest?.assets || getDocument(declarationQuery)?.filename),
        proofOfBanking: !!(bankingDetailsProof?.assets || getDocument(bankProofQuery)?.filename),
        referenceNumber: `DG-${appId}`,
    });

    return {
        // State
        currentStep,
        expandDocs,
        expandProv,
        expandProg,
        expandLoc,
        selectedProvince,
        selectedDistrict,
        selectedMunicipality,
        district,
        manucipality,
        programmeType,
        learningProgramme,
        subCategory,
        focusCritEvalId,
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

        // Setters
        setCurrentStep,
        setDocs,
        setProv,
        setProg,
        setLoc,
        setProvince,
        setSelectedDistrict,
        setSelectedMunipality,
        setDistrict,
        setManucipality,
        setProgrammeType,
        setLearningProgramme,
        setSubCategory,
        setFocusCritEvalId,
        setIntervention,
        setNoContinuing,
        setNoNew,
        setNoFemale,
        setNoHDI,
        setNoYouth,
        setNoDisabled,
        setNoRural,
        setCostPerLearner,
        setEntries,
        setEditingEntryId,
        setApplicationForm,
        setTaxComplience,
        setCompanyReg,
        setBeeCert,
        setAccredetation,
        setCommitmentLetter,
        setLearnerSchedule,
        setDeclarationInterest,
        setBankDetails,

        // Queries
        dgProjectDetailsApp,
        projectTypes,
        focusAreas,
        adminCriteria,
        evalMethods,
        bankProofQuery,
        beeQuery,
        scheduleQuery,
        declarationQuery,
        workplaceQuery,
        signedAppQuery,
        taxQuery,
        accredQuery,
        proposalQuery,
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
        requiredDocuments,

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
        handleEditEntry,
        handleDeleteEntry,
        handleNext,
        handlePrev,
        handleSubmitApplication,
        handleSaveApplication,

        // Helpers
        getDocument,
        getSelectedLabel,
        resetFormFields,
        isDocumentUploaded,
        canProceedFromStep1,
        canProceedFromStep2,
        generate,
    };
};

export default useDg;