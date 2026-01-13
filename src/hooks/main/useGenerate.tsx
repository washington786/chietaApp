import { generateApplicationPdf } from '@/core/helpers/pdfGenerator';
import { showToast } from '@/core';
import { useGetOrganizationByProjectQuery, useGetPersonByIdQuery } from '@/store/api/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface UseGenerateProps {
    orgId: number;
    appId: number;
    programmeType?: string;
    learningProgramme?: string;
    subCategory?: string;
    intervention?: string;
    province?: string;
    municipality?: string;
    noContinuing?: number;
    noNew?: number;
    noFemale?: number;
    noHDI?: number;
    noYouth?: number;
    noDisabled?: number;
    noRural?: number;
    costPerLearner?: number;
    // Document upload status
    taxCompliance?: boolean;
    companyRegistration?: boolean;
    beeCertificate?: boolean;
    letterOfCommitment?: boolean;
    proofOfAccreditation?: boolean;
    declarationOfInterest?: boolean;
    proofOfBanking?: boolean;
    workplaceApproval?: boolean;
    researchExportsQuestionnaire?: boolean;
}

const useGenerate = ({ orgId, appId, programmeType, learningProgramme, subCategory, intervention, province, municipality, noContinuing, noNew, noFemale, noHDI, noYouth, noDisabled, noRural, costPerLearner, taxCompliance, companyRegistration, beeCertificate, letterOfCommitment, proofOfAccreditation, declarationOfInterest, proofOfBanking, workplaceApproval, researchExportsQuestionnaire }: UseGenerateProps) => {
    const { user } = useSelector((state: RootState) => state.auth);

    const { data: dgOrgData, isLoading: dgOrgLoading, error: dgOrgError } = useGetOrganizationByProjectQuery(appId, { skip: !appId });

    const { data: sdfData, isLoading: sdfLoading, error: sdfError } = useGetPersonByIdQuery(user?.id, { skip: !user?.id });

    const generate = async () => {
        try {
            // Generate PDF with actual data and fallback to placeholders
            const templateData = {
                reference: '[Reference Number]',
                projectType: programmeType || '[Programme Type]',
                organisation: {
                    organisationName: dgOrgData?.result?.organisationName || '[Your Organization Name]',
                    tradingName: dgOrgData?.result?.tradingName || '[Trading Name]',
                    coreBusiness: dgOrgData?.result?.coreBusiness || '[Core Business]',
                    province: province || dgOrgData?.result?.province || '[Province]',
                    municipality: municipality || dgOrgData?.result?.municipality || '[Municipality]',
                    beeStatus: dgOrgData?.result?.beeStatus || '[BEE Status]',
                    phoneNumber: dgOrgData?.result?.phoneNumber || '[Phone Number]',
                    faxNumber: dgOrgData?.result?.faxNumber || '[Fax Number]',
                    email: dgOrgData?.result?.email || '[Email]',
                },
                ceo: {
                    firstName: dgOrgData?.result?.ceo?.firstName || '[CEO First Name]',
                    surname: dgOrgData?.result?.ceo?.surname || '[CEO Surname]',
                    email: dgOrgData?.result?.ceo?.email || '[CEO Email]',
                    race: dgOrgData?.result?.ceo?.race || '[Race]',
                    gender: dgOrgData?.result?.ceo?.gender || '[Gender]',
                },
                cfo: {
                    firstName: dgOrgData?.result?.senior?.firstName || '[CFO First Name]',
                    surname: dgOrgData?.result?.senior?.surname || '[CFO Surname]',
                    email: dgOrgData?.result?.senior?.email || '[CFO Email]',
                    race: dgOrgData?.result?.senior?.race || '[Race]',
                    gender: dgOrgData?.result?.senior?.gender || '[Gender]',
                },
                sdf: {
                    firstName: sdfData?.result?.firstName || '[SDF First Name]',
                    surname: sdfData?.result?.surname || '[SDF Surname]',
                    role: sdfData?.result?.role || '[Role]',
                    race: sdfData?.result?.race || '[Race]',
                    gender: sdfData?.result?.gender || '[Gender]',
                    phone: sdfData?.result?.phone || '[Phone]',
                    mobile: sdfData?.result?.mobile || '[Mobile]',
                    email: sdfData?.result?.email || '[Email]',
                },
                gms: {
                    learningProgramme: learningProgramme || '[Learning Programme]',
                    subCategory: subCategory || '[Sub Category]',
                    intervention: intervention || '[Intervention]',
                    cost: costPerLearner?.toString() || '[Cost]',
                },
                checklist: {
                    csdOrSarsPin: taxCompliance ? 'Yes' : 'No',
                    companyRegistration: companyRegistration ? 'Yes' : 'No',
                    beeCertificate: beeCertificate ? 'Yes' : 'No',
                    letterOfCommitment: letterOfCommitment ? 'Yes' : 'No',
                    proofOfAccreditation: proofOfAccreditation ? 'Yes' : 'No',
                    declarationOfInterest: declarationOfInterest ? 'Yes' : 'No',
                    proofOfBanking: proofOfBanking ? 'Yes' : 'No',
                    workplaceApproval: workplaceApproval ? 'Yes' : 'No',
                    researchExportsQuestionnaire: researchExportsQuestionnaire ? 'Yes' : 'No',
                },
                signOff: {
                    ceoName: '[CEO Name]',
                    ceoDate: '[Date]',
                    cfoName: '[CFO Name]',
                    cfoDate: '[Date]',
                },
                generatedDate: new Date().toISOString(),
            };

            await generateApplicationPdf(templateData);
            showToast({ message: "Template downloaded successfully", title: "Success", type: "success", position: "top" });
        } catch (error) {
            console.error("Download error:", error);
            showToast({ message: "Failed to download template", title: "Error", type: "error", position: "top" });
        }
    }
    return { generate }
}

export default useGenerate