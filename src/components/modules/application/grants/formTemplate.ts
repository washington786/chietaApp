import { ApplicationForm } from "./types";

// IMPORTANT: load logo from assets folder
// adjust relative path if needed based on where this file sits
const logo = require("../../../../assets/chieta-logo.jpg");

export const renderApplicationHtml = (data: ApplicationForm) => `
<html>
<head>

<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>

<style>
  body { font-family: Helvetica, Arial, sans-serif; padding: 28px; }

  .form-wrapper {
    max-width: 800px; 
    margin: 0 auto;
  }

  .title {
    text-align:center;
    font-weight:700;
    font-size:22px;
    color:#4b0082;
    margin-top: 6px;
    margin-bottom: 6px;
  }

  .section-header {
    font-weight:700;
    margin-top:16px;
    padding:6px 8px;
    border:1px solid #4b0082;
    background:#f2f2f2;
  }

  .data-table {
    width:100%;
    border-collapse:collapse;
    font-size:10pt;
  }

  .data-table th,
  .data-table td {
    border:1px solid #4b0082;
    padding:6px 8px;
  }

  .data-table th { width:32%; }
</style>

</head>

<body>

<div class="form-wrapper">

<!-- LOGO -->
<div style="text-align:center; margin-bottom:8px;">
  <img src="${logo}" style="width:180px;" />
</div>

<p class="title">IMS APPLICATION FORM</p>

<p class="text-center">
  <b>REFERENCE:</b> ${data.reference}
  &nbsp;&nbsp; | &nbsp;&nbsp;
  <b>PROJECT TYPE:</b> ${data.projectType}
</p>

<hr style="border:0; border-top:2px solid #4b0082;"/>

<!-- Organisation Information -->
<p class="section-header">Organisation Information</p>
<table class="data-table">
  <tr><th>Organisation Name</th><td>${data.organisation.organisationName}</td></tr>
  <tr><th>Trading Name</th><td>${data.organisation.tradingName}</td></tr>
  <tr><th>Core Business</th><td>${data.organisation.coreBusiness}</td></tr>
  <tr><th>Province</th><td>${data.organisation.province}</td></tr>
  <tr><th>Municipality</th><td>${data.organisation.municipality}</td></tr>
  <tr><th>BEE Status</th><td>${data.organisation.beeStatus}</td></tr>
</table>

<!-- Organisation Contact Details -->
<p class="section-header">Organisation Contact Details</p>
<table class="data-table">
  <tr><th>Phone Number</th><td>${data.organisation.phoneNumber}</td></tr>
  <tr><th>Fax Number</th><td>${data.organisation.faxNumber}</td></tr>
  <tr><th>Email Address</th><td>${data.organisation.email}</td></tr>
</table>

<!-- CEO Details -->
<p class="section-header">CEO Details</p>
<table class="data-table">
  <tr><th>First Name</th><td>${data.ceo.firstName}</td></tr>
  <tr><th>Surname</th><td>${data.ceo.surname}</td></tr>
  <tr><th>Email</th><td>${data.ceo.email}</td></tr>
  <tr><th>Race</th><td>${data.ceo.race}</td></tr>
  <tr><th>Gender</th><td>${data.ceo.gender}</td></tr>
</table>

<!-- CFO Details -->
<p class="section-header">Senior Organisation / CFO Details</p>
<table class="data-table">
  <tr><th>First Name</th><td>${data.cfo.firstName}</td></tr>
  <tr><th>Surname</th><td>${data.cfo.surname}</td></tr>
  <tr><th>Email</th><td>${data.cfo.email}</td></tr>
  <tr><th>Race</th><td>${data.cfo.race}</td></tr>
  <tr><th>Gender</th><td>${data.cfo.gender}</td></tr>
</table>

<!-- SDF Contacts -->
<p class="section-header">SDF Contacts</p>
<table class="data-table">
  <tr><th>First Name</th><td>${data.sdf.firstName}</td></tr>
  <tr><th>Surname</th><td>${data.sdf.surname}</td></tr>
  <tr><th>SDF Role</th><td>${data.sdf.role}</td></tr>
  <tr><th>Race</th><td>${data.sdf.race}</td></tr>
  <tr><th>Gender</th><td>${data.sdf.gender}</td></tr>
  <tr><th>Phone</th><td>${data.sdf.phone}</td></tr>
  <tr><th>Mobile</th><td>${data.sdf.mobile}</td></tr>
  <tr><th>Email</th><td>${data.sdf.email}</td></tr>
</table>

<!-- GMS Application -->
<p class="section-header">GMS Application</p>
<table class="data-table">
  <tr><th>Learning Programme</th><td>${data.gms.learningProgramme}</td></tr>
  <tr><th>Sub-Category</th><td>${data.gms.subCategory}</td></tr>
  <tr><th>Intervention</th><td>${data.gms.intervention}</td></tr>
  <tr><th>Cost (New/Cont/RPL)</th><td>${data.gms.cost}</td></tr>
</table>

<!-- File Upload Checklist -->
<p class="section-header">File Upload Checklist</p>
<table class="data-table">
  <tr><th>Central Supplier Database / SARS PIN</th><td>${data.checklist.csdOrSarsPin}</td></tr>
  <tr><th>Company Registration</th><td>${data.checklist.companyRegistration}</td></tr>
  <tr><th>Copy of BEE Certificate / Affidavit</th><td>${data.checklist.beeCertificate}</td></tr>
  <tr><th>Letter of Commitment</th><td>${data.checklist.letterOfCommitment}</td></tr>
  <tr><th>Proof of Accreditation</th><td>${data.checklist.proofOfAccreditation}</td></tr>
  <tr><th>Declaration of Interest</th><td>${data.checklist.declarationOfInterest}</td></tr>
  <tr><th>Proof of Banking Details</th><td>${data.checklist.proofOfBanking}</td></tr>
  <tr><th>Proof of Workplace Approval</th><td>${data.checklist.workplaceApproval}</td></tr>
  <tr><th>Research Exports Questionnaire</th><td>${data.checklist.researchExportsQuestionnaire}</td></tr>
</table>

<!-- Stakeholder Sign-Off -->
<p class="section-header">Stakeholder Sign-Off</p>

<table class="data-table">
  <tr>
    <td colspan="2">
      All applications will be reviewed according to CHIETA Grants Policy and relevant internal controls.
    </td>
  </tr>

  <tr><th>Name: CEO</th><td>${data.signOff.ceoName}</td></tr>
  <tr><th>Signature</th><td>________________________</td></tr>
  <tr><th>Date</th><td>${data.signOff.ceoDate}</td></tr>

  <tr><th>Name: CFO</th><td>${data.signOff.cfoName}</td></tr>
  <tr><th>Signature</th><td>________________________</td></tr>
  <tr><th>Date</th><td>${data.signOff.cfoDate}</td></tr>
</table>

<p class="text-end mt-3" style="font-size:10pt;">
  Generated by CHIETA IMS on ${data.generatedDate}
</p>

</div>

</body>
</html>
`;
