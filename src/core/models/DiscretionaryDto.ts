export interface DiscretionaryProjectDetailsApproval {
    id: number;
    projectId: number;
    projectTypeId: number;
    applicationStatusId: number;
    submittedBy: string | null;
    submissionDte: string;
    currentApprover: string | null;
    contractNumber: string | null;
    reason: string | null;
    approvalStatus: string | null;
    focusAreaId: number;
    subCategoryId: number;
    interventionId: number;
    otherIntervention: string | null;
    focusCritEvalId: number;
    numberContinuing: number;
    numberNew: number;
    costPerLearner: number;
    gecNew: number;
    gecContinuing: number;
    gecCostPerLearner: number;
    gacNew: number;
    gacContinuing: number;
    gacCostPerLearner: number;
    gcNew: number;
    gcContinuing: number;
    gcCostPerLearner: number;
    hdi: number;
    female: number;
    youth: number;
    numberDisabled: number;
    rural: number;
    province: string | null;
    municipality: string | null;
    district: string | null;
    vision2025goal: string | null;
    sqmrAppIndicator: boolean | null;
    leviesUptodate: boolean | null;
    previousWsp: string | null;
    previousParticipation: string | null;
    dateCreated: string;
    userId: string | null;
    usrUpd: string | null;
    dteUpd: string | null;
    comments: string | null;
    companyTypeId: number;
    companyComplianceId: number;
    discLearnerTypeId: number;
    hiStoricalPerfomanceId: number;
    newCompany: boolean | null;
    linkToSsp: string | null;
}

export interface DiscretionaryProjectDetails {
    id: number;
    projectId: number;
    projectTypeId: number;
    focusAreaId: number;
    subCategoryId: number;
    interventionId: number;
    otherIntervention: string | null;
    focusCritEvalId: number;
    numberContinuing: number;
    numberNew: number;
    costPerLearner: number;
    hdi: number;
    female: number;
    youth: number;
    numberDisabled: number;
    rural: number;
    province: string | null;
    municipality: string | null;
    district: string | null;
    dateCreated: string;
    userId: string | null;
}

// export interface DiscretionaryProject {
//     id: number;
//     organisationId: number;
//     projectStatusId: number;
//     projectStatDte: string;
//     projShortNam: string | null;
//     projectNam: string | null;
//     grantWindowId: number;
//     windowParamId: number;
//     projectTypeId: number;
//     submittedBy: string | null;
//     submissionDte: string;
//     totInitReq: number;
//     totProj: number;
//     totReq: number;
//     totFund: number;
//     totExpend: number;
//     totRcvd: number;
//     totDisb: number;
//     totGrant: number;
//     projMgrId: number | null;
//     auditor: string | null;
//     auditYyIncl: string | null;
//     poAppr: boolean | null;
//     poApprDte: string | null;
//     poApprNote: string | null;
//     finAppr: boolean | null;
//     finApprDte: string | null;
//     finApprNote: string | null;
//     reference: string | null;
//     fileLoctn: string | null;
//     photoLoctn: string | null;
//     captureDte: string;
//     nextLogNum: number;
//     archiveYn: boolean | null;
//     archSetDte: string | null;
//     appRef: string | null;
//     crPath: string | null;
//     gisLong: number | null;
//     gisLat: number | null;
//     dteUpd: string | null;
//     usrUpd: string | null;
//     dteCreated: string;
//     totOwnCntrb: number;
//     totAddFund: number;
//     rsaId: number | null;
//     rsaAssignedBy: string | null;
//     rsaAssignDate: string | null;
//     regManagerId: number | null;
//     userId: string | null;
//     dateCreated: string;
// }

export interface DiscretionaryStatus {
    id: number;
    status: number;
    statusDesc: string | null;
    typ: string | null;
    dteUpd: string | null;
    usrUpd: string | null;
    dteCreated: string;
}

export interface DiscretionaryGrantApplication {
    id: number;
    sdl: string;
    organisationId: number;
    organisation_Name: string;
    organisation_Trade_Name: string;
    contract_Number: string;
    projectId: number;
    applicationStatusId: number;
    projectType: string;
    project: string;
    focusArea: string;
    subCategory: string;
    intervention: string;
    otherIntervention: string | null;
    number_Continuing: number;
    number_New: number;
    costPerLearner: number;
    geC_Continuing: number;
    geC_New: number;
    geC_CostPerLearner: number;
    gaC_Continuing: number;
    gaC_New: number;
    gaC_CostPerLearner: number;
    gC_Continuing: number;
    gC_New: number;
    gC_CostPerLearner: number;
    hdi: number;
    female: number;
    youth: number;
    number_Disabled: number;
    rural: number;
    province: string;
    municipality: string;
    status: string;
    sqmrAppIndicator: string;
    vision2025goal: string;
    leviesuptodate: string;
    previousWSP: string;
    previousParticipation: string;
    approvalStatus: ApprovalStatus;
    gecStatus: ApprovalStatus;
    gacStatus: ApprovalStatus;
    gcStatus: ApprovalStatus;
    comment: string;
    dateCreated: string;
}

export interface ApprovalStatus {
    id: number;
    applicationId: number;
    approvalTypeId: number;
    approvalStatusId: number;
    comments: string;
    dateCreated: string;
    userId: number;
    dteUpd: string | null;
    userUpd: number;
}

// Optional: normalized naming suggestion
export interface activeWindow {
    id: number,
    dG_Window: string,
    projectType: string | null,
    title: string,
    projType: string,
    focusArea: string,
    subCategory: string | null,
    intervention: string | null,
    activeYN: boolean,
    skipCount: number,
    maxResultCount: number
}

export interface discretionaryWindow {
    id: number,
    progCd: string,
    reference: string,
    description: string,
    title: string,
    launchDte: string | Date,
    deadlineTime: string | Date,
    totBdgt: number,
    contractStartDate: string | Date,
    contractEndDate: string | Date,
    activeYN: true,
    dteUpd: string | Date,
    usrUpd: number,
    dteCreated: string | Date
}

export interface activeWindowBodyRequest {
    organisationId: number;
    projectStatusID: number; // defaults to 9
    projectStatDte?: string | Date;
    projShortNam?: string;
    projectNam?: string;
    grantWindowId?: number;
    windowParamId: number; // refers to DG application/project id
    projectTypeId: number;
    submittedBy: number; // refers to userId
    submissionDte: string | Date;
    captureDte: string | Date;
    usrUpd: string; // refers to userId
    dteCreated: string | Date;
}
export interface DiscretionaryProjectDto {

    id: number;

    title: string;

    projectType: string;

    focusArea: string;

    subCategory: string;

    projectId: number;

    applicationId: number;

    organisationId: number;

    projectStatus: string;

    statusDate: string;

    endDate: string;

    shortName: string;

    fullName: string;

    submissionDate: string;

    sdlNumber: string;

    organisationName: string;

    sdfId: number;

    rsaId: number | string;

    windowId: number;

    projectTypeId: number;

    windowParamId: number;

    contractStartDate: string;

    contractEndDate: string;

    isLinked?: boolean;

}
export interface dgProject {
    applicationId: number;
    contractEndDate: string | null;
    contractStartDate: string | null;
    focusArea: string;
    id: number;
    organisationId: number;
    organisation_Name: string;
    projShortNam: string;
    projType: string;
    projectEndDate: string;
    projectId: number;
    projectNam: string;
    projectStatDte: string;
    projectStatus: string;
    projecttypeid: number;
    rsaId: string | null;
    sdfId: number;
    sdlNo: string;
    subCategory: string | null;
    submissionDte: string | null;
    title: string;
    windowId: number;
    winid: number;
    isLinked?: boolean;
}

export interface GCStatus {
    applicationId: number;
    approvalTypeId: number;
    approvalStatusId: number;
    comments: string | null;
    dateCreated: string;
    userId: number;
    dteUpd: string | null;
    userUpd: string | null;
    id: number;
}

export interface ProjectDetail {
    id: number;
    projectType: string;
    projectId: number;
    applicationStatusId: number | null;
    contract_Number: string | null;
    submittedBy: string | null;
    submissionDte: string | null;
    current_Approver: string | null;
    reason: string | null;
    approvalStatus: string | null;
    focusArea: string;
    subCategory: string;
    intervention: string;
    otherIntervention: string | null;
    number_Continuing: number;
    number_New: number;
    costPerLearner: number;
    gC_Continuing: number | null;
    gC_New: number | null;
    gC_CostPerLearner: number | null;
    hdi: number;
    female: number;
    youth: number;
    number_Disabled: number;
    rural: number;
    province: string;
    municipality: string;
    status: string;
    organisationId: number;
    gcStatus: GCStatus | null;
    dateCreated: string;
}

export interface DGProjectDetailsAppItem {
    projectDetails: ProjectDetail;
}

export interface DGProjectDetailsAppResponse {
    result: {
        totalCount: number;
        items: DGProjectDetailsAppItem[];
    };
    targetUrl: string | null;
    success: boolean;
    error: string | null;
    unAuthorizedRequest: boolean;
    __abp: boolean;
}