export const getDesignation = (designation__code: number): string => {
    switch (designation__code) {
        case 1:
            return "SDF";
        case 2:
            return "Accountant";
        case 12:
            return "Director";
        case 4:
            return "Administrator";
        case 13:
            return "CEO";
        case 14:
            return "Bookeeper";
        case 15:
            return "Consultant";
        default:
            return "Unknown";
    }
};