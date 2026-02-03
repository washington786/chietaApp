import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { renderApplicationHtml } from "./formTemplate";
import { ApplicationForm } from "../types/types";
import { grantsApprovedTemplate, GrantsApprovedTemplateParams, grantsRejectedTemplate, GrantsRejectedTemplateParams } from "./grantsTemplate";

export const generateApplicationPdf = async (data: ApplicationForm) => {
  const html = renderApplicationHtml(data);

  // generate PDF
  const { uri } = await Print.printToFileAsync({
    html,
  });

  // optional: share file
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri);
  }

  return uri;
};
export const generateEvaluationApprovalPdf = async (data: GrantsApprovedTemplateParams) => {
  const html = grantsApprovedTemplate(data);

  // generate PDF
  const { uri } = await Print.printToFileAsync({
    html,
  });

  // optional: share file
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri);
  }

  return uri;
};
export const generateEvaluationRejectPdf = async (data: GrantsRejectedTemplateParams) => {
  const html = grantsRejectedTemplate(data);

  // generate PDF
  const { uri } = await Print.printToFileAsync({
    html,
  });

  // optional: share file
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri);
  }

  return uri;
};
