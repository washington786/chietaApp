/**
 * Utility function to check if a project is closed
 */

interface ProjectCheckResult {
    isClosed: boolean;
    isEditable: boolean;
}

/**
 * Checks if a project is closed based on status and end date
 * @param projectStatus - The status of the project (e.g., 'Registered')
 * @param projectEndDate - The end date of the project
 * @returns Object containing isClosed and isEditable flags
 */
export const checkProjectClosed = (
    projectStatus: string,
    projectEndDate: string | Date
): ProjectCheckResult => {
    let isEditable = true;
    let isClosed = false;

    const normalizedStatus = (projectStatus || '').trim().toLowerCase();
    const nonEditableStatuses = ['submitted', 'approved', 'rejected', 'closed', 'completed'];

    if (nonEditableStatuses.includes(normalizedStatus)) {
        isEditable = false;
        isClosed = true;
    }

    const parseDate = (value: string | Date | undefined) => {
        if (!value) return null;
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const endDate = parseDate(projectEndDate);
    if (endDate) {
        const normalizedEnd = new Date(endDate);
        normalizedEnd.setHours(23, 59, 59, 999);

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (normalizedEnd < now) {
            isEditable = false;
            isClosed = true;
        }
    }

    return { isClosed, isEditable };
};

/**
 * Simple check to determine if a project is closed
 * @param projectEndDate - The end date of the project
 * @returns true if project is closed, false otherwise
 */
export const isProjectClosed = (projectEndDate: string | Date): boolean => {
    const d = new Date();
    const endDate = new Date(projectEndDate);
    return endDate <= d;
};
