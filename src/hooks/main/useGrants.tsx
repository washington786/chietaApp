import { generateEvaluationApprovalPdf, generateEvaluationRejectPdf } from "@/core/helpers/pdfGenerator";
import { useGetGrantDetailsViewQuery, useGetProjectDetailsListViewQuery } from "@/store/api/api";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const useGrants = ({ appId }: { appId: number; }) => {
    const { data: grantDetails } = useGetGrantDetailsViewQuery(appId, { skip: !appId });

    const { selectedProject } = useSelector((state: RootState) => state.discretionaryGrant);

    const { data: grants } = useGetProjectDetailsListViewQuery(Number(appId), { skip: !appId });


    const cost = grants.map((grant: any) => grant.gC_CostPerLearner || 0).reduce((a: any, b: any) => a + b, 0);

    const generateApprovedGrantsReport = async () => {
        const templateData = {
            organizationName: grantDetails?.result?.organisation_Name || 'N/A',
            fundingCycle: selectedProject?.title || 'N/A',
            fundingAmount: cost ? `R ${cost.toFixed(2)}` : 'N/A',
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