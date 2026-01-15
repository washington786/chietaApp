import { generateApplicationPdf } from '@/core/helpers/pdfGenerator';
import { showToast } from '@/core';
import { useGetOrganizationByProjectQuery, useGetPersonByIdQuery } from '@/store/api/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface UseGenerateProps {
    orgId: number;
    appId: number;
    programmeType?: string;
    projectReference?: string;
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
    totalCost?: number;
    phoneNumber?: string;
    tradingName?: string;
    coreBusiness?: string;
    beeStatus?: string;
    organisationName?: string;
    faxNumber?: string;
    email?: string;

    ceoFirstName?: string;
    ceoSurname?: string;
    ceoEmail?: string;
    ceoRace?: string;
    ceoGender?: string;

    cfoFirstName?: string;
    cfoSurname?: string;
    cfoEmail?: string;
    cfoRace?: string;
    cfoGender?: string;

    sdfFirstName?: string;
    sdfSurname?: string;
    sdfEmail?: string;
    sdfRace?: string;
    sdfGender?: string;
    sdfrole?: string;
    sdfphone?: string;
    sdfmobile?: string;
    
    


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
                reference: dgOrgData?.result?.projectReference || '[Reference Number]',
                projectType: programmeType || '[Programme Type]',

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
                    numberNew: noNew ?? 0,
                    numberContinuing: noContinuing ?? 0,
                    costPerLearner: costPerLearner ?? 0,
                    totalCost: (costPerLearner ?? 0) * ((noNew ?? 0) + (noContinuing ?? 0)),
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
                    ceoName: `${dgOrgData?.result?.ceo?.firstName || ''} ${dgOrgData?.result?.ceo?.surname || ''}`.trim(),
                    ceoDate: new Date().toISOString().split('T')[0],
                    cfoName: `${dgOrgData?.result?.senior?.firstName || ''} ${dgOrgData?.result?.senior?.surname || ''}`.trim(),
                    cfoDate: new Date().toISOString().split('T')[0],
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