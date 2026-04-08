import { KnowledgeTopic } from './index';

export const GOVERNANCE_TOPICS: KnowledgeTopic[] = [
    {
        patterns: [
            /\b(governance|pfma|board.*chieta|accounting authority|audit|compliance|risk management|agsa|auditor.?general)\b/,
        ],
        response:
            "Risk & Governance at CHIETA\n\n" +
            "CHIETA operates as a public entity under the PFMA (Public Finance Management Act, Act 1 of 1999).\n\n" +
            "Governing structure:\n" +
            "\u2022 Board / Accounting Authority: 16 members (8 employer + 8 labour representatives), plus independent members\n" +
            "\u2022 CEO: Accounting Officer, reports to the Board\n" +
            "\u2022 External Audit: Auditor-General South Africa (AGSA) conducts annual financial and performance audits\n\n" +
            "Key compliance requirements:\n" +
            "\u2022 Annual Performance Plan (APP) submitted to DHET and National Treasury\n" +
            "\u2022 Annual Report published within 5 months of financial year end\n" +
            "\u2022 Financial statements prepared according to GRAP (Generally Recognised Accounting Practice)\n\n" +
            "Risk Management:\n" +
            "\u2022 Risk Committee reviews strategic and operational risks quarterly\n" +
            "\u2022 Internal Audit Unit provides assurance on internal controls\n" +
            "\u2022 All irregular, fruitless, and wasteful expenditure reported in Annual Report\n\n" +
            "Annual Reports and governance documents:\nwww.chieta.org.za/about-us/annual-reports/\n\n" +
            "[icon:mail] info@chieta.org.za | [icon:call] 011\u00a0628\u00a07000",
    },
    {
        patterns: [
            /\b(popi|popia|privacy|personal information|data protection|personal data)\b/,
        ],
        response:
            "POPIA \u2014 Protection of Personal Information\n\n" +
            "CHIETA complies with the Protection of Personal Information Act (POPIA, Act 4 of 2013).\n\n" +
            "How CHIETA handles your data:\n" +
            "\u2022 Personal data is collected only for SETA-related purposes (grants, learnerships, etc.)\n" +
            "\u2022 Data is stored securely and not shared without consent, except where required by law\n" +
            "\u2022 You have the right to access, correct, and request deletion of your personal information\n\n" +
            "To exercise POPIA rights or report a data breach:\n" +
            "[icon:mail] info@chieta.org.za\n\n" +
            "POPIA Regulator: www.inforegulator.org.za",
    },
];
