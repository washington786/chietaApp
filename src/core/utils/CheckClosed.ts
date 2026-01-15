/**
 * Utility function to check if a project is closed
 */

interface ProjectCheckResult {
    isClosed: boolean;
    isEditable: boolean;
}

/**
 * Pads a number with leading zeros
 * @param str - The string/number to pad
 * @returns Padded string
 */
const pad = (str: string | number): string => {
    const strValue = str.toString();
    return "00".substring(0, 2 - strValue.length) + strValue;
};

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

    // Check if project status is not 'Registered'
    if (projectStatus !== "Registered") {
        isEditable = false;
    }

    // Get current date in UTC
    const d = new Date();
    const dteNow = new Date(
        `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate() + 1)}`
    );

    // Parse end date
    const endDate = new Date(projectEndDate);

    // Check if end date has passed
    if (endDate <= d) {
        isEditable = false;
        isClosed = true;
    } else {
        isClosed = false;
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
