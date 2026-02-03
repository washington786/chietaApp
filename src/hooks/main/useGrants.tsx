import { generateApplicationPdf, generateEvaluationApprovalPdf, generateEvaluationRejectPdf } from "@/core/helpers/pdfGenerator";
import { useGetGrantDetailsViewQuery } from "@/store/api/api";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const useGrants = ({ appId }: { appId: number; }) => {
    const { data: grantDetails } = useGetGrantDetailsViewQuery(appId, { skip: !appId });

    const { selectedProject } = useSelector((state: RootState) => state.discretionaryGrant);

    const generateApprovedGrantsReport = async () => {
        const templateData = {
            organizationName: grantDetails?.result?.organisation_Name || 'N/A',
            fundingCycle: selectedProject?.title || 'N/A',
            fundingAmount: grantDetails?.result?.gC_CostPerLearner ? `R ${grantDetails.result.gC_CostPerLearner.toFixed(2)}` : 'N/A',
            fundingArea: grantDetails?.result?.focusArea || 'N/A',
        }

        await generateEvaluationApprovalPdf(templateData);
    }

    const generateRejectedGrantsReport = async () => {
        const templateData = {
            fundingCycle: selectedProject?.title || 'N/A',
        }

        await generateEvaluationRejectPdf(templateData);
    }

    return { generateApprovedGrantsReport, generateRejectedGrantsReport };
}

export default useGrants