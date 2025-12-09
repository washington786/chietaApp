export interface OrganisationDto {

    sdlNo: string;

    setaId: number;

    seta: string | null;

    sicCode: string;

    organisationRegistrationNumber: string;

    organisationName: string;

    organisationTradingName: string;

    organisationFaxNumber: string;

    organisationContactName: string | null;

    organisationContactEmailAddress: string;

    organisationContactPhoneNumber: string;

    organisationContactCellNumber: string;

    companySize: string;

    numberOfEmployees: number;

    typeOfEntity: string;

    coreBusiness: string;

    parentSdlNumber: string | null;

    bbbeeStatus: string;

    bbbeeLevel: number;

    dateBusinessCommenced: string | Date;

    status: string;

    exemptionCode: number;

    chamber: string;

    ceoName: string;

    ceoSurname: string;

    ceoEmail: string;

    ceoRaceId: string;

    ceoGenderId: string;

    seniorRepName: string;

    seniorRepSurname: string;

    seniorRepEmail: string;

    seniorRepRaceId: string;

    seniorRepGenderId: string;

    id: number;

}

export interface OrganisationItemDto {

    orgSdfId: number;

    statusId: number;

    organisation: OrganisationDto;

}

export interface OrganisationListResponseDto {

    items: OrganisationItemDto[];

}
