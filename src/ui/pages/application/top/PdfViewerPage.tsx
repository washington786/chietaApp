import React, { useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform
} from "react-native";
import WebView from "react-native-webview";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { showToast } from "@/core";
import { RLoaderAnimation, SafeArea } from "@/components/common";
import { MandatoryGrantPaymentDto } from "@/core/models/MandatoryDto";
import usePageTransition from "@/hooks/navigation/usePageTransition";
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
        <View style={styles.center}>
          <Text>No payment data available</Text>
        </View>
      </SafeArea>
    );
  }

  const year = payment.grantYear;
  const monthName = new Date(0, payment.month - 1).toLocaleString("en-US", { month: "long" });

  // ────────────────────────────────────────────────
  // HTML Content (slightly refined for beauty)
  // ────────────────────────────────────────────────
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin:0; padding:0; background:#f8f9fc; color:#1f2937; }
        .container { max-width: 900px; margin: 0 auto; padding: 24px; background: white; min-height: 100vh; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .header { text-align: center; padding-bottom: 32px; border-bottom: 1px solid #e5e7eb; }
        .logo { width: 180px; height: auto; }
        h1 { color: #311240; font-size: 22px; margin: 16px 0 8px; font-weight: 700; }
        .period { font-size: 17px; color: #4b5563; }
        .section-title { background: #311240; color: white; padding: 12px 16px; font-size: 15px; font-weight: 600; text-transform: uppercase; border-radius: 8px 8px 0 0; margin: 32px 0 0; }
        table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; overflow: hidden; }
        th, td { padding: 16px; text-align: left; border-bottom: 1px solid #f3f4f6; }
        th { background: #311240; color: white; font-weight: 600; width: 40%; }
        .amount { font-size: 24px; font-weight: 700; color: #dc2626; }
        .footer { margin-top: 60px; text-align: center; font-size: 13px; color: #6b7280; line-height: 1.6; border-top: 1px solid #e5e7eb; padding-top: 24px; }
        .highlight { color: #311240; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://chieta.org.za/wp-content/uploads/elementor/thumbs/logo_simple-pca818lqybtltygvjdikuoo5hdq0b78vbrbkd3axog.png" alt="CHIETA" class="logo" />
          <h1>Mandatory Grant Payment Statement</h1>
          <div class="period">${monthName} ${year}</div>
        </div>

        <div class="section-title">Payment Details</div>
        <table>
          <tr><th>Organisation</th><td>${payment.orgName_Code || '—'}</td></tr>
          <tr><th>SDL Number</th><td>${payment.sdL_Number || '—'}</td></tr>
          <tr><th>Bank Name</th><td>${payment.banK_NAME || 'unknown'}</td></tr>
          <tr><th>Bank Account Number</th><td>${payment.bank_Account_NUmber || '—'}</td></tr>
          <tr><th>Bank Code</th><td>${payment.bank_Account_Code || '—'}</td></tr>
          <tr><th>Levy Amount</th><td>R${payment.levyAmount?.toFixed(2) || '0.00'}</td></tr>
          <tr><th>Amount</th><td class="amount">R${payment.amount?.toFixed(2) || '0.00'}</td></tr>
        </table>

        <div class="footer">
          <strong class="highlight">Chemical Industries Education & Training Authority (CHIETA)</strong><br/>
          Tel: 011 628 7000 | Email: <a href="mailto:info@chieta.org.za">info@chieta.org.za</a><br/>
          <a href="https://www.chieta.org.za">www.chieta.org.za</a><br/><br/>
          Issued in compliance with the Skills Development Act.
        </div>
      </div>
    </body>
    </html>
  `;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const downloadPdf = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const filename = `CHIETA_Mandatory_Grant_${monthName}-${year}.pdf`;

      await Sharing.shareAsync(uri, {
        dialogTitle: `Share ${filename}`,
        UTI: '.pdf',
        mimeType: 'application/pdf',
      });
    } catch (err) {
      console.error(err);
      showToast({ message: 'Failed to prepare file', type: 'error', title: "Error", position: "top" });
    }
  };

  return (
    <SafeArea>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={onBack} hitSlop={16}>
          <Ionicons name="close" size={28} color="#1f2937" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {monthName} {year}
        </Text>

        <TouchableOpacity
          onPress={downloadPdf}
          hitSlop={16}
          style={styles.downloadButton}
        >
          <MaterialCommunityIcons
            name="download-circle"
            size={28}
            color={colors.primary[700] || '#6d28d9'}
          />
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <WebView
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        showsVerticalScrollIndicator={false}
        renderLoading={() => (
          <View style={styles.loader}>
            <RLoaderAnimation />
            <Text style={styles.loaderText}>Preparing statement...</Text>
          </View>
        )}
      />
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  downloadButton: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: 'rgba(109, 40, 217, 0.08)',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loaderText: {
    fontSize: 15,
    color: '#4b5563',
    marginTop: 12,
  },
});

export default PdfViewerPage;