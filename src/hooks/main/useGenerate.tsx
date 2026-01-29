import { generateApplicationPdf } from '@/core/helpers/pdfGenerator';
import { showToast } from '@/core';
import { useGetOrganizationByProjectQuery, useGetPersonByUserIdQuery } from '@/store/api/api';
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
    referenceNumber?: string;
}

const useGenerate = ({ appId, programmeType, learningProgramme, subCategory, intervention, province, municipality, costPerLearner, taxCompliance, companyRegistration, beeCertificate, letterOfCommitment, proofOfAccreditation, declarationOfInterest, proofOfBanking, workplaceApproval, researchExportsQuestionnaire, referenceNumber }: UseGenerateProps) => {

    const { user } = useSelector((state: RootState) => state.auth);

    const { data: dgOrgData } = useGetOrganizationByProjectQuery(appId, { skip: !appId });

    const { data: sdfData } = useGetPersonByUserIdQuery(user?.id, { skip: !user?.id });

    const generate = async () => {
        try {
            // Generate PDF with actual data and fallback to placeholders
            const templateData = {
                reference: referenceNumber || '',
                projectType: programmeType || '',
                organisation: {
                    organisationName: dgOrgData?.result?.organisationName || '',
                    tradingName: dgOrgData?.result?.tradingName || '',
                    coreBusiness: dgOrgData?.result?.coreBusiness || '',
                    province: province || dgOrgData?.result?.province || '',
                    municipality: municipality || dgOrgData?.result?.municipality || '',
                    beeStatus: dgOrgData?.result?.beeStatus || '',
                    phoneNumber: dgOrgData?.result?.phoneNumber || '',
                    faxNumber: dgOrgData?.result?.faxNumber || '',
                    email: dgOrgData?.result?.email || '',
                },
                ceo: {
                    firstName: dgOrgData?.result?.ceo?.firstName || '',
                    surname: dgOrgData?.result?.ceo?.surname || '',
                    email: dgOrgData?.result?.ceo?.email || '',
                    race: dgOrgData?.result?.ceo?.race || '',
                    gender: dgOrgData?.result?.ceo?.gender || '',
                },
                cfo: {
                    firstName: dgOrgData?.result?.senior?.firstName || '',
                    surname: dgOrgData?.result?.senior?.surname || '',
                    email: dgOrgData?.result?.senior?.email || '',
                    race: dgOrgData?.result?.senior?.race || '',
                    gender: dgOrgData?.result?.senior?.gender || '',
                },
                sdf: {
                    firstName: sdfData?.result?.firstName || '',
                    surname: sdfData?.result?.surname || '',
                    role: sdfData?.result?.role || '',
                    race: sdfData?.result?.race || '',
                    gender: sdfData?.result?.gender || '',
                    phone: sdfData?.result?.phone || '',
                    mobile: sdfData?.result?.mobile || '',
                    email: sdfData?.result?.email || '',
                },
                gms: {
                    learningProgramme: learningProgramme || '',
                    subCategory: subCategory || '',
                    intervention: intervention || '',
                    cost: costPerLearner?.toString() || '',
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
                    ceoName: (dgOrgData?.result?.ceo?.firstName || '') + " " + (dgOrgData?.result?.ceo?.surname || ''),
                    ceoDate: new Date().toISOString(),
                    cfoName: (dgOrgData?.result?.senior?.firstName || '') + " " + (dgOrgData?.result?.senior?.surname || ''),
                    cfoDate: new Date().toISOString(),
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