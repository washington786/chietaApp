const title = 'Workplace Skills Plan - Annual Training Report';
const title_dg = 'Discretionary Grants Application';

export interface ILetter {
    Organisation_Name: string;
    Trade_Name: string;
    SDL: string;
    Period: string;
    downloadedDate?: string;
    isDG?: boolean
}

export const submissionLetter = ({ Organisation_Name, Trade_Name, SDL, Period, downloadedDate, isDG }: ILetter) => {
    const formattedDate = downloadedDate
        ?? new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CHIETA WSP/ATR Acknowledgement Letter</title>
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
    }

    /* --- Header --- */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #3c1b50;
    }

    .logo img {
      max-width: 200px;
      height: auto;
    }

    .header-right {
      text-align: right;
    }

    .header-date {
      font-size: 11px;
      color: #333;
      margin-bottom: 8px;
    }

    .document-title {
      color: #3c1b50;
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 4px;
      font-family: Arial, sans-serif;
    }

    .document-subtitle {
      font-size: 12px;
      font-weight: bold;
      color: #333;
      font-family: Arial, sans-serif;
    }

    /* --- Organisation Details --- */
    .org-details {
      margin: 14px 0 16px 0;
      font-size: 12px;
    }

    .org-details p {
      margin: 3px 0;
    }

    .org-details strong {
      display: inline-block;
      width: 120px;
      color: #3c1b50;
      font-family: Arial, sans-serif;
    }

    /* --- Body text --- */
    .salutation {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 13px;
    }

    .content-paragraph {
      margin-bottom: 12px;
      line-height: 1.7;
      text-align: justify;
      font-size: 13px;
      color: #2a2a2a;
    }

    /* --- Enquiries heading --- */
    .enquiries-heading {
      background-color: #3c1b50;
      color: white;
      padding: 6px 12px;
      text-align: center;
      font-weight: bold;
      font-size: 12px;
      font-family: Arial, sans-serif;
      margin: 10px 0 0 0;
    }

    /* --- Table --- */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    table th,
    table td {
      border: 1px solid #ddd;
      padding: 6px 8px;
      text-align: left;
      vertical-align: top;
    }

    table th {
      background-color: #3c1b50;
      color: white;
      font-weight: bold;
      font-family: Arial, sans-serif;
    }

    table tr:nth-child(even) {
      background-color: #f8f9fa;
    }

    /* --- Signature --- */
    .signature-section {
      margin: 16px 0;
      padding: 10px 14px;
      border: 1.5px solid #3c1b50;
      border-radius: 4px;
      font-size: 12px;
    }

    .signature-label {
      font-size: 11px;
      color: #444;
      margin-top: 4px;
      font-family: Arial, sans-serif;
    }

    /* --- Footer --- */
    .footer-section {
      margin-top: 12px;
      padding-top: 8px;
      border-top: 2px solid #c98a1c;
    }

    .footer-offices {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 6px;
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
      color: #3c1b50;
      font-size: 9px;
      margin-bottom: 2px;
      font-family: Arial, sans-serif;
    }

    .office-detail {
      font-size: 8px;
      margin-bottom: 1px;
      color: #333;
    }

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

    .social-link {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      color: #666;
      font-size: 8px;
    }

    .social-icon {
      display: inline-block;
      width: 14px;
      height: 14px;
      margin-right: 3px;
      vertical-align: middle;
    }

    /* --- Page number --- */
    .page-number {
      text-align: center;
      margin-top: 8px;
      color: #666;
      font-size: 11px;
      font-weight: bold;
      border-top: 1px solid #ddd;
      padding-top: 6px;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }
      .page {
        width: 100%;
        margin: 0;
        padding: 20px;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>

  <div class="page">

    <!-- Header -->
    <div class="header">
      <div class="logo">
        <img src="https://chieta.org.za/wp-content/uploads/2024/11/logo_simple.png" alt="CHIETA Logo" />
      </div>
      <div class="header-right">
        <div class="header-date">Date: ${formattedDate}</div>
        <div class="document-title">ACKNOWLEDGEMENT OF RECEIPT</div>
        <div class="document-subtitle">${!isDG ? title : title_dg}</div>
      </div>
    </div>

    <!-- Organisation Details -->
    <div class="org-details">
      <p><strong>Legal Name:</strong> ${Organisation_Name}</p>
      <p><strong>Trading Name:</strong> ${Trade_Name}</p>
      <p><strong>SDL Number:</strong> ${SDL}</p>
      <p><strong>Reporting Period:</strong> ${Period}</p>
    </div>

    <!-- Salutation -->
    <div class="salutation">To Whom It May Concern</div>

    <!-- Body -->
    <p class="content-paragraph">
      This serves as an acknowledgement of receipt for the submission of Workplace Skills Plan - Annual Training Report ${Period} for the SDL Number ${SDL}.
    </p>

    <p class="content-paragraph">
      The submitted Workplace Skills Plans and the Annual Training report from ${Organisation_Name} will undergo evaluation process and feedback will be shared with the SDF.
    </p>

    <p class="content-paragraph">
      Should you have any queries with your submission kindly contact one of the regional offices below:
    </p>

    <!-- Enquiries -->
    <div class="enquiries-heading">ENQUIRIES</div>

    <table>
      <thead>
        <tr>
          <th style="width: 15%;">Region</th>
          <th style="width: 20%;">Person Responsible</th>
          <th style="width: 35%;">Email</th>
          <th style="width: 30%;">Phone</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Gauteng</td>
          <td>Nelisiwe Gumede</td>
          <td>ngumede@chieta.org.za</td>
          <td>087 357 6608 / 011 628 7000</td>
        </tr>
        <tr>
          <td>Western Cape</td>
          <td>Faith Gcali</td>
          <td>fgcali@chieta.org.za</td>
          <td>087 357 6695 / 021 551 1113</td>
        </tr>
        <tr>
          <td>KwaZulu-Natal</td>
          <td>Baswabile Maetisa</td>
          <td>bmaetisa@chieta.org.za</td>
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
      <p style="margin-bottom: 6px;">Yours Sincerely,</p>
      <div class="signature-label">CHIETA GRANTS MANAGEMENT UNIT</div>
    </div>

    <!-- Footer -->
    <div class="footer-section">
      <div class="footer-offices">
        <div class="office">
          <div class="office-title">CHIETA HEAD OFFICE</div>
          <div class="office-detail">Allandale Building, 3rd Floor, Office B</div>
          <div class="office-detail">23 Magwa Crescent, Waterfall City, 2090</div>
          <div class="office-detail">Tel: 011 628 7000</div>
        </div>
        <div class="office">
          <div class="office-title">WESTERN CAPE</div>
          <div class="office-detail">Westway Office Park, 21 The Roads</div>
          <div class="office-detail">Montague Gardens, 7441</div>
          <div class="office-detail">Tel: 021 551 1113/4</div>
        </div>
        <div class="office">
          <div class="office-title">KWAZULU-NATAL</div>
          <div class="office-detail">Uni: B2, Cor Race Course &amp; Omurembe</div>
          <div class="office-detail">Boulevard (1st Floor) Westville, 3630</div>
          <div class="office-detail">Tel: 031 368 4040</div>
        </div>
        <div class="office">
          <div class="office-title">PORT ELIZABETH</div>
          <div class="office-detail">Struanway Block E, New Brighton</div>
          <div class="office-detail">Port Elizabeth, 6001</div>
          <div class="office-detail">Tel: 041 509 6478</div>
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

    <!-- Page Number -->
    <div class="page-number">Page 1 of 1</div>

  </div>

</body>
</html>
    `;
}
