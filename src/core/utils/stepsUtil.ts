import { DiscretionaryGrantApplication } from "../models/DiscretionaryDto";

export type StepStatus = 'completed' | 'pending';
export interface TimelineStep {
    id: string;
    title: string;
    date: string;
    status: StepStatus;
    comments?: string;
}

export const getDynamicSteps = (grant: DiscretionaryGrantApplication): TimelineStep[] => {
    const formatDate = (isoDate: string | null): string => {
        if (!isoDate) return '—';
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-GB');
    };

    const isCompleted = (
        status: { approvalStatusId: number } | null,
        approvalTypeId: number
    ): boolean => {
        if (!status) return false;

        const { approvalStatusId } = status;
        switch (approvalTypeId) {
            case 1: // Final Approval
                return approvalStatusId === 111; // "Contract returned & signed"
            case 2: // RSA Review
                return approvalStatusId === 239; // "RSA Review Completed"
            case 3: // GAC Review
                return approvalStatusId === 243; // "GAC Committee Review Completed"
            case 4: // GEC Review
                return approvalStatusId === 241; // "GEC Committee Review Completed"
            default:
                return false;
        }
    };

    return [
        // Step 1: Application Submitted
        {
            id: 'submitted',
            title: 'Application Submitted',
            date: formatDate(grant.dateCreated),
            status: 'completed',
        },

        // Step 2: RSA Review (approvalTypeId: 2)
        {
            id: 'rsa',
            title: 'RSA Review Completed',
            date: formatDate(grant.gecStatus?.dateCreated || null),
            status: isCompleted(grant.gecStatus, 2) ? 'completed' : 'pending',
            comments: grant.gecStatus?.comments,
        },

        // Step 3: GAC Review (approvalTypeId: 3)
        {
            id: 'gac',
            title: 'GAC Review Completed',
            date: formatDate(grant.gacStatus?.dateCreated || null),
            status: isCompleted(grant.gacStatus, 3) ? 'completed' : 'pending',
            comments: grant.gacStatus?.comments,
        },

        // Step 4: GEC Review (approvalTypeId: 4)
        {
            id: 'gec',
            title: 'GEC Review Completed',
            date: formatDate(grant.gcStatus?.dateCreated || null),
            status: isCompleted(grant.gcStatus, 4) ? 'completed' : 'pending',
            comments: grant.gcStatus?.comments,
        },

        // Step 5: Final Approval (approvalTypeId: 1)
        {
            id: 'final',
            title: 'Final Approval & Contract Signed',
            date: formatDate(grant.approvalStatus?.dateCreated || null),
            status: isCompleted(grant.approvalStatus, 1) ? 'completed' : 'pending',
            comments: grant.approvalStatus?.comments,
        },
    ];
};