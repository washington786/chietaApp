export interface MandatoryApplicationDto {
    id: number;
    grantWindowId: number;
    organisationId: number;
    organisationSDL: string;
    organisation_Name: string;
    organisation_Trading_Name: string;
    province: string | null;
    region: string | null;
    grantStatus: string;
    referenceNo: string;
    description: string;
    userId: number;
    dteCreated: string | Date;
    captureDte: string | Date;
    submissionDte: string | Date;
    closingDate: string | Date;
    rsaId: number;
    rsa: any | null;
    rmId: number;
    submittedPrevious: boolean;
}

export interface OrganisationPhysicalAddressDto {
    id: number;
    organisationId: number;
    addressLine1: string;
    addressLine2: string | null;
    suburb: string | null;
    area: string | null;
    district: string | null;
    municipality: string;
    province: string;
    postcode: string | null;
    dateCreated: string;
    userId: string;
}

export interface OrganisationPostalAddressDto {
    id: number;
    organisationId: number;
    sameAsPhysical: boolean;
    addressLine1: string;
    addressLine2: string | null;
    suburb: string | null;
    area: string | null;
    district: string | null;
    municipality: string;
    province: string;
    postcode: string | null;
    dateCreated: string;
    userId: string;
}

export interface DocumentDto {
    id: number;
    entityId: number;
    newFilename: string;
    filename: string;
    lastModifiedDate: string;
    size: number;
    type: string;
    documentType: string;
    module: string;
    dateCreated: string;
    userId: string;
}

export interface MandatoryGrantPaymentDto {
    id: number;
    sdlNumber: string;
    zipfileId: number | null;
    grantYear: number;
    month: number;
    chietaAccount: string | null;
    chietaCode1: string | null;
    orgNameCode: string | null;
    bankName: string;
    bankAccountNumber: string;
    code: string | null;
    bankAccountCode: string | null;
    organisationName: string;
    sdlCode: string | null;
    amount: number;
    creatorUserId: string;
    deleterUserId: string | null;
    deletionTime: string | null;
    isDeleted: boolean;
    lastModificationTime: string | null;
    lastModifierUserId: string | null;
    creationTime: string;
}

export interface MandatoryBankingListDto {
    id: number;
    zipFileId: number | null;
    sdlNumber: string;
    chietaAccount: string | null;
    chietaCode1: string | null;
    orgNameCode: string | null;
    bankName: string;
    bankAccountNumber: string;
    code: string | null;
    bankAccountCode: string | null;
    organisationName: string;
    sdlCode: string | null;
    amount: number;
    creationTime: string;
}

export interface MandatoryGrantBiodataDto {
    id: number;
    applicationId: string;
    saIdNumber: string | null;
    passportNumber: string | null;
    firstname: string;
    middlename: string | null;
    surname: string;
    birthYear: number;
    gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say' | null;
    race: 'Black' | 'White' | 'Coloured' | 'Indian' | 'Other' | null;
    disability: 'None' | 'Yes' | null;
    nationality: string;
    province: string;
    municipality: string | null;
    highestQualificationType: string | null;
    employmentStatus: 'Employed' | 'Unemployed' | 'Self-employed' | 'Other' | null;
    occupationLevelForEquityReporting: string | null;
    organisationalStructureFilter: string | null;
    postReference: string | null;
    jobTitle: string | null;
    ofoOccupationCode: string;
    ofoSpecialisation: string | null;
    ofoOccupation: string | null;
    status: 'Active' | 'Inactive' | 'Pending' | 'Rejected' | 'Completed';
    comment: string | null;
    userId: string;
    dateCreated: string;
    usrUpd: string | null;
    dteUpd: string | null;
}

export interface MandatoryExtensionDto {
    id: number;
    applicationId: number;
    requestStatus: string | null;
    dateRequested: string;
    reasonForRequest: string | null;
    dateCreated: string;
    userId: string | null;
    dteUpd: string | null;
    usrUpd: string | null;
}


export interface MandatoryStatus {
    id: number;
    statusDesc: string;
    typ: string;
    dateCreated: string;
}