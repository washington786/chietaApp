import type { dgProject } from "@/core/models/DiscretionaryDto";
import { ApplicationForm } from "../types/types";
import { number } from "yup";

export const mapDgProjectToApplicationForm = (
  p: dgProject
): ApplicationForm => {
  return {
    reference: String(p.applicationId ?? p.projectId ?? ""),
    projectType: String(p.projType ?? ""),

    organisation: {
      organisationName: String(p.organisation_Name ?? ""),
      tradingName: String(p.projShortNam ?? ""),
      coreBusiness: "",
      province: "",
      municipality: "",
      beeStatus: "",
      phoneNumber: "",
      faxNumber: "",
      email: "",
    },

    ceo: {
      firstName: "",
      surname: "",
      email: "",
      race: "",
      gender: "",
    },

    cfo: {
      firstName: "",
      surname: "",
      email: "",
      race: "",
      gender: "",
    },

    sdf: {
      firstName: "",
      surname: "",
      role: "",
      race: "",
      gender: "",
      phone: "",
      mobile: "",
      email: "",
    },

    gms: {
      learningProgramme: String(p.projType ?? ""),
      subCategory: String(p.subCategory ?? ""),
      intervention: String(p.focusArea ?? ""),
      numberNew: number(p.numberNew ?? ""),
      numberContinuing: number(p.numberContinuing ?? ""),
      costPerLearner: number(p.costPerLearner ?? ""),
      totalCost: number(p.totalCost ?? ""),
    },

    checklist: {
      csdOrSarsPin: "",
      companyRegistration: "",
      beeCertificate: "",
      letterOfCommitment: "",
      proofOfAccreditation: "",
      declarationOfInterest: "",
      proofOfBanking: "",
      workplaceApproval: "",
      researchExportsQuestionnaire: "",
    },

    signOff: {
      ceoName: "",
      ceoDate: "",
      cfoName: "",
      cfoDate: "",
    },

    generatedDate: new Date().toISOString().split("T")[0],
  };
};
