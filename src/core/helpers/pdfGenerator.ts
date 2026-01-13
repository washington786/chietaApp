import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { renderApplicationHtml } from "./formTemplate";
import { ApplicationForm } from "../types/types";

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
