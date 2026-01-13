export interface ApplicationForm {
  reference: string;
  projectType: string;

  organisation: {
    organisationName: string;
    tradingName: string;
    coreBusiness: string;
    province: string;
    municipality: string;
    beeStatus: string;

    phoneNumber: string;
    faxNumber: string;
    email: string;
  };

  ceo: {
    firstName: string;
    surname: string;
    email: string;
    race: string;
    gender: string;
  };

  cfo: {
    firstName: string;
    surname: string;
    email: string;
    race: string;
    gender: string;
  };

  sdf: {
    firstName: string;
    surname: string;
    role: string;
    race: string;
    gender: string;
    phone: string;
    mobile: string;
    email: string;
  };

  gms: {
    learningProgramme: string;
    subCategory: string;
    intervention: string;
    cost: string;
  };

  checklist: {
    csdOrSarsPin: string;
    companyRegistration: string;
    beeCertificate: string;
    letterOfCommitment: string;
    proofOfAccreditation: string;
    declarationOfInterest: string;
    proofOfBanking: string;
    workplaceApproval: string;
    researchExportsQuestionnaire: string;
  };

  signOff: {
    ceoName: string;
    ceoDate: string;
    cfoName: string;
    cfoDate: string;
  };

  generatedDate: string;
}
