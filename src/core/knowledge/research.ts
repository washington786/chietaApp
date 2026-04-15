import { KnowledgeTopic } from './index';

export const RESEARCH_TOPICS: KnowledgeTopic[] = [
    {
        patterns: [
            /\b(ssp|sector skills plan|research.*chieta|chieta.*research|annual.*review.*ssp|labour market)\b/,
        ],
        response:
            "CHIETA Sector Skills Plan (SSP)\n\n" +
            "The SSP is CHIETA\u2019s flagship research document \u2014 updated annually and submitted to DHET.\n\n" +
            "SSP development phases:\n" +
            "1. Data Collection: employer surveys, DHET learner data, Stats SA labour force data\n" +
            "2. Analysis: identify scarce/critical skills, employment trends, sector outlook\n" +
            "3. Stakeholder Consultation: workshops with employer and labour bodies\n" +
            "4. Report Writing & Quality Review\n" +
            "5. DHET Submission (annual)\n\n" +
            "What the SSP informs:\n" +
            "\u2022 CHIETA\u2019s Annual Performance Plan (APP)\n" +
            "\u2022 SPOI \u2014 Scarce & Priority Occupations List\n" +
            "\u2022 Discretionary Grant funding priorities\n" +
            "\u2022 Bursary and learnership targets\n\n" +
            "Download the latest SSP:\nwww.chieta.org.za/about-us/research-and-publications/ssp/\n\n" +
            "[icon:mail] research@chieta.org.za",
    },
    {
        patterns: [
            /\b(qualification development|qcto.*process|qcto.*qualification|saqa.*qualification|new qualification|develop.*qualification|oqsf|occupational qualification)\b/,
        ],
        response:
            "Qualification Development Process\n\n" +
            "CHIETA facilitates the development of occupational qualifications through the QCTO framework.\n\n" +
            "Process overview:\n" +
            "1. Identify need (via SSP / sector demand)\n" +
            "2. Form a Subject Matter Expert (SME) panel from the sector\n" +
            "3. Develop Curriculum Development Requirements (CDR)\n" +
            "4. Submit to QCTO for quality review and approval\n" +
            "5. SAQA registers qualification on the National Qualifications Framework (NQF)\n\n" +
            "CHIETA\u2019s role:\n" +
            "\u2022 Funds and facilitates the development process\n" +
            "\u2022 Coordinates industry input and SME panels\n" +
            "\u2022 Registers as the Development Quality Partner (DQP)\n\n" +
            "For new qualification proposals:\n[icon:mail] research@chieta.org.za",
    },
    {
        patterns: [
            /\b(rpl|recognition.*prior learning|abet|prior learning|arpl|artisan.*rpl)\b/,
        ],
        response:
            "Recognition of Prior Learning (RPL)\n\n" +
            "RPL allows people with work experience to gain formal qualifications without traditional study.\n\n" +
            "Types supported by CHIETA:\n" +
            "\u2022 RPL for artisans (ARPL) \u2014 Trade Test preparation without completing a full apprenticeship\n" +
            "\u2022 ABET (Adult Basic Education and Training) \u2014 for workers with limited formal education\n\n" +
            "How RPL works:\n" +
            "1. Candidate is assessed against unit standards by an accredited assessor\n" +
            "2. Portfolio of Evidence (PoE) is compiled\n" +
            "3. ETQA moderates and issues certificate if competent\n\n" +
            "CHIETA funds RPL through Discretionary Grants.\n\n" +
            "Enquiries: info@chieta.org.za | [icon:call] 011\u00a0628\u00a07000",
    },
];
