import { KnowledgeTopic } from './index';

export const WSP_TOPICS: KnowledgeTopic[] = [
    {
        patterns: [
            /\b(wsp.*process|wsp.*flow|wsp.*steps?|wsp.*submit|submit.*wsp|how.*submit.*wsp|ofo code|ofo.*register|skills development committee|sdc)\b/,
            /workplace skills plan.*guide|guide.*workplace skills plan/,
        ],
        response: (_, yr) =>
            `WSP / ATR Submission Process\n\n` +
            `The WSP/ATR allows companies to plan future training needs and report on training completed.\n\n` +
            `What is included in the submission:\n` +
            `\u2022 Administrative details\n` +
            `\u2022 Workforce profile\n` +
            `\u2022 Identification of scarce skills\n` +
            `\u2022 Record of employees trained and planned training\n` +
            `\u2022 Pivotal training (priority)\n` +
            `\u2022 Finance and training comparison\n` +
            `\u2022 Authorisation from Skills Development Committee (SDC)\n\n` +
            `Step-by-step process:\n` +
            `1. Register / log in to https://mis.chieta.org.za\n` +
            `2. Check and verify Verification Documents (VD) and banking details\n` +
            `3. Upload signed VDs and proof of banking\n` +
            `4. Submit original copies to nearest CHIETA regional office\n` +
            `5. CHIETA verifies VD, approves banking, and approves WSP/ATR\n\n` +
            `OFO Codes: We are still using the 2021 OFO version.\n` +
            `Download OFO register: https://chieta.org.za/?s=OFO\n\n` +
            `Deadline: 30 April ${yr} at midnight\n\n` +
            `What happens if you don\u2019t submit:\n` +
            `\u2022 Forfeit the 20% mandatory grant\n` +
            `\u2022 Unable to apply for Discretionary Grants\n\n` +
            `[icon:mail] misqueries@chieta.org.za | [icon:call] 011\u00a0628\u00a07000`,
    },
    {
        patterns: [
            /\b(tax rebate|section 12h|12h.*income tax|income tax.*learnership|learnership.*tax)\b/,
        ],
        response:
            "Tax Rebates for Learnerships (Section 12H)\n\n" +
            "Employers can claim tax rebates under Section 12H of the Income Tax Act for registered learnerships.\n\n" +
            "Two types of allowances:\n" +
            "\u2022 Annual Allowance: Claimed each year of the learnership\n" +
            "\u2022 Completion Allowance: Claimed when the learner completes the programme\n\n" +
            "These allowances are administered by SARS.\n\n" +
            "Requirements:\n" +
            "\u2022 Learnership must be registered with CHIETA/SETA\n" +
            "\u2022 Learnership agreement must be in place\n" +
            "\u2022 Learner must be a South African tax resident\n\n" +
            "For more information: www.sars.gov.za\n" +
            "[icon:mail] info@chieta.org.za | [icon:call] 087\u00a0357\u00a06608",
    },
    {
        patterns: [
            /\b(skills programmes?|training programmes?|short course|upskill|nqf level|accredited courses?|programmes?)\b/,
        ],
        response:
            "CHIETA Skills Development Programmes\n\n" +
            "\u2022 Skills Programmes \u2014 short, accredited courses; credits count toward qualifications\n" +
            "\u2022 Full qualifications & learnerships\n" +
            "\u2022 Apprenticeships & trade tests (EISA)\n" +
            "\u2022 Bursaries for tertiary studies\n" +
            "\u2022 SMME entrepreneurship programmes\n\n" +
            "All programmes must be delivered by a CHIETA-accredited training provider.\n\n" +
            "List of accredited providers:\nwww.chieta.org.za/about-us/what-we-do/etqa/provider-accreditation/\n\n" +
            "Also check the QCTO database at qcto.org.za",
    },
    {
        patterns: [
            /\b(etqa|accredit|provider accredit|quality assurance|sdp|training provider|qcto|certificates issued|certificate)\b/,
        ],
        response:
            "CHIETA ETQA \u2014 Education & Training Quality Assurance\n\n" +
            "CHIETA\u2019s ETQA unit accredits training providers and quality-assures learning programmes in the chemical sector.\n\n" +
            "\u2022 Apply to become an accredited provider: www.chieta.org.za\n" +
            "\u2022 Accreditation documents: www.chieta.org.za/about-us/what-we-do/etqa/provider-accreditation/\n" +
            "\u2022 QCTO database of accredited SDPs: qcto.org.za\n" +
            "\u2022 Workplace approval: employers must complete a form submission, site visit, and evaluation to host learners\n\n" +
            "CHIETA has issued 3\u00a0720+ certificates.\n\n" +
            "ETQA accreditation processing: 60 working days after a complete application.\n\n" +
            "For ETQA queries: info@chieta.org.za | qcto@chieta.org.za",
    },
];
