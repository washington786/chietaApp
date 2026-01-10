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
    sdL_Number: string;
    grantYear: number;
    month: number;
    zipfileid: number;
    chietaAccount: string;
    chietA_Code1: string;
    orgName_Code: string;
    banK_NAME: string | null;
    bank_Account_NUmber: string;
    code: number;
    bank_Account_Code: string;
    organisation_Name: string;
    sdlCode: string;
    amount: number;
    levyAmount: number;
    id: number;
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
    applicationId: number;
    sA_Id_Number: string | null;
    passport_Number: string | null;
    firstname: string;
    middlename: string | null;
    surname: string;
    birth_Year: string;
    gender: string;
    race: string;
    disability: string;
    nationality: string;
    province: string;
    municipality: string | null;
    highest_Qualification_Type: string | null;
    employment_Status: string;
    occupation_Level_For_Equity_Reporting: string | null;
    organisational_Structure_Filter: string | null;
    post_Reference: string | null;
    job_Title: string;
    ofO_Occupation_Code: string;
    ofO_Specialisation: string | null;
    ofO_Occupation: string | null;
    status: string;
    comment: string | null;
    userId: number;
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