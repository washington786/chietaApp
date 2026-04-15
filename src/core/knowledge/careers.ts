import { KnowledgeTopic } from './index';

export const CAREERS_TOPICS: KnowledgeTopic[] = [
    // ── General career guidance ─────────────────────────────────────────────────
    {
        patterns: [
            /\b(career|job|vacanc|employ|post|position|hiring)\b/,
            /\b(career guidance|career path|what career|which career|chemical.*career)\b/,
        ],
        response:
            "Careers in the Chemical Sector\n\n" +
            "The chemical industry employs over 170\u00a0000 people and contributes ~25% of SA\u2019s manufacturing output.\n\n" +
            "Career categories:\n" +
            "\u2022 Engineering: Chemical, Mechanical, Electrical, Civil, Mechatronic, Materials\n" +
            "\u2022 Artisan trades: Boilermaker, Electrician, Welder, Fitter & Turner, Instrument Mechanician, Millwright\n" +
            "\u2022 Science: Chemist, Geologist, Materials Scientist, SHEQ Practitioner, Water Quality Analyst\n" +
            "\u2022 Medicine/Pharma: Pharmacist, Industrial Pharmacist, Medical Scientist\n" +
            "\u2022 IT/Digital: Software Developer, Data Scientist, Network Engineer, Systems Analyst\n" +
            "\u2022 Business: Finance Manager, HR Manager, Operations/Logistics Manager, Supply Chain\n" +
            "\u2022 Green/Energy: Energy Engineer, Biofuels Engineer, Environmental Compliance\n\n" +
            "CHIETA vacancies (internal & sector):\n" +
            "www.chieta.org.za/careers/vacancies/\n\n" +
            "Work placement (CV submissions):\n" +
            "ssdd@chieta.org.za | https://chieta.org.za/careers/vacancies/\n\n" +
            "Follow @CHIETA_SETA on social media for vacancy announcements.",
    },
    // ── Engineering careers ────────────────────────────────────────────────────
    {
        patterns: [
            /\b(engineering career|chemical engineer|mechanical engineer|electrical engineer|civil engineer|mechatronic|materials engineer|ecsa)\b/,
        ],
        response:
            "Engineering Careers in the Chemical Sector\n\n" +
            "Popular careers:\n" +
            "\u2022 Chemical Engineer\n" +
            "\u2022 Civil / Mechanical / Electrical / Mechatronic Engineer\n" +
            "\u2022 Materials Engineer / Fuel Cell Engineer\n\n" +
            "Minimum Requirements:\n" +
            "\u2022 National Senior Certificate (Matric)\n" +
            "\u2022 Mathematics (compulsory)\n" +
            "\u2022 Physical Sciences (compulsory)\n\n" +
            "For professional registration, graduates register with:\nEngineering Council of South Africa (ECSA) \u2014 0861 225 555\n\n" +
            "CHIETA funds Chemical Engineers through bursaries and Work Integrated Learning (NQF Level 6).",
    },
    // ── Artisan / trade careers ────────────────────────────────────────────────
    {
        patterns: [
            /\b(artisan|boilermaker|electrician|welder|fitter.*turner|instrument mechanician|millwright|trade.*career|artisan.*career)\b/,
        ],
        response:
            "Artisan & Trade Careers\n\n" +
            "Examples of trades in the chemical sector:\n" +
            "\u2022 Boilermaker\n" +
            "\u2022 Electrician\n" +
            "\u2022 Welder / Welding Inspector\n" +
            "\u2022 Fitter & Turner (Machine Fitter)\n" +
            "\u2022 Instrument Mechanician\n" +
            "\u2022 Millwright (Electromechanician)\n" +
            "\u2022 Chemical Plant Controller / Process Technician\n\n" +
            "Entry Requirement: Minimum Grade 9 (varies by pathway)\n\n" +
            "Qualification Routes:\n" +
            "\u2022 Apprenticeship\n" +
            "\u2022 Learnership (NQF Level 4)\n" +
            "\u2022 RPL \u2014 Artisan Recognition of Prior Learning (ARPL)\n\n" +
            "All artisans must pass a Trade Test (EISA).\n\n" +
            "CHIETA funds these through Apprenticeships Grant, Learnerships Grant, and RPL programmes.",
    },
    // ── Green / renewable energy careers ──────────────────────────────────────
    {
        patterns: [
            /\b(green skill|green.*job|green.*training|green.*chemist|sustainable.*skill|renewable energy.*skill|just transition|climate.*skill|low.?carbon|hydrogen|biofuel)\b/,
        ],
        response:
            "Green Skills & Emerging Careers\n\n" +
            "South Africa is transitioning toward renewable energy and a Hydrogen Economy.\n\n" +
            "Emerging careers:\n" +
            "\u2022 Energy Engineer / Biofuels Engineer\n" +
            "\u2022 Energy Auditor\n" +
            "\u2022 Environmental Compliance Officer / Environmental Scientist\n" +
            "\u2022 Green chemistry & sustainable manufacturing roles\n\n" +
            "CHIETA supports the Just Energy Transition through:\n" +
            "\u2022 Learnerships and skills programmes with sustainability focus\n" +
            "\u2022 Discretionary Grants for green skills projects\n" +
            "\u2022 Bursaries in Chemical Engineering and related fields\n\n" +
            "For current programmes: www.chieta.org.za \u2192 SSP\n[icon:mail] info@chieta.org.za",
    },
    // ── Study requirements ─────────────────────────────────────────────────────
    {
        patterns: [
            /\b(study requirements?|entry requirements?|what subjects|which subjects|matric requirements|minimum requirements)\b/,
        ],
        response:
            "Study Requirements for Chemical Sector Careers\n\n" +
            "Most technical careers require:\n" +
            "\u2022 National Senior Certificate (Matric)\n" +
            "\u2022 Mathematics (compulsory for Engineering & Science)\n" +
            "\u2022 Physical Sciences (compulsory for Engineering & Science)\n" +
            "\u2022 Life Sciences (recommended for Medicine/Pharma)\n\n" +
            "Each university and TVET college sets its own entry requirements.\n" +
            "TVET students: N3 is equivalent to Matric for CHIETA bursary eligibility.\n\n" +
            "Not in Grade 12 yet? Build your foundation in Mathematics and Sciences now.",
    },
    // ── SSDD work placement platform ──────────────────────────────────────────
    {
        patterns: [
            /\b(ssdd|work placement|work.integrated learning|wil|cv upload|send.*cv|upload.*cv|placement platform)\b/,
        ],
        response:
            "CHIETA Work Placement & SSDD Platform\n\n" +
            "CHIETA\u2019s SSDD functionality helps connect learners with employers.\n\n" +
            "For learners seeking placement:\n" +
            "\u2022 Upload your CV at: https://chieta.org.za/careers/vacancies/\n" +
            "\u2022 Or email: ssdd@chieta.org.za\n" +
            "\u2022 The SSDD administrator will notify you if updates are required\n\n" +
            "For employers seeking CVs:\n" +
            "\u2022 Request CVs from the SSDD administrator for specific placement requirements\n\n" +
            "Placement tracking: CHIETA monitors placement progress and reports on successful CV matches.",
    },
];
