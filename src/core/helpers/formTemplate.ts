import { ApplicationForm } from "../types/types";


export const renderApplicationHtml = (data: ApplicationForm): string => {
  const docId = data.reference.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 14);

  const gmsRows = Array.isArray(data.gms) && data.gms.length > 0
    ? data.gms.map((entry) => {
        const cost = entry.cost && entry.cost !== '—'
          ? 'R\u00a0' + (parseFloat(entry.cost) || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          : '—';
        return `<tr>
          <td>${entry.learningProgramme || '—'}</td>
          <td>${entry.subCategory || '—'}</td>
          <td>${entry.intervention || '—'}</td>
          <td>${cost}</td>
        </tr>`;
      }).join('')
    : '<tr><td colspan="4" style="text-align:center;color:#999;padding:10px;">No GMS entries recorded</td></tr>';

  const checklistItems: [string, string][] = [
    ['Central Supplier Database / SARS PIN',  data.checklist.csdOrSarsPin],
    ['Company Registration',                  data.checklist.companyRegistration],
    ['Copy of BEE Certificate / Affidavit',   data.checklist.beeCertificate],
    ['Letter of Commitment',                  data.checklist.letterOfCommitment],
    ['Proof of Accreditation',                data.checklist.proofOfAccreditation],
    ['Declaration of Interest',               data.checklist.declarationOfInterest],
    ['Proof of Banking Details',              data.checklist.proofOfBanking],
    ['Proof of Workplace Approval',           data.checklist.workplaceApproval],
    ['Research Exports Questionnaire',        data.checklist.researchExportsQuestionnaire],
  ];

  const checklistRows = checklistItems.map(([label, val]) => {
    const isYes = val === 'Yes';
    const statusHtml = isYes
      ? '<span class="status-ok">&#10003; Complete</span>'
      : '<span class="status-pending">&#10007; Pending</span>';
    return `<tr>
      <td>${label}</td>
      <td style="text-align:center;">${val}</td>
      <td style="text-align:center;">${statusHtml}</td>
    </tr>`;
  }).join('');

  const ceoDate = new Date(data.signOff.ceoDate).toLocaleDateString('en-ZA');
  const cfoDate = new Date(data.signOff.cfoDate).toLocaleDateString('en-ZA');
  const genDate = new Date(data.generatedDate).toLocaleDateString('en-ZA');
  const genTime = new Date(data.generatedDate).toLocaleTimeString('en-ZA');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<style>
  :root {
    color-scheme: light only;
    forced-color-adjust: none;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    font-size: 11px;
  }

  @page {
    size: A4;
    margin: 14mm 12mm 18mm 12mm;
  }

  html, body {
    width: 100%;
    height: auto;
    background: #ffffff !important;
    background-color: #ffffff !important;
    color: #2c2c2c !important;
    line-height: 1.4;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .form-wrapper {
    width: 100%;
    max-width: 210mm;
    background: #ffffff !important;
    background-color: #ffffff !important;
    color: #2c2c2c;
    overflow: visible;
  }

  /* ── Watermark: position:fixed repeats on every PDF page ── */
  .watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 72px;
    font-weight: bold;
    color: rgba(60, 27, 80, 0.055);
    white-space: nowrap;
    letter-spacing: 8px;
    text-transform: uppercase;
    pointer-events: none;
    z-index: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .watermark-pattern {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: repeating-linear-gradient(
      135deg,
      transparent,
      transparent 40px,
      rgba(60, 27, 80, 0.022) 40px,
      rgba(60, 27, 80, 0.022) 41px
    );
    pointer-events: none;
    z-index: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ── Verification badge: fixed top-right on every page ── */
  .verification-badge {
    position: fixed;
    top: 8px;
    right: 8px;
    background: linear-gradient(135deg, #3c1b50, #c98a1c);
    color: #ffffff;
    padding: 5px 11px;
    border-radius: 12px;
    font-size: 8px;
    font-weight: bold;
    text-align: center;
    z-index: 100;
    line-height: 1.4;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .badge-id {
    display: block;
    font-family: monospace;
    font-size: 7px;
    margin-top: 2px;
    letter-spacing: 1px;
    opacity: 0.9;
    color: #ffffff;
  }

  /* ── Header ── */
  .header {
    text-align: center;
    padding-bottom: 14px;
    border-bottom: 2px solid #3c1b50;
    margin-bottom: 16px;
    position: relative;
    z-index: 5;
    background: #ffffff;
  }

  .header img {
    max-width: 180px;
    margin-bottom: 8px;
  }

  .doc-title {
    color: #3c1b50;
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 4px;
    letter-spacing: 0.5px;
  }

  .doc-meta {
    font-size: 11px;
    font-weight: bold;
    color: #444444;
    margin-top: 3px;
  }

  /* ── Section & subsection titles ── */
  .section-title {
    background: #3c1b50;
    color: #ffffff;
    padding: 7px 12px;
    margin: 16px 0 8px 0;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    z-index: 5;
    page-break-after: avoid;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .subsection-title {
    background: #ede7f6;
    padding: 5px 10px;
    margin: 10px 0 6px 0;
    font-size: 10px;
    font-weight: bold;
    color: #3c1b50;
    position: relative;
    z-index: 5;
    page-break-after: avoid;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ── Tables ── */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 6px;
    position: relative;
    z-index: 5;
    background: #ffffff;
    page-break-inside: auto;
  }

  table th,
  table td {
    border: 1px solid #d0d0d0;
    padding: 6px 8px;
    text-align: left;
    vertical-align: top;
    font-size: 11px;
    background-color: inherit;
    color: #2c2c2c;
  }

  table th {
    background: #3c1b50;
    color: #ffffff;
    font-weight: bold;
    font-size: 10px;
    white-space: nowrap;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  table tr {
    background: #ffffff;
    page-break-inside: avoid;
  }

  table tr:nth-child(even) {
    background: #faf8fc;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  table td {
    background-color: inherit;
  }

  /* ── Notice/info boxes ── */
  .notice-box {
    background: #fff8e1;
    border-left: 4px solid #f9a825;
    padding: 8px 12px;
    margin: 8px 0;
    font-size: 10px;
    line-height: 1.5;
    color: #2c2c2c;
    position: relative;
    z-index: 5;
    page-break-inside: avoid;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .notice-box-blue {
    background: #eef2ff;
    border-left: 4px solid #3c1b50;
    padding: 8px 12px;
    margin: 8px 0;
    font-size: 10px;
    line-height: 1.5;
    color: #2c2c2c;
    position: relative;
    z-index: 5;
    page-break-inside: avoid;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .notice-box ul,
  .notice-box-blue ul {
    margin: 5px 0 0 16px;
    padding: 0;
  }

  .notice-box li,
  .notice-box-blue li {
    margin-bottom: 2px;
    color: #2c2c2c;
  }

  /* ── Signature section ── */
  .signature-section {
    border: 1.5px solid #3c1b50;
    border-radius: 3px;
    padding: 10px 12px;
    margin: 8px 0;
    background: #ffffff;
    page-break-inside: avoid;
    position: relative;
    z-index: 5;
  }

  .signature-line {
    border-bottom: 1px solid #555555;
    height: 30px;
    margin-top: 3px;
    background: #ffffff;
  }

  /* ── Checklist status ── */
  .status-ok {
    color: #2e7d32;
    font-weight: bold;
  }

  .status-pending {
    color: #c62828;
    font-weight: bold;
  }

  /* ── CHIETA offices footer ── */
  .footer-section {
    margin-top: 22px;
    padding-top: 10px;
    border-top: 2px solid #c98a1c;
    background: #ffffff;
    position: relative;
    z-index: 5;
    page-break-inside: avoid;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .footer-offices {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 8px;
    line-height: 1.4;
    color: #2c2c2c;
  }

  .office {
    flex: 1;
    padding-right: 6px;
    border-right: 1.5px solid #c98a1c;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .office:last-child {
    border-right: none;
    padding-right: 0;
  }

  .office-title {
    font-weight: bold;
    color: #3c1b50;
    font-size: 8px;
    margin-bottom: 2px;
  }

  .office-detail {
    font-size: 8px;
    color: #555555;
    margin-bottom: 1px;
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8px;
    padding-top: 6px;
    border-top: 1px solid #e0e0e0;
    color: #666666;
    line-height: 1.3;
    background: #ffffff;
  }

  .footer-social {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .social-link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    color: #555555;
    font-size: 8px;
    gap: 3px;
  }

  .social-icon {
    display: inline-block;
    width: 13px;
    height: 13px;
    vertical-align: middle;
  }

  .footer-antifraud {
    text-align: right;
    color: #c98a1c;
    font-weight: bold;
    font-size: 8px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .generated-by {
    text-align: center;
    color: #aaaaaa;
    font-size: 8px;
    margin-top: 8px;
    border-top: 1px solid #eeeeee;
    padding-top: 6px;
    background: #ffffff;
  }

  /* ── Print-specific optimizations ── */
  @media print {
    html, body {
      background: #ffffff !important;
      background-color: #ffffff !important;
      color: #2c2c2c !important;
      margin: 0;
      padding: 0;
      height: auto;
      overflow: visible;
    }
    .form-wrapper {
      margin: 0;
      padding: 0;
      overflow: visible;
    }
    .section-title {
      page-break-after: avoid;
    }
    .subsection-title {
      page-break-after: avoid;
    }
    .footer-section {
      page-break-inside: avoid;
    }
  }

  /* ── Force light mode even when system prefers dark ── */
  @media (prefers-color-scheme: dark) {
    html, body {
      background: #ffffff !important;
      background-color: #ffffff !important;
      color: #2c2c2c !important;
    }
    .form-wrapper {
      background: #ffffff !important;
      background-color: #ffffff !important;
      color: #2c2c2c !important;
    }
    table, table td, table tr {
      background-color: #ffffff !important;
      color: #2c2c2c !important;
    }
    table tr:nth-child(even) {
      background-color: #faf8fc !important;
    }
    table th {
      background-color: #3c1b50 !important;
      color: #ffffff !important;
    }
    .section-title {
      background-color: #3c1b50 !important;
      color: #ffffff !important;
    }
    .subsection-title {
      background-color: #ede7f6 !important;
      color: #3c1b50 !important;
    }
    .notice-box {
      background-color: #fff8e1 !important;
      color: #2c2c2c !important;
    }
    .notice-box-blue {
      background-color: #eef2ff !important;
      color: #2c2c2c !important;
    }
    .signature-section {
      background-color: #ffffff !important;
    }
    .header {
      background-color: #ffffff !important;
    }
    .footer-section, .footer-bottom {
      background-color: #ffffff !important;
      color: #666666 !important;
    }
    .generated-by {
      background-color: #ffffff !important;
    }
  }
</style>
</head>
<body>
<div class="form-wrapper">

<!-- Fixed watermark layer (repeats on every PDF page) -->
<div class="watermark">CHIETA OFFICIAL</div>
<div class="watermark-pattern"></div>

<!-- Verification badge (repeats on every PDF page) -->
<div class="verification-badge">
  OFFICIAL CHIETA DOCUMENT
  <span class="badge-id">ID: CHI-${docId}</span>
</div>

<!-- ── HEADER ── -->
<div class="header">
  <img src="https://chieta.org.za/wp-content/uploads/2024/11/logo_simple.png" alt="CHIETA Logo">
  <div class="doc-title">DISCRETIONARY GRANTS APPLICATION</div>
  <div class="doc-meta">Application Reference: ${data.reference}</div>
  <div class="doc-meta">Project Type: ${data.projectType}</div>
</div>

<!-- ── ORGANISATION INFORMATION ── -->
<div class="section-title">Organisation Information</div>
<table>
  <tr>
    <th>Organisation Name</th><td><strong>${data.organisation.organisationName}</strong></td>
    <th>Trading Name</th><td>${data.organisation.tradingName}</td>
  </tr>
  <tr>
    <th>Core Business</th><td>${data.organisation.coreBusiness}</td>
    <th>BEE Status</th><td>${data.organisation.beeStatus}</td>
  </tr>
  <tr>
    <th>Province</th><td>${data.organisation.province}</td>
    <th>Municipality</th><td>${data.organisation.municipality}</td>
  </tr>
</table>

<div class="subsection-title">Organisation Contact Details</div>
<table>
  <tr>
    <th>Phone Number</th><td>${data.organisation.phoneNumber}</td>
    <th>Fax Number</th><td>${data.organisation.faxNumber}</td>
  </tr>
  <tr>
    <th>Email Address</th><td colspan="3">${data.organisation.email}</td>
  </tr>
</table>

<!-- ── CEO ── -->
<div class="subsection-title">CEO Details</div>
<table>
  <tr>
    <th>First Name</th><td>${data.ceo.firstName}</td>
    <th>Surname</th><td>${data.ceo.surname}</td>
  </tr>
  <tr>
    <th>Email</th><td>${data.ceo.email}</td>
    <th>Race / Gender</th><td>${data.ceo.race} / ${data.ceo.gender}</td>
  </tr>
</table>

<!-- ── CFO ── -->
<div class="subsection-title">Senior Representative / CFO Details</div>
<table>
  <tr>
    <th>First Name</th><td>${data.cfo.firstName}</td>
    <th>Surname</th><td>${data.cfo.surname}</td>
  </tr>
  <tr>
    <th>Email</th><td>${data.cfo.email}</td>
    <th>Race / Gender</th><td>${data.cfo.race} / ${data.cfo.gender}</td>
  </tr>
</table>

<!-- ── SDF ── -->
<div class="section-title">SDF Contact Person</div>
<table>
  <tr>
    <th>First Name</th><td>${data.sdf.firstName}</td>
    <th>Surname</th><td>${data.sdf.surname}</td>
    <th>Role</th><td>${data.sdf.role}</td>
  </tr>
  <tr>
    <th>Race</th><td>${data.sdf.race}</td>
    <th>Gender</th><td>${data.sdf.gender}</td>
    <th>Mobile</th><td>${data.sdf.mobile}</td>
  </tr>
  <tr>
    <th>Phone</th><td>${data.sdf.phone}</td>
    <th>Email</th><td colspan="3">${data.sdf.email}</td>
  </tr>
</table>

<!-- ── GMS APPLICATIONS ── -->
<div class="section-title">Discretionary Grants Application Details</div>
<table>
  <thead>
    <tr>
      <th>Learning Programme</th>
      <th>Sub-Category</th>
      <th>Intervention</th>
      <th style="white-space:nowrap;">Cost per Learner (R)</th>
    </tr>
  </thead>
  <tbody>
    ${gmsRows}
  </tbody>
</table>
<div class="notice-box">
  <strong>Note:</strong> All applications are reviewed according to the CHIETA Grants Policy and related legislation.
  Approval is subject to available budget at the time of final review by the Governing Board.
</div>

<!-- ── FILE UPLOADS CHECKLIST ── -->
<div class="section-title">File Uploads Checklist</div>
<table>
  <thead>
    <tr>
      <th>Document</th>
      <th style="width:60px;text-align:center;">Uploaded</th>
      <th style="width:90px;text-align:center;">Status</th>
    </tr>
  </thead>
  <tbody>
    ${checklistRows}
  </tbody>
</table>
<div class="notice-box">
  <strong>Important:</strong> Ensure all pending documents are submitted before the application deadline.
  Incomplete applications may not be processed.
</div>

<!-- ── STAKEHOLDER SIGN-OFF ── -->
<div class="section-title">Stakeholder Sign-Off</div>
<div class="notice-box">
  All Applications are reviewed according to the CHIETA Grants Policy and related legislation.
  Award is subject to a budget being available at the time of final approval.
</div>

<div class="signature-section">
  <div class="subsection-title">Signature 1 – CEO / Senior Representative</div>
  <table>
    <tr><th>Name</th><td>${data.signOff.ceoName}</td></tr>
    <tr><th>Designation</th><td>CEO</td></tr>
    <tr><th>Signature</th><td><div class="signature-line"></div></td></tr>
    <tr><th>Date</th><td>${ceoDate}</td></tr>
  </table>

  <div class="subsection-title">Signature 2 – CFO / Authorised Representative</div>
  <table>
    <tr><th>Name</th><td>${data.signOff.cfoName}</td></tr>
    <tr><th>Designation</th><td>CFO / Authorised Representative</td></tr>
    <tr><th>Signature</th><td><div class="signature-line"></div></td></tr>
    <tr><th>Date</th><td>${cfoDate}</td></tr>
  </table>
</div>

<!-- ── DECLARATION ── -->
<div class="section-title">Declaration</div>
<div class="notice-box-blue">
  <strong>I hereby declare that:</strong>
  <ul>
    <li>All information provided in this application is true and accurate</li>
    <li>The organisation is compliant with all relevant legislation</li>
    <li>The organisation is up-to-date with all levy payments to SARS</li>
    <li>We understand that false information may result in application rejection</li>
    <li>We agree to comply with all CHIETA reporting requirements if awarded</li>
  </ul>
</div>

<div class="signature-section">
  <table>
    <tr>
      <th style="width:200px;">Skills Development Facilitator</th>
      <td>
        <div style="margin-bottom:4px;"><strong>Name:</strong> ${data.sdf.firstName} ${data.sdf.surname}</div>
        <div class="signature-line"></div>
        <div style="margin-top:4px;font-size:9px;color:#666;"><strong>Date:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      </td>
    </tr>
  </table>
</div>

<div class="notice-box">
  <strong>Submission Instructions:</strong>
  <ul>
    <li>Sign all pages where indicated</li>
    <li>Scan the complete document in PDF format</li>
    <li>Upload to the CHIETA Submission System</li>
    <li>Keep a copy for your records</li>
    <li>Ensure all pending documents are submitted before the deadline</li>
  </ul>
</div>

<!-- ── CHIETA OFFICE FOOTER ── -->
<div class="footer-section">
  <div class="footer-offices">
    <div class="office">
      <div class="office-title">HEAD OFFICE</div>
      <div class="office-detail">Tel: 011 628 7000</div>
      <div class="office-detail">Allandale Building, 9th Floor, Office B</div>
      <div class="office-detail">25 Magwa Crescent, Waterfall City, 2090</div>
    </div>
    <div class="office">
      <div class="office-title">WESTERN CAPE</div>
      <div class="office-detail">Tel: 021 551 1113/4</div>
      <div class="office-detail">Unit B2, Cnr Race Course &amp; Omuramba Roads</div>
      <div class="office-detail">Montague Gardens, 7441</div>
    </div>
    <div class="office">
      <div class="office-title">KWAZULU-NATAL</div>
      <div class="office-detail">Tel: 031 368 4040</div>
      <div class="office-detail">1 The Boulevard, Westway Office Park, Block D</div>
      <div class="office-detail">Westville, Durban, 3630</div>
    </div>
    <div class="office">
      <div class="office-title">PORT ELIZABETH</div>
      <div class="office-detail">Tel: 041 5096478</div>
      <div class="office-detail">Struanway Block E, New Brighton</div>
      <div class="office-detail">Port Elizabeth, 6001</div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-social">
      <a href="https://twitter.com/Chieteaa" class="social-link">
        <svg class="social-icon" viewBox="0 0 24 24" fill="#c98a1c" xmlns="http://www.w3.org/2000/svg"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
        @Chieteaa
      </a>
      <a href="https://www.facebook.com/chieta" class="social-link">
        <svg class="social-icon" viewBox="0 0 24 24" fill="#c98a1c" xmlns="http://www.w3.org/2000/svg"><path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z"/></svg>
        @CHIETA_SETA
      </a>
      <a href="https://www.instagram.com/chieta_sa" class="social-link">
        <svg class="social-icon" viewBox="0 0 24 24" fill="none" stroke="#c98a1c" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
        @Chieta_sa
      </a>
      <a href="https://www.chieta.org.za" class="social-link">
        <svg class="social-icon" viewBox="0 0 24 24" fill="#c98a1c" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93V18h2v1.93A8 8 0 0111 19.93zm2-15.86V4h-2V4.07A8 8 0 0113 4.07zM4.07 13H4v-2h.07A8 8 0 014.07 13zm15.86-2H20v2h-.07A8 8 0 0019.93 11z"/></svg>
        www.chieta.org.za
      </a>
    </div>
    <div class="footer-antifraud">
      Anti-Fraud Line: <span style="color:#1a1a1a;">0800 333 1201</span> | Toll Free: <span style="color:#1a1a1a;">0800 111 173</span>
    </div>
  </div>
</div>

<div class="generated-by">Generated by CHIETA IMS on ${genDate} at ${genTime}</div>

</div>
</body>
</html>`;
};
