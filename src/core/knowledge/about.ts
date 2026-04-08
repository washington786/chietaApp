import { KnowledgeTopic } from './index';

export const ABOUT_TOPICS: KnowledgeTopic[] = [
    {
        patterns: [
            /\b(what is chieta|who is chieta|about chieta|chieta seta|tell me about chieta|overview|mission|mandate)\b/,
            /chieta.*(mean|stand|stands|acronym|abbreviation)/,
            /\b(vision|values|strategic pillars|purpose of chieta)\b/,
        ],
        response:
            "CHIETA — Chemical Industries Education & Training Authority\n\n" +
            "A statutory body established by the Skills Development Act 97 of 1998, overseen by DHET.\n\n" +
            "Mission: Reimagining skills development using data and digital to provide innovative solutions for sustainable livelihoods.\n\n" +
            "Strategic Pillars:\n" +
            "\u2022 Innovation \u2022 Digitisation \u2022 Collaboration \u2022 Transformation \u2022 Artificial Intelligence\n\n" +
            "Values: Caring \u2022 Accountability \u2022 Excellence \u2022 Lifelong Learning \u2022 Integrity\n\n" +
            "Key achievements:\n" +
            "\u2022 74\u00a0742 learners supported\n" +
            "\u2022 630 SMMEs & 211 co-ops supported\n" +
            "\u2022 3\u00a0720 certificates issued\n" +
            "\u2022 5 consecutive clean audit opinions from the Auditor-General\n" +
            "\u2022 Rated one of the best & most innovative SETAs in South Africa\n\n" +
            "Website: www.chieta.org.za",
    },
    {
        patterns: [
            /\b(sector|sub.?sector|industry|industries|petroleum|base chemical|glass|explosive|fertiliser|fertilizer|pharmaceutical|fmcg|consumer goods|speciality|specialty|surface coating|coatings|plastics|cosmetics|paint)\b/,
        ],
        response:
            "CHIETA Chemical Industries Sub-sectors\n\n" +
            "\u2022 Petroleum\n" +
            "\u2022 Base Chemicals\n" +
            "\u2022 Glass\n" +
            "\u2022 Explosives\n" +
            "\u2022 Fertilisers\n" +
            "\u2022 Pharmaceuticals\n" +
            "\u2022 Fast Moving Consumer Goods (FMCG)\n" +
            "\u2022 Speciality Chemicals\n" +
            "\u2022 Surface Coatings\n" +
            "\u2022 Plastics, Cosmetics & Paint manufacturing (related sub-sectors)\n\n" +
            "Companies in these sectors may qualify for CHIETA grants, learnerships, and bursaries.\n\n" +
            "Not sure if your company is in CHIETA's scope? Your SIC code determines your SETA — check with SARS or visit www.dhet.gov.za.",
    },
    {
        patterns: [
            /\b(am i eligible|eligibility|eligible.*chieta|not.*chemical.*sector|which.*seta|qualify.*chieta|my.*sector|does chieta cover|wrong seta|different seta)\b/,
        ],
        response:
            "CHIETA Eligibility & Sector Check\n\n" +
            "CHIETA covers the chemical industries sector:\n" +
            "\u2022 Petroleum \u2022 Base Chemicals \u2022 Glass \u2022 Explosives\n" +
            "\u2022 Fertilisers \u2022 Pharmaceuticals \u2022 FMCG\n" +
            "\u2022 Speciality Chemicals \u2022 Surface Coatings\n\n" +
            "Not sure if your company belongs to CHIETA?\n" +
            "\u2022 Your SIC (Standard Industrial Classification) code determines your SETA\n" +
            "\u2022 Check with SARS or visit: www.dhet.gov.za\n\n" +
            "[icon:call] 087\u00a0357\u00a06608 | [icon:mail] info@chieta.org.za",
    },
    {
        patterns: [/\b(smart skills centres?|smart skills cent[er]+|ssc|smart centre|digital innovation|free internet|learning space|book boardroom)\b/],
        response:
            "CHIETA Smart Skills Centres (SSC)\n\n" +
            "\u201cEmpowering Communities Through Digital Innovation\u201d\n\n" +
            "9 centres \u2014 one per province \u2014 offering:\n" +
            "\u2022 Free internet access\n" +
            "\u2022 Digital literacy & 4IR technology training\n" +
            "\u2022 Entrepreneurship support & innovation programmes\n" +
            "\u2022 Job-seeker preparation (CV writing, interview practice)\n" +
            "\u2022 Boardroom bookings for entrepreneurs\n\n" +
            "Serves: youth, job seekers, students, entrepreneurs, and communities.\n\n" +
            "Over 60\u00a0000 visits recorded. Centres in all 9 provinces.\n\n" +
            "Find your nearest SSC, book a boardroom or sign in at:\nhttp://ssc.chieta.org.za",
    },
    {
        patterns: [/\b(smmes?|small business|entrepreneur|cooperative|co.op|ngo|npo|cbo|cbc|non.levy|non levy)\b/],
        response:
            "CHIETA SMME & Entrepreneur Support\n\n" +
            "CHIETA has supported 630+ SMMEs and 211+ cooperatives in the chemical sector.\n\n" +
            "Support initiatives:\n" +
            "\u2022 Discretionary Grant funding for non-levy paying SMMEs in the chemical sector\n" +
            "\u2022 SMME Entrepreneurs Innovating for Impact (with CEIBS Africa) \u2014 8-month virtual innovation & entrepreneurship programme\n" +
            "\u2022 Smart Skills Centres for free internet, business planning, and digital resources\n\n" +
            "To apply for DG funding as an SMME/NGO/Co-op:\n" +
            "\u2022 Must operate within the chemical sector\n" +
            "\u2022 Apply during a DG window at https://ims.chieta.org.za\n" +
            "\u2022 Contact your regional CHIETA office for guidance",
    },
    {
        patterns: [/\b(ceibs|china europe|innovation.*impact|8.month.*programme|entrepreneur.*impact|smme.*innovation)\b/],
        response:
            "CHIETA SMME Innovation Programme (CEIBS Africa)\n\n" +
            "CHIETA partners with CEIBS Africa for \u2018SMME Entrepreneurs Innovating for Impact\u2019.\n\n" +
            "\u2022 Duration: 8 months (virtual delivery)\n" +
            "\u2022 Target: SMMEs and co-ops in the chemical sector\n" +
            "\u2022 Content: Business strategy, innovation, entrepreneurship, financial management\n" +
            "\u2022 630+ SMMEs and 211+ co-ops supported to date\n\n" +
            "Applications open via CHIETA announcement:\n[icon:globe-outline] www.chieta.org.za | [icon:phone-portrait] @CHIETA_SETA\n\n" +
            "[icon:mail] info@chieta.org.za | [icon:call] 087\u00a0357\u00a06608",
    },
];
