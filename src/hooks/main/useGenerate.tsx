import { generateApplicationPdf } from '@/core/helpers/pdfGenerator';
import { showToast } from '@/core';

const useGenerate = ({ orgId, appId }: { orgId: number, appId: number }) => {
    const generate = async () => {
        try {

            // Generate PDF with template data
            const templateData = {
                reference: '[Reference Number]',
                projectType: '[Programme Type]',
                organisation: {
                    organisationName: '[Your Organization Name]',
                    tradingName: '[Trading Name]',
                    coreBusiness: '[Core Business]',
                    province: '[Province]',
                    municipality: '[Municipality]',
                    beeStatus: '[BEE Status]',
                    phoneNumber: '[Phone Number]',
                    faxNumber: '[Fax Number]',
                    email: '[Email]',
                },
                ceo: {
                    firstName: '[CEO First Name]',
                    surname: '[CEO Surname]',
                    email: '[CEO Email]',
                    race: '[Race]',
                    gender: '[Gender]',
                },
                cfo: {
                    firstName: '[CFO First Name]',
                    surname: '[CFO Surname]',
                    email: '[CFO Email]',
                    race: '[Race]',
                    gender: '[Gender]',
                },
                sdf: {
                    firstName: '[SDF First Name]',
                    surname: '[SDF Surname]',
                    role: '[Role]',
                    race: '[Race]',
                    gender: '[Gender]',
                    phone: '[Phone]',
                    mobile: '[Mobile]',
                    email: '[Email]',
                },
                gms: {
                    learningProgramme: '[Learning Programme]',
                    subCategory: '[Sub Category]',
                    intervention: '[Intervention]',
                    cost: '[Cost]',
                },
                checklist: {
                    csdOrSarsPin: '[ ]',
                    companyRegistration: '[ ]',
                    beeCertificate: '[ ]',
                    letterOfCommitment: '[ ]',
                    proofOfAccreditation: '[ ]',
                    declarationOfInterest: '[ ]',
                    proofOfBanking: '[ ]',
                    workplaceApproval: '[ ]',
                    researchExportsQuestionnaire: '[ ]',
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