import React, { useLayoutEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import WebView from "react-native-webview";
import { Directory, Paths, File } from "expo-file-system";
import { RLoaderAnimation, RRow, SafeArea } from "@/components/common";
import { MandatoryGrantPaymentDto } from "@/core/models/MandatoryDto";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { showToast } from "@/core";
import Ionicons from "@expo/vector-icons/Ionicons";
import usePageTransition from "@/hooks/navigation/usePageTransition";
import { Text } from "react-native-paper";
import colors from "@/config/colors";

interface Props {
  route: { params: { payment: MandatoryGrantPaymentDto } };
  navigation: any;
}

const PdfViewerPage = ({ route, navigation }: Props) => {
  const { onBack } = usePageTransition();
  const payment = route?.params?.payment;

  if (!payment) {
    return (
      <SafeArea>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text variant="titleMedium">No payment data available</Text>
        </View>
      </SafeArea>
    );
  }

  const year = payment.grantYear;
  const monthName = new Date(0, payment.month - 1).toLocaleString("en-US", {
    month: "long",
  });

  // Generate simple but nice-looking HTML PDF
  const htmlContent = `
    <!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: "Helvetica Neue", Arial, sans-serif;
        padding: 20px 5px;
        background: #ffffff;
        color: #333;
        line-height: 1.6;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        background-color: #f9f9f9;
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
      }
      .header {
        text-align: center;
        margin-bottom: 40px;
      }
      .logo {
        width: 180px;
        height: auto;
        margin-bottom: 20px;
      }
      h1 {
        color: #311240;
        font-size: 18px;
        margin: 0;
      }
      .period {
        font-size: 18px;
        color: #311240;
        margin: 10px 0;
      }
      .section-title {
        font-size: 14px;
        font-weight: bold;
        text-transform: uppercase;
        margin: 30px 0 10px;
        background-color: #311240;
        color: white;
        padding: 8px 12px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }
      th,
      td {
        padding: 14px 16px;
        text-align: left;
        border-bottom: 1px solid #eee;
      }
      th {
        background-color: #311240;
        color: white;
        font-weight: 600;
      }
      .amount {
        font-size: 28px;
        font-weight: bold;
        color: #311240;
        text-align: left;
      }
      .footer {
        margin-top: 80px;
        padding-top: 30px;
        border-top: 1px solid #ddd;
        text-align: center;
        font-size: 12px;
        color: #666;
      }
      .footer a {
        color: #311240;
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }
      .contact {
        margin: 10px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img
          src="https://chieta.org.za/wp-content/uploads/elementor/thumbs/logo_simple-pca818lqybtltygvjdikuoo5hdq0b78vbrbkd3axog.png"
          alt="CHIETA Logo"
          class="logo"
        />
        <h1>Mandatory Grant Payment Statement</h1>
        <div class="period">${monthName} ${year}</div>
      </div>

      <div class="section-title">Payment Details</div>
      <table>
        <tr>
          <th>Organisation</th>
          <td>${payment.orgName_Code}</td>
        </tr>
        <tr>
          <th>SDL Number</th>
          <td>${payment.sdL_Number}</td>
        </tr>
        <tr>
          <th>Bank Name</th>
          <td>${payment.banK_NAME}</td>
        </tr>
        <tr>
          <th>Bank Account Number</th>
          <td>${payment.bank_Account_NUmber}</td>
        </tr>
        <tr>
          <th>Bank Code</th>
          <td>${payment.bank_Account_Code}</td>
        </tr>
        <tr>
          <th>Levy Amt</th>
          <td>-R${payment.levyAmount.toFixed(2)}</td>
        </tr>
        <tr>
          <th>Amount</th>
          <td class="amount">-R${payment.amount.toFixed(2)}</td>
        </tr>
      </table>

      <div class="footer">
        <strong
          >Chemical Industries Education & Training Authority (CHIETA)</strong
        ><br />
        <div class="contact">
          Tel: 011 628 7000 / 087 357 6608 | Email:
          <a href="mailto:info@chieta.org.za">info@chieta.org.za</a><br />
          Website:
          <a href="https://www.chieta.org.za" target="_blank"
            >www.chieta.org.za</a
          >
        </div>
        <br />
        This statement is issued in compliance with the Skills Development
        Act.<br />
        We respect your privacy in accordance with the POPI Act. For our Privacy
        Notice and PAIA Manual, visit our website.
      </div>
    </div>
  </body>
</html>

  `;

  useLayoutEffect(() => {
    navigation.setOptions({ title: `${monthName} ${year}` });
  }, [navigation]);

  const downloadPdf = async () => {
    try {
      // 1. Generate PDF from HTML
      const { uri: tempUri } = await Print.printToFileAsync({ html: htmlContent });

      // 2. Define destination using modern API
      const filename = `${monthName}-${year}-Payment.pdf`;
      const documentsDir = new Directory(Paths.document);
      const destFile = new File(documentsDir, filename);

      // 3. Move file using modern API
      const sourceFile = new File(tempUri);
      await sourceFile.move(destFile);

      // 4. Share the file
      await Sharing.shareAsync(destFile.uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
      });
    } catch (err) {
      console.error('PDF error:', err);
      showToast({
        message: 'Could not generate PDF',
        title: 'Error',
        type: 'error',
        position: 'top',
      });
    }
  };

  return (
    <SafeArea>
      <RRow
        style={{
          alignItems: "flex-end",
          justifyContent: "flex-end",
          paddingHorizontal: 12,
        }}
      >
        <Ionicons name="close" size={24} color="black" onPress={onBack} />
      </RRow>
      <WebView
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        showsVerticalScrollIndicator={false}
        renderLoading={() => (
          <View style={styles.loader}>
            <RLoaderAnimation />
            <Text variant="bodySmall" style={{ alignSelf: "center" }}>
              loading statement...
            </Text>
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={downloadPdf}>
          <RRow
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.primary[900],
              paddingVertical: 8,
              borderRadius: 10,
              gap: 6,
            }}
          >
            <Ionicons name="download" size={30} color="white" />
            <Text variant="titleMedium" style={{ color: "white" }}>
              download file
            </Text>
          </RRow>
        </TouchableOpacity>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  buttonContainer: {
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  btn: {},
});

export default PdfViewerPage;
