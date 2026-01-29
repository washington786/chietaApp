import { ApplicationForm } from "../types/types";


export const renderApplicationHtml = (data: ApplicationForm) => `
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { 
    margin: 0; 
    padding: 0; 
    box-sizing: border-box; 
  }
  
  @page {
    size: A4;
    margin: 15mm 15mm 20mm 15mm;
    @bottom-right {
      content: "Page " counter(page) " of " counter(pages);
      font-size: 9pt;
      color: #999;
    }
  }

  html, body {
    width: 100%;
    height: 100%;
  }

  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
    color: #2c2c2c;
    line-height: 1.5;
    background: #fff;
  }

  .form-wrapper {
    width: 100%;
    background: white;
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0 25px 0;
    border-bottom: 3px solid #6a2d91;
    margin-bottom: 30px;
  }

  .header-logo {
    flex: 0 0 auto;
  }

  .header-logo img {
    height: 80px;
    width: auto;
  }

  .header-info {
    flex: 1;
    text-align: right;
  }

  .header-title {
    font-size: 24px;
    font-weight: 700;
    color: #6a2d91;
    margin-bottom: 8px;
  }

  .header-meta {
    font-size: 11px;
    color: #666;
    line-height: 1.6;
  }

  .meta-row {
    display: flex;
    justify-content: flex-end;
    gap: 20px;
    margin: 4px 0;
  }

  .meta-item {
    display: flex;
    gap: 6px;
  }

  .meta-label {
    font-weight: 600;
    color: #6a2d91;
  }

  /* Content Sections */
  .section {
    margin-bottom: 24px;
    page-break-inside: avoid;
  }

  .section-title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: white;
    background: #6a2d91;
    padding: 10px 14px;
    margin-bottom: 14px;
    border-radius: 3px;
  }

  /* Info Grid */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  .info-item {
    padding: 10px 12px;
    border-right: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    page-break-inside: avoid;
  }

  .info-item:nth-child(odd):nth-last-child(2),
  .info-item:last-child {
    border-right: none;
  }

  .info-item:nth-last-child(-n+2) {
    border-bottom: none;
  }

  .info-label {
    font-size: 10px;
    font-weight: 600;
    color: #6a2d91;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  .info-value {
    font-size: 11px;
    color: #333;
    word-wrap: break-word;
    min-height: 18px;
  }

  /* Single Column Info */
  .info-grid.single {
    grid-template-columns: 1fr;
  }

  .info-grid.single .info-item {
    border-right: none;
  }

  /* GMS Entries */
  .gms-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .gms-entry {
    background: linear-gradient(135deg, #f8f3fc 0%, #faf7ff 100%);
    border-left: 4px solid #6a2d91;
    padding: 12px;
    page-break-inside: avoid;
    border-radius: 2px;
  }

  .gms-entry-num {
    font-size: 10px;
    font-weight: 700;
    color: #6a2d91;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .gms-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .gms-field {
    page-break-inside: avoid;
  }

  .gms-label {
    font-size: 9px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
  }

  .gms-value {
    font-size: 11px;
    color: #333;
    padding: 6px 8px;
    background: white;
    border-radius: 2px;
    border: 1px solid #e8e8e8;
  }

  /* Checklist */
  .checklist {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .checklist-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid #e8e8e8;
    font-size: 11px;
    page-break-inside: avoid;
  }

  .checklist-label {
    flex: 1;
    color: #333;
  }

  .checklist-value {
    flex: 0 0 50px;
    text-align: center;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 3px;
    font-size: 10px;
  }

  .checklist-yes {
    background: #e8f5e9;
    color: #2e7d32;
  }

  .checklist-no {
    background: #ffebee;
    color: #c62828;
  }

  /* Sign Off */
  .signoff-section {
    margin-top: 20px;
  }

  .signoff-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 12px;
  }

  .signoff-block {
    page-break-inside: avoid;
  }

  .signoff-name {
    font-size: 10px;
    font-weight: 700;
    color: #6a2d91;
    text-transform: uppercase;
    margin-bottom: 6px;
    letter-spacing: 0.5px;
  }

  .signoff-person {
    font-size: 11px;
    color: #333;
    margin-bottom: 12px;
    font-weight: 600;
  }

  .signoff-row {
    margin-bottom: 14px;
  }

  .signoff-label {
    font-size: 9px;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
  }

  .signature-line {
    border-bottom: 1px solid #333;
    height: 28px;
    display: flex;
    align-items: flex-end;
    padding-bottom: 2px;
  }

  .signoff-date {
    font-size: 10px;
    color: #333;
  }

  /* Disclaimer */
  .disclaimer {
    background: #fff9e6;
    border: 1px solid #ffe082;
    border-radius: 3px;
    padding: 10px 12px;
    margin: 14px 0;
    font-size: 9px;
    color: #666;
    page-break-inside: avoid;
  }

  .disclaimer strong {
    color: #f57f17;
  }

  /* Footer */
  .footer {
    margin-top: 30px;
    padding-top: 12px;
    border-top: 1px solid #e8e8e8;
    text-align: right;
    font-size: 9px;
    color: #999;
  }

  /* Responsive Tables */
  table {
    width: 100%;
    border-collapse: collapse;
  }

  tr {
    page-break-inside: avoid;
  }

  @media print {
    body { 
      background: white;
      margin: 0;
      padding: 0;
    }
    .form-wrapper {
      box-shadow: none;
      margin: 0;
      padding: 0;
    }
  }
</style>
</head>

<body>
<div class="form-wrapper">

<!-- HEADER -->
<div class="header">
  <div class="header-logo">
    <img src="https://chieta.org.za/wp-content/uploads/2024/11/logo_simple.png" alt="CHIETA" />
  </div>
  <div class="header-info">
    <div class="header-title">IMS Application Form</div>
    <div class="header-meta">
      <div class="meta-row">
        <div class="meta-item">
          <span class="meta-label">Reference:</span>
          <span>${data.reference}</span>
        </div>
      </div>
      <div class="meta-row">
        <div class="meta-item">
          <span class="meta-label">Project Type:</span>
          <span>${data.projectType}</span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ORGANISATION SECTION -->
<div class="section">
  <div class="section-title">Organisation Information</div>
  <div class="info-grid">
    <div class="info-item">
      <div class="info-label">Organisation Name</div>
      <div class="info-value"><strong>${data.organisation.organisationName}</strong></div>
    </div>
    <div class="info-item">
      <div class="info-label">Trading Name</div>
      <div class="info-value">${data.organisation.tradingName}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Core Business</div>
      <div class="info-value">${data.organisation.coreBusiness}</div>
    </div>
    <div class="info-item">
      <div class="info-label">BEE Status</div>
      <div class="info-value">${data.organisation.beeStatus}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Province</div>
      <div class="info-value">${data.organisation.province}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Municipality</div>
      <div class="info-value">${data.organisation.municipality}</div>
    </div>
  </div>
</div>

<!-- CONTACT SECTION -->
<div class="section">
  <div class="section-title">Contact Details</div>
  <div class="info-grid single">
    <div class="info-item">
      <div class="info-label">Phone</div>
      <div class="info-value">${data.organisation.phoneNumber}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Fax</div>
      <div class="info-value">${data.organisation.faxNumber}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Email</div>
      <div class="info-value">${data.organisation.email}</div>
    </div>
  </div>
</div>

<!-- CEO SECTION -->
<div class="section">
  <div class="section-title">CEO Details</div>
  <div class="info-grid">
    <div class="info-item">
      <div class="info-label">First Name</div>
      <div class="info-value">${data.ceo.firstName}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Surname</div>
      <div class="info-value">${data.ceo.surname}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Email</div>
      <div class="info-value">${data.ceo.email}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Gender</div>
      <div class="info-value">${data.ceo.gender}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Race</div>
      <div class="info-value">${data.ceo.race}</div>
    </div>
    <div class="info-item">
      <div class="info-label">&nbsp;</div>
      <div class="info-value">&nbsp;</div>
    </div>
  </div>
</div>

<!-- CFO SECTION -->
<div class="section">
  <div class="section-title">Senior Representative / CFO Details</div>
  <div class="info-grid">
    <div class="info-item">
      <div class="info-label">First Name</div>
      <div class="info-value">${data.cfo.firstName}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Surname</div>
      <div class="info-value">${data.cfo.surname}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Email</div>
      <div class="info-value">${data.cfo.email}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Gender</div>
      <div class="info-value">${data.cfo.gender}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Race</div>
      <div class="info-value">${data.cfo.race}</div>
    </div>
    <div class="info-item">
      <div class="info-label">&nbsp;</div>
      <div class="info-value">&nbsp;</div>
    </div>
  </div>
</div>

<!-- SDF SECTION -->
<div class="section">
  <div class="section-title">SDF Contact Person</div>
  <div class="info-grid">
    <div class="info-item">
      <div class="info-label">First Name</div>
      <div class="info-value">${data.sdf.firstName}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Surname</div>
      <div class="info-value">${data.sdf.surname}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Role</div>
      <div class="info-value">${data.sdf.role}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Gender</div>
      <div class="info-value">${data.sdf.gender}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Race</div>
      <div class="info-value">${data.sdf.race}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Phone</div>
      <div class="info-value">${data.sdf.phone}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Mobile</div>
      <div class="info-value">${data.sdf.mobile}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Email</div>
      <div class="info-value">${data.sdf.email}</div>
    </div>
  </div>
</div>

<!-- GMS SECTION -->
<div class="section">
  <div class="section-title">GMS Applications</div>
  <div class="gms-container">
    ${Array.isArray(data.gms) && data.gms.length > 0
    ? data.gms.map((entry, index) => {
      const formattedCost = entry.cost && entry.cost !== '—' ?
        'R ' + (parseFloat(entry.cost) || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') :
        '—';
      return '<div class="gms-entry">' +
        '<div class="gms-entry-num">Entry ' + (index + 1) + '</div>' +
        '<div class="gms-grid">' +
        '<div class="gms-field"><div class="gms-label">Learning Programme</div><div class="gms-value">' + (entry.learningProgramme || '—') + '</div></div>' +
        '<div class="gms-field"><div class="gms-label">Sub-Category</div><div class="gms-value">' + (entry.subCategory || '—') + '</div></div>' +
        '<div class="gms-field"><div class="gms-label">Intervention</div><div class="gms-value">' + (entry.intervention || '—') + '</div></div>' +
        '<div class="gms-field"><div class="gms-label">Cost per Learner</div><div class="gms-value">' + formattedCost + '</div></div>' +
        '</div></div>';
    }).join('')
    : '<div class="gms-entry"><div class="gms-entry-num">Entry 1</div><div class="gms-grid"><div class="gms-field"><div class="gms-label">Learning Programme</div><div class="gms-value">—</div></div><div class="gms-field"><div class="gms-label">Sub-Category</div><div class="gms-value">—</div></div><div class="gms-field"><div class="gms-label">Intervention</div><div class="gms-value">—</div></div><div class="gms-field"><div class="gms-label">Cost per Learner</div><div class="gms-value">—</div></div></div></div>'
  }
  </div>
</div>

<!-- CHECKLIST SECTION -->
<div class="section">
  <div class="section-title">Document Checklist</div>
  <div class="checklist">
    <div class="checklist-item">
      <div class="checklist-label">Central Supplier Database / SARS PIN</div>
      <div class="checklist-value ${data.checklist.csdOrSarsPin === 'Yes' ? 'checklist-yes' : 'checklist-no'}">${data.checklist.csdOrSarsPin}</div>
    </div>
    <div class="checklist-item">
      <div class="checklist-label">Company Registration</div>
      <div class="checklist-value ${data.checklist.companyRegistration === 'Yes' ? 'checklist-yes' : 'checklist-no'}">${data.checklist.companyRegistration}</div>
    </div>
    <div class="checklist-item">
      <div class="checklist-label">BEE Certificate / Affidavit</div>
      <div class="checklist-value ${data.checklist.beeCertificate === 'Yes' ? 'checklist-yes' : 'checklist-no'}">${data.checklist.beeCertificate}</div>
    </div>
    <div class="checklist-item">
      <div class="checklist-label">Letter of Commitment</div>
      <div class="checklist-value ${data.checklist.letterOfCommitment === 'Yes' ? 'checklist-yes' : 'checklist-no'}">${data.checklist.letterOfCommitment}</div>
    </div>
    <div class="checklist-item">
      <div class="checklist-label">Proof of Accreditation</div>
      <div class="checklist-value ${data.checklist.proofOfAccreditation === 'Yes' ? 'checklist-yes' : 'checklist-no'}">${data.checklist.proofOfAccreditation}</div>
    </div>
    <div class="checklist-item">
      <div class="checklist-label">Declaration of Interest</div>
      <div class="checklist-value ${data.checklist.declarationOfInterest === 'Yes' ? 'checklist-yes' : 'checklist-no'}">${data.checklist.declarationOfInterest}</div>
    </div>
    <div class="checklist-item">
      <div class="checklist-label">Proof of Banking Details</div>
      <div class="checklist-value ${data.checklist.proofOfBanking === 'Yes' ? 'checklist-yes' : 'checklist-no'}">${data.checklist.proofOfBanking}</div>
    </div>
    <div class="checklist-item">
      <div class="checklist-label">Proof of Workplace Approval</div>
      <div class="checklist-value ${data.checklist.workplaceApproval === 'Yes' ? 'checklist-yes' : 'checklist-no'}">${data.checklist.workplaceApproval}</div>
    </div>
    <div class="checklist-item">
      <div class="checklist-label">Research Exports Questionnaire</div>
      <div class="checklist-value ${data.checklist.researchExportsQuestionnaire === 'Yes' ? 'checklist-yes' : 'checklist-no'}">${data.checklist.researchExportsQuestionnaire}</div>
    </div>
  </div>
</div>

<!-- SIGN-OFF SECTION -->
<div class="section signoff-section">
  <div class="section-title">Authorisation & Sign-Off</div>
  
  <div class="disclaimer">
    <strong>Important:</strong> All applications are reviewed according to CHIETA Grants Policy. By signing below, signatories confirm the information provided is accurate and complete.
  </div>

  <div class="signoff-grid">
    <div class="signoff-block">
      <div class="signoff-name">CEO</div>
      <div class="signoff-person">${data.signOff.ceoName}</div>
      
      <div class="signoff-row">
        <div class="signoff-label">Signature</div>
        <div class="signature-line"></div>
      </div>
      
      <div class="signoff-row">
        <div class="signoff-label">Date</div>
        <div class="signoff-date">${new Date(data.signOff.ceoDate).toLocaleDateString('en-ZA')}</div>
      </div>
    </div>

    <div class="signoff-block">
      <div class="signoff-name">CFO / Senior Representative</div>
      <div class="signoff-person">${data.signOff.cfoName}</div>
      
      <div class="signoff-row">
        <div class="signoff-label">Signature</div>
        <div class="signature-line"></div>
      </div>
      
      <div class="signoff-row">
        <div class="signoff-label">Date</div>
        <div class="signoff-date">${new Date(data.signOff.cfoDate).toLocaleDateString('en-ZA')}</div>
      </div>
    </div>
  </div>
</div>

<div class="footer">
  Generated by CHIETA IMS on ${new Date(data.generatedDate).toLocaleDateString('en-ZA')} at ${new Date(data.generatedDate).toLocaleTimeString('en-ZA')}
</div>

</div>
</body>
</html>
`;
