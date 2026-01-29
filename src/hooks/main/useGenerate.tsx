import { generateApplicationPdf } from '@/core/helpers/pdfGenerator';
import { showToast } from '@/core';
import { useGetOrganizationByProjectQuery, useGetPersonByUserIdQuery, useGetOrganizationPhysicalAddressQuery, useGetDGProjectDetailsAppQuery } from '@/store/api/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface UseGenerateProps {
    appId: number;
    programmeType?: string;
    learningProgramme?: string;
    subCategory?: string;
    intervention?: string;
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

const useGenerate = ({ appId, programmeType, learningProgramme, subCategory, intervention, costPerLearner, taxCompliance, companyRegistration, beeCertificate, letterOfCommitment, proofOfAccreditation, declarationOfInterest, proofOfBanking, workplaceApproval, researchExportsQuestionnaire, referenceNumber }: UseGenerateProps) => {

    const { user } = useSelector((state: RootState) => state.auth);

    const { data: dgOrgData } = useGetOrganizationByProjectQuery(appId, { skip: !appId });

    // Get organization ID from dgOrgData
    const organizationId = dgOrgData?.result?.organisation?.id;

    // Fetch physical address using organization ID
    const { data: physicalAddressData } = useGetOrganizationPhysicalAddressQuery(organizationId, { skip: !organizationId });


    const { data: sdfData } = useGetPersonByUserIdQuery(user?.id, { skip: !user?.id });

    const { data: entries } = useGetDGProjectDetailsAppQuery(appId, { skip: !appId });

    console.log('gms:', entries?.result?.items[0]);

    const generate = async () => {
        try {
            // Extract organization data from result
            const org = dgOrgData?.result?.organisation;

            // Extract physical address data
            const physicalAddress = physicalAddressData?.result?.organisationPhysicalAddress;

            console.log('address: ', physicalAddress);
            console.log('entries data: ', entries);
            console.log('entries.result: ', entries?.result);

            // Generate PDF with actual data and fallback to placeholders
            const templateData = {
                reference: referenceNumber || '',
                projectType: programmeType || '',
                organisation: {
                    organisationName: org?.organisation_Name || '',
                    tradingName: org?.organisation_Trading_Name || '',
                    coreBusiness: org?.corE_BUSINESS || '',
                    province: physicalAddress?.province || '',
                    municipality: physicalAddress?.municipality || '',
                    beeStatus: org?.bbbeE_Status || '',
                    phoneNumber: org?.organisation_Contact_Phone_Number || '',
                    faxNumber: org?.organisation_Contact_Cell_Number || '',
                    email: org?.organisation_Contact_Email_Address || '',
                },
                ceo: {
                    firstName: org?.ceO_Name || '',
                    surname: org?.ceO_Surname || '',
                    email: org?.ceO_Email || '',
                    race: org?.ceO_RaceId || '',
                    gender: org?.ceO_GenderId || '',
                },
                cfo: {
                    firstName: org?.senior_Rep_Name || '',
                    surname: org?.senior_Rep_Surname || '',
                    email: org?.senior_Rep_Email || '',
                    race: org?.senior_Rep_RaceId || '',
                    gender: org?.senior_Rep_GenderId || '',
                },
                sdf: {
                    firstName: sdfData?.result?.person?.firstname || '',
                    surname: sdfData?.result?.person?.lastname || '',
                    role: sdfData?.result?.person?.designation || '',
                    race: sdfData?.result?.person?.equity || '',
                    gender: sdfData?.result?.person?.gender || '',
                    phone: sdfData?.result?.person?.phone || '',
                    mobile: sdfData?.result?.person?.cellphone || '',
                    email: sdfData?.result?.person?.email || '',
                },
                gms: entries?.result?.items && Array.isArray(entries.result.items) && entries.result.items.length > 0
                    ? entries.result.items.map((item: any) => {
                        const details = item.projectDetails;
                        return {
                            learningProgramme: details.projectType || programmeType || '',
                            subCategory: details.subCategory || subCategory || '',
                            intervention: details.intervention || intervention || '',
                            cost: details.costPerLearner?.toString() || costPerLearner?.toString() || '',
                        };
                    })
                    : [{
                        learningProgramme: programmeType || '',
                        subCategory: subCategory || '',
                        intervention: intervention || '',
                        cost: costPerLearner?.toString() || '',
                    }],
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
                    ceoName: (org?.ceO_Name || '') + " " + (org?.ceO_Surname || ''),
                    ceoDate: new Date().toISOString(),
                    cfoName: (org?.senior_Rep_Name || '') + " " + (org?.senior_Rep_Surname || ''),
                    cfoDate: new Date().toISOString(),
                },
                generatedDate: new Date().toISOString(),
            };

            console.log('TemplateData for PDF:', templateData);
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