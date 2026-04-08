// ─────────────────────────────────────────────────────────────────────────────
// CHIETA Assistant — Bot routing layer
// Content lives in src/core/knowledge/ — this file handles routing only.
// ─────────────────────────────────────────────────────────────────────────────
import { ALL_TOPICS } from '../knowledge';

export const SUGGESTIONS = [
    { icon: 'help-circle', label: 'What is CHIETA?' },
    { icon: 'file-text', label: 'How do I apply for a grant?' },
    { icon: 'award', label: 'Bursaries & learnerships' },
    { icon: 'briefcase', label: 'Career opportunities' },
    { icon: 'map-pin', label: 'Find my regional office' },
    { icon: 'phone', label: 'Contact & support' },
] as const;

export const QUICK_CHIPS = [
    'Tell me more',
    'Eligibility requirements',
    'Application deadlines',
    'Required documents',
    'Track my application',
    'Smart Skills Centres',
    'SMME support',
    'Report fraud',
    'What is SDL?',
    'NQF levels explained',
    'Learner stipend',
    'IMS portal help',
    'Career guidance',
    'Payment timeline',
    'Inter-SETA transfer',
    'Whistleblowing',
    'SPOI occupations',
    'Tax rebates',
    'RPL / prior learning',
    'M&E system',
];

// ─────────────────────────────────────────────────────────────────────────────
// Normalise input (handle smart quotes, lowercase)
// ─────────────────────────────────────────────────────────────────────────────
function norm(s: string): string {
    return s.toLowerCase().replace(/[\u2018\u2019]/g, "'");
}


// ───────────────────────────────────────────────────────────────────────────────
// Dynamic year helpers — no hardcoded years needed
// yr()  = current year (e.g. 2026)   nyr() = next year
// fy()  = financial year string e.g. "2026/27"
// ───────────────────────────────────────────────────────────────────────────────
function yr(): number { return new Date().getFullYear(); }
function nyr(): number { return new Date().getFullYear() + 1; }
function fy(): string { const y = yr(); return `${y}/${String(y + 1).slice(2)}`; }

// ───────────────────────────────────────────────────────────────────────────────
// Levenshtein distance + fuzzy keyword match (typo tolerance)
// ───────────────────────────────────────────────────────────────────────────────
function levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
        Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    return dp[m][n];
}

/** Returns true if any word in `input` is within `maxDist` edits of `keyword`. */
function fuzzy(input: string, keyword: string, maxDist = 2): boolean {
    return input.split(/\s+/).some(w => levenshtein(w, keyword) <= maxDist && w.length >= keyword.length - 1);
}
// ─────────────────────────────────────────────────────────────────────────────
// Main reply function
// ─────────────────────────────────────────────────────────────────────────────
export interface BotMessage { role: 'user' | 'bot'; text: string; }

export function getBotReply(
    input: string,
    hasAttachments: boolean,
    history: BotMessage[] = [],
): string {
    if (hasAttachments)
        return "Thank you for sharing that file. Our team will review it and get back to you shortly. For urgent queries contact info@chieta.org.za or call 087\u00a0357\u00a06608.";

    const q = norm(input);

    // ── Context-aware follow-ups (multi-turn) ─────────────────────────────────
    // Short affirmations expand on the last bot topic (but NOT "tell me more"
    // which always goes to the explicit topic-menu handler below)
    const isFollowUp = /^(yes|sure|ok|okay|go on|more|please|continue|elaborate|expand)[.!?]?$/.test(q.trim());
    if (isFollowUp && history.length >= 2) {
        const lastBotMsg = [...history].reverse().find(m => m.role === 'bot');
        if (lastBotMsg) {
            const firstLine = lastBotMsg.text.split('\n')[0].toLowerCase();
            const redir = getBotReply('tell me more about ' + firstLine, false);
            // Don't re-serve the same content that was just shown
            const isDuplicate = redir.split('\n')[0].toLowerCase() === lastBotMsg.text.split('\n')[0].toLowerCase();
            if (redir && !redir.startsWith("I didn") && !isDuplicate) return redir;
            // No further expansion available — tell the user politely
            return "I've already shared everything available on that topic.\n\nFeel free to ask about something else, or tap a chip below. You can also reach us directly:\n\n[icon:call] 087\u00a0357\u00a06608 | [icon:mail] info@chieta.org.za";
        }
    }

    // ── Greetings ─────────────────────────────────────────────────────────────
    if (/\b(hi|hello|hey|howzit|good morning|good day|good afternoon|good evening|sawubona|hola)\b/.test(q))
        return "Hello! I'm the CHIETA Assistant. I can help with grants, bursaries, learnerships, skills programmes, career opportunities, Smart Skills Centres, and more.\n\nWhat would you like to know today?";

    // ── Knowledge modules (modular topic matching) ────────────────────────────
    for (const topic of ALL_TOPICS) {
        if (topic.patterns.some(p => p.test(q))) {
            const res = topic.response;
            return typeof res === 'function' ? res(fy(), yr()) : res;
        }
    }

    // ── About CHIETA ──────────────────────────────────────────────────────────
    if (/\b(what is chieta|who is chieta|about chieta|chieta seta|tell me about chieta|overview|mission|mandate)\b/.test(q)
        || (q.includes('chieta') && /\b(mean|stand|stands|acronym|abbreviation)\b/.test(q)))
        return "CHIETA stands for the Chemical Industries Education & Training Authority \u2014 a statutory body established by the Skills Development Act 97 of 1998, overseen by the Department of Higher Education and Training (DHET).\n\nOur purpose is to facilitate skills development in the chemical industries sector through training, learnerships, bursaries, and grants.\n\nKey achievements:\n\u2022 74\u00a0742 learners supported\n\u2022 630 SMMEs supported\n\u2022 211 cooperatives supported\n\u2022 3\u00a0720 certificates issued by CHIETA ETQA\n\u2022 Rated one of the best SETAs in South Africa with consecutive clean audits\n\nWebsite: www.chieta.org.za";

    // ── Sub-sectors ───────────────────────────────────────────────────────────
    if (/\b(sector|sub.?sector|industry|industries|petroleum|base chemical|glass|explosive|fertiliser|fertilizer|pharmaceutical|fmcg|consumer goods|speciality|specialty|surface coating|coatings)\b/.test(q)
        && !/\b(grant|bursary|learnership|career|job)\b/.test(q))
        return "CHIETA covers the following chemical industries sub-sectors:\n\n\u2022 Petroleum\n\u2022 Base Chemicals\n\u2022 Glass\n\u2022 Explosives\n\u2022 Fertilisers\n\u2022 Pharmaceuticals\n\u2022 Fast Moving Consumer Goods (FMCG)\n\u2022 Speciality Chemicals\n\u2022 Surface Coatings\n\nIf your company or studies fall within any of these sectors you may be eligible for CHIETA funding and support programmes.";

    // ── Mandatory Grants / WSP / ATR ──────────────────────────────────────────
    if (/\b(mandatory grant|wsp|atr|workplace skills plan|annual training report|sdl|skills development levy|mis portal|misqueries)\b/.test(q)
        || (q.includes('mandatory') && q.includes('grant')))
        return `Mandatory Grants \u2014 WSP / ATR (${fy()})\n\nThe WSP/ATR system is currently open. Final submission deadline: 30 April ${yr()} at 00:00 (midnight).\n\nWhat to submit:\n\u2022 ATR: Report all training completed 1 Jan ${yr() - 1} \u2013 31 Dec ${yr() - 1}\n\u2022 WSP: Submit planned training for 1 Jan ${yr()} \u2013 31 Dec ${yr()}\n\nEligibility:\n\u2022 Registered employer paying Skills Development Levy (SDL)\n\u2022 Up to date with SDL payments\n\u2022 Previously submitted WSP & ATR within prescribed timeframes\n\nMandatory Grants = 20% of your SDL contributions.\n\nExtensions: 22\u201329 April ${yr()} at 16:00 (not guaranteed)\n\nPortals:\n\u2022 https://ims.chieta.org.za \u2014 submit WSP/ATR\n\u2022 https://mis.chieta.org.za \u2014 MIS system\n\u2022 Technical queries: misqueries@chieta.org.za`;

    // ── Discretionary Grants ──────────────────────────────────────────────────
    if (/\b(discretionary grant|dg cycle|project grant|dg fund|strategic project|cycle [1-4])\b/.test(q)
        || (q.includes('discretionary') && q.includes('grant')))
        return `Discretionary Grants (DG) \u2014 ${fy()}\n\nMultiple cycles per year, aligned to the CHIETA Sector Skills Plan (SSP).\n\nWho can apply:\n\u2022 Chemical sector employers who have submitted WSP/ATR\n\u2022 Non-levy paying companies in the chemical sector\n\u2022 CHIETA accredited training providers\n\u2022 SMMEs, CBOs, CBCs, NPOs, NGOs, Co-ops (chemical sector)\n\u2022 Government institutions & municipalities\n\u2022 TVET/CET colleges and Higher Education Institutions\n\nCycle 1 ${fy()}: Opened 12 Nov ${yr() - 1}, closed 12 Dec ${yr() - 1} \u2014 feedback expected April ${yr()}.\n\nApply at: https://ims.chieta.org.za\nDownload advert & proposal template: www.chieta.org.za`;

    // ── Bursaries ─────────────────────────────────────────────────────────────
    if (/\b(bursary|bursaries|scholarship|study funding|student fund|tuition|university funding|tertiary|industrial futures|grade 12|matric)\b/.test(q))
        return `CHIETA Industrial Futures Bursary ${fy()}\n\nFor unemployed South African youth accepted at an accredited public tertiary institution.\n\nValue: Up to R76\u00a0000 per annum (undergraduate tuition)\n\nEligibility:\n\u2022 SA citizen, aged 16\u201335\n\u2022 Grade 12 (Matric) with Mathematics & Physical Science\n\u2022 Minimum 75% overall average in Grade 12\n\u2022 Accepted at a public tertiary institution or TVET college for ${yr()}\n\u2022 Preference: household income < R350\u00a0000/year; or \u2018missing middle\u2019 (R350k\u2013R600k)\n\nPriority fields: Chemical Engineering and qualifications in the CHIETA SSP.\n\nSub-sectors: Petroleum, Base Chemicals, Glass, Explosives, Fertilisers, Pharmaceuticals, FMCG, Speciality Chemicals, Surface Coatings\n\nRequired documents:\n\u2022 Certified SA ID (\u22646 months old)\n\u2022 Certified Grade 12 results\n\u2022 Proof of tertiary registration\n\u2022 Proof of household income\n\u2022 Certified parents\u2019/guardian\u2019s ID copies\n\nContact: Ms Dinky Dlamini \u2014 Bursary@chieta.org.za | 087\u00a0357\u00a06623\nApply at: https://ims.chieta.org.za`;

    // ── Learnerships ──────────────────────────────────────────────────────────
    if (/\b(learnerships?|apprenticeship|learner|work.based|work based|artisan|trade test)\b/.test(q)
        && !/\b(stipend|allowance|ceibs)\b/.test(q))
        return "CHIETA funds work-based learning programmes including:\n\n\u2022 Learnerships \u2014 NQF-aligned, combining classroom & workplace experience (12\u201324 months)\n\u2022 Apprenticeships \u2014 artisan/trade qualifications (e.g. chemical plant operators, instrumentation)\n\u2022 Internships \u2014 workplace exposure for graduates & students\n\u2022 Skills Programmes \u2014 shorter accredited training modules\n\nAvailable to employed and unemployed individuals in the chemical sector.\n\nTo find learnerships:\n\u2022 SSC portal: http://ssc.chieta.org.za\n\u2022 Contact your nearest CHIETA regional office\n\u2022 Accredited providers: www.chieta.org.za/about-us/what-we-do/etqa/provider-accreditation/";

    // ── Skills Programmes / Training ──────────────────────────────────────────
    if (/\b(skills programmes?|training programmes?|short course|upskill|nqf level|accredited courses?|programmes?)\b/.test(q)
        && !/\b(grant|bursary|learnerships?|ceibs)\b/.test(q))
        return "CHIETA funds a wide range of skills development programmes:\n\n\u2022 Skills Programmes (short, accredited courses)\n\u2022 Full qualifications & learnerships\n\u2022 Apprenticeships & trade tests\n\u2022 Bursaries for tertiary studies\n\u2022 SMME entrepreneurship programmes\n\nAll programmes must be delivered by a CHIETA-accredited training provider.\n\nList of accredited providers:\nwww.chieta.org.za/about-us/what-we-do/etqa/provider-accreditation/\n\nAlso check the QCTO database at qcto.org.za";

    // ── ETQA / Accreditation ──────────────────────────────────────────────────
    if (/\b(etqa|accredit|provider accredit|quality assurance|sdp|training provider|qcto|certificates issued|certificate)\b/.test(q))
        return "CHIETA ETQA \u2014 Education & Training Quality Assurance\n\nCHIETA\u2019s ETQA unit accredits training providers and quality-assures learning programmes in the chemical sector.\n\n\u2022 Apply to become an accredited provider: www.chieta.org.za\n\u2022 Accreditation documents: www.chieta.org.za/about-us/what-we-do/etqa/provider-accreditation/\n\u2022 QCTO database of accredited SDPs: qcto.org.za\n\nCHIETA has issued 3\u00a0720+ certificates.\n\nFor ETQA queries attend CHIETA\u2019s quarterly workshops (invitations posted on website) or email info@chieta.org.za.";

    // ── Smart Skills Centres ──────────────────────────────────────────────────
    if (/\b(smart skills centres?|smart skills cent[er]+|ssc|smart centre|digital innovation|free internet|learning space|book boardroom)\b/.test(q))
        return "CHIETA Smart Skills Centres (SSC)\n\n\u201cEmpowering Communities Through Digital Innovation\u201d\n\n9 centres \u2014 one per province \u2014 offering:\n\u2022 Free internet access\n\u2022 Educational training & programmes\n\u2022 Job-seeker preparation (CV writing, interview practice)\n\u2022 Boardroom bookings for entrepreneurs\n\u2022 Digital skills & computer access\n\nOver 60\u00a0000 visits recorded.\n\nCentres include:\n\u2022 NW \u2013 Brits | LP \u2013 Letaba | + 7 other provincial centres\n\nFind your nearest SSC, book a boardroom or sign in at:\nhttp://ssc.chieta.org.za";

    // ── SMME / Entrepreneur Support ───────────────────────────────────────────
    if (/\b(smmes?|small business|entrepreneur|cooperative|co.op|ngo|npo|cbo|cbc|non.levy|non levy)\b/.test(q))
        return "CHIETA SMME & Entrepreneur Support\n\nCHIETA has supported 630+ SMMEs and 211+ cooperatives in the chemical sector.\n\nSupport initiatives:\n\u2022 Discretionary Grant funding for non-levy paying SMMEs in the chemical sector\n\u2022 SMME Entrepreneurs Innovating for Impact (with CEIBS Africa) \u2014 8-month virtual innovation & entrepreneurship programme\n\u2022 Smart Skills Centres for free internet, business planning, and digital resources\n\nTo apply for DG funding as an SMME/NGO/Co-op:\n\u2022 Must operate within the chemical sector\n\u2022 Apply during a DG window at https://ims.chieta.org.za\n\u2022 Contact your regional CHIETA office for guidance";

    // ── Career Opportunities ──────────────────────────────────────────────────
    if (/\b(career|job|vacanc|employ|post|position|hiring)\b/.test(q))
        return "Career Opportunities at CHIETA & the Chemical Sector\n\nCHIETA regularly posts vacancies \u2014 both internal CHIETA positions and sector opportunities.\n\nRecent CHIETA vacancies have included:\n\u2022 Regional Administrators (various provinces)\n\u2022 Project Specialists\n\u2022 Grants Specialists\n\u2022 ICT Support Interns (Smart Skills Centres)\n\u2022 Regional Skills Advisors\n\u2022 Administration Support Interns\n\nChemical sector career guidance:\nwww.chieta.org.za/careers/careers-in-the-chemical-industry-sector/\n\nAll live vacancies:\nwww.chieta.org.za/careers/vacancies/\n\nFollow @CHIETA_SETA on social media for vacancy announcements.";

    // ── Contact & Support (head office) ──────────────────────────────────────
    if (/\b(contact|call|phone|email|reach|support|help|helpdesk|head office|address|telephone)\b/.test(q)
        && !/\b(region|province|western cape|cape town|kwazulu|kzn|eastern cape|limpopo|mpumalanga|north west|free state|gauteng)\b/.test(q)
        && !/\b(portal|ims|mis)\b/.test(q))
        return "CHIETA Contact Details\n\n[icon:location] Head Office:\nAllandale Building, 3rd Floor, Office B\n23 Magwa Crescent, Waterfall City, 2090\n\n[icon:call] Main Lines:\n\u2022 087 357 6608\n\u2022 011 628 7000\n\n[icon:mail] General: info@chieta.org.za\n[icon:mail] Bursaries: Bursary@chieta.org.za\n[icon:mail] MIS/Technical: misqueries@chieta.org.za\n\n[icon:time] Hours: Mon\u2013Fri, 08:00\u201316:30\n\n[icon:alert-circle] Anti-Fraud Hotline: 0800 333 120 (toll-free)\n\nSocial: @CHIETA_SETA (Twitter/X \u2022 LinkedIn \u2022 Facebook \u2022 YouTube)";

    // ── Regional Offices ──────────────────────────────────────────────────────
    if (/\b(region|regional office|province|western cape|cape town|kwazulu|kzn|natal|eastern cape|limpopo|mpumalanga|north west|free state|gauteng|pretoria|durban|port elizabeth|gqeberha)\b/.test(q))
        return "CHIETA Regional Offices\n\n[icon:globe] GP / LP / MP / NW / FS\nNtombi Seruto \u2014 nseruto@chieta.org.za | 011\u00a0628\u00a07000\n\n[icon:globe] Western Cape / Northern Cape\nFaith Gcali \u2014 FGcali@chieta.org.za | 021\u00a0551\u00a01113/4\n\n[icon:globe] KwaZulu-Natal\nVanessa Mthembu \u2014 vmthembu@chieta.org.za | 031\u00a0368\u00a04040\n\n[icon:globe] Eastern Cape\nShanice Moodley \u2014 spotberg@chieta.org.za | 041\u00a0509\u00a06478\n\nDiscretionary Grant DG contacts:\n\u2022 GP: Brenda Ledwaba \u2014 bledwaba@chieta.org.za | 087\u00a0357\u00a06608\n\u2022 WC: Faith Gcali \u2014 087\u00a0357\u00a06695\n\u2022 KZN: Vanessa Mthembu \u2014 087\u00a0353\u00a05573\n\u2022 EC: Shanice Moodley \u2014 087\u00a0353\u00a05573";

    // ── Fraud Reporting ───────────────────────────────────────────────────────
    if (/\b(fraud|anti.fraud|corrupt|whistle.blow|irregularity|misconduct|scam)\b/.test(q))
        return "Reporting Fraud or Misconduct\n\n[icon:alert-circle] Anti-Fraud Hotline: 0800 333 120 (toll-free, anonymous)\n\n[icon:mail] Also report to: info@chieta.org.za\n\nAll reports are treated confidentially. CHIETA has received successive clean audit outcomes.\n\n[icon:warning] Warning: Anyone asking you to pay money to access CHIETA grants or learnerships is committing fraud. CHIETA does not charge applicants any fees. Do not share personal banking details with anyone claiming to represent CHIETA.";

    // ── Deadlines / Dates ─────────────────────────────────────────────────────
    if (/\b(deadlines?|closing date|due date|cut.off|upcoming dates?|key dates?|important dates?)\b/.test(q))
        return `Key CHIETA Dates & Deadlines\n\n[icon:calendar] Mandatory Grants (WSP/ATR) ${fy()}:\n\u2022 Deadline: 30 April ${yr()} at 00:00 (midnight)\n\u2022 Extension window: 22\u201329 April ${yr()} at 16:00 (not guaranteed)\n\n[icon:calendar] Bursary ${fy()}:\n\u2022 Application window: 30 Jan \u2013 27 Feb ${yr()} (now closed)\n\u2022 No feedback by 30 Apr ${yr()} = unsuccessful\n\n[icon:calendar] Discretionary Grants Cycle 1 ${fy()}:\n\u2022 Closed: 12 Dec ${yr() - 1} | Feedback: April ${yr()}\n\n[icon:calendar] Future windows: Subscribe to the CHIETA newsletter at www.chieta.org.za for alerts.`;

    // ── Required Documents ────────────────────────────────────────────────────
    if (/\b(documents?|what do i need|b.bbee|bbbee|bbee|comply|compliance|tax clearance|registration)\b/.test(q))
        return "Required Documents (varies by programme)\n\nFor Mandatory Grant (WSP/ATR):\n\u2022 Valid B-BBEE certificate\n\u2022 Updated WSP and ATR\n\u2022 SARS tax clearance pin\n\u2022 Company registration documents\n\u2022 SDL proof (levy payments up to date)\n\nFor Discretionary Grants:\n\u2022 Completed online application (https://ims.chieta.org.za)\n\u2022 Project proposal (download template from website)\n\u2022 Declaration of interest\n\u2022 B-BBEE certificate + company registration\n\nFor Bursaries (individuals):\n\u2022 Certified SA ID (\u22646 months old)\n\u2022 Certified Grade 12/Matric results\n\u2022 Proof of tertiary registration\n\u2022 Proof of household income\n\u2022 Certified parents\u2019/guardian\u2019s ID copies\n\nAll applications submitted at: https://ims.chieta.org.za";

    // ── How to Apply ──────────────────────────────────────────────────────────
    if (/\b(how to apply|apply for|application process|get started|sign up|ims\.chieta)\b/.test(q)
        || (/\bims portal\b/.test(q) && !/\b(help|password|login|log.?in|forgot|access|error|issue)\b/.test(q)))
        return `How to Apply for CHIETA Programmes\n\n1. Mandatory Grants (employers):\n   Log into https://ims.chieta.org.za, submit WSP/ATR before 30 April ${yr()}.\n\n2. Discretionary Grants (employers/organisations):\n   Watch for the DG window advert, download the proposal template, apply at https://ims.chieta.org.za.\n\n3. Bursaries (students):\n   Apply at https://ims.chieta.org.za during the open bursary window.\n\n4. Provider Accreditation:\n   Follow the process at www.chieta.org.za/about-us/what-we-do/etqa/\n\nNeed help? [icon:call] 087 357 6608 | [icon:mail] info@chieta.org.za`;

    // ── Track Application ─────────────────────────────────────────────────────
    if (/\b(track|status|progress|where is my|check my|application status|application update|follow up)\b/.test(q))
        return `Tracking Your Application\n\n\u2022 Log into https://ims.chieta.org.za \u2192 \u2018My Applications\u2019 to view your current status.\n\u2022 Status updates are sent by email and appear as in-app notifications.\n\u2022 For WSP/ATR: https://mis.chieta.org.za provides submission confirmations.\n\nExpected feedback:\n\u2022 Bursaries: No feedback by 30 Apr ${yr()} = unsuccessful\n\u2022 DG Cycle 1 ${fy()}: April ${yr()}\n\nDirect follow-up:\n[icon:call] 087 357 6608 | [icon:mail] info@chieta.org.za\n\nAlways quote your application/reference number.`;


    // \u2500\u2500 NQF Levels \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(nqf|national qualifications framework)\b/.test(q))
        return "NQF \u2014 National Qualifications Framework\n\nSouth Africa\u2019s NQF has 10 levels:\n\n\u2022 Level 1 \u2013 Grade 9 / ABET Level 4\n\u2022 Level 2 \u2013 Grade 10\n\u2022 Level 3 \u2013 Grade 11\n\u2022 Level 4 \u2013 Grade 12 (Matric) / N3\n\u2022 Level 5 \u2013 Higher Certificate\n\u2022 Level 6 \u2013 Diploma / Advanced Certificate\n\u2022 Level 7 \u2013 Bachelor\u2019s Degree\n\u2022 Level 8 \u2013 Honours / Postgraduate Diploma\n\u2022 Level 9 \u2013 Master\u2019s Degree\n\u2022 Level 10 \u2013 Doctoral Degree (PhD)\n\nLearnerships are typically NQF Level 2\u20135. Skills programmes award credits towards NQF qualifications.\n\nFor CHIETA-funded qualifications by NQF level: www.chieta.org.za";

    // \u2500\u2500 SDF (Skills Development Facilitator) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(sdf|skills development facilitator)\b/.test(q))
        return "Skills Development Facilitator (SDF)\n\nAn SDF is the person responsible for implementing the Skills Development Act within a company.\n\nSDF Responsibilities:\n\u2022 Compile and submit the Workplace Skills Plan (WSP)\n\u2022 Submit the Annual Training Report (ATR)\n\u2022 Liaise with CHIETA on grants, learnerships, and programmes\n\u2022 Advise management on skills development requirements\n\nDo I need an SDF?\n\u2022 All SDL-paying companies must appoint an SDF\n\u2022 Smaller employers may share an SDF or appoint a consultant\n\nRegister your SDF: https://ims.chieta.org.za\n[icon:mail] misqueries@chieta.org.za | [icon:call] 011\u00a0628\u00a07000";

    // \u2500\u2500 Learner Stipend / Allowance \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(stipend|learner allowance|get paid|am i paid|paid.*learner|learner.*paid)\b/.test(q)
        || (/\b(allowance|remuneration)\b/.test(q) && /\b(learner|learnership|apprentice)\b/.test(q)))
        return "Learner Stipends & Allowances\n\nLearners in CHIETA-funded programmes receive an allowance:\n\n\u2022 Employed learners: Continue receiving normal salary + training support\n\u2022 Unemployed learners: Monthly stipend (amount set per grant agreement)\n\u2022 Apprentices: Wage per sectoral determination\n\nStipend amounts vary by NQF level, programme duration, and grant conditions.\n\nFor specific stipend values:\n[icon:call] 087\u00a0357\u00a06608 | [icon:mail] info@chieta.org.za\nOr contact your nearest CHIETA regional office.";

    // \u2500\u2500 Portal Login / Password Help \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(forgot.*password|reset.*password|can't log|cannot log|login.*issue|portal.*access|portal.*error|system error|ims.*login|mis.*login|portal.*help|ims.*help|help.*portal)\b/.test(q)
        || (/\b(password|log.?in|access)\b/.test(q) && /\b(ims|mis|portal)\b/.test(q)))
        return "IMS / MIS Portal Login Help\n\n[icon:lock-closed] IMS (applications): https://ims.chieta.org.za\n[icon:lock-closed] MIS (WSP/ATR): https://mis.chieta.org.za\n\nForgot your password?\n1. Click \u2018Forgot Password\u2019 on the login page\n2. Enter your registered email address\n3. Check your inbox + spam/junk for the reset link\n4. Reset links expire after 24\u00a0hours \u2014 request a new one if needed\n\nIf the reset email doesn\u2019t arrive, confirm you\u2019re using the correct registered email.\n\nTechnical errors / account issues:\n[icon:mail] misqueries@chieta.org.za | [icon:call] 011\u00a0628\u00a07000\n\n[icon:warning] Never share your password with anyone.";

    // \u2500\u2500 Employer Registration \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(register.*employer|employer.*register|new employer|register.*chieta|register.*company|register.*sdf|employer.*registration)\b/.test(q))
        return "Registering as an Employer with CHIETA\n\n1. Confirm your company is in the chemical sector\n2. Register with SARS for SDL (if payroll \u2265 R500\u00a0000/year)\n3. Create an account: https://ims.chieta.org.za\n4. Register your appointed SDF on the portal\n5. Submit your first WSP by the April deadline\n\nSDL threshold:\n\u2022 Payroll \u2265 R500\u00a0000/year \u2192 mandatory 1% of payroll (SDL)\n\u2022 Payroll < R500\u00a0000/year \u2192 SDL exempt, but may still access DG funding\n\n[icon:call] 087\u00a0357\u00a06608 | [icon:mail] info@chieta.org.za";

    // \u2500\u2500 Programme Comparison \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(difference.*between|what.*difference|learnership.*vs|vs.*learnership|internship.*vs|apprenticeship.*vs|compare.*programme|learnership.*or.*internship)\b/.test(q))
        return "Comparing CHIETA Programmes\n\n[icon:library] Learnership (12\u201324 months)\n\u2022 NQF-registered qualification (Level 2\u20135)\n\u2022 Combines classroom + workplace experience\n\u2022 Open to employed and unemployed individuals\n\n[icon:construct] Apprenticeship (3\u20135 years)\n\u2022 Artisan / trade qualification\n\u2022 Ends with a formal trade test\n\n[icon:briefcase] Internship (3\u201312 months)\n\u2022 Practical workplace exposure for graduates/students\n\u2022 Does not lead to a formal NQF qualification\n\n[icon:document-text] Skills Programme (days to weeks)\n\u2022 Short accredited training module\n\u2022 Credits count towards a full qualification\n\nFor current opportunities: https://ims.chieta.org.za";

    // \u2500\u2500 Appeals / Disputes \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(appeal|dispute|rejected|declined|unsuccessful application|reconsider|grievance|complain.*chieta|chieta.*complain)\b/.test(q))
        return "Appealing a Decision or Lodging a Complaint\n\nIf your application was declined:\n1. Review the outcome letter for stated reasons\n2. Submit a written appeal to info@chieta.org.za within 30 days of the decision\n3. Include your reference number and supporting motivation\n4. CHIETA will acknowledge within 5 working days\n\nFor general complaints:\n[icon:mail] info@chieta.org.za | [icon:call] 087\u00a0357\u00a06608\n\nFor misconduct or fraud:\n[icon:alert-circle] Anti-Fraud Hotline: 0800 333 120 (free, anonymous)\n\n[icon:warning] CHIETA does not charge any fees for reviews or appeals.";

    // \u2500\u2500 POPI / Data Privacy \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(popi|paia|popia|privacy|personal information|data protection|personal data)\b/.test(q))
        return "CHIETA & POPI Act Compliance\n\nCHIETA processes personal information in accordance with the Protection of Personal Information Act (POPIA), Act 4 of 2013.\n\nYour rights under POPIA:\n\u2022 Know what personal information CHIETA holds about you\n\u2022 Request correction or deletion of your information\n\u2022 Lodge a complaint with the Information Regulator of SA\n\nYour data is used for:\n\u2022 Grant & bursary processing\n\u2022 IMS / MIS portal management\n\u2022 Statutory DHET reporting\n\nPOPIA enquiries:\n[icon:mail] info@chieta.org.za | [icon:call] 087\u00a0357\u00a06608\nPrivacy Policy: www.chieta.org.za";

    // \u2500\u2500 Tenders / Procurement \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(tender|procurement|rfp|rfq|vendor|supplier registration|service provider|supply chain|central supplier|csd.*database)\b/.test(q))
        return "CHIETA Tenders & Procurement\n\nCHIETA procures in line with the PFMA and Supply Chain Management policies.\n\nWhere to find tenders:\n\u2022 www.chieta.org.za \u2192 \u2018Tenders\u2019 section\n\u2022 eTenders portal: www.etenders.gov.za\n\nSupplier registration requirements:\n\u2022 Central Supplier Database (CSD): www.csd.gov.za\n\u2022 Valid B-BBEE certificate\n\u2022 SARS tax clearance pin\n\nFor procurement queries:\n[icon:mail] info@chieta.org.za | [icon:call] 087\u00a0357\u00a06608\n\n[icon:warning] CHIETA never solicits payments from suppliers. Report anything suspicious to 0800 333 120.";

    // \u2500\u2500 Governance / Board / Annual Report \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(governing board|accounting authority|audit committee|annual report|shareholder compact|board member|chairperson|chieta.*board|board.*chieta|clean audit)\b/.test(q))
        return "CHIETA Governance & Annual Reports\n\nCHIETA is governed by a Board (Accounting Authority) appointed by the Minister of Higher Education and Training (DHET).\n\nThe Board represents:\n\u2022 Organised labour\n\u2022 Organised business (chemical sector)\n\u2022 Government (DHET)\n\u2022 Independent experts\n\nCHIETA consistently achieves clean audit outcomes from the Auditor-General of SA.\n\nAnnual reports & publications:\n[icon:globe-outline] www.chieta.org.za \u2192 \u2018Publications\u2019\n\nFor governance queries: info@chieta.org.za";

    // \u2500\u2500 Green Skills / Sustainability \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(green skill|green.*job|green.*training|green.*chemist|sustainable.*skill|renewable energy.*skill|just transition|climate.*skill|low.?carbon)\b/.test(q))
        return "Green Skills & Sustainability\n\nCHIETA supports the Just Energy Transition and green skills development in the chemical sector.\n\nFunded green skills areas:\n\u2022 Green chemistry and sustainable manufacturing\n\u2022 Environmental compliance and management\n\u2022 Renewable energy integration in chemical processes\n\u2022 Waste management and recycling\n\u2022 Carbon footprint measurement and reporting\n\nOpportunities:\n\u2022 Learnerships and skills programmes with a sustainability focus\n\u2022 Discretionary Grants for green skills projects\n\u2022 Research grants under CHIETA\u2019s SSP priorities\n\nFor current programmes: www.chieta.org.za \u2192 SSP\n[icon:mail] info@chieta.org.za";

    // \u2500\u2500 Postgraduate Bursaries \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(postgrad|post.graduate|honours|master's|masters degree|phd|doctoral|doctorate|research.*study.*fund)\b/.test(q))
        return "Postgraduate Funding\n\nCHIETA\u2019s Industrial Futures Bursary primarily covers undergraduate studies (up to R76\u00a0000/year).\n\nFor postgraduate studies:\n\u2022 CHIETA occasionally funds Honours & Master\u2019s candidates in priority chemical sector fields\n\u2022 Postgraduate research may qualify under Discretionary Grant (Research & Skills Planning)\n\u2022 National Research Foundation (NRF) bursaries: www.nrf.ac.za\n\nEnquire about postgraduate options:\n[icon:mail] Bursary@chieta.org.za | [icon:call] 087\u00a0357\u00a06623 (Ms Dinky Dlamini)\n\nWatch www.chieta.org.za for postgraduate-specific calls.";

    // \u2500\u2500 Newsletter / Stay Updated \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(newsletter|subscribe|mailing list|stay updated|get.*update|notify.*me|receive.*notification|follow.*chieta)\b/.test(q))
        return "Stay Updated with CHIETA\n\nSubscribe to get notified about:\n\u2022 New grant windows\n\u2022 Bursary application periods\n\u2022 Events, webinars, and career fairs\n\u2022 Smart Skills Centre programmes\n\nSubscribe: www.chieta.org.za \u2192 scroll to the bottom and enter your email\n\nFollow @CHIETA_SETA on:\n[icon:phone-portrait] Twitter/X \u2022 LinkedIn \u2022 Facebook \u2022 YouTube \u2022 Instagram";

    // \u2500\u2500 Sector Skills Plan (SSP) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(ssp|sector skills plan|scarce skill|critical skill|skills planning|skills demand|in.demand skill)\b/.test(q))
        return "CHIETA Sector Skills Plan (SSP)\n\nThe SSP is CHIETA\u2019s strategic document identifying skills needs and priorities in the chemical sector.\n\nCovers:\n\u2022 Scarce and critical skills in the chemical sector\n\u2022 Priority occupations and qualifications\n\u2022 Projected training needs by sub-sector\n\u2022 Chemical industry workforce research\n\nThe SSP guides:\n\u2022 Which qualifications CHIETA prioritises for funding\n\u2022 Discretionary Grant focus areas each cycle\n\u2022 Priority fields for bursary funding\n\nDownload the current SSP:\n[icon:globe-outline] www.chieta.org.za \u2192 \u2018Publications\u2019\n[icon:mail] info@chieta.org.za";

    // \u2500\u2500 Eligibility / Sector Check \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(am i eligible|eligibility|eligible.*chieta|not.*chemical.*sector|which.*seta|qualify.*chieta|my.*sector|does chieta cover|wrong seta|different seta)\b/.test(q))
        return "CHIETA Eligibility & Sector Check\n\nCHIETA covers the chemical industries sector:\n\u2022 Petroleum \u2022 Base Chemicals \u2022 Glass \u2022 Explosives\n\u2022 Fertilisers \u2022 Pharmaceuticals \u2022 FMCG\n\u2022 Speciality Chemicals \u2022 Surface Coatings\n\nNot sure if your company belongs to CHIETA?\n\u2022 Your SIC (Standard Industrial Classification) code determines your SETA\n\u2022 Check with SARS or visit: www.dhet.gov.za\n\nAlready confirmed you\u2019re in the sector but unsure about a specific programme?\n[icon:call] 087\u00a0357\u00a06608 | [icon:mail] info@chieta.org.za";

    // \u2500\u2500 TVET Colleges \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(tvet|technical.*vocational|community.*education|cet.*college|fet.*college)\b/.test(q))
        return "TVET Colleges & CHIETA\n\nCHIETA works closely with TVET and CET colleges in the chemical sector.\n\nTVET students can:\n\u2022 Apply for CHIETA bursaries (N-course students accepted)\n\u2022 Participate in CHIETA-funded learnerships and skills programmes\n\u2022 Access Smart Skills Centres for free internet and study support\n\nTVET colleges can apply for DG funding as accredited training providers.\n\nN3 is considered equivalent to Matric for bursary eligibility (chemical-sector study field required).\n\n[icon:mail] Bursary@chieta.org.za | [icon:call] 087\u00a0357\u00a06623";

    // \u2500\u2500 B-BBEE / Transformation \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(b.?bbee|broad.?based.*empowerment|black economic empowerment|bee.*certif|transformation.*score|bbee.*level)\b/.test(q))
        return "B-BBEE & Transformation\n\nAll CHIETA-funded beneficiaries require a valid B-BBEE (Broad-Based Black Economic Empowerment) certificate.\n\nB-BBEE Scorecard elements:\n\u2022 Ownership\n\u2022 Management & control\n\u2022 Skills development\n\u2022 Enterprise & supplier development\n\u2022 Socioeconomic development\n\nFor CHIETA applications:\n\u2022 Valid B-BBEE certificate required for all DG and mandatory grant applications\n\u2022 Sole proprietors and micro-enterprises may qualify with a sworn affidavit\n\nSkills development directly contributes to your B-BBEE scorecard.\n[icon:mail] info@chieta.org.za | [icon:call] 087\u00a0357\u00a06608";

    // \u2500\u2500 Processing Times \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(how long|processing time|when will i|turnaround|time.*take|take.*time|expected.*time|when.*paid|when.*funded|when.*hear)\b/.test(q))
        return `Application Processing Times\n\n[icon:calendar] Mandatory Grants (WSP/ATR):\nPayment typically 3\u20134 months after 30 April deadline and assessment.\n\n[icon:calendar] Discretionary Grants:\nFeedback 3\u20134 months after cycle closes (e.g., DG Cycle 1 ${fy()}: feedback April ${yr()}). Contract signing and payment follow approval.\n\n[icon:calendar] Bursaries:\nOutcomes communicated by 30 April ${yr()}. No feedback by that date = unsuccessful.\n\n[icon:calendar] ETQA Accreditation:\n60 working days after a complete application is submitted.\n\nFor delays beyond these timeframes, always quote your reference number:\n[icon:call] 087\u00a0357\u00a06608 | [icon:mail] info@chieta.org.za`;

    // \u2500\u2500 Events / Workshops \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(event|workshops?|webinar|seminar|information session|roadshow|stakeholder session|upcoming session|calendar)\b/.test(q))
        return "CHIETA Events, Workshops & Webinars\n\nCHIETA hosts regular events for stakeholders:\n\u2022 WSP/ATR submission workshops (ahead of April deadline)\n\u2022 ETQA accreditation workshops (quarterly)\n\u2022 DG applicant briefing sessions\n\u2022 Smart Skills Centre digital literacy programmes\n\u2022 Skills development conferences and career fairs\n\nUpcoming events:\n[icon:globe-outline] www.chieta.org.za \u2192 \u2018Events\u2019\n[icon:phone-portrait] @CHIETA_SETA on Twitter/X\n\nTo register or get details:\n[icon:mail] info@chieta.org.za | [icon:call] 087\u00a0357\u00a06608";

    // \u2500\u2500 CEIBS / Innovation Programme \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(ceibs|china europe|innovation.*impact|8.month.*programme|entrepreneur.*impact|smme.*innovation)\b/.test(q))
        return "CHIETA SMME Innovation Programme (CEIBS Africa)\n\nCHIETA partners with CEIBS Africa for \u2018SMME Entrepreneurs Innovating for Impact\u2019.\n\n\u2022 Duration: 8 months (virtual delivery)\n\u2022 Target: SMMEs and co-ops in the chemical sector\n\u2022 Content: Business strategy, innovation, entrepreneurship, financial management\n\u2022 630+ SMMEs and 211+ co-ops supported to date\n\nApplications open via CHIETA announcement:\n[icon:globe-outline] www.chieta.org.za | [icon:phone-portrait] @CHIETA_SETA\n\n[icon:mail] info@chieta.org.za | [icon:call] 087\u00a0357\u00a06608";

    // \u2500\u2500 Tell me more \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    if (/\b(tell me more|more info|more information|elaborate|can you explain)\b/.test(q))
        return "I can provide more detail on any of these CHIETA topics:\n\n\u2022 [icon:business] About CHIETA & its mandate\n\u2022 [icon:document-text] Mandatory Grants (WSP / ATR) & SDL levy\n\u2022 [icon:cash] Discretionary Grants (DG)\n\u2022 [icon:school] Bursaries & student funding\n\u2022 [icon:construct] Learnerships, apprenticeships & internships\n\u2022 [icon:library] NQF levels & qualifications\n\u2022 [icon:cash] Learner stipends & allowances\n\u2022 [icon:stats-chart] SDF roles & employer registration\n\u2022 [icon:checkmark-circle] ETQA & provider accreditation\n\u2022 [icon:bulb] Smart Skills Centres (SSC)\n\u2022 [icon:business] SMME, co-ops & CEIBS programme\n\u2022 [icon:folder] Application process & documents\n\u2022 [icon:calendar] Deadlines & processing times\n\u2022 [icon:globe] Regional offices & events\n\u2022 [icon:alert-circle] Appeals, fraud & POPI\n\u2022 [icon:briefcase] Careers & tenders\n\nJust ask about any of the above!";


    // ── Fuzzy fallback (typo / misspelling tolerance) ──────────────────────────────
    const FUZZY_HINTS: [string, string][] = [
        ['grant', 'How do I apply for a grant?'],
        ['bursary', 'Bursaries & learnerships'],
        ['learnership', 'Bursaries & learnerships'],
        ['contact', 'Contact & support'],
        ['deadline', 'Application deadlines'],
        ['stipend', 'Learner stipend'],
        ['portal', 'IMS portal help'],
        ['document', 'Required documents'],
        ['regional', 'Find my regional office'],
        ['certificate', 'ETQA & provider accreditation'],
        ['apprentice', 'Bursaries & learnerships'],
        ['vacancy', 'Career opportunities'],
        ['tender', 'Tenders & procurement'],
        ['fraud', 'Reporting fraud'],
    ];
    for (const [kw, suggestion] of FUZZY_HINTS) {
        if (fuzzy(q, kw)) {
            return `I didn\'t quite catch that — did you mean to ask about **${suggestion}**?\n\nTry rephrasing, tap a quick chip below, or contact us directly:\n\n[icon:call] 087 357 6608 | [icon:mail] info@chieta.org.za`;
        }
    }

    // \u2500\u2500 Fallback \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    return "Thank you for your question. I may not have a specific answer for that right now, but here\u2019s how to get expert help:\n\n[icon:call] 087 357 6608 / 011 628 7000\n[icon:mail] info@chieta.org.za\n[icon:time] Mon\u2013Fri, 08:00\u201316:30\n\nBrowse all resources at www.chieta.org.za, or access the IMS Portal at https://ims.chieta.org.za.\n\nI can also help with: grants, bursaries, learnerships, NQF levels, SDF roles, Smart Skills Centres, regional offices, and more!";
}
