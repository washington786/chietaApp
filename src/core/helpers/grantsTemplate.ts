export interface GrantsApprovedTemplateParams {
    organizationName: string;
    fundingCycle: string;
    fundingAmount: string;
    fundingArea: string;
}
export interface GrantsRejectedTemplateParams {
    fundingCycle: string;
}

export const grantsApprovedTemplate = (params: GrantsApprovedTemplateParams) => {
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Funding Outcome Letter</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Times New Roman', Times, serif;
      background-color: #f5f5f5;
      padding: 20px;
      color: #1a1a1a;
    }

    .page {
      width: 210mm;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      position: relative;
      display: flex;
      flex-direction: column;
    }

    /* Header with logo and badge */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      min-height: 100px;
    }

    .logo {
      max-width: 280px;
    }

    .logo img {
      max-width: 100%;
      height: auto;
    }

    .badge {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #d4af37 0%, #c98a1c 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 28px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      font-family: Arial, sans-serif;
    }

    /* Recipient section */
    .recipient {
      margin-bottom: 20px;
    }

    .recipient-label {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 8px;
      font-family: Arial, sans-serif;
    }

    .recipient-line {
      border-bottom: 2px solid #333;
      padding-bottom: 12px;
    }

    /* Body text */
    .body-text {
      font-size: 14px;
      line-height: 1.8;
      margin-bottom: 20px;
      text-align: justify;
      color: #2a2a2a;
    }

    /* Funding outcome box */
    .outcome-box {
      border: 2px solid #333;
      margin: 25px 0;
      background-color: #fafafa;
    }

    .outcome-box-header {
      background-color: #f0f0f0;
      padding: 12px 15px;
      font-weight: bold;
      font-size: 16px;
      border-bottom: 2px solid #333;
      font-family: Arial, sans-serif;
    }

    .outcome-box-content {
      padding: 12px 15px;
      font-size: 16px;
      font-weight: bold;
      font-family: Arial, sans-serif;
    }

    .amount {
      color: #c98a1c;
    }

    /* Table styles */
    .contacts-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 13px;
    }

    .contacts-table thead {
      background-color: #f0f0f0;
    }

    .contacts-table th,
    .contacts-table td {
      border: 1px solid #333;
      padding: 12px 10px;
      text-align: left;
    }

    .contacts-table th {
      font-weight: bold;
      font-family: Arial, sans-serif;
      background-color: white;
    }

    .contacts-table tbody tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    /* Notes and warnings */
    .notes {
      font-size: 14px;
      line-height: 1.8;
      margin: 20px 0;
      text-align: justify;
    }

    .bold-notes {
      font-weight: bold;
      margin: 20px 0;
      line-height: 1.8;
      text-align: justify;
    }

    /* Signature section */
    .signature-section {
      margin-top: 40px;
      font-size: 14px;
      margin-bottom: 40px;
    }

    .signature-line {
      margin-top: 30px;
      font-family: Arial, sans-serif;
    }

    /* Footer with regional offices */
    .footer-section {
      margin-top: 20px;
      padding-top: 12px;
      border-top: 2px solid #c98a1c;
      flex-shrink: 0;
    }

    .footer-offices {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 10px;
      font-size: 9px;
      line-height: 1.4;
    }

    .office {
      flex: 1;
      padding-right: 8px;
      border-right: 2px solid #c98a1c;
    }

    .office:last-child {
      border-right: none;
      padding-right: 0;
    }

    .office-title {
      font-weight: bold;
      color: #c98a1c;
      font-size: 9px;
      margin-bottom: 2px;
      font-family: Arial, sans-serif;
    }

    .office-detail {
      font-size: 8px;
      margin-bottom: 1px;
    }

    /* Social and contact info footer */
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8px;
      padding-top: 8px;
      border-top: 1px solid #ddd;
      color: #666;
      line-height: 1.3;
    }

    .footer-social {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .footer-antifraud {
      text-align: right;
      color: #c98a1c;
      font-weight: bold;
      font-size: 8px;
    }

    .footer-bottom span {
      margin: 0 3px;
    }

    .social-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-right: 4px;
      vertical-align: middle;
    }

    .social-link {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      color: #666;
      font-size: 8px;
      transition: color 0.3s ease;
    }

    .social-link:hover {
      color: #c98a1c;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }

      .page {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 40px;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header with Logo and Badge -->
    <div class="header">
      <div class="logo">
        <img src="https://chieta.org.za/wp-content/uploads/2024/11/logo_simple.png" alt="CHIETA Logo" style="max-width: 280px; height: auto;">
      </div>
      <div class="badge">1</div>
    </div>

    <!-- Recipient Section -->
    <div class="recipient">
      <div class="recipient-label">To: ${params.organizationName}</div>
      <div class="recipient-line"></div>
    </div>

    <!-- Body Text -->
    <p class="body-text">
      We have received your application linked to the ${params.fundingCycle} Discretionary Grant funding window. CHIETA has extensively reviewed all applications against objectives that would address the CHIETA's Sector Skills Plan and Annual Performance Plan indicators as well as national imperatives. Consideration of the available budget, economies of scale and past &amp; present organisation performance was analysed during the extensive review processes before final approvals were undertaken by the CHIETA Governing Board.
    </p>

    <p class="body-text">
      The following table contains the result of the applications submitted by THE PETROLEUM OIL AND GAS CORPORATION OF SOUTH AFRICA SOC LTD.
    </p>

    <!-- Funding Outcome Box -->
    <div class="outcome-box">
      <div class="outcome-box-header">Funding Outcome - Approved</div>
      <div class="outcome-box-content">${params.fundingArea} &nbsp; - <span class="amount">${params.fundingAmount}</span></div>
    </div>

    <p class="body-text">
      The above feedback table still requires compliance to all relevant Grant regulations and CHIETA funding policy guidelines. If you require any feedback on the above award feedback, please contact your nearest regional office as per below:
    </p>

    <!-- Regional Contacts Table -->
    <table class="contacts-table">
      <thead>
        <tr>
          <th>Region</th>
          <th>Person Responsible</th>
          <th>Email</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Gauteng</td>
          <td>Brenda Ledwaba</td>
          <td>bledwaba@chieta.org.za</td>
          <td>087 357 6608 / 011 628 7000</td>
        </tr>
        <tr>
          <td>Western Cape</td>
          <td>Faith Nenemba</td>
          <td>fnenemba@chieta.org.za</td>
          <td>087 357 6695 / 021 551 1113/4</td>
        </tr>
        <tr>
          <td>Kwazulu Natal</td>
          <td>Baswabile Maetisa</td>
          <td>bmaetisa@Chieta.org.za</td>
          <td>087 353 5573 / 031 368 4040</td>
        </tr>
        <tr>
          <td>Eastern Cape</td>
          <td>Shanice Moodley</td>
          <td>spotberg@chieta.org.za</td>
          <td>087 353 5573 / 041 509 6478</td>
        </tr>
      </tbody>
    </table>

    <p class="notes">
      Please note the final allocation could differ from what you initially have applied for. The CHIETA will not enter into any discussion or negotiation on the content of the MoA.
    </p>

    <p class="bold-notes">
      Non-upload of the signed MoA on the IMS Portal will constitute a non-acceptance of the Discretionary Award &amp; may result in a sweep of the committed funding, at the discretion of CHIETA management. This award letter does not constitute a commitment. A commitment will only be raised against the MoA at the point of receipt of original signed MoA by both parties. Further details on MoA availability will be communicated to you via email.
    </p>

    <!-- Signature -->
    <div class="signature-section">
      <div class="signature-line">CEO O.B.O CHIETA
duly appointed Executive Authority</div>
    </div>

    <!-- Regional Offices Footer -->
    <div class="footer-section">
      <div class="footer-offices">
        <div class="office">
          <div class="office-title">CHIETA HEAD OFFICE:</div>
          <div class="office-detail">Tel: 011 628 7000</div>
          <div class="office-detail">Allandale Building, 9th Floor, Office B</div>
          <div class="office-detail">25 Magwa Crescent, Waterfall City, 2090</div>
        </div>
        <div class="office">
          <div class="office-title">WESTERN CAPE:</div>
          <div class="office-detail">Tel: 021 551 1113/4</div>
          <div class="office-detail">Suite C Rose Square, Crumbia &amp;</div>
          <div class="office-detail">Chirumbe Roads, Montague Gardens, 7441</div>
        </div>
        <div class="office">
          <div class="office-title">KWAZULU-NATAL:</div>
          <div class="office-detail">Tel: 031 368 4040</div>
          <div class="office-detail">Workshop Office, P.O. Box 23</div>
          <div class="office-detail">Hillcrest, Boulevard (1st Floor) Westville, 3630</div>
        </div>
        <div class="office">
          <div class="office-title">GAUTENG:</div>
          <div class="office-detail">Tel: 041 509 6478</div>
          <div class="office-detail">Grosvenor Block, E. New Brighton,</div>
          <div class="office-detail">Port Elizabeth, 6001</div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-social">
          <a href="https://twitter.com/Chieteaa" class="social-link" title="Twitter">
            <svg class="social-icon" viewBox="0 0 24 24" fill="#c98a1c" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9-1 9-5.6a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
            </svg>
            @Chieteaa
          </a>
          <a href="https://www.facebook.com/chieta" class="social-link" title="Facebook">
            <svg class="social-icon" viewBox="0 0 24 24" fill="#c98a1c" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z"/>
            </svg>
            @CHIETA_SETA
          </a>
          <a href="https://www.instagram.com/chieta_sa" class="social-link" title="Instagram">
            <svg class="social-icon" viewBox="0 0 24 24" fill="none" stroke="#c98a1c" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
              <circle cx="17.5" cy="6.5" r="1.5"/>
            </svg>
            @Chieta_sa
          </a>
          <a href="https://www.chieta.org.za" class="social-link" title="Website">
            <svg class="social-icon" viewBox="0 0 24 24" fill="#c98a1c" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
            www.chieta.org.za
          </a>
        </div>
        <div class="footer-antifraud">
          Anti-Fraud Line: <span style="color: #1a1a1a;">0800 333 1201</span> | Toll Free Line: <span style="color: #1a1a1a;">0800 111 173</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>

    `;
};


export const grantsRejectedTemplate = (params: GrantsRejectedTemplateParams) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Funding Outcome Letter</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Times New Roman', Times, serif;
      background-color: #f5f5f5;
      padding: 20px;
      color: #1a1a1a;
    }

    .page {
      width: 210mm;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      position: relative;
      display: flex;
      flex-direction: column;
    }

    /* Header with logo and badge */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      min-height: 100px;
    }

    .logo {
      max-width: 280px;
    }

    .logo img {
      max-width: 100%;
      height: auto;
    }

    .badge {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #d4af37 0%, #c98a1c 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 28px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      font-family: Arial, sans-serif;
    }

    /* Recipient section */
    .recipient {
      margin-bottom: 20px;
    }

    .recipient-label {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 8px;
      font-family: Arial, sans-serif;
    }

    .recipient-line {
      border-bottom: 2px solid #333;
      padding-bottom: 12px;
    }

    /* Body text */
    .body-text {
      font-size: 14px;
      line-height: 1.8;
      margin-bottom: 20px;
      text-align: justify;
      color: #2a2a2a;
    }

    /* Funding outcome box */
    .outcome-box {
      border: 2px solid #333;
      margin: 25px 0;
      background-color: #fafafa;
    }

    .outcome-box-header {
      background-color: #f0f0f0;
      padding: 12px 15px;
      font-weight: bold;
      font-size: 16px;
      border-bottom: 2px solid #333;
      font-family: Arial, sans-serif;
    }

    .outcome-box-content {
      padding: 12px 15px;
      font-size: 16px;
      font-weight: bold;
      font-family: Arial, sans-serif;
    }

    .amount {
      color: #c98a1c;
    }

    /* Table styles */
    .contacts-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 13px;
    }

    .contacts-table thead {
      background-color: #f0f0f0;
    }

    .contacts-table th,
    .contacts-table td {
      border: 1px solid #333;
      padding: 12px 10px;
      text-align: left;
    }

    .contacts-table th {
      font-weight: bold;
      font-family: Arial, sans-serif;
      background-color: white;
    }

    .contacts-table tbody tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    /* Notes and warnings */
    .notes {
      font-size: 14px;
      line-height: 1.8;
      margin: 20px 0;
      text-align: justify;
    }

    .bold-notes {
      font-weight: bold;
      margin: 20px 0;
      line-height: 1.8;
      text-align: justify;
    }

    /* Signature section */
    .signature-section {
      margin-top: 40px;
      font-size: 14px;
      margin-bottom: 40px;
    }

    .signature-line {
      margin-top: 30px;
      font-family: Arial, sans-serif;
    }

    /* Footer with regional offices */
    .footer-section {
      margin-top: 20px;
      padding-top: 12px;
      border-top: 2px solid #c98a1c;
      flex-shrink: 0;
    }

    .footer-offices {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 10px;
      font-size: 9px;
      line-height: 1.4;
    }

    .office {
      flex: 1;
      padding-right: 8px;
      border-right: 2px solid #c98a1c;
    }

    .office:last-child {
      border-right: none;
      padding-right: 0;
    }

    .office-title {
      font-weight: bold;
      color: #c98a1c;
      font-size: 9px;
      margin-bottom: 2px;
      font-family: Arial, sans-serif;
    }

    .office-detail {
      font-size: 8px;
      margin-bottom: 1px;
    }

    /* Social and contact info footer */
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8px;
      padding-top: 8px;
      border-top: 1px solid #ddd;
      color: #666;
      line-height: 1.3;
    }

    .footer-social {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .footer-antifraud {
      text-align: right;
      color: #c98a1c;
      font-weight: bold;
      font-size: 8px;
    }

    .footer-bottom span {
      margin: 0 3px;
    }

    .social-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-right: 4px;
      vertical-align: middle;
    }

    .social-link {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      color: #666;
      font-size: 8px;
      transition: color 0.3s ease;
    }

    .social-link:hover {
      color: #c98a1c;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }

      .page {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 40px;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header with Logo and Badge -->
    <div class="header">
      <div class="logo">
        <img src="https://chieta.org.za/wp-content/uploads/2024/11/logo_simple.png" alt="CHIETA Logo" style="max-width: 280px; height: auto;">
      </div>
      <div class="badge">1</div>
    </div>

    <!-- Greeting -->
    <p class="body-text" style="font-weight: bold; font-size: 16px; margin-bottom: 30px;">
      DEAR VALUED STAKEHOLDER
    </p>

    <!-- Body Text -->
    <p class="body-text">
      Thank you for submitting your application for the ${params.fundingCycle} Discretionary Grant funding window. CHIETA has extensively reviewed all applications against objectives that would address the CHIETA Sector Skills Plan and Annual Performance Plan indicators as well as National Imperatives. Consideration of the available budget, economies of scale, past and present organisational performance was analysed during the extensive review processes before final approvals were undertaken by the CHIETA Governing Board.
    </p>

    <p class="body-text">
      We regret to inform you that your application was unsuccessful due to budgetary constraints. Please note that another DG funding window will open in the near future and we encourage you to apply again.
    </p>

    <p class="body-text">
      If you require any feedback on the above award feedback, please contact your nearest regional office as per below:
    </p>

    <!-- Regional Contacts Table -->
    <table class="contacts-table">
      <thead>
        <tr>
          <th>Region</th>
          <th>Person Responsible</th>
          <th>Email</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Gauteng</td>
          <td>Brenda Ledwaba</td>
          <td>bledwaba@chieta.org.za</td>
          <td>087 357 6608 / 011 628 7000</td>
        </tr>
        <tr>
          <td>Western Cape</td>
          <td>Faith Nenemba</td>
          <td>fnenemba@chieta.org.za</td>
          <td>087 357 6695 / 021 551 1113/4</td>
        </tr>
        <tr>
          <td>Kwazulu Natal</td>
          <td>Baswabile Maetisa</td>
          <td>bmaetisa@Chieta.org.za</td>
          <td>087 353 5573 / 031 368 4040</td>
        </tr>
        <tr>
          <td>Eastern Cape</td>
          <td>Shanice Moodley</td>
          <td>spotberg@chieta.org.za</td>
          <td>087 353 5573 / 041 509 6478</td>
        </tr>
      </tbody>
    </table>

    <!-- Signature -->
    <div class="signature-section">
      <div class="signature-line">CEO O.B.O CHIETA
duly appointed Executive Authority</div>
    </div>

    <!-- Regional Offices Footer -->
    <div class="footer-section">
      <div class="footer-offices">
        <div class="office">
          <div class="office-title">CHIETA HEAD OFFICE:</div>
          <div class="office-detail">Tel: 011 628 7000</div>
          <div class="office-detail">Allandale Building, 9th Floor, Office B</div>
          <div class="office-detail">25 Magwa Crescent, Waterfall City, 2090</div>
        </div>
        <div class="office">
          <div class="office-title">WESTERN CAPE:</div>
          <div class="office-detail">Tel: 021 551 1113/4</div>
          <div class="office-detail">Suite C Rose Square, Crumbia &amp;</div>
          <div class="office-detail">Chirumbe Roads, Montague Gardens, 7441</div>
        </div>
        <div class="office">
          <div class="office-title">KWAZULU-NATAL:</div>
          <div class="office-detail">Tel: 031 368 4040</div>
          <div class="office-detail">Workshop Office, P.O. Box 23</div>
          <div class="office-detail">Hillcrest, Boulevard (1st Floor) Westville, 3630</div>
        </div>
        <div class="office">
          <div class="office-title">GAUTENG:</div>
          <div class="office-detail">Tel: 041 509 6478</div>
          <div class="office-detail">Grosvenor Block, E. New Brighton,</div>
          <div class="office-detail">Port Elizabeth, 6001</div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-social">
          <a href="https://twitter.com/Chieteaa" class="social-link" title="Twitter">
            <svg class="social-icon" viewBox="0 0 24 24" fill="#c98a1c" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9-1 9-5.6a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
            </svg>
            @Chieteaa
          </a>
          <a href="https://www.facebook.com/chieta" class="social-link" title="Facebook">
            <svg class="social-icon" viewBox="0 0 24 24" fill="#c98a1c" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z"/>
            </svg>
            @CHIETA_SETA
          </a>
          <a href="https://www.instagram.com/chieta_sa" class="social-link" title="Instagram">
            <svg class="social-icon" viewBox="0 0 24 24" fill="none" stroke="#c98a1c" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
              <circle cx="17.5" cy="6.5" r="1.5"/>
            </svg>
            @Chieta_sa
          </a>
          <a href="https://www.chieta.org.za" class="social-link" title="Website">
            <svg class="social-icon" viewBox="0 0 24 24" fill="#c98a1c" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
            www.chieta.org.za
          </a>
        </div>
        <div class="footer-antifraud">
          Anti-Fraud Line: <span style="color: #1a1a1a;">0800 333 1201</span> | Toll Free Line: <span style="color: #1a1a1a;">0800 111 173</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
 `
};