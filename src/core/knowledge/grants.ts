import { KnowledgeTopic } from './index';

export const GRANTS_TOPICS: KnowledgeTopic[] = [
    // ── Mandatory Grants / WSP / ATR ────────────────────────────────────────────
    {
        patterns: [
            /\b(mandatory grant|wsp|atr|workplace skills plan|annual training report|sdl|skills development levy|mis portal|misqueries)\b/,
            /mandatory.*grant|grant.*mandatory/,
        ],
        response: (fy, yr) =>
            `Mandatory Grants \u2014 WSP / ATR (${fy})\n\n` +
            `Final submission deadline: 30 April ${yr} at 00:00 (midnight).\n\n` +
            `What to submit:\n` +
            `\u2022 ATR: Training completed 1 Jan ${yr - 1} \u2013 31 Dec ${yr - 1}\n` +
            `\u2022 WSP: Planned training for 1 Jan ${yr} \u2013 31 Dec ${yr}\n\n` +
            `Eligibility:\n` +
            `\u2022 SDL-paying employer with up-to-date payments\n` +
            `\u2022 Previously submitted WSP & ATR within prescribed timeframes\n\n` +
            `Mandatory Grants = 20% of your SDL contributions.\n\n` +
            `Benefits of submitting:\n` +
            `\u2022 Claim back 20% of levies paid\n` +
            `\u2022 Qualify for Discretionary Grants\n` +
            `\u2022 Accredited learnerships & skills programmes\n` +
            `\u2022 Reduced staff turnover & improved productivity\n\n` +
            `Extension window: 22\u201329 April ${yr} at 16:00 (not guaranteed)\n\n` +
            `Portals:\n` +
            `\u2022 https://ims.chieta.org.za \u2014 submit WSP/ATR\n` +
            `\u2022 https://mis.chieta.org.za \u2014 MIS system\n` +
            `\u2022 Technical queries: misqueries@chieta.org.za`,
    },

    // ── Discretionary Grants ────────────────────────────────────────────────────
    {
        patterns: [
            /\b(discretionary grant|dg cycle|project grant|dg fund|strategic project|cycle [1-4])\b/,
            /discretionary.*grant|grant.*discretionary/,
        ],
        response: (fy, yr) =>
            `Discretionary Grants (DG) \u2014 ${fy}\n\n` +
            `Multiple cycles per year, aligned to the CHIETA Sector Skills Plan (SSP).\n\n` +
            `Who can apply:\n` +
            `\u2022 Chemical sector employers who have submitted WSP/ATR\n` +
            `\u2022 Non-levy paying companies in the chemical sector\n` +
            `\u2022 CHIETA accredited training providers\n` +
            `\u2022 SMMEs, CBOs, CBCs, NPOs, NGOs, Co-ops (chemical sector)\n` +
            `\u2022 Government institutions & municipalities\n` +
            `\u2022 TVET/CET colleges and Higher Education Institutions\n\n` +
            `Eligible programmes: Learnerships, Apprenticeships, Bursaries, Skills Programmes, Research projects\n\n` +
            `How applications are evaluated:\n` +
            `\u2022 Alignment with CHIETA priorities & SSP\n` +
            `\u2022 Budget accuracy and value for money\n` +
            `\u2022 Organisational capacity & compliance\n` +
            `\u2022 Sector impact and transformation goals\n\n` +
            `Funding window:\n` +
            `\u2022 Advertised on www.chieta.org.za, CHIETA social media, and electronic media\n` +
            `\u2022 Open for 7 to 30 days per window\n` +
            `\u2022 Late, manual, or emailed applications are NOT accepted\n\n` +
            `Cycle 1 ${fy}: Opened 12 Nov ${yr - 1}, closed 12 Dec ${yr - 1} \u2014 feedback expected April ${yr}.\n\n` +
            `Apply at: https://ims.chieta.org.za\nDownload advert & proposal template: www.chieta.org.za`,
    },

    // ── How to Apply ─────────────────────────────────────────────────────────────
    {
        patterns: [
            /\b(how to apply|apply for|application process|get started|sign up)\b(?!.*(bursary|bursaries|learnership|scholarship|apprenticeship))/,
            /\bims\.chieta\b/,
            /ims portal(?!.*(help|password|login|log.?in|forgot|access|error|issue))/,
        ],
        response: (fy, yr) =>
            `How to Apply for CHIETA Programmes\n\n` +
            `1. Mandatory Grants (employers):\n   Log into https://ims.chieta.org.za, submit WSP/ATR before 30 April ${yr}.\n\n` +
            `2. Discretionary Grants (employers/organisations):\n   Watch for the DG window advert, download the proposal template, apply at https://ims.chieta.org.za.\n\n` +
            `3. Bursaries (students):\n   Apply at https://ims.chieta.org.za during the open bursary window.\n\n` +
            `4. Provider Accreditation:\n   Follow the process at www.chieta.org.za/about-us/what-we-do/etqa/\n\n` +
            `Registration steps:\n` +
            `\u2022 Create an IMS account at https://ims.chieta.org.za\n` +
            `\u2022 Upload signed SDF appointment letter on company letterhead\n` +
            `\u2022 Link your organisation and verify banking details\n\n` +
            `Need help? [icon:call] 087\u00a0357\u00a06608 | [icon:mail] info@chieta.org.za`,
    },

    // ── Required Documents ────────────────────────────────────────────────────────
    {
        patterns: [
            /\b(documents?|what do i need|b.bbee|bbbee|bbee|comply|compliance|tax clearance|registration)\b/,
        ],
        response:
            "Required Documents (varies by programme)\n\n" +
            "For Mandatory Grant (WSP/ATR):\n" +
            "\u2022 Valid B-BBEE certificate or sworn affidavit\n" +
            "\u2022 Updated WSP and ATR\n" +
            "\u2022 SARS tax clearance pin (CSD report or TCS pin)\n" +
            "\u2022 Company registration documents (CIPC)\n" +
            "\u2022 SDL proof (levy payments up to date)\n" +
            "\u2022 Signed appointment letter for SDF\n" +
            "\u2022 Banking details: stamped bank letter less than 3 months old\n\n" +
            "For Discretionary Grants:\n" +
            "\u2022 Completed online application (https://ims.chieta.org.za)\n" +
            "\u2022 Project proposal (download template from website)\n" +
            "\u2022 Declaration of Interest (relationships with CHIETA Board/management)\n" +
            "\u2022 B-BBEE certificate + company registration\n\n" +
            "For Bursaries (individuals):\n" +
            "\u2022 Certified SA ID (\u22646 months old)\n" +
            "\u2022 Certified Grade 12/Matric results\n" +
            "\u2022 Proof of tertiary registration\n" +
            "\u2022 Proof of household income\n" +
            "\u2022 Certified parents\u2019/guardian\u2019s ID copies\n\n" +
            "All applications submitted at: https://ims.chieta.org.za",
    },

    // ── Track Application ────────────────────────────────────────────────────────
    {
        patterns: [
            /\b(track|status|progress|where is my|check my|application status|application update|follow up)\b/,
        ],
        response: (fy, yr) =>
            `Tracking Your Application\n\n` +
            `\u2022 Log into https://ims.chieta.org.za \u2192 \u2018My Applications\u2019 to view your current status.\n` +
            `\u2022 Status updates are sent by email and appear as in-app notifications.\n` +
            `\u2022 For WSP/ATR: https://mis.chieta.org.za provides submission confirmations.\n\n` +
            `Expected feedback:\n` +
            `\u2022 Bursaries: No feedback by 30 Apr ${yr} = unsuccessful\n` +
            `\u2022 DG Cycle 1 ${fy}: April ${yr}\n\n` +
            `Direct follow-up:\n[icon:call] 087\u00a0357\u00a06608 | [icon:mail] info@chieta.org.za\n\n` +
            `Always quote your application/reference number.`,
    },

    // ── Deadlines ─────────────────────────────────────────────────────────────────
    {
        patterns: [
            /\b(deadlines?|closing date|due date|cut.off|upcoming dates?|key dates?|important dates?)\b/,
        ],
        response: (fy, yr) =>
            `Key CHIETA Dates & Deadlines\n\n` +
            `[icon:calendar] Mandatory Grants (WSP/ATR) ${fy}:\n` +
            `\u2022 Deadline: 30 April ${yr} at 00:00 (midnight)\n` +
            `\u2022 Extension window: 22\u201329 April ${yr} at 16:00 (not guaranteed)\n\n` +
            `[icon:calendar] Bursary ${fy}:\n` +
            `\u2022 Application window: 30 Jan \u2013 27 Feb ${yr} (now closed)\n` +
            `\u2022 No feedback by 30 Apr ${yr} = unsuccessful\n\n` +
            `[icon:calendar] Discretionary Grants Cycle 1 ${fy}:\n` +
            `\u2022 Closed: 12 Dec ${yr - 1} | Feedback: April ${yr}\n\n` +
            `[icon:calendar] Future windows: Subscribe at www.chieta.org.za for alerts.`,
    },

    // ── Bursaries ─────────────────────────────────────────────────────────────────
    {
        patterns: [
            /\b(bursary|bursaries|scholarship|study funding|student fund|tuition|university funding|tertiary|industrial futures|grade 12|matric)\b/,
        ],
        response: (fy, yr) =>
            `CHIETA Industrial Futures Bursary ${fy}\n\n` +
            `For unemployed South African youth accepted at an accredited public tertiary institution.\n\n` +
            `Value: Up to R76\u00a0000 per annum (undergraduate tuition)\n\n` +
            `Eligibility:\n` +
            `\u2022 SA citizen, aged 16\u201335\n` +
            `\u2022 Grade 12 (Matric) with Mathematics & Physical Science\n` +
            `\u2022 Minimum 75% overall average in Grade 12\n` +
            `\u2022 Accepted at a public tertiary institution or TVET college for ${yr}\n` +
            `\u2022 Preference: household income < R350\u00a0000/year\n\n` +
            `Priority fields: Chemical Engineering and qualifications in the CHIETA SSP.\n\n` +
            `Required documents:\n` +
            `\u2022 Certified SA ID (\u22646 months old)\n` +
            `\u2022 Certified Grade 12 results\n` +
            `\u2022 Proof of tertiary registration\n` +
            `\u2022 Proof of household income\n\n` +
            `Contact: Ms Dinky Dlamini \u2014 Bursary@chieta.org.za | 087\u00a0357\u00a06623\n` +
            `Apply at: https://ims.chieta.org.za`,
    },

    // ── Postgraduate Bursaries ────────────────────────────────────────────────────
    {
        patterns: [
            /\b(postgrad|post.graduate|honours|master's|masters degree|phd|doctoral|doctorate|research.*study.*fund)\b/,
        ],
        response: (_, yr) =>
            `Postgraduate Funding\n\n` +
            `CHIETA\u2019s Industrial Futures Bursary primarily covers undergraduate studies (up to R76\u00a0000/year).\n\n` +
            `For postgraduate studies:\n` +
            `\u2022 CHIETA occasionally funds Honours & Master\u2019s candidates in priority chemical sector fields\n` +
            `\u2022 Postgraduate research may qualify under Discretionary Grant (Research & Skills Planning)\n` +
            `\u2022 National Research Foundation (NRF): www.nrf.ac.za\n\n` +
            `Enquire about postgraduate options:\n[icon:mail] Bursary@chieta.org.za | [icon:call] 087\u00a0357\u00a06623 (Ms Dinky Dlamini)\n\n` +
            `Watch www.chieta.org.za for postgraduate-specific calls.`,
    },

    // ── Learnerships ──────────────────────────────────────────────────────────────
    {
        patterns: [
            /\b(learnerships?|apprenticeship|work.based|work based|artisan|trade test)\b/,
        ],
        response:
            "CHIETA Work-Based Learning Programmes\n\n" +
            "CHIETA funds the following work-based learning programmes:\n\n" +
            "\u2022 Learnerships \u2014 NQF-aligned, combining classroom & workplace experience (12\u201324 months)\n" +
            "\u2022 Apprenticeships \u2014 artisan/trade qualifications (e.g., chemical plant operators, instrumentation). Ends with a formal EISA trade test.\n" +
            "\u2022 Internships \u2014 workplace exposure for graduates & students (3\u201312 months)\n" +
            "\u2022 Skills Programmes \u2014 short accredited training modules; credits count toward full qualifications\n\n" +
            "All available to employed and unemployed individuals in the chemical sector.\n\n" +
            "To find learnerships:\n" +
            "\u2022 SSC portal: http://ssc.chieta.org.za\n" +
            "\u2022 Contact your nearest CHIETA regional office\n" +
            "\u2022 Accredited providers: www.chieta.org.za/about-us/what-we-do/etqa/provider-accreditation/",
    },

    // ── Programme Comparison ──────────────────────────────────────────────────────
    {
        patterns: [
            /\b(difference.*between|what.*difference|learnership.*vs|vs.*learnership|internship.*vs|apprenticeship.*vs|compare.*programme|learnership.*or.*internship)\b/,
        ],
        response:
            "Comparing CHIETA Programmes\n\n" +
            "[icon:library] Learnership (12\u201324 months)\n" +
            "\u2022 NQF-registered qualification (Level 2\u20135)\n" +
            "\u2022 Combines classroom + workplace experience\n" +
            "\u2022 Open to employed and unemployed individuals\n\n" +
            "[icon:construct] Apprenticeship (3\u20135 years)\n" +
            "\u2022 Artisan / trade qualification; ends with EISA trade test\n\n" +
            "[icon:briefcase] Internship (3\u201312 months)\n" +
            "\u2022 Practical workplace exposure for graduates/students\n" +
            "\u2022 Does not lead to a formal NQF qualification\n\n" +
            "[icon:document-text] Skills Programme (days to weeks)\n" +
            "\u2022 Short accredited training module\n" +
            "\u2022 Credits count towards a full qualification\n\n" +
            "For current opportunities: https://ims.chieta.org.za",
    },

    // ── Learner Stipend ────────────────────────────────────────────────────────────
    {
        patterns: [
            /\b(stipend|learner allowance|get paid|am i paid|paid.*learner|learner.*paid)\b/,
            /\b(allowance|remuneration)\b.*\b(learner|learnership|apprentice)\b/,
            /\b(learner|learnership|apprentice)\b.*\b(allowance|remuneration)\b/,
        ],
        response:
            "Learner Stipends & Allowances\n\n" +
            "Learners in CHIETA-funded programmes receive an allowance:\n\n" +
            "\u2022 Employed learners: Continue receiving normal salary + training support\n" +
            "\u2022 Unemployed learners: Monthly stipend (amount set per grant agreement)\n" +
            "\u2022 Apprentices: Wage per sectoral determination\n\n" +
            "Stipend amounts vary by NQF level, programme duration, and grant conditions.\n\n" +
            "For specific stipend values:\n[icon:call] 087\u00a0357\u00a06608 | [icon:mail] info@chieta.org.za\n" +
            "Or contact your nearest CHIETA regional office.",
    },

    // ── Processing Times ────────────────────────────────────────────────────────
    {
        patterns: [
            /\b(how long|processing time|when will i|turnaround|time.*take|take.*time|expected.*time|when.*paid|when.*funded|when.*hear)\b/,
        ],
        response: (fy, yr) =>
            `Application Processing Times\n\n` +
            `[icon:calendar] Mandatory Grants (WSP/ATR):\nPayment typically 3\u20134 months after 30 April deadline and assessment.\n\n` +
            `[icon:calendar] Discretionary Grants:\nFeedback 3\u20134 months after cycle closes (e.g., DG Cycle 1 ${fy}: feedback April ${yr}). Contract signing and payment follow approval.\n\n` +
            `[icon:calendar] Bursaries:\nOutcomes communicated by 30 April ${yr}. No feedback by that date = unsuccessful.\n\n` +
            `[icon:calendar] ETQA Accreditation:\n60 working days after a complete application is submitted.\n\n` +
            `For delays beyond these timeframes, always quote your reference number:\n[icon:call] 087\u00a0357\u00a06608 | [icon:mail] info@chieta.org.za`,
    },

    // ── Employer Registration ─────────────────────────────────────────────────────
    {
        patterns: [
            /\b(register.*employer|employer.*register|new employer|register.*chieta|register.*company|register.*sdf|employer.*registration)\b/,
        ],
        response:
            "Registering as an Employer with CHIETA\n\n" +
            "1. Confirm your company is in the chemical sector\n" +
            "2. Register with SARS for SDL (if payroll \u2265 R500\u00a0000/year)\n" +
            "3. Create an account: https://ims.chieta.org.za\n" +
            "4. Register your appointed SDF on the portal\n" +
            "5. Submit your first WSP by the April deadline\n\n" +
            "SDL threshold:\n" +
            "\u2022 Payroll \u2265 R500\u00a0000/year \u2192 mandatory 1% of payroll (SDL)\n" +
            "\u2022 Payroll < R500\u00a0000/year \u2192 SDL exempt, but may still access DG funding\n\n" +
            "[icon:call] 087\u00a0357\u00a06608 | [icon:mail] info@chieta.org.za",
    },

    // ── Appeals / Disputes ────────────────────────────────────────────────────────
    {
        patterns: [
            /\b(appeal|dispute|rejected|declined|unsuccessful application|reconsider|grievance|complain.*chieta|chieta.*complain)\b/,
        ],
        response:
            "Appealing a Decision or Lodging a Complaint\n\n" +
            "If your application was declined:\n" +
            "1. Review the outcome letter for stated reasons\n" +
            "2. Submit a written appeal to info@chieta.org.za within 30 days of the decision\n" +
            "3. Include your reference number and supporting motivation\n" +
            "4. CHIETA will acknowledge within 5 working days\n\n" +
            "Common reasons for unsuccessful applications:\n" +
            "\u2022 Incomplete documentation\n" +
            "\u2022 Late submission\n" +
            "\u2022 Non-alignment with funding criteria\n" +
            "\u2022 Budget inconsistencies\n" +
            "\u2022 Failure to meet compliance requirements\n\n" +
            "For general complaints:\n[icon:mail] info@chieta.org.za | [icon:call] 087\u00a0357\u00a06608\n\n" +
            "[icon:warning] CHIETA does not charge any fees for reviews or appeals.",
    },

    // ── Tenders / Procurement ─────────────────────────────────────────────────────
    {
        patterns: [
            /\b(tender|procurement|rfp|rfq|vendor|supplier registration|service provider|supply chain|central supplier|csd.*database)\b/,
        ],
        response:
            "CHIETA Tenders & Procurement\n\n" +
            "CHIETA procures in line with the PFMA and Supply Chain Management policies.\n\n" +
            "Where to find tenders:\n" +
            "\u2022 www.chieta.org.za \u2192 \u2018Tenders\u2019 section\n" +
            "\u2022 eTenders portal: www.etenders.gov.za\n\n" +
            "Supplier registration requirements:\n" +
            "\u2022 Central Supplier Database (CSD): www.csd.gov.za\n" +
            "\u2022 Valid B-BBEE certificate\n" +
            "\u2022 SARS tax clearance pin\n\n" +
            "For procurement queries:\n[icon:mail] info@chieta.org.za | [icon:call] 087\u00a0357\u00a06608\n\n" +
            "[icon:warning] CHIETA never solicits payments from suppliers. Report anything suspicious to 0800 333 120.",
    },
];
