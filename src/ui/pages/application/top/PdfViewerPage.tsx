import React, { useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
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

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n?: number | null) =>
  n != null
    ? `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "R 0.00";

const maskAccount = (acc?: string | null) => {
  if (!acc || acc.length <= 4) return acc || "—";
  return "•".repeat(acc.length - 4) + acc.slice(-4);
};

const refId = (id: number) => `CHIETA-MG-${String(id).padStart(8, "0")}`;

// ─── Component ───────────────────────────────────────────────────────────────
const PdfViewerPage = ({ route, navigation }: Props) => {
  const { onBack } = usePageTransition();
  const payment = route?.params?.payment;

  if (!payment) {
    return (
      <SafeArea>
        <View style={styles.center}>
          <Text style={styles.emptyText}>No payment data available.</Text>
        </View>
      </SafeArea>
    );
  }

  const year = payment.grantYear;
  const monthName = new Date(0, payment.month - 1).toLocaleString("en-ZA", { month: "long" });
  const issueDate = new Date().toLocaleDateString("en-ZA", { day: "2-digit", month: "long", year: "numeric" });
  const bankName = payment.banK_NAME && payment.banK_NAME.trim() ? payment.banK_NAME.trim() : "Not on record";
  const orgName = payment.organisation_Name || payment.orgName_Code || "—";
  const reference = refId(payment.id ?? 0);

  // ────────────────────────────────────────────────────────────────────────────
  // Professional bank payment statement HTML
  // ────────────────────────────────────────────────────────────────────────────
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Payment Statement – ${monthName} ${year}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #eef0f5;
      color: #1a1a2e;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── Paper ── */
    .page {
      max-width: 820px;
      margin: 24px auto;
      background: #ffffff;
      border-radius: 4px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      overflow: hidden;
    }

    /* ── Letterhead ── */
    .letterhead {
      background: linear-gradient(135deg, #2b0f3e 0%, #4a1a6b 60%, #311240 100%);
      padding: 32px 40px 28px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
      overflow: hidden;
    }
    .letterhead::after {
      content: "";
      position: absolute;
      right: -60px;
      top: -60px;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
    }
    .letterhead-left { flex: 1; }
    .lh-logo { height: 52px; width: auto; filter: brightness(0) invert(1); margin-bottom: 12px; }
    .lh-issuer { color: rgba(255,255,255,0.9); font-size: 13px; line-height: 1.5; }
    .lh-issuer strong { color: #fff; font-size: 14px; display: block; margin-bottom: 2px; }
    .letterhead-right { text-align: right; }
    .doc-label {
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 6px;
      padding: 10px 18px;
      color: #fff;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 8px;
      display: inline-block;
    }
    .doc-ref { color: rgba(255,255,255,0.7); font-size: 12px; margin-bottom: 4px; }
    .doc-ref span { color: #fff; font-weight: 600; }
    .doc-date { color: rgba(255,255,255,0.7); font-size: 12px; }
    .doc-date span { color: #fff; }

    /* ── Status ribbon ── */
    .status-bar {
      background: #f0fdf4;
      border-top: 3px solid #16a34a;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 40px;
    }
    .status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .badge-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: #16a34a;
      box-shadow: 0 0 0 3px rgba(22,163,74,0.2);
    }
    .badge-text { color: #15803d; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
    .period-chip {
      background: #311240;
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      padding: 5px 16px;
      border-radius: 20px;
    }

    /* ── Body ── */
    .body { padding: 32px 36px 24px; }

    /* ── Transaction meta strip ── */
    .meta-strip {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #e0e7ff;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 28px;
      background: #f5f7ff;
    }
    .meta-strip td {
      padding: 14px 20px;
      text-align: center;
      vertical-align: middle;
      border-right: 1px solid #e0e7ff;
      width: 33.33%;
    }
    .meta-strip td:last-child { border-right: none; }
    .meta-lbl {
      font-size: 10px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      font-weight: 700;
      display: block;
      margin-bottom: 5px;
    }
    .meta-val {
      font-size: 13px;
      color: #111827;
      font-weight: 700;
    }
    .meta-val.highlight {
      color: #311240;
      font-size: 12px;
      font-weight: 700;
      background: #ede9fe;
      padding: 3px 10px;
      border-radius: 20px;
      display: inline-block;
    }

    /* ── Section label ── */
    .sec-label {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #9ca3af;
      border-left: 3px solid #311240;
      padding-left: 10px;
      margin-bottom: 14px;
      margin-top: 28px;
    }

    /* ── Transfer flow table ── */
    .flow-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin-bottom: 28px;
    }
    .flow-from, .flow-to {
      width: 44%;
      padding: 20px 22px;
      vertical-align: top;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      background: #fafafa;
    }
    .flow-from { border-left: 4px solid #311240; }
    .flow-to   { border-left: 4px solid #0284c7; }
    .flow-middle {
      width: 12%;
      text-align: center;
      vertical-align: middle;
      padding: 0 8px;
    }
    .flow-role {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 7px;
    }
    .flow-from .flow-role { color: #7c3aed; }
    .flow-to   .flow-role { color: #0284c7; }
    .flow-name {
      font-size: 15px;
      font-weight: 800;
      color: #111827;
      margin-bottom: 8px;
      line-height: 1.3;
    }
    .flow-meta-row {
      font-size: 11px;
      color: #6b7280;
      line-height: 1.9;
    }
    .flow-meta-key { font-weight: 600; color: #9ca3af; margin-right: 4px; }
    .arrow-wrap { text-align: center; }
    .arrow-line {
      width: 2px;
      height: 28px;
      background: #d1d5db;
      margin: 0 auto 4px;
    }
    .arrow-head {
      width: 0; height: 0;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-top: 10px solid #311240;
      margin: 0 auto 6px;
    }
    .arrow-amt {
      font-size: 11px;
      font-weight: 800;
      color: #311240;
      letter-spacing: 0.3px;
      background: #ede9fe;
      border-radius: 12px;
      padding: 3px 8px;
      white-space: nowrap;
    }

    /* ── Statement details table ── */
    .stmt-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
    }
    .stmt-table tr:nth-child(odd)  { background: #ffffff; }
    .stmt-table tr:nth-child(even) { background: #f9fafb; }
    .stmt-table tr:last-child td   { border-bottom: none; }
    .stmt-table td {
      padding: 13px 18px;
      border-bottom: 1px solid #f3f4f6;
      vertical-align: middle;
    }
    .stmt-key {
      width: 44%;
      font-size: 11px;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stmt-val {
      font-size: 13px;
      color: #111827;
      font-weight: 600;
    }
    .stmt-val .chip {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      color: #0369a1;
      font-size: 12px;
      font-weight: 700;
      padding: 2px 10px;
      border-radius: 12px;
    }

    /* ── Amount card ── */
    .amount-card {
      background: linear-gradient(135deg, #1e0833 0%, #3b1260 60%, #2d0f50 100%);
      border-radius: 14px;
      overflow: hidden;
      margin-bottom: 28px;
      position: relative;
    }
    .amount-card::before {
      content: "";
      position: absolute;
      left: -50px; top: -50px;
      width: 180px; height: 180px;
      border-radius: 50%;
      background: rgba(255,255,255,0.03);
    }
    .amount-card::after {
      content: "";
      position: absolute;
      right: -40px; bottom: -40px;
      width: 150px; height: 150px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
    }
    .amount-inner {
      position: relative;
      z-index: 1;
    }
    .amount-top {
      padding: 20px 28px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .amount-top-lbl {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.5);
      margin-bottom: 6px;
    }
    .amount-top-val {
      font-size: 16px;
      font-weight: 600;
      color: rgba(255,255,255,0.78);
    }
    .amount-bottom {
      padding: 20px 28px 22px;
      display: table;
      width: 100%;
    }
    .amount-bottom-left { display: table-cell; vertical-align: middle; }
    .amount-bottom-right { display: table-cell; vertical-align: middle; text-align: right; }
    .grant-lbl {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.55);
      margin-bottom: 6px;
    }
    .grant-figure {
      font-size: 30px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -1px;
      line-height: 1;
    }
    .paid-stamp {
      display: inline-block;
      border: 3px solid rgba(74,222,128,0.7);
      border-radius: 8px;
      padding: 6px 16px;
      color: rgba(74,222,128,0.85);
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 5px;
      text-transform: uppercase;
      transform: rotate(-8deg);
    }

    /* ── Banking section ── */
    .bank-outer {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 28px;
    }
    .bank-titlebar {
      background: linear-gradient(90deg, #0c4a6e 0%, #0284c7 100%);
      padding: 13px 20px;
    }
    .bank-title-text {
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .bank-body {
      width: 100%;
      border-collapse: collapse;
    }
    .bank-body tr:nth-child(odd)  { background: #fff; }
    .bank-body tr:nth-child(even) { background: #f0f9ff; }
    .bank-body tr:last-child td { border-bottom: none; }
    .bank-body td {
      padding: 14px 20px;
      border-bottom: 1px solid #e5e7eb;
      vertical-align: middle;
    }
    .bank-key {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      width: 42%;
    }
    .bank-val {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
    }
    .bank-name-pill {
      display: inline-block;
      background: #dbeafe;
      color: #1e40af;
      border: 1px solid #93c5fd;
      font-size: 13px;
      font-weight: 700;
      padding: 4px 14px;
      border-radius: 20px;
    }
    .bank-acc-mono {
      font-family: "Courier New", Courier, monospace;
      font-size: 14px;
      color: #1e293b;
      letter-spacing: 2px;
    }

    /* ── Disclaimer band ── */
    .disclaimer {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 8px;
      font-size: 11px;
      color: #92400e;
      line-height: 1.6;
      text-align: center;
    }

    /* ── Footer ── */
    .doc-footer {
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      padding: 24px 40px;
      text-align: center;
    }
    .footer-logo { color: #311240; font-size: 14px; font-weight: 700; margin-bottom: 6px; }
    .footer-details { font-size: 12px; color: #6b7280; line-height: 1.7; }
    .footer-details a { color: #311240; text-decoration: none; }
    .footer-note { margin-top: 14px; font-size: 11px; color: #9ca3af; font-style: italic; }

    .watermark {
      position: fixed;
      opacity: 0.035;
      font-size: 100px;
      font-weight: 900;
      color: #311240;
      transform: rotate(-28deg);
      left: 8%;
      top: 38%;
      pointer-events: none;
      letter-spacing: 6px;
    }
  </style>
</head>
<body>
  <div class="watermark">PAID</div>
  <div class="page">

    <!-- ── Letterhead ── -->
    <div class="letterhead">
      <div class="letterhead-left">
        <img src="https://chieta.org.za/wp-content/uploads/elementor/thumbs/logo_simple-pca818lqybtltygvjdikuoo5hdq0b78vbrbkd3axog.png" alt="CHIETA" class="lh-logo"/>
        <div class="lh-issuer">
          <strong>Chemical Industries Education &amp; Training Authority</strong>
          Tel: 011 628 7000 &nbsp;|&nbsp; info@chieta.org.za &nbsp;|&nbsp; www.chieta.org.za
        </div>
      </div>
      <div class="letterhead-right">
        <div class="doc-label">Payment Statement</div>
        <div class="doc-ref">Reference: <span>${reference}</span></div>
        <div class="doc-date">Issued: <span>${issueDate}</span></div>
      </div>
    </div>

    <!-- ── Status bar ── -->
    <div class="status-bar">
      <div class="status-badge">
        <div class="badge-dot"></div>
        <span class="badge-text">Payment Confirmed</span>
      </div>
      <div class="period-chip">${monthName} ${year}</div>
    </div>

    <!-- ══════════════════════════════════════════════════════════ -->
    <!--                        BODY                               -->
    <!-- ══════════════════════════════════════════════════════════ -->
    <div class="body">

      <!-- ③ Statement Details -->
      <div class="sec-label">Statement Details</div>
      <table class="stmt-table">
        <tr>
          <td class="stmt-key">Organisation Name</td>
          <td class="stmt-val">${orgName}</td>
        </tr>
        <tr>
          <td class="stmt-key">Organisation Code</td>
          <td class="stmt-val">${payment.orgName_Code || "—"}</td>
        </tr>
        <tr>
          <td class="stmt-key">SDL Number</td>
          <td class="stmt-val"><span class="chip">${payment.sdL_Number || "—"}</span></td>
        </tr>
        <tr>
          <td class="stmt-key">Grant Year</td>
          <td class="stmt-val">${year}</td>
        </tr>
        <tr>
          <td class="stmt-key">Payment Period</td>
          <td class="stmt-val">${monthName} ${year}</td>
        </tr>
        <tr>
          <td class="stmt-key">Date Issued</td>
          <td class="stmt-val">${issueDate}</td>
        </tr>
        <tr>
          <td class="stmt-key">Document Reference</td>
          <td class="stmt-val">${reference}</td>
        </tr>
      </table>

      <!-- ④ Amount Card -->
      <div class="sec-label">Amount Summary</div>
      <div class="amount-card">
        <div class="amount-inner">
          <div class="amount-top">
            <div class="amount-top-lbl">Levy Contribution Received</div>
            <div class="amount-top-val">${fmt(payment.levyAmount)}</div>
          </div>
          <div class="amount-bottom">
            <div class="amount-bottom-left">
              <div class="grant-lbl">Mandatory Grant Amount Paid</div>
              <div class="grant-figure">${fmt(payment.amount)}</div>
            </div>
            <div class="amount-bottom-right">
              <div class="paid-stamp">PAID</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ⑤ Banking Details -->
      <div class="sec-label">Beneficiary Banking Details</div>
      <div class="bank-outer">
        <div class="bank-titlebar">
          <span class="bank-title-text">Bank Account Information — Recipient</span>
        </div>
        <table class="bank-body">
          <tr>
            <td class="bank-key">Bank Name</td>
            <td class="bank-val"><span class="bank-name-pill">${bankName}</span></td>
          </tr>
          <tr>
            <td class="bank-key">Account Number</td>
            <td class="bank-val"><span class="bank-acc-mono">${maskAccount(payment.bank_Account_NUmber)}</span></td>
          </tr>
          <tr>
            <td class="bank-key">Branch Code</td>
            <td class="bank-val">${payment.bank_Account_Code || "—"}</td>
          </tr>
        </table>
      </div>

      <!-- ⑥ Disclaimer -->
      <div class="disclaimer">
        This document serves as official proof of mandatory grant payment issued by CHIETA.
        Please retain for your records. For queries, contact CHIETA at
        <strong>011 628 7000</strong> or <strong>info@chieta.org.za</strong>.
      </div>

    </div><!-- /body -->

    <!-- ── Footer ── -->
    <div class="doc-footer">
      <div class="footer-logo">Chemical Industries Education &amp; Training Authority (CHIETA)</div>
      <div class="footer-details">
        Private Bag X105, Bryanston, 2021 &nbsp;|&nbsp; Tel: 011 628 7000<br/>
        <a href="mailto:info@chieta.org.za">info@chieta.org.za</a> &nbsp;|&nbsp;
        <a href="https://www.chieta.org.za">www.chieta.org.za</a>
      </div>
      <div class="footer-note">
        This statement is issued in compliance with the Skills Development Act, No. 97 of 1998
        and the Skills Development Levies Act, No. 9 of 1999. This is a system-generated document.
      </div>
    </div>

  </div>
</body>
</html>`;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const downloadPdf = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const filename = `CHIETA_Grant_Statement_${monthName}-${year}.pdf`;
      await Sharing.shareAsync(uri, {
        dialogTitle: `Share ${filename}`,
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    } catch (err) {
      console.error("PDF export error:", err);
      showToast({ message: "Failed to export statement", type: "error", title: "Error", position: "top" });
    }
  };

  return (
    <SafeArea>
      {/* ── Header Bar ── */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={onBack} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color="#1f2937" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Payment Statement
          </Text>
          <Text style={styles.headerSub}>{monthName} {year}</Text>
        </View>

        <TouchableOpacity onPress={downloadPdf} hitSlop={12} style={styles.downloadBtn}>
          <MaterialCommunityIcons name="export-variant" size={20} color={colors.primary[600] ?? "#5b21b6"} />
          <Text style={styles.downloadText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* ── Statement WebView ── */}
      <WebView
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
        startInLoadingState
        showsVerticalScrollIndicator={false}
        renderLoading={() => (
          <View style={styles.loader}>
            <RLoaderAnimation />
            <Text style={styles.loaderText}>Preparing statement…</Text>
          </View>
        )}
      />
    </SafeArea>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    zIndex: 10,
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 19,
  },
  headerSub: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#f3e8ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  downloadText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5b21b6",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loaderText: {
    fontSize: 15,
    color: "#4b5563",
    marginTop: 8,
  },
});

export default PdfViewerPage;