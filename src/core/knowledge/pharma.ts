import { KnowledgeTopic } from './index';

export const PHARMA_TOPICS: KnowledgeTopic[] = [
    {
        patterns: [
            /\b(pharma|pharmaceutical|medicine.*sector|drug.*manufacturer|pharmacy.*sector|pharma.*subsector|med.*technolog|clinical)\b/,
        ],
        response:
            "Pharmaceutical Subsector \u2014 CHIETA Skills Plan Summary\n\n" +
            "The pharmaceutical sector is one of CHIETA\u2019s fastest-growing subsectors.\n\n" +
            "Employment trends:\n" +
            "\u2022 Steady growth driven by generic medicines and biologicals\n" +
            "\u2022 Significant demand for Industrial Pharmacists, Lab Analysts & Chemical Engineers\n" +
            "\u2022 Post-COVID boost in local vaccine and medical device manufacturing\n\n" +
            "Scarce skills in pharmaceuticals:\n" +
            "\u2022 Industrial Pharmacist (NQF 8)\n" +
            "\u2022 Pharmaceutical Chemist / Quality Analyst (NQF 6\u20137)\n" +
            "\u2022 Biomedical Scientist (NQF 7)\n" +
            "\u2022 Regulatory Affairs Specialist (NQF 7)\n" +
            "\u2022 Pharmaceutical Technology Technician (NQF 5)\n\n" +
            "CHIETA supports pharma through:\n" +
            "\u2022 Bursaries for BSc Pharmacy and Biomedical Science\n" +
            "\u2022 Learnerships in Pharmaceutical Manufacturing (NQF 3\u20134)\n" +
            "\u2022 Skills programmes aligned to SAHPRA compliance requirements\n\n" +
            "Key regulatory body: SAHPRA (South African Health Products Regulatory Authority)\n" +
            "Professional body: South African Pharmacy Council (SAPC) \u2014 www.pharmcouncil.co.za\n\n" +
            "For pharma-specific grant opportunities: info@chieta.org.za",
    },
];
